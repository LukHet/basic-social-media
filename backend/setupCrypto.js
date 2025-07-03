import crypto from "crypto";

if (typeof global.crypto === "undefined") {
  global.crypto = crypto;
}

//additional crypto setup to fix Lucia, it won't work without it for some reason
