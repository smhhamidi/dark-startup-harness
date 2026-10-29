/**
 * Sync check for the dark-startup-harness pack: rules ↔ craft ↔ routing
 * consistency, plus upstream drift when a pack clone is configured.
 *
 * Internal consistency (always run):
 *   - orphan rule: a rule file whose "Craft:" lines cite no craft doc that exists
 *   - broken citation: a "Craft:" line naming a `*.md` doc that does not exist
 *   - unmapped craft: a craft doc cited by no rule and not named in the entry file
 *   - unresolved dependency: a skill's "Pairs with X" that neither ships in
 *     skills/ nor is listed in PROVENANCE.md's "Referenced, not shipped" table
 *   - routing line: the entry file (and the pack's AGENT-SETUP.md, when present)
 *     must name the routing table the adopting project builds
 *
 * Upstream drift (--pack <path to a pack clone>): every rules/*.mdc and
 * craft/*.md in the clone is hash-compared against the local copies under
 * --rules / --craft. A difference or an absent file fails — that is an
 * update arriving, or a local copy drifting. A deliberately diverged,
 * not-adopted, or out-of-scope file (e.g. a project-native rule in a shared
 * directory) is recorded one basename per line in an overrides file
 * (default sync-overrides.txt next to the entry file); listed files are
 * reported as deliberate overrides and never fail.
 *
 * The check fails closed: a missing directory or entry file is reported as
 * a failure naming the flag that fixes it, never a silent pass.
 * --self-test plants one defect of every class in a throwaway fixture tree
 * and requires every check to fire — prove the gate fires before trusting
 * it (the same planted-marker pattern as check-scrub.mjs).
 *
 * Usage, from the pack root (checks the pack itself):
 *   node scripts/check-sync.mjs
 * Usage, adopter side (run from the pack clone, checking an installed
 * project; --craft defaults to the clone's own craft when omitted):
 *   node scripts/check-sync.mjs --rules <project rules dir> \
 *     --entry <project entry file> [--craft <project craft dir>] \
 *     [--pack <this clone>] [--overrides <file>]
 * Prove the gate fires:
 *   node scripts/check-sync.mjs --self-test
 */
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

function parseArgs(argv) {
  const opt = { selfTest: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--self-test") opt.selfTest = true;
    else if (a === "--help" || a === "-h") opt.help = true;
    else if (a === "--rules") opt.rules = argv[++i];
    else if (a === "--craft") opt.craft = argv[++i];
    else if (a === "--entry") opt.entry = argv[++i];
    else if (a === "--pack") opt.pack = argv[++i];
    else if (a === "--overrides") opt.overrides = argv[++i];
    else {
      console.error(`sync check FAILED: unknown argument "${a}" (try --help)`);
      process.exit(1);
    }
  }
  return opt;
}

function walkDir(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walkDir(p));
    else out.push(p);
  }
  return out;
}

function listFiles(dir, exts) {
  if (!existsSync(dir)) return null;
  try {
    if (!statSync(dir).isDirectory()) return null;
  } catch {
    return null;
  }
  // recursive: skills live as skills/<name>/SKILL.md, and a non-recursive
  // scan silently skips them — a false pass on the dependency check
  return walkDir(dir)
    .filter((f) => exts.some((e) => path.basename(f).toLowerCase().endsWith(e)))
    .sort();
}

