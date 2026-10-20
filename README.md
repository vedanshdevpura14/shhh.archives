# shhh.archives 🎞️

> A quiet, editorial photography archive and digital darkroom for **Vedansh Devpura**.

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-black?style=flat&logo=framer)](https://www.framer.com/motion/)

---

## 📷 About the Project

**shhh.archive** is an editorial visual portfolio celebrating the art of slow, contemplative photography. Inspired by darkroom proofs and photojournalistic contact sheets, it pairs a quiet monochrome palette with bespoke SVG line doodles and modern web craft.

---

## ✨ Features

- **🎞️ Editorial Darkroom Aesthetic**: High-contrast quiet monochrome theme with film-grain texture, smooth scroll progress, and custom circular focus cursor.
- **✏️ Hand-Drawn Photography Doodles**: Scroll-triggered SVG animations sketch themselves into view across negative spaces:
  - 6-blade spinning aperture rings with f-stop tick marks.
  - Advancing 35mm film strips with sprocket holes and frame rails.
  - Darkroom enlarger safelights with light cone rays.
  - Analog exposure light meters with swinging needles.
  - Tripod camera rigs with subtle lens flares.
- **📷 Gear Showcase & Full-Bleed Photo Break**:
  - Full-bleed cinematic bridge with Lightroom-style RAW exposure overlay (`FF_09209.ARW · 35mm f/1.8`).
  - Darkroom contact proof card displaying daily carry specs (`SONY α7 · FE 35mm F1.8 · ▲ SAFETY FILM ▲`).
- **🖼️ Fluid Masonry Archive & Lightbox**:
  - Responsive masonry grid with category filters.
  - Fullscreen lightbox overlay with darkroom viewfinder corner brackets.
  - Clean captions displaying only intentional custom titles and location/year metadata.
- **🔏 Built-in Owner Management Suite**:
  - **Secure Owner Access**: Locked behind an encrypted owner passcode modal (`Ctrl + Shift + O` or discreet footer link).
  - **Live Photo Uploads**: Drag-and-drop image upload processed on-the-fly via **Sharp** (auto-rotated by EXIF, auto-scaled to webp, progressive thumbnails generated).
  - **Visual Reorder Mode**: Interactive sequence controls (`[◀]`, `[▶]`, `[⤒]`, `[⤓]`) with one-click live server publishing.
  - **One-Click Deletions**: Quick delete trash controls directly on cards and inside the lightbox.
  - **In-Browser Passcode Management**: Change owner passcodes directly from the UI without code edits.
- **✒️ Official Watermark Seals**: *Shhhhhhh Photography* emblem featured in the middle page transition and as the closing seal in the footer.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (Turbopack, App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with OKLCH color variables
- **Motion & Physics**: [Framer Motion 12](https://www.framer.com/motion/)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript 5

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/vedanshdevpura14/shhh.archives.git
cd shhh.archives
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables (Optional)

Create a `.env.local` file in the root directory:
```env
# Custom Owner Passcode (defaults to shhh14 if not provided)
ADMIN_PASSCODE=your_custom_passcode
```

---

## 📂 Project Structure

```text
├── public/
│   ├── camera-bw.png          # Everyday carry gear photograph
│   ├── watermark.png          # Shhhhhhh Photography seal emblem
│   └── photos/                # Archive high-res & thumbnail assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── photos/        # GET, POST (upload), DELETE, PUT (reorder)
│   │   │   └── auth/          # Verify & Change Passcode endpoints
│   │   ├── globals.css        # Theme variables & custom keyframe animations
│   │   ├── layout.tsx         # Root layout with fonts & metadata
│   │   └── page.tsx           # Portfolio composition
│   ├── components/
│   │   └── portfolio/
│   │       ├── doodle-divider.tsx  # SVG photography artwork dividers
│   │       ├── gallery-section.tsx # Archive masonry, lightbox & reordering
│   │       ├── hero-section.tsx    # Title entrance, aperture & film corners
│   │       ├── info-section.tsx    # Photographer bio & bento grid
│   │       ├── owner-modal.tsx     # Owner auth, upload & passcode modals
│   │       └── footer.tsx          # Contact section & camera cutout card
│   ├── data/
│   │   ├── photos.json        # Persistent live photo database
│   │   └── admin.json         # Encrypted owner credentials
│   └── lib/
│       └── auth.ts            # Centralized authentication helper
```

---

## 👤 Author

**Vedansh Devpura**
- Instagram: [@shhhhhhh._.14](https://instagram.com/shhhhhhh._.14)
- Email: [shootly.in@gmail.com](mailto:shootly.in@gmail.com)

---

## 📄 License

Personal portfolio and creative archive. All photographic works © Vedansh Devpura.
