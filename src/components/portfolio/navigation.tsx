"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Index", href: "#work" },
  { label: "Info", href: "#info" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-0 right-0 top-0 z-[9000] transition-all duration-500 ${
          scrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-border/40"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
          {/* Brand */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-baseline gap-1"
            data-cursor="hover"
          >
            <span className="font-serif text-xl tracking-tight text-foreground">
              shhh
            </span>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              .archive
            </span>
          </button>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-10 md:flex">
            {navItems.map((item, i) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + i * 0.08, duration: 0.5 }}
              >
                <button
                  onClick={() => handleNav(item.href)}
                  data-cursor="hover"
                  className="link-underline font-sans text-[11px] uppercase tracking-[0.25em] text-foreground/70 hover:text-foreground transition-colors"
                >
                  {item.label}
                </button>
              </motion.li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[8999] bg-background/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex h-full flex-col items-start justify-center px-10">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  onClick={() => handleNav(item.href)}
                  className="py-3 font-serif text-4xl text-foreground"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
