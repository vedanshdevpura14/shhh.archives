"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup, useInView, useAnimation } from "framer-motion";
import { X, ArrowLeft, ArrowRight, ArrowLeftRight, RotateCcw, Check, Copy, ArrowUpToLine, ArrowDownToLine, Plus, Trash2, Lock, Unlock, ShieldCheck, Loader2, KeyRound } from "lucide-react";
import { photos as initialPhotos, categories, type Category, type Photo } from "./data";
import { OwnerLoginModal, AddPhotoModal, ChangePasscodeModal } from "./owner-modal";

export default function GallerySection() {
  const [active, setActive] = useState<Category>("All");
  const [selected, setSelected] = useState<Photo | null>(null);

  // Photos state (fetched from /api/photos or fallback to initialPhotos)
  const [photoList, setPhotoList] = useState<Photo[]>(initialPhotos);
  const [loading, setLoading] = useState(false);

  // Reordering mode state
  const [isReordering, setIsReordering] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);

  // Owner Authentication State
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Load photos from server API on mount
  const loadPhotosFromServer = useCallback(async () => {
    try {
      const res = await fetch("/api/photos");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPhotoList(data);
        }
      }
    } catch (e) {
      console.error("Could not fetch photos from server:", e);
    }
  }, []);

  useEffect(() => {
    loadPhotosFromServer();
  }, [loadPhotosFromServer]);

  // Check persisted admin session
  useEffect(() => {
    try {
      const storedKey = localStorage.getItem("shhh_admin_token");
      if (storedKey) {
        fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode: storedKey }),
        })
          .then((r) => r.json())
          .then((res) => {
            if (res.valid) {
              setIsAdmin(true);
              setAdminKey(storedKey);
            } else {
              localStorage.removeItem("shhh_admin_token");
            }
          })
          .catch(() => {});
      }
    } catch (e) {}
  }, []);

  // Listen for global custom event or keyboard shortcut to open Owner Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+O or Alt+O opens owner login
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        if (isAdmin) {
          setIsAddModalOpen(true);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };

    const handleOpenOwner = () => {
      setIsLoginModalOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-owner-login", handleOpenOwner);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-owner-login", handleOpenOwner);
    };
  }, [isAdmin]);

  const handleLogin = async (passcode: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (data.valid) {
        setIsAdmin(true);
        setAdminKey(passcode);
        try {
          localStorage.setItem("shhh_admin_token", passcode);
        } catch (e) {}
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminKey("");
    setIsReordering(false);
    try {
      localStorage.removeItem("shhh_admin_token");
    } catch (e) {}
  };

  const handlePhotoAdded = (newPhoto: Photo) => {
    setPhotoList((prev) => [newPhoto, ...prev.filter((p) => p.id !== newPhoto.id)]);
  };

  const handleDeletePhoto = async (id: number) => {
    if (!isAdmin) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this photograph from the archive?");
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/photos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setPhotoList((prev) => prev.filter((p) => p.id !== id));
        if (selected?.id === id) {
          setSelected(null);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete photo");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting photo");
    } finally {
      setDeletingId(null);
    }
  };

  const movePhoto = (index: number, direction: "left" | "right" | "start" | "end") => {
    setPhotoList((prev) => {
      const next = [...prev];
      const item = next[index];
      next.splice(index, 1);
      if (direction === "left") {
        next.splice(Math.max(0, index - 1), 0, item);
      } else if (direction === "right") {
        next.splice(Math.min(next.length, index + 1), 0, item);
      } else if (direction === "start") {
        next.unshift(item);
      } else if (direction === "end") {
        next.push(item);
      }
      return next;
    });
  };

  const saveOrderToServer = async () => {
    if (!isAdmin) return;
    setSavingOrder(true);
    try {
      const ids = photoList.map((p) => p.id);
      const res = await fetch("/api/photos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ order: ids }),
      });

      if (res.ok) {
        setOrderSaved(true);
        setTimeout(() => setOrderSaved(false), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingOrder(false);
    }
  };

  const resetOrder = async () => {
    setPhotoList(initialPhotos);
    if (isAdmin) {
      const ids = initialPhotos.map((p) => p.id);
      await fetch("/api/photos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ order: ids }),
      });
    }
  };

  const isCustomTitle = (title?: string) => {
    if (!title) return false;
    return !/^frame\s*\d+$/i.test(title.trim());
  };

  const filtered = useMemo(() => {
    if (active === "All") return photoList;
    return photoList.filter((p) => p.category === active);
  }, [active, photoList]);

  const count = filtered.length;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!selected) return;
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight") {
        const idx = photoList.findIndex((p) => p.id === selected.id);
        setSelected(photoList[(idx + 1) % photoList.length]);
      }
      if (e.key === "ArrowLeft") {
        const idx = photoList.findIndex((p) => p.id === selected.id);
        setSelected(photoList[(idx - 1 + photoList.length) % photoList.length]);
      }
    },
    [selected, photoList]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    if (document.body) {
      document.body.style.overflow = selected ? "hidden" : "";
    }
  }, [selected]);

  return (
    <section id="work" className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        {/* Section header */}
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="font-sans text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
            >
              Index — Photographs {String(photoList.length).padStart(2, "0")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 font-serif text-4xl font-light leading-[0.95] tracking-tight sm:text-6xl"
            >
              The
              <span className="italic text-muted-foreground"> Archive</span>
            </motion.h2>

            {/* Film roll doodle — hangs off the title, right side negative space (desktop) */}
            <div className="absolute -right-20 top-0 hidden lg:block" aria-hidden>
              <FilmRollDoodle />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Owner Controls Toolbar (visible ONLY when logged in as Owner) */}
            {isAdmin ? (
              <div className="flex flex-wrap items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 backdrop-blur-md">
                <span className="flex items-center gap-1.5 font-sans text-[9px] uppercase tracking-[0.2em] text-emerald-400 font-medium mr-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Owner Mode
                </span>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 font-sans text-[10px] uppercase tracking-[0.15em] text-background hover:bg-foreground/90 transition-colors"
                >
                  <Plus size={11} />
                  Add Photo
                </button>

                <button
                  onClick={() => setIsReordering(!isReordering)}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-sans text-[10px] uppercase tracking-[0.15em] transition-colors ${
                    isReordering
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground hover:border-foreground/50"
                  }`}
                >
                  <ArrowLeftRight size={11} />
                  {isReordering ? "Exit Reorder" : "Rearrange"}
                </button>

                <button
                  onClick={() => setIsChangePassModalOpen(true)}
                  title="Change Owner Passcode"
                  className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.15em] text-foreground/80 hover:border-foreground/50 hover:text-foreground transition-colors"
                >
                  <KeyRound size={11} />
                  Passcode
                </button>

                <button
                  onClick={handleLogout}
                  title="Lock Owner Mode"
                  className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Unlock size={12} className="text-emerald-400" />
                </button>
              </div>
            ) : null}

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
              >
                Showing {String(count).padStart(2, "0")} of{" "}
                {String(photoList.length).padStart(2, "0")}
              </motion.div>
              {/* Darkroom timer doodle next to count */}
              <div className="absolute -right-14 top-1/2 -translate-y-1/2 hidden lg:block" aria-hidden>
                <DarkroomTimerDoodle />
              </div>
            </div>
          </div>
        </div>

        {/* Reordering Control Bar (Owner only) */}
        <AnimatePresence>
          {isAdmin && isReordering && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-10 overflow-hidden rounded-xl border border-border/80 bg-muted/20 p-4 sm:p-6 backdrop-blur-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-serif text-lg text-foreground">
                    Rearrange Archive Order
                  </p>
                  <p className="mt-1 font-sans text-xs text-muted-foreground">
                    Use arrows on each card to reorder. Click &quot;Save Order to Site&quot; to make it permanent for all visitors.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={saveOrderToServer}
                    disabled={savingOrder}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-1.5 font-sans text-[10px] uppercase tracking-[0.15em] text-black font-medium hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                  >
                    {savingOrder ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : orderSaved ? (
                      <Check size={11} />
                    ) : (
                      <Check size={11} />
                    )}
                    {orderSaved ? "Order Published!" : "Save Order to Site"}
                  </button>

                  <button
                    onClick={resetOrder}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                  >
                    <RotateCcw size={11} />
                    Reset
                  </button>

                  <button
                    onClick={() => setIsReordering(false)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 font-sans text-[10px] uppercase tracking-[0.15em] text-background hover:bg-foreground/90 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter bar */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 flex flex-wrap items-center gap-2 sm:gap-3"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActive(cat)}
                data-cursor="hover"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative overflow-hidden rounded-full border px-4 py-1.5 font-sans text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                  active === cat
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {cat}
                {active === cat && (
                  <motion.span
                    className="absolute inset-0 rounded-full border border-foreground/20"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Grid display: either interactive reordering grid OR masonry presentation */}
        {isAdmin && isReordering ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
            {photoList.map((photo, i) => (
              <motion.div
                key={photo.id}
                layout
                className="group relative flex flex-col overflow-hidden rounded-md border border-border/80 bg-card p-2"
              >
                {/* Card thumbnail */}
                <div
                  className="relative w-full overflow-hidden rounded-sm bg-black/40"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <img
                    src={photo.thumb}
                    alt={photo.title || `Photo ${photo.id}`}
                    className="h-full w-full object-cover"
                  />
                  {/* Sequence pill */}
                  <span className="absolute top-1.5 left-1.5 rounded bg-background/80 px-1.5 py-0.5 font-mono text-[9px] font-medium text-foreground backdrop-blur-md">
                    #{i + 1}
                  </span>

                  {/* Delete button (Owner only) */}
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    disabled={deletingId === photo.id}
                    title="Delete photo"
                    className="absolute top-1.5 right-1.5 rounded bg-rose-950/80 p-1 text-rose-300 hover:bg-rose-900 transition-colors backdrop-blur-md"
                  >
                    {deletingId === photo.id ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <Trash2 size={11} />
                    )}
                  </button>
                </div>

                {/* Reorder controls bar */}
                <div className="mt-2 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => movePhoto(i, "start")}
                      title="Move to beginning"
                      disabled={i === 0}
                      className="rounded border border-border p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUpToLine size={12} />
                    </button>
                    <button
                      onClick={() => movePhoto(i, "left")}
                      title="Move earlier"
                      disabled={i === 0}
                      className="rounded border border-border p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft size={12} />
                    </button>
                  </div>

                  <span className="font-mono text-[9px] text-muted-foreground/60">
                    ID {photo.id}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => movePhoto(i, "right")}
                      title="Move later"
                      disabled={i === photoList.length - 1}
                      className="rounded border border-border p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowRight size={12} />
                    </button>
                    <button
                      onClick={() => movePhoto(i, "end")}
                      title="Move to end"
                      disabled={i === photoList.length - 1}
                      className="rounded border border-border p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDownToLine size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Masonry grid (Public view) */
          <LayoutGroup>
            <motion.div
              layout
              className="columns-1 gap-3 sm:columns-2 lg:columns-3 sm:gap-4 [&>*]:mb-3 sm:[&>*]:mb-4"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((photo, i) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.6,
                      delay: (i % 6) * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group relative block w-full break-inside-avoid text-left"
                    style={{
                      aspectRatio: `${photo.width} / ${photo.height}`,
                    }}
                  >
                    <div className="image-zoom-container relative h-full w-full overflow-hidden rounded-sm bg-card cursor-pointer"
                      onClick={() => setSelected(photo)}
                      data-cursor="hover"
                      data-cursor-label="View"
                    >
                      <img
                        src={photo.thumb}
                        alt={`${photo.title || "Photograph"} — ${photo.category}, ${photo.location}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      {/* Subtle gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      {/* Minimal caption — only show custom title, NEVER default "Frame XX" */}
                      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">
                        <div>
                          {isCustomTitle(photo.title) && (
                            <p className="font-serif text-lg text-foreground">
                              {photo.title}
                            </p>
                          )}
                          {(photo.location || photo.year) && (
                            <p className="mt-0.5 font-sans text-[9px] uppercase tracking-[0.25em] text-foreground/60">
                              {[photo.location, photo.year]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Owner Quick Delete Button (Visible only to authenticated Owner on hover) */}
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhoto(photo.id);
                        }}
                        disabled={deletingId === photo.id}
                        title="Delete photo from archive"
                        className="absolute top-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity border border-border/80 hover:bg-rose-950/80 hover:text-rose-300 backdrop-blur-md shadow-md"
                      >
                        {deletingId === photo.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 sm:p-10 backdrop-blur-md"
          >
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              data-cursor="hover"
              aria-label="Close"
              className="absolute top-6 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Left arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const idx = photoList.findIndex((p) => p.id === selected.id);
                setSelected(photoList[(idx - 1 + photoList.length) % photoList.length]);
              }}
              data-cursor="hover"
              aria-label="Previous"
              className="absolute left-6 z-10 hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>

            {/* Right arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const idx = photoList.findIndex((p) => p.id === selected.id);
                setSelected(photoList[(idx + 1) % photoList.length]);
              }}
              data-cursor="hover"
              aria-label="Next"
              className="absolute right-6 z-10 hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors"
            >
              <ArrowRight size={16} />
            </button>

            <motion.div
              key={selected.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto flex max-h-[85vh] max-w-[90vw] flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Film frame corners on lightbox image */}
              <div className="relative">
                <LightboxCorners />
                <img
                  src={selected.src}
                  alt={selected.title || "Photograph"}
                  className="max-h-[75vh] max-w-full object-contain"
                />

                {/* Owner Delete directly inside lightbox */}
                {isAdmin && (
                  <button
                    onClick={() => handleDeletePhoto(selected.id)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-rose-950/90 border border-rose-500/40 px-3 py-1 font-sans text-[10px] uppercase tracking-wider text-rose-300 hover:bg-rose-900 transition-colors backdrop-blur-md"
                  >
                    <Trash2 size={12} />
                    Delete Frame
                  </button>
                )}
              </div>
              <div className="mt-5 flex w-full items-end justify-between">
                <div>
                  {isCustomTitle(selected.title) && (
                    <h3 className="font-serif text-xl text-foreground">
                      {selected.title}
                    </h3>
                  )}
                  {(selected.location || selected.year) && (
                    <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                      {[selected.location, selected.year]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Owner Authentication Modal */}
      <OwnerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Owner Add Photo Modal */}
      <AddPhotoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        adminKey={adminKey}
        onPhotoAdded={handlePhotoAdded}
      />

      {/* Owner Change Passcode Modal */}
      <ChangePasscodeModal
        isOpen={isChangePassModalOpen}
        onClose={() => setIsChangePassModalOpen(false)}
        adminKey={adminKey}
        onPasscodeChanged={(newKey) => {
          setAdminKey(newKey);
          try {
            localStorage.setItem("shhh_admin_token", newKey);
          } catch (e) {}
        }}
      />
    </section>
  );
}

/* ─── Film Roll Doodle ─── */
function FilmRollDoodle() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const controls = useAnimation();
  useEffect(() => { if (isInView) controls.start("visible"); }, [isInView, controls]);

  const sp = { stroke: "oklch(0.88 0.004 260)", strokeOpacity: 0.14, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const draw = (delay: number, dur = 1.2) => ({
    variants: { hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1, transition: { duration: dur, delay, ease: "easeInOut" as const } } },
    initial: "hidden", animate: controls,
  });

  return (
    <div ref={ref} className="animate-float-slow">
      <svg viewBox="0 0 50 140" width="40" height="110" aria-hidden>
        {/* roll hub top */}
        <motion.circle cx={25} cy={15} r={10} strokeWidth="1.2" {...sp} {...draw(0)} />
        <motion.circle cx={25} cy={15} r={5} strokeWidth="0.9" {...sp} {...draw(0.1)} />
        {/* roll body outline */}
        <motion.rect x={8} y={25} width={34} height={90} rx={4} strokeWidth="1.3" {...sp} {...draw(0.2, 1.4)} />
        {/* film tongue coming out */}
        <motion.path d="M 8 35 H 2 V 105 H 8" strokeWidth="1" {...sp} {...draw(0.35, 1.0)} />
        {/* sprocket holes left */}
        {[35, 50, 65, 80, 95].map((y, i) => (
          <motion.rect key={`l-${i}`} x={12} y={y} width={8} height={8} rx={1.5} strokeWidth="0.8" {...sp} {...draw(0.1 * i + 0.3, 0.5)} />
        ))}
        {/* sprocket holes right */}
        {[35, 50, 65, 80, 95].map((y, i) => (
          <motion.rect key={`r-${i}`} x={36} y={y} width={8} height={8} rx={1.5} strokeWidth="0.8" {...sp} {...draw(0.1 * i + 0.35, 0.5)} />
        ))}
        {/* frame lines */}
        <motion.line x1={14} y1={52} x2={36} y2={52} strokeWidth="0.6" {...sp} strokeOpacity={0.08} {...draw(0.5, 0.6)} />
        <motion.line x1={14} y1={72} x2={36} y2={72} strokeWidth="0.6" {...sp} strokeOpacity={0.08} {...draw(0.55, 0.6)} />
        <motion.line x1={14} y1={92} x2={36} y2={92} strokeWidth="0.6" {...sp} strokeOpacity={0.08} {...draw(0.6, 0.6)} />
        {/* roll hub bottom */}
        <motion.circle cx={25} cy={125} r={10} strokeWidth="1.2" {...sp} {...draw(0.65)} />
        <motion.circle cx={25} cy={125} r={5} strokeWidth="0.9" {...sp} {...draw(0.75)} />
      </svg>
    </div>
  );
}

/* ─── Darkroom Timer Doodle ─── */
function DarkroomTimerDoodle() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const controls = useAnimation();
  useEffect(() => { if (isInView) controls.start("visible"); }, [isInView, controls]);

  const sp = { stroke: "oklch(0.88 0.004 260)", strokeOpacity: 0.13, fill: "none", strokeLinecap: "round" as const };
  const draw = (delay: number) => ({
    variants: { hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1, transition: { duration: 1.0, delay, ease: "easeInOut" as const } } },
    initial: "hidden", animate: controls,
  });

  const rnd = (n: number) => Number(n.toFixed(2));

  return (
    <div ref={ref}>
      <svg viewBox="0 0 36 36" width="28" height="28" aria-hidden>
        <motion.circle cx={18} cy={18} r={16} strokeWidth="1.1" {...sp} {...draw(0)} />
        {/* hour marks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <motion.line
              key={i}
              x1={rnd(18 + 12 * Math.cos(rad))}
              y1={rnd(18 + 12 * Math.sin(rad))}
              x2={rnd(18 + 15 * Math.cos(rad))}
              y2={rnd(18 + 15 * Math.sin(rad))}
              strokeWidth="0.7"
              {...sp}
              {...draw(0.1 + i * 0.02)}
            />
          );
        })}
        {/* hands */}
        <motion.line x1={18} y1={18} x2={18} y2={6} strokeWidth="1" {...sp} {...draw(0.4)} />
        <motion.line x1={18} y1={18} x2={26} y2={22} strokeWidth="0.9" {...sp} {...draw(0.5)} />
        <motion.circle cx={18} cy={18} r={1.5} strokeWidth="0.8" {...sp} {...draw(0.45)} />
      </svg>
    </div>
  );
}

/* ─── Lightbox film frame corners ─── */
function LightboxCorners() {
  const sp = { stroke: "oklch(0.88 0.004 260)", strokeOpacity: 0.25, fill: "none", strokeLinecap: "round" as const };
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <path d="M 2 14 V 2 H 14" strokeWidth="1" {...sp} />
      <path d="M 86 2 H 98 V 14" strokeWidth="1" {...sp} />
      <path d="M 2 86 V 98 H 14" strokeWidth="1" {...sp} />
      <path d="M 86 98 H 98 V 86" strokeWidth="1" {...sp} />
    </svg>
  );
}
