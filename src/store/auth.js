import { create } from "zustand";

const INACTIVITY_MS = 30 * 60 * 1000;
const persistKey = "smarttax_auth";

const initial = (() => {
  try {
    const raw = localStorage.getItem(persistKey);
    return raw ? JSON.parse(raw) : { token: null, role: null, user: null };
  } catch {
    return { token: null, role: null, user: null };
  }
})();

const useAuth = create((set, get) => ({
  ...initial,
  login: ({ token, role, user, adminLevel, jurisdiction }) => {
    const state = { token, role, user, adminLevel, jurisdiction, lastActive: Date.now() };
    localStorage.setItem(persistKey, JSON.stringify(state));
    set(state);
  },
  logout: () => {
    localStorage.removeItem(persistKey);
    set({ token: null, role: null, user: null, adminLevel: null, jurisdiction: null });
  },
  touch: () => {
    const s = { ...get(), lastActive: Date.now() };
    localStorage.setItem(persistKey, JSON.stringify(s));
    set(s);
  },
}));

let timer;
function startWatcher() {
  const check = () => {
    const s = useAuth.getState();
    if (s.token && s.lastActive && Date.now() - s.lastActive > INACTIVITY_MS) {
      useAuth.getState().logout();
    }
  };
  clearInterval(timer);
  timer = setInterval(check, 60 * 1000);
  if (typeof window !== "undefined") {
    ["click", "keydown", "mousemove", "scroll"].forEach((evt) =>
      window.addEventListener(evt, () => useAuth.getState().touch(), { passive: true })
    );
  }
}
if (typeof window !== "undefined") startWatcher();

export default useAuth;
