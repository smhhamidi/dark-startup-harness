/**
 * Scrub gate for the dark-startup-harness pack: fails if any pack file names
 * something that identifies the private source deployment. Markers live in
 * scripts/scrub-markers.txt — one per line, # comments allowed; wrap a line
 * in /.../ for a regex, anything else matches literally. The list itself is
 * private by necessity (it is the list of names that must never be
 * published): the build runs this gate with the real list and never ships
 * the file. The gate fails closed when the list is missing or empty — it
 * never passes by default; adopters write their own list and prove the gate
 * fires on a planted marker. CREDITS.md and LICENCE are exempt (attribution
 * and the licence line are public by design). Usage: node scripts/check-scrub.mjs
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const MARKERS_PATH = path.join(HERE, "scrub-markers.txt");

function loadMarkers() {
  if (!existsSync(MARKERS_PATH)) return null;
  const parts = readFileSync(MARKERS_PATH, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const re = l.match(/^\/(.*)\/$/);
      return re ? re[1] : l.replace(/[$()*+?.^{|}\[\]\\-]/g, "\\$&");
    });
  return parts.length ? new RegExp(parts.join("|"), "i") : null;
}

const MARKERS = loadMarkers();
if (!MARKERS) {
  console.error(
    "scrub gate FAILED: scripts/scrub-markers.txt is missing or empty — the gate never passes by default. Write your own markers file (see PROVENANCE.md) and prove the gate fires on a planted marker.",
  );
  process.exit(1);
}

const EXEMPT = new Set([
  "CREDITS.md",
  "LICENCE",
  path.join("scripts", "check-scrub.mjs"),
  path.join("scripts", "scrub-markers.txt"),
]);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules" || name === ".gitignore") continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p); // every file, whatever the extension — an extension filter is an evasion hole (review round 1, 2026-10-26: a planted marker in a .json passed)
  }
  return out;
}

function readText(buf) {
  // UTF-16 text (BOM-marked) decodes before the NUL test — skipping on NUL
  // alone would make UTF-16 files invisible to the gate (review round 2,
  // LOW A: a planted marker in a UTF-16 file passed silently).
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) return buf.toString("utf16le");
  if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
    const swapped = Buffer.from(buf);
    for (let i = 0; i + 1 < swapped.length; i += 2) {
      const b = swapped[i];
      swapped[i] = swapped[i + 1];
      swapped[i + 1] = b;
    }
    return swapped.toString("utf16le");
  }
  return buf.includes(0) ? null : buf.toString("utf8");
}

let bad = 0;
for (const file of walk(ROOT)) {
  if (EXEMPT.has(path.relative(ROOT, file))) continue;
  const text = readText(readFileSync(file));
  if (text === null) continue; // binary — no text to leak
  const lines = text.split(/\r?\n/);
  lines.forEach((l, i) => {
    const hit = l.match(MARKERS);
    if (hit) {
      bad++;
      console.error(`scrub gate FAILED: ${path.relative(ROOT, file)}:${i + 1} names "${hit[0]}" — strip it upstream and rebuild`);
    }
  });
}
if (bad > 0) process.exit(1);
console.log("scrub gate: PASS — no deployment-identifying content in the pack");
