import { route, bodyOf, HttpError } from "./_lib/http.js";
import { sql } from "./_lib/db.js";
import { requireUser } from "./_lib/auth.js";
import { isUuid } from "./_lib/validate.js";

async function list(userId) {
  const rows = await sql()`
    select b.blocked as id, u.display_name, b.created_at
    from block b join app_user u on u.id = b.blocked
    where b.blocker = ${userId} order by b.created_at desc`;
  return {
    blocks: rows.map((r) => ({ id: r.id, displayName: r.display_name, createdAt: r.created_at })),
  };
}

export default route({
  GET: async (req) => list((await requireUser(req)).id),

  POST: async (req) => {
    const user = await requireUser(req);
    const { userId } = bodyOf(req);
    if (!isUuid(userId)) throw new HttpError(400, "Choose a valid account to block");
    if (userId === user.id) throw new HttpError(400, "You cannot block yourself");
    const s = sql();
    const [target] = await s`select id from app_user where id = ${userId}`;
    if (!target) throw new HttpError(404, "That account was not found");
    await s.transaction([
      s`insert into block (blocker, blocked) values (${user.id}, ${userId}) on conflict do nothing`,
      s`insert into audit_log (actor, action, detail)
        values (${user.id}, 'block.add', ${JSON.stringify({ blocked: userId })}::jsonb)`,
    ]);
    return list(user.id);
  },

  DELETE: async (req) => {
    const user = await requireUser(req);
    const userId = req.query?.userId;
    if (!isUuid(userId)) throw new HttpError(400, "Choose a valid account to unblock");
    const s = sql();
    await s.transaction([
      s`delete from block where blocker = ${user.id} and blocked = ${userId}`,
      s`insert into audit_log (actor, action, detail)
        values (${user.id}, 'block.remove', ${JSON.stringify({ blocked: userId })}::jsonb)`,
    ]);
    return list(user.id);
  },
});
