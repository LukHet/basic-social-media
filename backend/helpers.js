export function isBase64PngorJpg(dataUri) {
  return /^data:image\/(jpeg|jpg|png);base64/i.test(dataUri);
}

export function isIdValid(id) {
  return id || id.trim().length !== 0 || typeof id === "number" || id >= 0;
}
