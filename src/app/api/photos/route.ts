import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { Photo, photos as initialPhotos } from "@/components/portfolio/data";
import { getAdminPasscode } from "@/lib/auth";

const DATA_FILE = path.join(process.cwd(), "src", "data", "photos.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "photos", "uploads");

function verifyAdmin(req: NextRequest): boolean {
  const authHeader = req.headers.get("x-admin-key") || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!authHeader) return false;
  return authHeader.trim() === getAdminPasscode();
}

function readPhotos(): Photo[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading photos.json:", e);
  }
  return initialPhotos;
}

function savePhotos(photos: Photo[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(photos, null, 2), "utf-8");
}

// GET /api/photos — fetch all photos
export async function GET() {
  const photos = readPhotos();
  return NextResponse.json(photos, {
    headers: {
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
    },
  });
}

// POST /api/photos — add a new photo (Owner only)
export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized. Owner passcode required." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "";
    const location = (formData.get("location") as string) || "";
    const year = (formData.get("year") as string) || "";
    const category = ((formData.get("category") as string) || "All") as Photo["category"];

    if (!file) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const timestamp = Date.now();
    const buffer = Buffer.from(await file.arrayBuffer());

    // Process image with sharp: auto-rotate based on EXIF, get dimensions
    const image = sharp(buffer).rotate();
    const metadata = await image.metadata();

    const originalWidth = metadata.width || 1200;
    const originalHeight = metadata.height || 800;

    // Simplify aspect ratio to standard grid numbers (e.g. 3/2, 2/3, 4/3, 1/1)
    let width = 3;
    let height = 2;
    const ratio = originalWidth / originalHeight;
    if (Math.abs(ratio - 1) < 0.15) {
      width = 1;
      height = 1;
    } else if (ratio < 0.8) {
      width = 2;
      height = 3;
    } else if (ratio > 1.3) {
      width = 3;
      height = 2;
    } else {
      width = 4;
      height = 3;
    }

    const fullFileName = `photo-${timestamp}.webp`;
    const thumbFileName = `photo-${timestamp}-thumb.webp`;

    const fullPath = path.join(UPLOAD_DIR, fullFileName);
    const thumbPath = path.join(UPLOAD_DIR, thumbFileName);

    // Save full resolution webp (max 2400px width/height)
    await image
      .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(fullPath);

    // Save thumbnail webp (max 800px width/height)
    await sharp(buffer)
      .rotate()
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(thumbPath);

    const newPhoto: Photo = {
      id: timestamp,
      src: `/photos/uploads/${fullFileName}`,
      thumb: `/photos/uploads/${thumbFileName}`,
      title: title.trim(),
      category,
      location: location.trim(),
      year: year.trim(),
      width,
      height,
    };

    const currentPhotos = readPhotos();
    // Add new photo at the very beginning of the archive
    const updatedPhotos = [newPhoto, ...currentPhotos];
    savePhotos(updatedPhotos);

    return NextResponse.json({
      success: true,
      photo: newPhoto,
      photos: updatedPhotos,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to process photo" }, { status: 500 });
  }
}

// DELETE /api/photos — remove a photo (Owner only)
export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized. Owner passcode required." }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Photo id is required." }, { status: 400 });
    }

    const currentPhotos = readPhotos();
    const target = currentPhotos.find((p) => p.id === Number(id));

    if (!target) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    // If it was an uploaded file, clean up files on disk
    if (target.src.includes("/photos/uploads/")) {
      const fullPath = path.join(process.cwd(), "public", target.src.replace(/^\//, ""));
      const thumbPath = path.join(process.cwd(), "public", target.thumb.replace(/^\//, ""));
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    }

    const updatedPhotos = currentPhotos.filter((p) => p.id !== Number(id));
    savePhotos(updatedPhotos);

    return NextResponse.json({
      success: true,
      deletedId: id,
      photos: updatedPhotos,
    });
  } catch (err: any) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete photo" }, { status: 500 });
  }
}

// PUT /api/photos — reorder photos (Owner only)
export async function PUT(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized. Owner passcode required." }, { status: 401 });
  }

  try {
    const { order } = await req.json();
    if (!Array.isArray(order)) {
      return NextResponse.json({ error: "Order array of IDs is required." }, { status: 400 });
    }

    const currentPhotos = readPhotos();
    const map = new Map(currentPhotos.map((p) => [p.id, p]));
    const ordered: Photo[] = [];

    for (const id of order) {
      const p = map.get(Number(id));
      if (p) {
        ordered.push(p);
        map.delete(Number(id));
      }
    }

    // Append any remaining that weren't in order list
    for (const p of map.values()) {
      ordered.push(p);
    }

    savePhotos(ordered);

    return NextResponse.json({
      success: true,
      photos: ordered,
    });
  } catch (err: any) {
    console.error("Reorder error:", err);
    return NextResponse.json({ error: err.message || "Failed to save photo order" }, { status: 500 });
  }
}
