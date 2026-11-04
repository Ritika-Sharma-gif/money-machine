import { getAuthClient } from "./auth";

let cached = { token: null, exp: 0 };

function expiryOf(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part)).exp * 1000;
  } catch {
    return Date.now() + 60_000;
  }
}

export function clearToken() {
  cached = { token: null, exp: 0 };
}

const looksLikeJwt = (t) => typeof t === "string" && t.split(".").length === 3;

// The SDK exposes the access token on the session (taken from the server's
// set-auth-jwt header); older docs show it at data.token. Accept either, and
// only ever send something shaped like a JWT.
async function token(force) {
  if (!force && cached.token && cached.exp - 30_000 > Date.now()) return cached.token;
  const client = await getAuthClient();
  const session = await client.getSession();
  let t = session?.data?.session?.token;
  if (!looksLikeJwt(t)) {
    const r = await client.token();
    t = r?.data?.token || r?.data?.session?.token;
  }
  if (!looksLikeJwt(t)) throw new Error("Please sign in");
  cached = { token: t, exp: expiryOf(t) };
  return t;
}

export async function api(path, { method = "GET", body } = {}) {
  async function once(force) {
    return fetch(path, {
      method,
      headers: {
        Authorization: `Bearer ${await token(force)}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }
  let res = await once(false);
  if (res.status === 401) res = await once(true); // token may have just expired
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}
