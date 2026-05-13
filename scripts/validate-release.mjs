import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const config = JSON.parse(readFileSync(join(repoRoot, 'src', 'release.config.json'), 'utf8'));
const product = config.product;

function fail(message) {
  console.error(`release validation failed: ${message}`);
  process.exitCode = 1;
}

function formatBytes(bytes) {
  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;

  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

const expectedPath = `/downloads/${product.fileName}`;

if (product.installerPath !== expectedPath) {
  fail(`installerPath should be "${expectedPath}", got "${product.installerPath}"`);
}

if (!product.fileName.toLowerCase().endsWith('.exe')) {
  fail(`installer fileName should point to a Windows .exe, got "${product.fileName}"`);
}

const installerFile = join(repoRoot, 'public', product.installerPath);

try {
  const stats = statSync(installerFile);
  const actualSize = formatBytes(stats.size);
  const actualChecksum = sha256(installerFile);

  if (actualSize !== product.fileSize) {
    fail(`fileSize should be "${actualSize}" for ${stats.size} bytes, got "${product.fileSize}"`);
  }

  if (actualChecksum !== product.checksum) {
    fail(`checksum mismatch for ${product.installerPath}: expected ${product.checksum}, got ${actualChecksum}`);
  }
} catch (error) {
  fail(`installer is missing at public${product.installerPath}`);
}

if (!/^[a-f0-9]{64}$/i.test(product.checksum)) {
  fail('checksum must be a 64-character SHA-256 hex string');
}

if (!product.version || !product.fileName.includes(product.version.replace(/^v/i, ''))) {
  fail(`fileName "${product.fileName}" should include version "${product.version}"`);
}

if (!product.releaseDate || /placeholder|replace|todo|unknown/i.test(product.releaseDate)) {
  fail('releaseDate must be launch-ready');
}

if (!product.publisher || /placeholder|replace|todo|unknown/i.test(product.publisher)) {
  fail('publisher must be launch-ready');
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(product.supportEmail)) {
  fail(`supportEmail should be a valid email address, got "${product.supportEmail}"`);
}

if (!process.exitCode) {
  console.log(
    `release validation passed: ${product.fileName}, ${product.fileSize}, ${product.checksum.slice(0, 12)}...`,
  );
}
