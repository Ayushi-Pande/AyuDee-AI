import { createContext, useContext, useMemo, useState } from "react";

const SETTINGS_KEY = "ayudee-app-lock";
const PIN_KEY = "ayudee-app-lock-pin";

async function hashPin(pin) {
  const data = new TextEncoder().encode(pin);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

const AppLockContext = createContext(null);

export function AppLockProvider({ children }) {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(SETTINGS_KEY) === "true");
  const [unlocked, setUnlocked] = useState(false);

  const setPin = async (pin) => {
    if (!/^\d{4,6}$/.test(pin)) throw new Error("PIN must contain 4 to 6 digits.");
    localStorage.setItem(PIN_KEY, await hashPin(pin));
    localStorage.setItem(SETTINGS_KEY, "true");
    setEnabled(true);
    setUnlocked(true);
  };

  const unlock = async (pin) => {
    const valid = await hashPin(pin) === localStorage.getItem(PIN_KEY);
    if (valid) setUnlocked(true);
    return valid;
  };

  const disable = () => {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(PIN_KEY);
    setEnabled(false);
    setUnlocked(false);
  };

  const value = useMemo(() => ({ enabled, unlocked, setPin, unlock, disable }), [enabled, unlocked]);
  return <AppLockContext.Provider value={value}>{children}</AppLockContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppLock() {
  const context = useContext(AppLockContext);
  if (!context) throw new Error("useAppLock must be used within AppLockProvider");
  return context;
}
