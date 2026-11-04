import { sql } from "./db.js";

export async function loadMe(user) {
  const s = sql();
  const [settings] = await s`
    select notify_offers, notify_messages, notify_reminders
    from user_settings where user_id = ${user.id}`;
  const [profile] =
    user.account_type === "creator"
      ? await s`
          select headline, bio, city, categories, languages, discoverable, showcase_public
          from creator_profile where user_id = ${user.id}`
      : [];
  const orgs =
    user.account_type === "creator" || !user.account_type
      ? []
      : await s`
          select o.id, o.name, o.kind, m.role
          from membership m join organisation o on o.id = m.org_id
          where m.user_id = ${user.id}`;
  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      accountType: user.account_type,
      isStaff: user.is_staff,
    },
    settings: settings && {
      notifyOffers: settings.notify_offers,
      notifyMessages: settings.notify_messages,
      notifyReminders: settings.notify_reminders,
    },
    profile: profile && {
      headline: profile.headline,
      bio: profile.bio,
      city: profile.city,
      categories: profile.categories,
      languages: profile.languages,
      discoverable: profile.discoverable,
      showcasePublic: profile.showcase_public,
    },
    organisations: orgs,
  };
}
