import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Brand from "../components/Brand";
import { useAuth, homeFor } from "../AuthContext";
import { api } from "../lib/api";
import "../experience.css";

const types = [
  ["creator", "I’m a creator", "Share your work and find businesses."],
  ["business", "I’m a business", "Find creators and manage the work."],
  ["agency", "I’m an agency", "Coordinate creators for your clients."],
];

export default function SignIn() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("create");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("creator");

  useEffect(() => {
    document.title = "Sign in | Money Machine";
  }, []);

  if (!auth.enabled)
    return (
      <div className="mm-auth-page">
        <div className="mm-auth-card">
          <Brand />
          <h1>Sign-in isn’t switched on yet</h1>
          <p>This is the demo version. You can explore every screen without an account.</p>
          <Link className="mm-button" to="/creator/dashboard">Explore the demo</Link>
        </div>
      </div>
    );
  if (auth.status === "loading") return <div className="mm-auth-page" aria-busy="true" />;

  // Signed in with everything set up: go to the workspace.
  if (auth.status === "in" && auth.me?.user.accountType)
    return <Navigate to={homeFor(auth.me)} replace />;

  const needsSetup = auth.status === "in"; // signed in but no account type yet

  async function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    setNote("");
    try {
      if (needsSetup) {
        const me = await api("/api/me", {
          method: "PATCH",
          body: {
            accountType: type,
            organisationName: f.get("organisation") || undefined,
          },
        });
        await auth.refresh();
        navigate(homeFor(me), { replace: true });
        return;
      }
      const creds = { email: f.get("email"), password: f.get("password") };
      const me =
        mode === "create"
          ? await auth.signUp({ ...creds, name: String(f.get("name")).trim() })
          : await auth.signIn(creds);
      if (!me && mode === "create")
        setNote("Almost there. Check your email to confirm your address, then sign in.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mm-auth-page">
      <div className="mm-auth-card">
        <Link to="/" aria-label="Money Machine home"><Brand /></Link>
        <h1>
          {needsSetup ? "One last step" : mode === "create" ? "Create your account" : "Welcome back"}
        </h1>
        <p>
          {needsSetup
            ? "Tell us how you’ll use Money Machine. You can’t change this later."
            : "Your profile stays hidden from search until you choose to be found."}
        </p>
        <form onSubmit={submit} className="mm-form">
          {needsSetup ? (
            <>
              <fieldset className="mm-types">
                <legend className="sr-only">Account type</legend>
                {types.map(([id, title, text]) => (
                  <label key={id} className={type === id ? "on" : ""}>
                    <input type="radio" name="type" value={id} checked={type === id} onChange={() => setType(id)} />
                    <strong>{title}</strong>
                    <small>{text}</small>
                  </label>
                ))}
              </fieldset>
              {type !== "creator" && (
                <label>
                  {type === "agency" ? "Agency name" : "Business name"}
                  <input name="organisation" required maxLength={120} autoComplete="organization" />
                </label>
              )}
            </>
          ) : (
            <>
              {mode === "create" && (
                <label>
                  Your name
                  <input name="name" required maxLength={80} autoComplete="name" />
                </label>
              )}
              <label>
                Email
                <input name="email" type="email" required autoComplete="email" />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "create" ? "new-password" : "current-password"}
                />
              </label>
            </>
          )}
          {error && <p role="alert" className="mm-error">{error}</p>}
          {note && <p role="status" className="mm-notice">{note}</p>}
          <button className="mm-button" type="submit" disabled={busy}>
            {busy ? "One moment…" : needsSetup ? "Continue" : mode === "create" ? "Create account" : "Sign in"}
          </button>
        </form>
        {!needsSetup && (
          <button
            className="mm-quiet"
            type="button"
            onClick={() => { setMode(mode === "create" ? "signin" : "create"); setError(""); setNote(""); }}
          >
            {mode === "create" ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
        )}
        {needsSetup && (
          <button className="mm-quiet" type="button" onClick={() => auth.signOut()}>Sign out</button>
        )}
      </div>
    </div>
  );
}
