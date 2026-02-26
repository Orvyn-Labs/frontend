"use client";

import { motion, AnimatePresence } from "framer-motion";

export const FadeIn = ({ children, delay = 0, duration = 0.5, y = 20 }: { children: React.ReactNode; delay?: number; duration?: number; y?: number }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = 0, duration = 0.4 }: { children: React.ReactNode; delay?: number; duration?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay, ease: [0.23, 1, 0.32, 1] }}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, staggerDelay = 0.1, delay = 0 }: { children: React.ReactNode; staggerDelay?: number; delay?: number }) => (
  <motion.div
    initial="initial"
    animate="animate"
    variants={{
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delay
        }
      }
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={{
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    }}
  >
    {children}
  </motion.div>
);

export const HoverScale = ({ children, scale = 1.02 }: { children: React.ReactNode; scale?: number }) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    {children}
  </motion.div>
);

export { motion, AnimatePresence };