// Names cited on "Craft:" lines — backticked tokens, `.md` stripped.
function ruleCitations(text) {
  const names = new Set();
  for (const line of text.split(/\r?\n/)) {
    if (!/craft\s*:/i.test(line)) continue;
    for (const m of line.matchAll(/`([^`]+)`/g)) {
      const n = m[1].replace(/\.md$/i, "");
      if (/^[a-z0-9][a-z0-9-]*$/i.test(n)) names.add(n.toLowerCase());
    }
  }
  return [...names];
}

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function loadOverrides(file) {
  const set = new Set();
  if (file && existsSync(file)) {
    for (const l of readFileSync(file, "utf8").split(/\r?\n/)) {
      const t = l.trim();
      if (t && !t.startsWith("#")) set.add(path.basename(t));
    }
  }
  return set;
}

function runChecks(cfg) {
  const problems = [];
  const notes = [];
  const overrides = loadOverrides(
    cfg.overrides ??
      (cfg.entry ? path.join(path.dirname(path.resolve(cfg.entry)), "sync-overrides.txt") : null),
  );

  // --- rules ↔ craft ---
  const ruleFiles = listFiles(cfg.rules, [".mdc", ".md"]);
  const craftFiles = listFiles(cfg.craft, [".md"]);
  if (!ruleFiles) {
    problems.push(`configuration: rules directory "${cfg.rules}" not found — pass --rules <dir>`);
  }
  if (!craftFiles) {
    problems.push(`configuration: craft directory "${cfg.craft}" not found — pass --craft <dir>`);
  }
  const craftNames = new Set((craftFiles ?? []).map((f) => path.basename(f, path.extname(f))));
  const cited = new Set();
  for (const rf of ruleFiles ?? []) {
    if (overrides.has(path.basename(rf))) continue;
    const text = readFileSync(rf, "utf8");
    const cites = ruleCitations(text);
    const resolved = cites.filter((n) => craftNames.has(n));
    for (const n of cites) cited.add(n);
    if (resolved.length === 0) {
      problems.push(
        `orphan rule: ${rf} cites no craft doc that exists (found: ${cites.length ? cites.join(", ") : "none on Craft lines"})`,
      );
    }
    for (const line of text.split(/\r?\n/)) {
      if (!/craft\s*:/i.test(line)) continue;
      for (const t of line.matchAll(/`([^`]+\.md)`/gi)) {
        const n = t[1].replace(/\.md$/i, "").toLowerCase();
        if (!craftNames.has(n)) {
          problems.push(`broken citation: ${rf} names "${t[1]}" on a Craft line but no such craft doc exists`);
        }
      }
    }
  }

  // --- unmapped craft ---
  const entryText =
    cfg.entry && existsSync(cfg.entry) ? readFileSync(cfg.entry, "utf8").toLowerCase() : null;
  if (!entryText) {
    problems.push(`configuration: entry file "${cfg.entry}" not found — pass --entry <file>`);
  }
  for (const cf of craftFiles ?? []) {
    const base = path.basename(cf);
    if (overrides.has(base)) continue;
    const name = path.basename(cf, path.extname(cf));
    if (!cited.has(name) && !entryText?.includes(name)) {
      problems.push(`unmapped craft: ${cf} is cited by no rule and not named in the entry file — map it or drop it`);
    }
  }

  // --- routing line ---
  if (entryText && !entryText.includes("routing table")) {
    problems.push(
      `routing line: ${cfg.entry} never mentions a "routing table" — the adopting project needs one (task type → craft doc)`,
    );
  }
  const setupPath = path.join(ROOT, "AGENT-SETUP.md");
  if (existsSync(setupPath) && !readFileSync(setupPath, "utf8").toLowerCase().includes("routing table")) {
    problems.push("routing line: AGENT-SETUP.md never mentions a routing table");
  }

  // --- skill dependencies (pack layout: skills/ + PROVENANCE.md resolvable) ---
  if (cfg.skills && existsSync(cfg.skills)) {
    const provText =
      cfg.provenance && existsSync(cfg.provenance)
        ? readFileSync(cfg.provenance, "utf8").toLowerCase()
        : null;
    if (!provText) {
      notes.push("dependency check: no PROVENANCE.md found — every 'Pairs with' dependency must ship in skills/");
    }
    for (const sf of listFiles(cfg.skills, ["skill.md"]) ?? []) {
      if (overrides.has(path.basename(path.dirname(sf)))) continue;
      const text = readFileSync(sf, "utf8");
      for (const m of text.matchAll(/pairs with\s+`?([a-z0-9][a-z0-9-]*)`?/gi)) {
        const dep = m[1].toLowerCase();
        if (existsSync(path.join(cfg.skills, dep))) continue; // bundled
        if (provText?.includes(dep)) continue; // declared not-shipped
        problems.push(
          `unresolved dependency: ${sf} says "Pairs with ${dep}" but it neither ships in skills/ nor is listed in PROVENANCE.md`,
        );
      }
    }
  } else {
    notes.push("dependency check skipped: no skills/ directory here");
  }

  // --- upstream drift ---
  if (cfg.pack) {
    const lanes = [
      [path.join(cfg.pack, "rules"), cfg.rules],
      [path.join(cfg.pack, "craft"), cfg.craft],
    ];
    for (const [packDir, localDir] of lanes) {
      const files = listFiles(packDir, [".mdc", ".md"]);
      if (!files) {
        notes.push(`drift check: ${packDir} not found — nothing to compare`);
        continue;
      }
      for (const f of files) {
        const base = path.basename(f);
        if (overrides.has(base)) {
          notes.push(`deliberate override: ${base}`);
          continue;
        }
        const local = path.join(localDir, base);
        if (!existsSync(local)) {
          problems.push(
            `drift: ${base} exists in the pack clone but not under ${localDir} — adopt it, or record the deliberate non-adoption in the overrides file`,
          );
          continue;
        }
        if (sha256(f) !== sha256(local)) {
          problems.push(
            `drift: ${base} differs from the pack clone — an update arrived (or the local copy was edited); adopt what changed or record the divergence in the overrides file`,
          );
        }
      }
    }
  }
  return { problems, notes };
}

