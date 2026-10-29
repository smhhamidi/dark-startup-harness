/**
 * Adoption test for the dark-startup-harness pack: a dress rehearsal of the
 * install, run once by the adopting project right after copying the pack in.
 *
 * Copying files into a project proves nothing was *copied wrong* only if
 * something then *reads* them the way the real project will. So this script
 * builds a throwaway project (rules/ + craft/ + an entry file naming the
 * routing table and every craft doc), then drives scripts/check-sync.mjs
 * against it in the exact modes the adopter will use, and requires each one
 * to behave:
 *
 *   1. clean install        → check-sync adopter mode passes (files readable,
 *                              citations resolve, no drift vs the pack)
 *   2. planted drift        → a local edit vs the pack clone FAILS the check
 *                              (the gate must fire, not just pass)
 *   3. deliberate override  → recording the drift in sync-overrides.txt turns
 *                              the failure into a reported override
 *   4. missing configuration→ a nonexistent rules dir fails closed
 *   5. pack self-check      → the received pack itself passes (incl. MANIFEST)
 *   6. gate-fires proof     → check-sync --self-test passes 7/7 planted defects
 *
 * Exits 0 only when every step behaved; prints one PASS line per step and a
 * summary. Pure Node builtins — no install, nothing left behind (the
 * throwaway project is a temp dir, removed on exit).
 *
 * Usage, from the pack root (after receiving or cloning the pack):
 *   node scripts/adoption-test.mjs
 */
import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PACK_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECK_SYNC = path.join(PACK_ROOT, "scripts", "check-sync.mjs");

/** Run check-sync with args; never throws — returns {code, out}. */
function runCheckSync(args, opts = {}) {
  try {
    const out = execFileSync(process.execPath, [CHECK_SYNC, ...args], {
      encoding: "utf8",
      cwd: opts.cwd ?? PACK_ROOT,
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ""}${e.stderr ?? ""}` };
  }
}

const results = [];
function step(name, ok, detail = "") {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const tmp = mkdtempSync(path.join(os.tmpdir(), "adoption-test-"));
try {
  // --- throwaway project: the pack's rules and craft, an entry file naming
  // the routing table and every craft doc, exactly as the install steps say
  const projRules = path.join(tmp, "rules");
  const projCraft = path.join(tmp, "craft");
  mkdirSync(projRules);
  mkdirSync(projCraft);
  const craftNames = [];
  for (const f of readdirSync(path.join(PACK_ROOT, "craft"))) {
    if (!f.endsWith(".md")) continue;
    copyFileSync(path.join(PACK_ROOT, "craft", f), path.join(projCraft, f));
    craftNames.push(path.basename(f, ".md"));
  }
  for (const f of readdirSync(path.join(PACK_ROOT, "rules"))) {
    if (!f.endsWith(".mdc")) continue;
    copyFileSync(path.join(PACK_ROOT, "rules", f), path.join(projRules, f));
  }
  const entry = path.join(tmp, "AGENT.md");
  writeFileSync(
    entry,
    [
      "# Throwaway project entry file",
      "",
      "routing table (task type → craft doc):",
      "",
      ...craftNames.map((n) => `- ${n}`),
      "",
    ].join("\n"),
  );
  const adopterArgs = ["--rules", projRules, "--craft", projCraft, "--entry", entry, "--pack", PACK_ROOT];

  // 1. clean install
  let r = runCheckSync(adopterArgs);
  step(
    "clean install: check-sync adopter mode passes",
    r.code === 0 && /sync check: PASS/.test(r.out),
    r.code === 0 ? "" : r.out.trim().split("\n")[0],
  );

  // 2. planted drift — a local edit must FAIL (prove the gate fires)
  const drifted = path.join(projCraft, `${craftNames[0]}.md`);
  writeFileSync(drifted, "locally edited — this content no longer matches the pack\n");
  r = runCheckSync(adopterArgs);
  step(
    "planted drift: a local edit fails the check",
    r.code === 1 && new RegExp(`drift: ${craftNames[0]}\\.md differs`).test(r.out),
    r.code === 1 ? "" : "the planted drift did NOT fail the check",
  );

  // 3. deliberate override — the recorded divergence becomes a note, not a failure
  writeFileSync(path.join(tmp, "sync-overrides.txt"), `${path.basename(drifted)}\n`);
  r = runCheckSync(adopterArgs);
  step(
    "deliberate override: the recorded drift passes as an override",
    r.code === 0 && new RegExp(`deliberate override: ${craftNames[0]}\\.md`).test(r.out),
    r.code === 0 ? "" : r.out.trim().split("\n")[0],
  );

  // 4. missing configuration fails closed
  r = runCheckSync(["--rules", path.join(tmp, "no-such-dir"), "--craft", projCraft, "--entry", entry]);
  step(
    "fail-closed: a missing rules directory is a failure, never a silent pass",
    r.code === 1 && /configuration: rules directory/.test(r.out),
  );

  // 5. the received pack itself passes (rules ↔ craft ↔ routing + MANIFEST)
  r = runCheckSync([]);
  step(
    "pack self-check: the received pack passes, manifest verified",
    r.code === 0 && /manifest verified/.test(r.out),
    r.code === 0 ? "" : r.out.trim().split("\n")[0],
  );

  // 6. the gate-fires proof passes on this machine
  r = runCheckSync(["--self-test"]);
  step(
    "self-test: all 7 planted defects fire on this machine",
    r.code === 0 && /7 planted defects/.test(r.out),
  );

  if (!existsSync(path.join(PACK_ROOT, "MANIFEST.json"))) {
    step("manifest present: the pack ships a MANIFEST.json", false, "missing — rebuild the pack");
  }

  const passed = results.filter(Boolean).length;
  if (results.some((ok) => !ok)) {
    console.error(`adoption test: ${passed}/${results.length} steps behaved — see the FAIL lines above`);
    process.exit(1);
  }
  console.log(`adoption test: PASS — ${passed}/${results.length} steps behaved (install, drift detection, override, fail-closed, pack integrity, gate-fires proof)`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
