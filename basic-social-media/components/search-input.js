"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SearchInput({
  id,
  type,
  placeholder,
  label,
  onChange,
  value,
  foundData,
  handleProfileInSearchClick,
}) {
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
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        id={id}
        type={type ? type : "text"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <div className="search"></div>
      <div className="dropdown fixed w-inherit bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg">
        {foundData && foundData.length > 0
          ? foundData.map((user) => (
              <Link
                href={`/profile/${user.id}`}
                key={user.id}
                onClick={handleProfileInSearchClick}
              >
                <div className="px-0.5 py-2 hover:bg-sky-700 cursor-pointer">
                  {user.name + " " + user.surname}
                </div>
              </Link>
            ))
          : null}
      </div>
    </motion.div>
  );
}
