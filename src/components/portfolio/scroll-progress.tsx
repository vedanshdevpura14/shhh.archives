"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Top scroll progress indicator — thin gold line that fills as user scrolls.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[9998] h-px origin-left bg-primary/80"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
