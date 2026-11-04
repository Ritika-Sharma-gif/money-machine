// Sign-in is optional: with VITE_AUTH_ENABLED unset the site stays a pure demo.
export const authEnabled = import.meta.env.VITE_AUTH_ENABLED === "true";

let clientPromise;
// Requests go to /neon-auth on our own domain (proxied to Neon Auth) so the
// session cookie is first-party. That keeps sign-in working in Safari and in
// the home-screen app, which block third-party cookies.
export function getAuthClient() {
  clientPromise ||= import("@neon/neon-js/auth").then(({ createAuthClient }) =>
    createAuthClient(`${window.location.origin}/neon-auth`, {
      fetchOptions: { credentials: "include" },
    }),
  );
  return clientPromise;
}
