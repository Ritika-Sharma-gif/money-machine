# People-first prototype

The product now opens on discovery instead of a dashboard. Both creators and businesses appear in searchable public demo profiles. The supplied navy, teal, and white interface palette remains in place; muted colours distinguish illustrative portfolio samples.

## Available interactions

- Search by name, handle, interest, or city; filter by role and interest.
- Open profiles with bios, work grids, and business opportunities.
- Save profiles in browser-local collections, separated by preview role.
- As a creator, draft applications to business opportunities. As a business, draft invitations to creators.
- View and delete local drafts under My collaborations. No drafts are sent.
- Access planned income/spending, agreements, commissions, messages, achievements, privacy, and settings tools through More navigation.

This is frontend-only. Local storage is not authentication, access control, secure financial storage, or a backend. All public profiles are fictional and depicted as opted in. Real discoverability must require opt-in. Earnings are not displayed on public profiles. There are no payment, verified achievement, or legal-enforceability claims. Accepted agreements, amendments, distinct financial states and sources, and affiliate statuses remain requirements for future modules.

## Files

- src/App.jsx: social navigation, role-specific local state, draft list, routing.
- src/pages/Discovery.jsx: search, filters, bookmarks, profile grid.
- src/pages/PublicProfile.jsx: public profile and appropriate Apply/Invite actions.
- src/components/RequestDialog.jsx: accessible native dialog and validated draft form.
- src/components/PeopleArtwork.jsx: reusable sample artwork and avatars.
- src/data/people.js: fictional demo data, kept separate from the UI.
- src/social.css: responsive social layouts; shared palette remains in styles.css.

Run npm ci, then npm run dev. Build with npm run build. No deployment is included in this change.

## Validation

Production build passes. Desktop browser checks cover city search, opening a business profile, draft application validation and saving, draft-list display, and separation of creator and business draft lists. Mobile CSS is included; device-width browser verification remains outstanding.

## Next decisions

The full Developer Specification PDF is still missing. Real user media, posting, following, messages, onboarding, identity verification, affiliate rules, and backend persistence are not implemented. Search currently covers the six sample profiles only.
