import { route } from "./_lib/http.js";
import { sql } from "./_lib/db.js";
import { requireUser, needType } from "./_lib/auth.js";
import { likePattern, text } from "./_lib/validate.js";

// Businesses and agencies search creators who have switched discovery on.
// Never returns email, earnings or anyone who blocked (or was blocked by) the caller.
export default route({
  GET: async (req) => {
    const user = await requireUser(req);
    needType(user, "business", "agency");
    const q = text(req.query?.q, 80, "Search") || "";
    const category = text(req.query?.category, 40, "Category") || "";
    const limit = Math.min(Math.max(parseInt(req.query?.limit, 10) || 24, 1), 50);
    const pattern = likePattern(q);
    const rows = await sql()`
      select u.id, u.display_name, p.headline, left(p.bio, 280) as bio,
             p.city, p.categories, p.languages
      from creator_profile p
      join app_user u on u.id = p.user_id
      where p.discoverable
        and u.id <> ${user.id}
        and not exists (
          select 1 from block b
          where (b.blocker = ${user.id} and b.blocked = u.id)
             or (b.blocker = u.id and b.blocked = ${user.id}))
        and (${q}::text = '' or u.display_name ilike ${pattern}
             or p.headline ilike ${pattern} or p.city ilike ${pattern} or p.bio ilike ${pattern})
        and (${category}::text = '' or ${category}::text = any(p.categories))
      order by p.updated_at desc
      limit ${limit}`;
    return {
      results: rows.map((r) => ({
        id: r.id,
        displayName: r.display_name,
        headline: r.headline,
        bio: r.bio,
        city: r.city,
        categories: r.categories,
        languages: r.languages,
      })),
    };
  },
});
