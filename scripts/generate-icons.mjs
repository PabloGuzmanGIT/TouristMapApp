import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svgPath = join(root, 'public', 'icons', 'icon.svg');
const svgBuffer = readFileSync(svgPath);

const sizes = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-384x384.png', size: 384 },
  { name: 'icon-512x512.png', size: 512 },
];

async function generate() {
  // Generate PNGs
  for (const { name, size } of sizes) {
    const outputPath = join(root, 'public', 'icons', name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // Generate favicon.ico (32x32 PNG, saved as .ico)
  const faviconPath = join(root, 'src', 'app', 'favicon.ico');
  const pngBuffer = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();

  // ICO format: header + directory entry + PNG data
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);      // Reserved
  icoHeader.writeUInt16LE(1, 2);      // ICO type
  icoHeader.writeUInt16LE(1, 4);      // 1 image

  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(32, 0);         // Width
  dirEntry.writeUInt8(32, 1);         // Height
  dirEntry.writeUInt8(0, 2);          // Color palette
  dirEntry.writeUInt8(0, 3);          // Reserved
  dirEntry.writeUInt16LE(1, 4);       // Color planes
  dirEntry.writeUInt16LE(32, 6);      // Bits per pixel
  dirEntry.writeUInt32LE(pngBuffer.length, 8);  // Image size
  dirEntry.writeUInt32LE(22, 12);     // Offset (6 header + 16 dir entry)

  const ico = Buffer.concat([icoHeader, dirEntry, pngBuffer]);
  writeFileSync(faviconPath, ico);
  console.log('Generated favicon.ico (32x32)');

  console.log('\nAll icons generated successfully!');
}

generate().catch(console.error);
