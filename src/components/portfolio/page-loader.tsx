"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Quiet intro loader for shhh.archive — brand mark with a typewriter reveal.
 */
export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl"
              initial={{ letterSpacing: "0.6em", opacity: 0 }}
              animate={{ letterSpacing: "0.05em", opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              shhh
              <span className="text-muted-foreground">.archive</span>
            </motion.div>
            <motion.div
              className="mt-3 font-sans text-[9px] uppercase tracking-[0.4em] text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              a personal archive
            </motion.div>
          </motion.div>

          {/* Bottom hairline progress */}
          <motion.div
            className="absolute bottom-0 left-0 h-px bg-foreground/60"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
