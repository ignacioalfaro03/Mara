"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { checkMaraDeviceAccount, DEVICE_RESET_KEY } from "@/lib/local-device-state";

const AccountContext = createContext(false);
export const useDeviceAccount = () => useContext(AccountContext);

// Verify cache ownership before rendering private continuity, including in tabs
// already open when another tab signs out or resets the device.
export function DeviceMemoryBoundary({ children }: { children: React.ReactNode }) {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"checking" | "anonymous" | "authenticated" | "unavailable">("checking");
  useEffect(() => {
    let active = true;
    setStatus("checking");
    void checkMaraDeviceAccount().then((next) => { if (active) setStatus(next); });
    const reset = () => { setStatus("checking"); setAttempt((value) => value + 1); };
    const storage = (event: StorageEvent) => { if (event.key === DEVICE_RESET_KEY || event.key === null) reset(); };
    window.addEventListener("storage", storage);
    window.addEventListener("mara:device-reset", reset);
    return () => {
      active = false;
      window.removeEventListener("storage", storage);
      window.removeEventListener("mara:device-reset", reset);
    };
  }, [attempt]);
  if (status === "checking") return <p className="memoryLoading" role="status">Un segundo…</p>;
  if (status === "unavailable") return (
    <div className="memoryLoading" role="status">
      <p>No pude recuperar tu cuenta. Tu historia sigue guardada.</p>
      <button type="button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button>{" "}
      <a href="/auth">Ir a mi cuenta</a>
    </div>
  );
  return <AccountContext.Provider key={attempt} value={status === "authenticated"}>{children}</AccountContext.Provider>;
}
