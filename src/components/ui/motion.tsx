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

export const ParallaxBackground = () => (
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full -z-10 pointer-events-none overflow-hidden">
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3],
        x: [0, 20, 0],
        y: [0, -20, 0],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-[5%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]"
    />
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.4, 0.2],
        x: [0, -30, 0],
        y: [0, 30, 0],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-violet-500/10 rounded-full blur-[100px]"
    />
    <motion.div
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.1, 0.2, 0.1],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-amber-500/5 rounded-full blur-[120px]"
    />
  </div>
);

export { motion, AnimatePresence };
