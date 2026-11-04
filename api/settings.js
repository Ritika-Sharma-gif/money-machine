import { route, bodyOf } from "./_lib/http.js";
import { sql } from "./_lib/db.js";
import { requireUser } from "./_lib/auth.js";
import { parseSettings } from "./_lib/validate.js";
import { loadMe } from "./_lib/me.js";

export default route({
  PUT: async (req) => {
    const user = await requireUser(req);
    const p = parseSettings(bodyOf(req));
    const s = sql();
    await s`
      insert into user_settings (user_id) values (${user.id}) on conflict do nothing`;
    await s`
      update user_settings set
        notify_offers    = coalesce(${p.notifyOffers ?? null}::boolean, notify_offers),
        notify_messages  = coalesce(${p.notifyMessages ?? null}::boolean, notify_messages),
        notify_reminders = coalesce(${p.notifyReminders ?? null}::boolean, notify_reminders),
        updated_at = now()
      where user_id = ${user.id}`;
    return (await loadMe(user)).settings;
  },
});
