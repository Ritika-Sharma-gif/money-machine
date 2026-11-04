import { neon } from "@neondatabase/serverless";
import { HttpError } from "./http.js";

let client;
export function sql() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new HttpError(503, "The service is not configured yet");
    client = neon(url);
  }
  return client;
}
