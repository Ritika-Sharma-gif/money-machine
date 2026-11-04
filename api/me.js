import { route, bodyOf, HttpError } from "./_lib/http.js";
import { sql } from "./_lib/db.js";
import { requireUser } from "./_lib/auth.js";
import { parseOnboarding } from "./_lib/validate.js";
import { loadMe } from "./_lib/me.js";

export default route({
  GET: async (req) => loadMe(await requireUser(req)),

  // First-time setup (choose account type) and name changes.
  PATCH: async (req) => {
    const user = await requireUser(req);
    const { displayName, accountType, organisationName } = parseOnboarding(bodyOf(req));
    const s = sql();

    if (accountType && user.account_type && accountType !== user.account_type)
      throw new HttpError(409, "Your account type is already set and cannot be changed here");

    if (accountType && !user.account_type) {
      const forOrg = accountType !== "creator";
      if (forOrg && !organisationName)
        throw new HttpError(400, "Enter your business or agency name");
      const steps = [
        s`update app_user set account_type = ${accountType},
            display_name = coalesce(${displayName ?? null}::text, display_name),
            updated_at = now()
          where id = ${user.id} and account_type is null`,
        s`insert into user_settings (user_id) values (${user.id}) on conflict do nothing`,
        forOrg
          ? s`with o as (
                insert into organisation (name, kind, created_by)
                values (${organisationName}, ${accountType}, ${user.id}) returning id)
              insert into membership (user_id, org_id, role)
              select ${user.id}, id, 'owner' from o`
          : s`insert into creator_profile (user_id) values (${user.id}) on conflict do nothing`,
        s`insert into audit_log (actor, action, detail)
          values (${user.id}, 'account.onboarded', ${JSON.stringify({ accountType })}::jsonb)`,
      ];
      await s.transaction(steps);
    } else if (displayName) {
      await s`update app_user set display_name = ${displayName}, updated_at = now() where id = ${user.id}`;
    }

    const [fresh] = await s`
      select id, email, display_name, account_type, is_staff from app_user where id = ${user.id}`;
    return loadMe(fresh);
  },
});
