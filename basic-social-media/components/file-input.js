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
        className="my-3"
        accept=".jpg, .jpeg, .png"
      />
      {fileSize > 0 ? <p>File size: {returnFileSize(fileSize)}</p> : null}
    </>
  );
}
