import { MAX_STRING_LENGTH, EMAIL_REGEX } from "../constants/app-info.js";

export function isBase64PngorJpg(dataUri) {
  return /^data:image\/(jpeg|jpg|png);base64/i.test(dataUri);
}

export function isIdValid(id) {
  return (
    typeof id === "number" || (typeof id === "string" && id.trim().length > 0)
  );
}

export function isUserDataValid(
  name,
  surname,
  email,
  birthdate,
  gender,
  country,
  city
) {
  return (
    !name ||
    name.length > MAX_STRING_LENGTH ||
    name.trim().length === 0 ||
    !surname ||
    surname.length > MAX_STRING_LENGTH ||
    surname.trim().length === 0 ||
    !birthdate ||
    !gender ||
    !gender.trim().length === 0 ||
    !country ||
    !country.trim().length === 0 ||
    !city ||
    !city.trim().length === 0 ||
    city.length > MAX_STRING_LENGTH ||
    !email.trim().length === 0 ||
    !EMAIL_REGEX.test(email)
  );
}

export const relationshipTypeFriends = "friends";
export const relationshipTypeNone = "none";
export const relationshipStatusBlocked = "blocked";
export const relationshipStatusPending = "pending";
export const relationshipStatusDeclined = "declined";
export const relationshipStatusApproved = "accepted";
