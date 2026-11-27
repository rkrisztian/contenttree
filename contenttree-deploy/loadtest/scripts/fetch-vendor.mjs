import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';

const VENDORS = [
  {
    url: 'https://raw.githubusercontent.com/benc-uk/k6-reporter/35491b4cbf38d84e7ca325bbdfa212b95daee1dd/dist/bundle.js',
    sha256: '3d981a8f06dc558700e01e3fcbc3ab9214f4d45a4ff43c637c1ddf2e8d22c13c',
    fileName: 'html-report.js',
  },
  {
    url: 'https://raw.githubusercontent.com/grafana/k6-jslib-url/300098d64b41fca72b308bb36ad90df470b74bc0/index.js',
    sha256: '43812073b0b2fdb09edd506098ea9247d6d16c373894d8e843864e5df813dddd',
    fileName: 'url.js',
  },
];

const main = async () => {
  for (const vendor of VENDORS) {
    await fetchAndVerify(vendor);
  }
};

const fetchAndVerify = async (vendor) => {
  const outputDir = `vendor`;
  const outputPath = `${outputDir}/${vendor.fileName}`;

  const content = await readFileIfExists(outputPath);
  if (content && contentMatchesChecksum(content, vendor.sha256)) {
    const stats = await stat(outputPath);
    console.log(`Skipped ${outputPath}, already up-to-date (${formatLength(stats.size)})`);
    return;
  }

  const res = await fetch(vendor.url);
  if (!res.ok) {
    throw new Error(`Failed to fetch vendor script: ${res.status} ${res.statusText}`);
  }
  const body = await res.text();

  if (!contentMatchesChecksum(body, vendor.sha256)) {
    throw new Error(
      `Vendor integrity check FAILED for ${outputPath}.\n  expected: ${vendor.sha256}\n  actual:   ${actualSha}\nRefusing to overwrite ${outputPath}.`,
    );
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, body, 'utf8');
  console.log(`Vendored ${outputPath}, checksum OK (${formatLength(body.length)})`);
};

const readFileIfExists = async (filePath) => {
  try {
    return await readFile(filePath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
};

const contentMatchesChecksum = (content, expectedSha) =>
  createHash('sha256').update(content).digest('hex') === expectedSha;

const formatLength = (length) => `${(length / 1024).toFixed(1)} kB`;

await main();
