/**
 * process-photos.js
 *
 * Optimizes the user's uploaded photography for the shhh.archive website.
 * - Converts all JPGs to web-optimized versions (full + thumbnail)
 * - Attempts to convert HEIC files to JPG (skips if not supported)
 * - Skips RAW files (ARW, NEF) — browsers cannot render them
 * - Outputs a JSON manifest of all processed photos
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SOURCE_ROOT = "/home/z/my-project/upload/extracted";
const OUT_FULL = "/home/z/my-project/public/photos/full";
const OUT_THUMB = "/home/z/my-project/public/photos/thumb";
const MANIFEST_PATH = "/home/z/my-project/scripts/photo-manifest.json";

const FULL_WIDTH = 1600;
const THUMB_WIDTH = 800;
const QUALITY = 82;

// Find all image files recursively
function findImages(root) {
  const results = [];
  for (const dir of fs.readdirSync(root)) {
    const dirPath = path.join(root, dir);
    const stat = fs.statSync(dirPath);
    if (stat.isDirectory()) {
      for (const file of fs.readdirSync(dirPath)) {
        const ext = path.extname(file).toLowerCase();
        if ([".jpg", ".jpeg", ".heic"].includes(ext)) {
          results.push({
            source: path.join(dirPath, file),
            folder: dir,
            baseName: path.basename(file, path.extname(file)),
            ext,
          });
        }
      }
    }
  }
  return results;
}

async function processPhoto(photo, index) {
  const outName = `photo-${String(index + 1).padStart(2, "0")}.jpg`;
  const fullOut = path.join(OUT_FULL, outName);
  const thumbOut = path.join(OUT_THUMB, outName);

  try {
    // Load image with sharp — auto-rotates based on EXIF
    let pipeline = sharp(photo.source, { failOn: "none" }).rotate();

    // Get metadata to know original dimensions and orientation
    const meta = await pipeline.metadata();
    const originalWidth = meta.width || 0;
    const originalHeight = meta.height || 0;

    // Generate full-size version (max 1600px on the long edge)
    await pipeline
      .resize({
        width: FULL_WIDTH,
        height: FULL_WIDTH,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
      .toFile(fullOut);

    // Generate thumbnail (max 800px on the long edge)
    await sharp(photo.source, { failOn: "none" })
      .rotate()
      .resize({
        width: THUMB_WIDTH,
        height: THUMB_WIDTH,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 72, mozjpeg: true, progressive: true })
      .toFile(thumbOut);

    // Calculate aspect ratio from processed full image
    const fullMeta = await sharp(fullOut).metadata();
    const aspectWidth = fullMeta.width;
    const aspectHeight = fullMeta.height;
    // Reduce to simplest ratio (divide by GCD)
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const g = gcd(aspectWidth, aspectHeight);
    const w = aspectWidth / g;
    const h = aspectHeight / g;

    return {
      id: index + 1,
      outName,
      fullUrl: `/photos/full/${outName}`,
      thumbUrl: `/photos/thumb/${outName}`,
      originalName: path.basename(photo.source),
      folder: photo.folder,
      aspect: { w, h },
      width: aspectWidth,
      height: aspectHeight,
      originalWidth,
      originalHeight,
      ok: true,
    };
  } catch (err) {
    console.error(`✗ Failed: ${photo.source} — ${err.message}`);
    return {
      id: index + 1,
      originalName: path.basename(photo.source),
      folder: photo.folder,
      ok: false,
      error: err.message,
    };
  }
}

async function main() {
  console.log("Finding images...");
  const photos = findImages(SOURCE_ROOT);
  console.log(`Found ${photos.length} JPG/HEIC images`);

  // Sort by folder then by name for predictable order
  photos.sort((a, b) => {
    if (a.folder !== b.folder) return a.folder.localeCompare(b.folder);
    return a.baseName.localeCompare(b.baseName);
  });

  const results = [];
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    process.stdout.write(
      `[${i + 1}/${photos.length}] Processing ${photo.folder}/${path.basename(
        photo.source
      )}... `
    );
    const result = await processPhoto(photo, i);
    if (result.ok) {
      console.log(
        `✓ ${result.width}×${result.height} (aspect ${result.aspect.w}:${result.aspect.h})`
      );
      results.push(result);
    } else {
      console.log("✗ skipped");
    }
  }

  // Save manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(results, null, 2));
  console.log(`\n✓ Manifest saved to ${MANIFEST_PATH}`);
  console.log(`✓ Successfully processed ${results.length} photos`);
  console.log(`✓ Full-size: ${OUT_FULL}`);
  console.log(`✓ Thumbnails: ${OUT_THUMB}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
