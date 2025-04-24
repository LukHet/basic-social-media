export default function FileInput({ handleFileChange, fileSize }) {
  const returnFileSize = (number) => {
    if (number < 1e3) {
      return `${number} bytes`;
    } else if (number >= 1e3 && number < 1e6) {
      return `${(number / 1e3).toFixed(1)} KB`;
    } else {
      return `${(number / 1e6).toFixed(1)} MB`;
    }
  };
  return (
    <>
      <input
        type="file"
        onChange={handleFileChange}
        className="my-3 block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
    file:bg-gray-50 file:border-0
    file:me-4
    file:py-3 file:px-4
    dark:file:bg-neutral-700 dark:file:text-neutral-400 cursor-pointer"
        accept=".jpg, .jpeg, .png"
      />
      {fileSize > 0 ? <p>File size: {returnFileSize(fileSize)}</p> : null}
    </>
  );
}
