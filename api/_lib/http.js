// Small helpers shared by every endpoint.
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(body));
}

// route({ GET: fn, PUT: fn }) -> Vercel handler. Each fn receives (req, ctx)
// and returns [status, body] or a body (200). Errors never leak internals.
export function route(methods) {
  return async function handler(req, res) {
    try {
      const fn = methods[req.method];
      if (!fn) {
        res.setHeader("Allow", Object.keys(methods).join(", "));
        throw new HttpError(405, "Method not allowed");
      }
      const out = await fn(req);
      if (Array.isArray(out)) return send(res, out[0], out[1]);
      return send(res, 200, out);
    } catch (err) {
      if (err instanceof HttpError) return send(res, err.status, { error: err.message });
      console.error("api_error", err?.message);
      return send(res, 500, { error: "Something went wrong. Please try again." });
    }
  };
}

export function bodyOf(req) {
  const b = req.body;
  if (b && typeof b === "object") return b;
  if (typeof b === "string" && b.length < 20000) {
    try {
      return JSON.parse(b);
    } catch {
      /* fall through */
    }
  }
  throw new HttpError(400, "Request body must be JSON");
}
