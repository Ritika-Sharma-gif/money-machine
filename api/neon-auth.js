// Same-origin proxy to Neon Auth. The browser talks to /neon-auth/* on our own
// domain, so the session cookie is first-party (Safari and the home-screen app
// block third-party cookies). Only the fixed Neon Auth base URL is ever called.
const PASS_REQUEST = ["content-type", "accept", "cookie", "origin", "user-agent", "accept-language"];
const SAFE_PATH = /^[A-Za-z0-9._~/-]*$/;

export function buildTarget(base, rawPath, search) {
  const rest = String(rawPath || "");
  if (!SAFE_PATH.test(rest) || rest.includes("..") || rest.includes("//")) return null;
  const url = new URL(`${base.replace(/\/$/, "")}/${rest}`);
  const q = new URLSearchParams(search);
  q.delete("path");
  url.search = q.toString();
  return url;
}

export default async function handler(req, res) {
  const base = process.env.NEON_AUTH_BASE_URL;
  const send = (status, msg) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify({ error: msg }));
  };
  if (!base) return send(503, "Sign-in is not configured yet");
  if (!["GET", "POST"].includes(req.method)) return send(405, "Method not allowed");

  const search = (req.url || "").split("?")[1] || "";
  const query = new URLSearchParams(search);
  const target = buildTarget(base, query.get("path"), search);
  if (!target) return send(400, "Bad path");

  const headers = {};
  for (const k of PASS_REQUEST) if (req.headers[k]) headers[k] = req.headers[k];
  if (!headers.origin) headers.origin = new URL(base).origin;

  let body;
  if (req.method === "POST") {
    const b = req.body;
    body = typeof b === "string" || Buffer.isBuffer(b) ? b : b != null ? JSON.stringify(b) : undefined;
    if (body !== undefined && !headers["content-type"]) headers["content-type"] = "application/json";
  }

  let upstream;
  try {
    upstream = await fetch(target, { method: req.method, headers, body, redirect: "manual" });
  } catch (err) {
    console.error("neon_auth_unreachable", err?.message);
    return send(502, "Sign-in service is unavailable. Please try again.");
  }

  const buf = Buffer.from(await upstream.arrayBuffer());
  if (upstream.status >= 400) {
    // Request bodies (passwords) are never logged; only the service's reply.
    console.error("neon_auth_upstream", upstream.status, req.method, query.get("path"), buf.toString("utf8").slice(0, 300));
  }
  res.statusCode = upstream.status;
  for (const name of ["content-type", "set-auth-jwt", "location"]) {
    const v = upstream.headers.get(name);
    if (v) res.setHeader(name, v);
  }
  const cookies = upstream.headers.getSetCookie?.() ?? [];
  if (cookies.length) res.setHeader("Set-Cookie", cookies);
  res.setHeader("Cache-Control", "no-store");
  res.end(buf);
}
