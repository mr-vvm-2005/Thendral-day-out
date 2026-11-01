import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const brainDir = 'C:/Users/mrvvm/.gemini/antigravity-ide/brain/8e7b70c0-5788-4e66-963f-a63bdb248a3a/.user_uploaded';
const logoSrc = path.join(brainDir, 'media_1793254790545.jpg');
const collageSrc = path.join(brainDir, 'media_1793254868344.jpg');

const outDir = path.resolve('public/images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function process() {
  console.log('Copying logo and collage...');
  fs.copyFileSync(logoSrc, path.join(outDir, 'logo.jpg'));
  fs.copyFileSync(collageSrc, path.join(outDir, 'venue-collage.jpg'));

  // Also create a cropped logo emblem if needed and standard logo
  await sharp(logoSrc)
    .png({ quality: 95 })
    .toFile(path.join(outDir, 'logo.png'));

  // Pool top section (avoiding any top banner clipping)
  await sharp(collageSrc)
    .extract({ left: 0, top: 46, width: 1024, height: 260 })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'pool-main.jpg'));

  // Kids play area (bottom left)
  await sharp(collageSrc)
    .extract({ left: 16, top: 326, width: 322, height: 260 })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'kids-play.jpg'));

  // Dining outdoor area (bottom center)
  await sharp(collageSrc)
    .extract({ left: 348, top: 326, width: 304, height: 260 })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'dining-area.jpg'));

  // Birthday Party hall (bottom right)
  await sharp(collageSrc)
    .extract({ left: 672, top: 326, width: 332, height: 260 })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'party-hall.jpg'));

  console.log('All images cropped and saved in public/images successfully!');
}

process().catch(console.error);
