"use client";

import { motion } from "framer-motion";
import { MAX_AGE, MIN_AGE } from "@/constants/app-info";

export default function DateInput({ id, placeholder, label, onChange, value }) {
  const calculateMinOrMax = (age) => {
    const todaysDate = new Date();
    todaysDate.setFullYear(todaysDate.getFullYear() - age);
    return todaysDate.toISOString().split("T")[0];
  };

  const minDate = calculateMinOrMax(MAX_AGE);
  const maxDate = calculateMinOrMax(MIN_AGE);

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
        className="bg-gray-50 min-w-[210px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        id={id}
        type="date"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        max={maxDate}
        min={minDate}
      />
    </motion.div>
  );
}
