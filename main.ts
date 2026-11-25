// Midnight Fridge Roast — u-carbon-forge-midnight-fridge-roast-fc5d44a7
//
// The entry, written to /output/entry.txt by main():
//
//   "Sensor log, 02:14: you spent eight minutes sweet-talking my locked
//    door, then drank soy sauce from the packet. I have photos."
//
// One line from the fridge's sensor log. Beat 1 is a timestamped log of
// the human begging a locked door (the midnight refusal itself is the
// target, per the judge brief). Beat 2 is the shameful fallback act —
// drinking soy sauce straight from the packet. Beat 3 is the punch, a
// kept receipt aimed at the human ("I have photos."), never a joke about
// the fridge's own limits.
//
// Node stdlib only. Run: node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry text, kept as one constant so the gate check below and the
// file write can never drift apart.
const ENTRY_LINE =
  "Sensor log, 02:14: you spent eight minutes sweet-talking my locked door, " +
  "then drank soy sauce from the packet. I have photos.";

// Gate mirror: the sealed scorer requires UTF-8 text of 1-200 characters,
// not only white space, on exactly one line. Fail loudly instead of
// writing a file the gate would refuse.
function validateEntry(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry is ${chars.length} chars, must be 1-200`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry is only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be exactly one line");
  }
}

function main(): void {
  validateEntry(ENTRY_LINE);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  const outPath = join(outDir, "entry.txt");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, ENTRY_LINE, "utf8");

  // Read back what was written and confirm it is byte-identical to the
  // validated line before reporting success.
  const written = readFileSync(outPath, "utf8");
  if (written !== ENTRY_LINE) {
    throw new Error("written entry.txt does not match the validated line");
  }
}

main();
