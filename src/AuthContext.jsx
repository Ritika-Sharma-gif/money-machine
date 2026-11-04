import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authEnabled, getAuthClient } from "./lib/auth";
import { api, clearToken } from "./lib/api";

const Ctx = createContext({ status: "off", me: null });
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: authEnabled ? "loading" : "off", me: null });

  const refresh = useCallback(async () => {
    if (!authEnabled) return null;
    try {
      const client = await getAuthClient();
      const session = await client.getSession();
      if (!session?.data?.session) {
        setState({ status: "out", me: null });
        return null;
      }
      const me = await api("/api/me");
      setState({ status: "in", me });
      return me;
    } catch {
      setState({ status: "out", me: null });
      return null;
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      ...state,
      enabled: authEnabled,
      refresh,
      async signUp({ name, email, password }) {
        const client = await getAuthClient();
        const r = await client.signUp.email({ name, email, password });
        if (r.error) throw new Error(r.error.message || "Could not create the account");
        clearToken();
        return refresh(); // null if the address must be confirmed first
      },
      async signIn({ email, password }) {
        const client = await getAuthClient();
        const r = await client.signIn.email({ email, password });
        if (r.error) throw new Error(r.error.message || "Email or password is not right");
        clearToken();
        return refresh();
      },
      async signOut() {
        const client = await getAuthClient();
        await client.signOut();
        clearToken();
        setState({ status: "out", me: null });
      },
    }),
    [state, refresh],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Where a signed-in person should land.
export function homeFor(me) {
  return me?.user?.accountType === "creator" ? "/creator/dashboard" : "/business/dashboard";
}
