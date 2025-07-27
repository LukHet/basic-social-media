export default function isBase64PngorJpg(dataUri) {
  return /^data:image\/(jpeg|jpg|png);base64/i.test(dataUri);
}
