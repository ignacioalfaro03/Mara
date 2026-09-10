import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const EXPECTED_SHA256 = "595895c615f8ee6e9a2989933df8d8b48a91337ce509b2124379c4691c36a9eb";
const EXPECTED_WIDTH = 384;
const EXPECTED_HEIGHT = 576;
const file = new URL("../public/mara/mara-v2-reference.webp", import.meta.url);
const bytes = fs.readFileSync(file);

assert(bytes.length > 1_000, "Canonical Mara runtime asset is unexpectedly small");
assert.equal(bytes.toString("ascii", 0, 4), "RIFF", "Canonical Mara runtime asset is not RIFF");
assert.equal(bytes.toString("ascii", 8, 12), "WEBP", "Canonical Mara runtime asset is not WebP");
assert.equal(bytes.toString("ascii", 12, 16), "VP8 ", "Canonical Mara runtime asset must be the approved lossy VP8 WebP derivative");
assert.equal(bytes[23], 0x9d, "Canonical WebP VP8 frame signature is invalid");
assert.equal(bytes[24], 0x01, "Canonical WebP VP8 frame signature is invalid");
assert.equal(bytes[25], 0x2a, "Canonical WebP VP8 frame signature is invalid");

const width = bytes.readUInt16LE(26) & 0x3fff;
const height = bytes.readUInt16LE(28) & 0x3fff;
assert.equal(width, EXPECTED_WIDTH, `Canonical Mara width changed: ${width}`);
assert.equal(height, EXPECTED_HEIGHT, `Canonical Mara height changed: ${height}`);

const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
assert.equal(
  sha256,
  EXPECTED_SHA256,
  `LAUNCH BLOCKED: canonical Mara runtime bytes changed. Expected SHA-256 ${EXPECTED_SHA256}, got ${sha256}. A visual/canonical decision is required before updating this lock.`,
);

const presence = fs.readFileSync(new URL("../components/mara-presence.tsx", import.meta.url), "utf8");
assert(
  presence.includes('const DEFAULT_MARA_IMAGE_URL = "/mara/mara-v2-reference.webp"'),
  "LAUNCH BLOCKED: Mara runtime component is not pinned to the approved V2 asset",
);
assert(
  !presence.includes('DEFAULT_MARA_IMAGE_URL = "/mara/mara-v1-reference.jpg"'),
  "LAUNCH BLOCKED: corrupt legacy V1 asset is still configured as runtime default",
);

console.log(`MARA_CANONICAL_FILE_INTEGRITY PASS sha256=${sha256} dimensions=${width}x${height}`);
