/**
 * add-photos.js
 *
 * Processes additional uploaded photos and appends them to the existing
 * archive. Reads from /home/z/my-project/upload/ directly (not extracted/),
 * picks up only NEW files (skips ones already in the manifest based on
 * original filename), and appends them with sequential IDs continuing from
 * the last existing photo.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const UPLOAD_ROOT = "/home/z/my-project/upload";
const OUT_FULL = "/home/z/my-project/public/photos/full";
const OUT_THUMB = "/home/z/my-project/public/photos/thumb";
const MANIFEST_PATH = "/home/z/my-project/scripts/photo-manifest.json";

const FULL_WIDTH = 1600;
const THUMB_WIDTH = 800;
const QUALITY = 82;

// Find JPG/JPEG files directly in upload root (not zips, not extracted subdirs)
function findNewUploads(root, existingNames) {
  const results = [];
  const files = fs.readdirSync(root);
  for (const file of files) {
    const fullPath = path.join(root, file);
    const stat = fs.statSync(fullPath);
    if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if ([".jpg", ".jpeg"].includes(ext)) {
        if (!existingNames.has(file)) {
          results.push({
            source: fullPath,
            originalName: file,
            baseName: path.basename(file, path.extname(file)),
          });
        }
      }
    }
  }
  return results;
}

async function processPhoto(photo, id) {
  const outName = `photo-${String(id).padStart(2, "0")}.jpg`;
  const fullOut = path.join(OUT_FULL, outName);
  const thumbOut = path.join(OUT_THUMB, outName);

  try {
    let pipeline = sharp(photo.source, { failOn: "none" }).rotate();
    const meta = await pipeline.metadata();

    await pipeline
      .resize({
        width: FULL_WIDTH,
        height: FULL_WIDTH,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
      .toFile(fullOut);

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

    const fullMeta = await sharp(fullOut).metadata();
    const aspectWidth = fullMeta.width;
    const aspectHeight = fullMeta.height;

    // Simplify aspect ratio
    let w = aspectWidth;
    let h = aspectHeight;
    if (w > 50 || h > 50) {
      const ratio = w / h;
      if (ratio > 1.3) { w = 3; h = 2; }
      else if (ratio < 0.77) { w = 2; h = 3; }
      else if (ratio > 1.1) { w = 4; h = 3; }
      else { w = 3; h = 4; }
    }

    return {
      id,
      outName,
      fullUrl: `/photos/full/${outName}`,
      thumbUrl: `/photos/thumb/${outName}`,
      originalName: photo.originalName,
      folder: "upload",
      aspect: { w, h },
      width: aspectWidth,
      height: aspectHeight,
      originalWidth: meta.width || 0,
      originalHeight: meta.height || 0,
      ok: true,
    };
  } catch (err) {
    console.error(`✗ Failed: ${photo.source} — ${err.message}`);
    return null;
  }
}

async function main() {
  // Load existing manifest
  let existing = [];
  if (fs.existsSync(MANIFEST_PATH)) {
    existing = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  }
  const existingNames = new Set(existing.map((p) => p.originalName));
  const nextId = existing.length
    ? Math.max(...existing.map((p) => p.id)) + 1
    : 1;

  console.log(`Existing photos: ${existing.length}`);
  console.log(`Next ID will be: ${nextId}`);

  const newPhotos = findNewUploads(UPLOAD_ROOT, existingNames);
  console.log(`Found ${newPhotos.length} new photo(s) to add`);

  if (newPhotos.length === 0) {
    console.log("Nothing to add — all photos already in archive.");
    return;
  }

  const newResults = [];
  let currentId = nextId;
  for (const photo of newPhotos) {
    process.stdout.write(
      `Processing ${photo.originalName}... `
    );
    const result = await processPhoto(photo, currentId);
    if (result) {
      console.log(`✓ ${result.width}×${result.height} → ${result.outName}`);
      newResults.push(result);
      currentId++;
    }
  }

  const allPhotos = [...existing, ...newResults];
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(allPhotos, null, 2));
  console.log(`\n✓ Manifest updated: ${allPhotos.length} total photos`);
  console.log(`✓ Added ${newResults.length} new photo(s)`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
