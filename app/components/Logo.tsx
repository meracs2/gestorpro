"use client";

import { motion } from "framer-motion";

export default function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: [0.42, 0, 0.58, 1] }}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '24px',
        fontWeight: '300',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'black'
      }}
    >
      MHMC
    </motion.div>
  );
}
