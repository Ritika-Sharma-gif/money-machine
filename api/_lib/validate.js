// Pure input checks. No I/O, so they are easy to test.
import { HttpError } from "./http.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const ACCOUNT_TYPES = ["creator", "business", "agency"];

export function isUuid(v) {
  return typeof v === "string" && UUID.test(v);
}

export function text(v, max, field) {
  if (v === undefined || v === null) return undefined;
  if (typeof v !== "string") throw new HttpError(400, `${field} must be text`);
  const t = v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim();
  if (t.length > max) throw new HttpError(400, `${field} must be ${max} characters or fewer`);
  return t;
}

export function list(v, maxItems, maxLen, field) {
  if (v === undefined || v === null) return undefined;
  if (!Array.isArray(v)) throw new HttpError(400, `${field} must be a list`);
  if (v.length > maxItems) throw new HttpError(400, `${field} can have at most ${maxItems} items`);
  const out = [];
  for (const item of v) {
    const t = text(item, maxLen, field);
    if (t && !out.includes(t)) out.push(t);
  }
  return out;
}

export function bool(v, field) {
  if (v === undefined) return undefined;
  if (typeof v !== "boolean") throw new HttpError(400, `${field} must be true or false`);
  return v;
}

export function parseProfile(b) {
  return {
    headline: text(b.headline, 140, "Headline"),
    bio: text(b.bio, 1000, "Bio"),
    city: text(b.city, 80, "City"),
    categories: list(b.categories, 12, 40, "Categories"),
    languages: list(b.languages, 8, 40, "Languages"),
    discoverable: bool(b.discoverable, "discoverable"),
    showcasePublic: bool(b.showcasePublic, "showcasePublic"),
  };
}

export function parseSettings(b) {
  return {
    notifyOffers: bool(b.notifyOffers, "notifyOffers"),
    notifyMessages: bool(b.notifyMessages, "notifyMessages"),
    notifyReminders: bool(b.notifyReminders, "notifyReminders"),
  };
}

export function parseOnboarding(b) {
  const displayName = text(b.displayName, 80, "Name");
  let accountType;
  if (b.accountType !== undefined) {
    if (!ACCOUNT_TYPES.includes(b.accountType))
      throw new HttpError(400, "Account type must be creator, business or agency");
    accountType = b.accountType;
  }
  const organisationName = text(b.organisationName, 120, "Organisation name");
  if (displayName !== undefined && displayName.length < 1)
    throw new HttpError(400, "Name cannot be empty");
  return { displayName, accountType, organisationName };
}

// Escape % _ \ so user text is matched literally inside ILIKE.
export function likePattern(q) {
  const t = text(q, 80, "Search") || "";
  return `%${t.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}
