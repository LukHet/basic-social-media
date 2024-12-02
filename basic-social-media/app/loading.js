"use client";

import React from "react";
import { motion } from "framer-motion";
import "./globals.css";

export default function Spinner() {
  return (
    <div className="loader-container">
      <motion.span
        className="span spin"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "easeInOut",
          duration: 1,
        }}
      />
    </div>
  );
}
