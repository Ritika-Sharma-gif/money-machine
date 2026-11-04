import { createRemoteJWKSet, jwtVerify } from "jose";
import { HttpError } from "./http.js";
import { sql } from "./db.js";

let jwks;
function keys() {
  const base = process.env.NEON_AUTH_BASE_URL;
  if (!base) throw new HttpError(503, "Sign-in is not configured yet");
  jwks ||= createRemoteJWKSet(new URL(`${base.replace(/\/$/, "")}/.well-known/jwks.json`));
  return jwks;
}

// Verifies the caller's Neon Auth token. The browser can send anything, so the
// signature, issuer, algorithm and expiry are all checked here on the server.
export async function verifyToken(token, keySet = keys(), issuer) {
  const iss = issuer || new URL(process.env.NEON_AUTH_BASE_URL).origin;
  try {
    const { payload } = await jwtVerify(token, keySet, {
      issuer: iss,
      algorithms: ["EdDSA"],
    });
    if (!payload.sub || payload.banned === true) throw new Error("rejected");
    return payload;
  } catch {
    throw new HttpError(401, "Please sign in again");
  }
}

export function bearer(req) {
  const h = req.headers?.authorization || "";
  const m = /^Bearer\s+(\S+)$/i.exec(h);
  if (!m) throw new HttpError(401, "Please sign in");
  return m[1];
}

// Returns the signed-in user's app record, creating it on first visit.
export async function requireUser(req) {
  const claims = await verifyToken(bearer(req));
  const s = sql();
  const name = String(claims.name || claims.email || "New member").slice(0, 80);
  const rows = await s`
    insert into app_user (id, email, display_name)
    values (${claims.sub}, ${String(claims.email || "")}, ${name})
    on conflict (id) do update set email = excluded.email
    returning id, email, display_name, account_type, is_staff`;
  return rows[0];
}

export function needType(user, ...types) {
  if (!user.account_type) throw new HttpError(409, "Finish setting up your account first");
  if (!types.includes(user.account_type)) throw new HttpError(403, "This is not available for your account type");
}
