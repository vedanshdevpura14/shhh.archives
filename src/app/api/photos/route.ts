import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { put, del, list } from "@vercel/blob";
import { Photo, photos as initialPhotos } from "@/components/portfolio/data";
import { getAdminPasscode } from "@/lib/auth";

const DATA_FILE = path.join(process.cwd(), "src", "data", "photos.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "photos", "uploads");

function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isVercel(): boolean {
  return Boolean(process.env.VERCEL);
}

function verifyAdmin(req: NextRequest): boolean {
  const authHeader = req.headers.get("x-admin-key") || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!authHeader) return false;
  return authHeader.trim() === getAdminPasscode();
}

async function readPhotos(): Promise<Photo[]> {
  // If Vercel Blob is configured, check blob storage first
  if (hasBlobStorage()) {
    try {
      const { blobs } = await list({ prefix: "data/photos.json" });
      if (blobs.length > 0) {
        // Sort by upload time descending to get newest
        const latestBlob = blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())[0];
        const res = await fetch(latestBlob.url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data;
          }
        }
      }
    } catch (e) {
      console.error("Error reading from Vercel Blob:", e);
    }
  }

  // Fallback to local photos.json
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading local photos.json:", e);
  }
  return initialPhotos;
}

async function savePhotos(photos: Photo[]): Promise<void> {
  // Save to Vercel Blob if available
  if (hasBlobStorage()) {
    try {
      await put("data/photos.json", JSON.stringify(photos, null, 2), {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
      });
    } catch (e) {
      console.error("Error saving photos to Vercel Blob:", e);
    }
  }

  // Also save locally if writable (development / local machine)
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(photos, null, 2), "utf-8");
  } catch (e) {
    // In read-only serverless environments, fs write will fail safely
  }
}

// GET /api/photos — fetch all photos
export async function GET() {
  const photos = await readPhotos();
  return NextResponse.json(photos, {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
    },
  });
}

// POST /api/photos — add a new photo (Owner only)
export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized. Owner passcode required." }, { status: 401 });
  }

  if (isVercel() && !hasBlobStorage()) {
    return NextResponse.json(
      {
        error:
          "Vercel Blob storage is not connected yet. In your Vercel Dashboard, go to Storage -> Create Database -> Blob -> Connect to shhh-archives (100% free), then uploads will work immediately!",
      },
      { status: 400 }
    );
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

    const timestamp = Date.now();
    const buffer = Buffer.from(await file.arrayBuffer());

    let originalWidth = 1200;
    let originalHeight = 800;
    let fullBuffer: Buffer = buffer;
    let thumbBuffer: Buffer = buffer;

    try {
      // Process with Sharp into buffers (in-memory, no disk write)
      const image = sharp(buffer).rotate();
      const metadata = await image.metadata();
      originalWidth = metadata.width || 1200;
      originalHeight = metadata.height || 800;

      fullBuffer = await sharp(buffer)
        .rotate()
        .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 88 })
        .toBuffer();

      thumbBuffer = await sharp(buffer)
        .rotate()
        .resize(800, 800, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 78 })
        .toBuffer();
    } catch (sharpError) {
      console.warn("Sharp processing failed, using raw buffer:", sharpError);
    }

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

    let srcUrl = "";
    let thumbUrl = "";

    if (hasBlobStorage()) {
      // Upload directly to Vercel Blob
      const fullBlob = await put(`photos/full-${timestamp}.webp`, fullBuffer, {
        access: "public",
        contentType: "image/webp",
      });
      const thumbBlob = await put(`photos/thumb-${timestamp}.webp`, thumbBuffer, {
        access: "public",
        contentType: "image/webp",
      });
      srcUrl = fullBlob.url;
      thumbUrl = thumbBlob.url;
    } else {
      // Local fallback on laptop
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }
      const fullFileName = `photo-${timestamp}.webp`;
      const thumbFileName = `photo-${timestamp}-thumb.webp`;
      fs.writeFileSync(path.join(UPLOAD_DIR, fullFileName), fullBuffer);
      fs.writeFileSync(path.join(UPLOAD_DIR, thumbFileName), thumbBuffer);
      srcUrl = `/photos/uploads/${fullFileName}`;
      thumbUrl = `/photos/uploads/${thumbFileName}`;
    }

    const newPhoto: Photo = {
      id: timestamp,
      src: srcUrl,
      thumb: thumbUrl,
      title: title.trim(),
      category,
      location: location.trim(),
      year: year.trim(),
      width,
      height,
    };

    const currentPhotos = await readPhotos();
    const updatedPhotos = [newPhoto, ...currentPhotos];
    await savePhotos(updatedPhotos);

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

    const currentPhotos = await readPhotos();
    const target = currentPhotos.find((p) => p.id === Number(id));

    if (!target) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    // Clean up Vercel Blob files if stored on Vercel
    if (hasBlobStorage()) {
      try {
        if (target.src.startsWith("http")) await del(target.src);
        if (target.thumb.startsWith("http")) await del(target.thumb);
      } catch (delErr) {
        console.error("Error deleting from Vercel Blob:", delErr);
      }
    }

    // Clean up local disk files if local
    if (target.src.includes("/photos/uploads/")) {
      try {
        const fullPath = path.join(process.cwd(), "public", target.src.replace(/^\//, ""));
        const thumbPath = path.join(process.cwd(), "public", target.thumb.replace(/^\//, ""));
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
      } catch (localDelErr) {}
    }

    const updatedPhotos = currentPhotos.filter((p) => p.id !== Number(id));
    await savePhotos(updatedPhotos);

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

    const currentPhotos = await readPhotos();
    const map = new Map(currentPhotos.map((p) => [p.id, p]));
    const ordered: Photo[] = [];

    for (const id of order) {
      const p = map.get(Number(id));
      if (p) {
        ordered.push(p);
        map.delete(Number(id));
      }
    }

    for (const p of map.values()) {
      ordered.push(p);
    }

    await savePhotos(ordered);

    return NextResponse.json({
      success: true,
      photos: ordered,
    });
  } catch (err: any) {
    console.error("Reorder error:", err);
    return NextResponse.json({ error: err.message || "Failed to save photo order" }, { status: 500 });
  }
}
