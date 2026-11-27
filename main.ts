import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const IEND = Buffer.from([
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);
const LIMIT = 1024 * 1024;

const bytes = readFileSync(new URL('./entry.png', import.meta.url));

if (bytes.length < 64 || bytes.length > LIMIT) {
  throw new Error(`entry.png size ${bytes.length} out of range`);
}
if (!bytes.subarray(0, 8).equals(PNG_SIG)) {
  throw new Error('entry.png is not a PNG');
}
if (bytes.subarray(12, 16).toString('ascii') !== 'IHDR') {
  throw new Error('entry.png has no IHDR chunk');
}
if (bytes.readUInt32BE(16) !== 1024 || bytes.readUInt32BE(20) !== 1024) {
  throw new Error(
    `entry.png must be 1024x1024, got ${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`,
  );
}
if (!bytes.subarray(bytes.length - 12).equals(IEND)) {
  throw new Error('entry.png is missing its IEND trailer');
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), bytes);
