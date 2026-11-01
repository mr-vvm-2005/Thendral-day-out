import fs from 'fs';
import path from 'path';

const brainDir = 'C:/Users/mrvvm/.gemini/antigravity-ide/brain/8e7b70c0-5788-4e66-963f-a63bdb248a3a';
const outDir = path.resolve('public/images');

const files = [
  { src: 'artificial_falls_feature_1793259502627.jpg', dest: 'falls-feature.jpg' },
  { src: 'garden_relaxation_space_1793259536715.jpg', dest: 'garden-relaxation.jpg' },
  { src: 'dressing_rooms_facility_1793259564524.jpg', dest: 'dressing-rooms.jpg' },
  { src: 'restroom_facility_1793259607771.jpg', dest: 'restrooms.jpg' },
];

for (const f of files) {
  const srcPath = path.join(brainDir, f.src);
  const destPath = path.join(outDir, f.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${f.src} -> ${f.dest}`);
  } else {
    console.error(`Missing ${srcPath}`);
  }
}
