"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Button({
  label,
  onClick,
  href,
  additionalClass,
  disabled = false,
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className={`mt-3 button rounded-lg max-w-30 mx-auto px-5 text-center ${
        additionalClass || ""
      } ${
        disabled
          ? "cursor-not-allowed !bg-gray-300 pointer-events-none !opacity-50"
          : ""
      }`}
    >
      {href ? <Link href={href}>{label}</Link> : label}
    </motion.button>
  );
}