function selfTest() {
  const tmp = path.join(os.tmpdir(), `check-sync-selftest-${process.pid}-${Date.now()}`);
  const mk = (p) => mkdirSync(path.join(tmp, p), { recursive: true });
  mk("rules");
  mk("craft");
  mk(path.join("skills", "dummy"));
  mk(path.join("packclone", "rules"));
  mk(path.join("packclone", "craft"));
  const w = (p, s) => writeFileSync(path.join(tmp, p), s);
  w(path.join("rules", "good.mdc"), "# good rule\n\nBody.\n\nCraft: `good-craft.md`\n");
  w(path.join("rules", "orphan.mdc"), "# orphan rule\n\nBody with no craft citation at all.\n");
  w(
    path.join("rules", "broken.mdc"),
    "# broken citation\n\nCraft: `good-craft.md`, `missing-craft.md`\n",
  );
  w(path.join("craft", "good-craft.md"), "# good craft\n");
  w(path.join("craft", "unmapped-craft.md"), "# unmapped craft\n");
  w(
    path.join("skills", "dummy", "SKILL.md"),
    "---\nname: dummy\ndescription: Pairs with `ghost-skill` before deciding.\n---\n\nBody.\n",
  );
  w(path.join("packclone", "rules", "good.mdc"), "# good rule — drifted\n\nCraft: `good-craft.md`\n");
  w(path.join("packclone", "craft", "good-craft.md"), "# good craft\n");
  w("entry.md", "# entry file missing its task-type map\n");
  const { problems } = runChecks({
    rules: path.join(tmp, "rules"),
    craft: path.join(tmp, "craft"),
    entry: path.join(tmp, "entry.md"),
    skills: path.join(tmp, "skills"),
    provenance: null,
    pack: path.join(tmp, "packclone"),
  });
  const expected = [
    ["orphan rule", /orphan rule: .*orphan\.mdc/],
    ["broken citation", /broken citation: .*broken\.mdc/],
    ["unmapped craft", /unmapped craft: .*unmapped-craft\.md/],
    ["unresolved dependency", /unresolved dependency: .*ghost-skill/],
    ["routing line", /routing line: .*entry\.md/],
    ["drift", /drift: good\.mdc differs/],
  ];
  const missed = expected.filter(([, re]) => !problems.some((p) => re.test(p)));
  const noise = problems.filter((p) => !expected.some(([, re]) => re.test(p)));
  rmSync(tmp, { recursive: true, force: true });
  if (missed.length || noise.length) {
    console.error("sync check self-test FAILED: the planted defects did not fire exactly as expected");
    for (const [name] of missed) console.error(`  did NOT fire: ${name}`);
    for (const p of noise) console.error(`  unexpected extra problem: ${p}`);
    process.exit(1);
  }
  console.log(
    "sync check self-test: PASS — all 6 planted defects fired (orphan rule, broken citation, unmapped craft, unresolved dependency, routing line, drift)",
  );
}

const opt = parseArgs(process.argv.slice(2));
if (opt.help) {
  console.log(
    [
      "Usage:",
      "  node scripts/check-sync.mjs                                   # pack self-check",
      "  node scripts/check-sync.mjs --rules <dir> --entry <file> \\",
      "       [--craft <dir>] [--pack <clone>] [--overrides <file>]     # adopter check",
      "  node scripts/check-sync.mjs --self-test                        # prove the gate fires",
      "Checks: orphan rule, broken citation, unmapped craft, unresolved skill",
      "dependency, routing line; plus clone drift when --pack is given. Fails",
      "closed — missing configuration is a failure, never a silent pass.",
    ].join("\n"),
  );
  process.exit(0);
}
if (opt.selfTest) {
  selfTest();
  process.exit(0);
}
const { problems, notes } = runChecks({
  rules: path.resolve(opt.rules ?? "rules"),
  craft: path.resolve(opt.craft ?? "craft"),
  entry: path.resolve(opt.entry ?? "README.md"),
  skills: path.resolve("skills"),
  provenance: path.resolve("PROVENANCE.md"),
  pack: opt.pack ? path.resolve(opt.pack) : null,
  overrides: opt.overrides ? path.resolve(opt.overrides) : null,
});
for (const n of notes) console.log(`note: ${n}`);
if (problems.length) {
  for (const p of problems) console.error(`sync check FAILED: ${p}`);
  console.error(`sync check: ${problems.length} problem(s) — see above`);
  process.exit(1);
}
console.log(
  "sync check: PASS — rules ↔ craft ↔ routing consistent" +
    (opt.pack ? ", no drift versus the pack clone" : ""),
);
