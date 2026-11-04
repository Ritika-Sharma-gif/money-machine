import { route } from "./_lib/http.js";
import { sql } from "./_lib/db.js";

export default route({
  GET: async () => {
    await sql()`select 1`;
    return { ok: true };
  },
});
