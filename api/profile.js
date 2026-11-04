import { route, bodyOf, HttpError } from "./_lib/http.js";
import { sql } from "./_lib/db.js";
import { requireUser, needType } from "./_lib/auth.js";
import { parseProfile } from "./_lib/validate.js";
import { loadMe } from "./_lib/me.js";

export default route({
  GET: async (req) => {
    const user = await requireUser(req);
    needType(user, "creator");
    return (await loadMe(user)).profile;
  },

  PUT: async (req) => {
    const user = await requireUser(req);
    needType(user, "creator");
    const p = parseProfile(bodyOf(req));
    const s = sql();
    const [cur] = await s`select headline, discoverable, showcase_public from creator_profile where user_id = ${user.id}`;
    if (!cur) throw new HttpError(409, "Finish setting up your account first");

    const nextHeadline = p.headline ?? cur.headline;
    if (p.discoverable === true && !nextHeadline)
      throw new HttpError(400, "Add a headline before turning on discovery");

    const steps = [
      s`update creator_profile set
          headline        = coalesce(${p.headline ?? null}::text, headline),
          bio             = coalesce(${p.bio ?? null}::text, bio),
          city            = coalesce(${p.city ?? null}::text, city),
          categories      = coalesce(${p.categories ?? null}::text[], categories),
          languages       = coalesce(${p.languages ?? null}::text[], languages),
          discoverable    = coalesce(${p.discoverable ?? null}::boolean, discoverable),
          showcase_public = coalesce(${p.showcasePublic ?? null}::boolean, showcase_public),
          updated_at      = now()
        where user_id = ${user.id}`,
    ];
    for (const [scope, next, prev] of [
      ["discoverability", p.discoverable, cur.discoverable],
      ["showcase", p.showcasePublic, cur.showcase_public],
    ]) {
      if (next === undefined || next === prev) continue;
      steps.push(
        next
          ? s`insert into consent_record (user_id, scope) values (${user.id}, ${scope})`
          : s`update consent_record set withdrawn_at = now()
              where user_id = ${user.id} and scope = ${scope} and withdrawn_at is null`,
        s`insert into audit_log (actor, action, detail)
          values (${user.id}, ${`profile.${scope}.${next ? "on" : "off"}`}, '{}'::jsonb)`,
      );
    }
    await s.transaction(steps);
    return (await loadMe(user)).profile;
  },
});
