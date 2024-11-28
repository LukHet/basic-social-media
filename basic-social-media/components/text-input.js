"use client";

import { motion } from "framer-motion";

export default function TextInput({ id, type, placeholder, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <label
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-5"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        id={id}
        type={type ? type : "text"}
        placeholder={placeholder}
      />
    </motion.div>
  );
}
