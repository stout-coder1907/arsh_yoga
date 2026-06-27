import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("arsh_token"));
  const [loading, setLoading] = useState(true);

  // hydrate user from localStorage to avoid extra roundtrip on app start
  useEffect(() => {
    try {
      const raw = localStorage.getItem("arsh_user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  // ensure api header is set when token exists on startup
  useEffect(() => {
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }, [token]);

  const persist = (t, u) => {
    if (t) localStorage.setItem("arsh_token", t);
    else localStorage.removeItem("arsh_token");
    if (u) localStorage.setItem("arsh_user", JSON.stringify(u));
    else localStorage.removeItem("arsh_user");
    setToken(t);
    setUser(u);
    // set axios default header for immediate subsequent requests
    if (t) api.defaults.headers.common.Authorization = `Bearer ${t}`;
    else delete api.defaults.headers.common.Authorization;
  };

  const loadMe = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data?.user || data);
    } catch {
      persist(null, null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadMe(); }, [loadMe]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persist(data.token, data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persist(data.token, data);
    return data;
  };

  const logout = () => persist(null, null);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      isInstructor: user?.role === "instructor",
      login,
      register,
      logout,
      refresh: loadMe,
    }),
    [user, token, loading, loadMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
