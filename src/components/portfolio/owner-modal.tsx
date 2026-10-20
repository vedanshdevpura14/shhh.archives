"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, X, Upload, Plus, Trash2, Check, AlertCircle, Loader2, Image as ImageIcon } from "lucide-react";
import { Photo } from "./data";

interface OwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLogin: (passcode: string) => Promise<boolean>;
  onLogout: () => void;
  onPhotoAdded: (photo: Photo) => void;
}

export function OwnerLoginModal({
  isOpen,
  onClose,
  onLogin,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (passcode: string) => Promise<boolean>;
}) {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPasscode("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setLoading(true);
    setError("");

    const success = await onLogin(passcode);
    setLoading(false);

    if (success) {
      onClose();
    } else {
      setError("Incorrect passcode. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-sm rounded-xl border border-border/80 bg-card p-6 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/40">
              <Lock size={15} className="text-foreground" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-foreground">Owner Access</h3>
              <p className="font-sans text-[11px] text-muted-foreground">
                Unlock add, delete & reorder controls
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                Passcode
              </label>
              <input
                ref={inputRef}
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter owner passcode"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/60 focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-muted-foreground/60">
                Default passcode: <span className="font-mono text-foreground/80">shhh14</span>
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-500">
                <AlertCircle size={13} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border px-4 py-1.5 font-sans text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 font-sans text-xs text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors"
              >
                {loading && <Loader2 size={12} className="animate-spin" />}
                Unlock
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function AddPhotoModal({
  isOpen,
  onClose,
  adminKey,
  onPhotoAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  adminKey: string;
  onPhotoAdded: (photo: Photo) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreview(null);
      setTitle("");
      setLocation("");
      setError("");
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith("image/")) {
        setError("Please choose a valid image file (JPG, PNG, WEBP).");
        return;
      }
      setFile(selected);
      setError("");
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image to upload.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("location", location.trim());
      formData.append("year", year.trim());
      formData.append("category", "All");

      const res = await fetch("/api/photos", {
        method: "POST",
        headers: {
          "x-admin-key": adminKey,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload photo");
      }

      onPhotoAdded(data.photo);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-xl border border-border/80 bg-card p-6 shadow-2xl my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2 mb-6">
            <Plus size={18} className="text-foreground" />
            <h3 className="font-serif text-xl text-foreground">Add New Photograph</h3>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            {/* File Drop / Selector */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileChange}
                className="hidden"
              />

              {preview ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border/80 bg-black/60 group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full bg-foreground px-4 py-1.5 font-sans text-xs text-background"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full aspect-[16/10] rounded-lg border border-dashed border-border/80 hover:border-foreground/50 transition-colors p-6 text-center cursor-pointer bg-muted/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/40 mb-3 text-muted-foreground">
                    <Upload size={20} />
                  </div>
                  <p className="font-sans text-sm font-medium text-foreground">
                    Select a photograph
                  </p>
                  <p className="mt-1 font-sans text-xs text-muted-foreground">
                    JPG, PNG or WEBP (auto-optimized on upload)
                  </p>
                </button>
              )}
            </div>

            {/* Optional Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Udaipur Monsoon"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Lake Pichola"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/60 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2024"
                className="w-28 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/60 focus:outline-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-500">
                <AlertCircle size={13} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border px-4 py-2 font-sans text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading || !file}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 font-sans text-xs text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors"
              >
                {uploading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Processing & Publishing...</span>
                  </>
                ) : (
                  <>
                    <Upload size={13} />
                    <span>Add to Archive</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function ChangePasscodeModal({
  isOpen,
  onClose,
  adminKey,
  onPasscodeChanged,
}: {
  isOpen: boolean;
  onClose: () => void;
  adminKey: string;
  onPasscodeChanged: (newKey: string) => void;
}) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrent(adminKey);
      setNewPass("");
      setConfirmPass("");
      setError("");
      setSuccess(false);
    }
  }, [isOpen, adminKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass.trim()) {
      setError("Please enter a new passcode.");
      return;
    }
    if (newPass.trim().length < 4) {
      setError("Passcode must be at least 4 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("New passcodes do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/change-passcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": current.trim(),
        },
        body: JSON.stringify({
          currentPasscode: current.trim(),
          newPasscode: newPass.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to change passcode.");
      }

      setSuccess(true);
      onPasscodeChanged(newPass.trim());
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update passcode");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-sm rounded-xl border border-border/80 bg-card p-6 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <Lock size={16} className="text-foreground" />
            <h3 className="font-serif text-lg text-foreground">Change Owner Passcode</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Current Passcode
              </label>
              <input
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="Current passcode"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-foreground/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                New Passcode
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Minimum 4 characters"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-foreground/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Confirm New Passcode
              </label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Repeat new passcode"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-foreground/60 focus:outline-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-500">
                <AlertCircle size={13} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Check size={13} />
                <span>Passcode updated successfully!</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border px-3.5 py-1.5 font-sans text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 font-sans text-xs text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors"
              >
                {loading && <Loader2 size={12} className="animate-spin" />}
                Save New Passcode
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
