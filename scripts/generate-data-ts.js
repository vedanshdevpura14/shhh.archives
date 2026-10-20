/**
 * generate-data-ts.js
 *
 * Reads the photo manifest produced by process-photos.js and emits a fresh
 * data.ts file for the gallery. Photos are uncategorized (single "All" view)
 * since we don't know what's in each frame — the user can categorize later.
 *
 * Photo titles are intentionally neutral: "Frame 01", "Frame 02", etc.
 * Locations and years are left blank placeholders.
 *
 * To remove a photo from the gallery (but keep it on disk), add its ID to
 * the EXCLUDE_IDS array below.
 */

const fs = require("fs");

const MANIFEST = "/home/z/my-project/scripts/photo-manifest.json";
const OUT = "/home/z/my-project/src/components/portfolio/data.ts";

// Photos to exclude from the gallery (by manifest ID).
// The image files stay on disk; they just don't appear in the gallery grid.
const EXCLUDE_IDS = [29];

const photosAll = JSON.parse(fs.readFileSync(MANIFEST, "utf-8"));

// Filter out excluded IDs but keep original IDs intact for cross-reference.
// The gallery uses these IDs directly for the lightbox counter and keyboard nav.
const photos = photosAll.filter((p) => !EXCLUDE_IDS.includes(p.id));

if (EXCLUDE_IDS.length > 0) {
  console.log(
    `Excluding ${EXCLUDE_IDS.length} photo(s): ${EXCLUDE_IDS.join(", ")}`
  );
}

const lines = [];
lines.push(`export type Photo = {`);
lines.push(`  id: number;`);
lines.push(`  src: string;`);
lines.push(`  thumb: string;`);
lines.push(`  title: string;`);
lines.push(`  category: Category;`);
lines.push(`  location: string;`);
lines.push(`  year: string;`);
lines.push(`  width: number;`);
lines.push(`  height: number;`);
lines.push(`};`);
lines.push(``);
lines.push(`export type Category = "All";`);
lines.push(``);
lines.push(`export const categories: Category[] = ["All"];`);
lines.push(``);
lines.push(`// Personal photography archive — frames collected in passing.`);
lines.push(`// Replace titles / locations / years with your own metadata as you wish.`);
lines.push(`export const photos: Photo[] = [`);

for (const p of photos) {
  // Use simplified aspect ratio (cap large numbers to avoid ugly ratios)
  let w = p.aspect.w;
  let h = p.aspect.h;
  // If either is larger than 50, simplify to common aspect
  if (w > 50 || h > 50) {
    const ratio = p.width / p.height;
    if (ratio > 1.3) {
      w = 3;
      h = 2;
    } else if (ratio < 0.77) {
      w = 2;
      h = 3;
    } else if (ratio > 1.1) {
      w = 4;
      h = 3;
    } else {
      w = 3;
      h = 4;
    }
  }
  const title = `Frame ${String(p.id).padStart(2, "0")}`;
  const safeName = p.originalName.replace(/'/g, "\\'");
  lines.push(`  {`);
  lines.push(`    id: ${p.id},`);
  lines.push(`    src: "${p.fullUrl}",`);
  lines.push(`    thumb: "${p.thumbUrl}",`);
  lines.push(`    title: "${title}",`);
  lines.push(`    category: "All",`);
  lines.push(`    location: "",`);
  lines.push(`    year: "",`);
  lines.push(`    width: ${w},`);
  lines.push(`    height: ${h},`);
  lines.push(`  }, // ${p.folder}/${safeName}`);
}

lines.push(`];`);

fs.writeFileSync(OUT, lines.join("\n"));
console.log(`✓ Wrote ${OUT} with ${photos.length} photos`);
