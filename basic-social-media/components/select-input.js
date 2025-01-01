"use client";

import { motion } from "framer-motion";

export default function SelectInput({
  id,
  placeholder,
  label,
  options,
  onChange,
  value,
}) {
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
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      >
        <option value="none" disabled hidden>
          Select an Option
        </option>
        {options &&
          options.length > 0 &&
          options.map((el) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
      </select>
    </motion.div>
  );
}
