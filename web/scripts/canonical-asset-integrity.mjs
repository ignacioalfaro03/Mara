import fs from "node:fs";
import assert from "node:assert/strict";

const file = new URL("../public/mara/mara-v1-reference.jpg", import.meta.url);
const bytes = fs.readFileSync(file);
assert(bytes[0] === 0xff && bytes[1] === 0xd8, "Canonical asset is not a JPEG");
assert(bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9,
  "LAUNCH BLOCKED: canonical JPEG is truncated (missing EOI). Restore the exact approved source; do not just append EOI. Hash and naturalWidth checks cannot prove visual integrity.");
console.log("MARA_CANONICAL_FILE_INTEGRITY PASS (visual review is also required)");
