"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Button(props) {
  const { label, onClick, href } = props;
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className="mt-3 button rounded-lg max-w-30 mx-auto px-5 text-center"
    >
      {href ? <Link href={href}>{label}</Link> : label}
    </motion.button>
  );
}
