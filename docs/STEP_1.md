# Step 1 — Application foundation

This step adds the React + Vite application, shared colour tokens, responsive workspace shell, role preview selector, navigation, overview introduction, module placeholders, and a 404 page. No real accounts, financial records, or payments are implemented.

## Run locally

Install Node.js 22 or newer, then run from this repository:

```sh
npm install
npm run dev
```

Open the URL Vite prints. To check the production build:

```sh
npm run build
npm run preview
```

## Files and responsibilities

- `src/main.jsx`: mounts React and the router. Hash-based URLs allow navigation on static hosting without server rewrite rules.
- `src/App.jsx`: routes, responsive shell, role selector, mobile menus, and not-found handling. Role URLs are presentation only, not authentication or access control.
- `src/data/navigation.js`: labels, icons, and descriptions for each role. Update this list to add workspace navigation.
- `src/components/`: reusable brand and placeholder views.
- `src/pages/Overview.jsx`: introduction and links to planned modules. It intentionally shows no invented financial totals.
- `src/styles.css`: shared CSS variables and desktop/mobile layouts. Fonts have local sans-serif fallbacks if Google Fonts is unavailable.

## Manual checks

1. Open `/#/creator/overview` and navigate through each sidebar item.
2. Select Business owner. Briefs and Shortlists should appear; Income becomes Spending.
3. Switch from Business briefs to Creator. The route should fall back to Creator overview.
4. At 320px, 390px, 768px and desktop widths, check for overflow and use the mobile menu and bottom navigation.
5. Use Tab and Enter to navigate; the first Tab reveals Skip to content.
6. Refresh a module URL and use browser Back/Forward.
7. Visit `/#/creator/unknown` to check the 404 page.

## Next step

Build the public landing page, simulated login/signup, role selection, and onboarding. Await approval before starting this next major step. Keep discovery opt-in and financial records private by default. The full referenced Developer Specification PDF has not been supplied, so P0/P1 scope and commercial rules still need confirmation.
