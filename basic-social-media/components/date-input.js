"use client";

import { motion } from "framer-motion";

export default function DateInput({ id, placeholder, label, onChange, value }) {
  const todaysDate = new Date().toISOString().slice(0, 10);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {label ? (
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-5"
          htmlFor={id}
        >
          {label}
        </label>
      ) : null}
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        id={id}
        type="date"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        max={todaysDate}
      />
    </motion.div>
  );
}
