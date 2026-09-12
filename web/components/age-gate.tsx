"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "mara_age_gate_passed";

// The Revenue OS itself is not an adult-only product. Keep the existing gate
// only on legacy/adult consumer surfaces until those routes are retired or
// replaced by creator/offer-level compliance controls.
const LEGACY_ADULT_PREFIXES = ["/meet-mara", "/experience", "/shop", "/library", "/app"];

function requiresAdultGate(pathname: string) {
  return LEGACY_ADULT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function AgeGate() {
  const pathname = usePathname();
  const gated = requiresAdultGate(pathname);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!gated) {
      setVisible(false);
      return;
    }

    let passed = false;
    try { passed = window.localStorage.getItem(STORAGE_KEY) === "true"; } catch { /* Ask again when storage is unavailable. */ }
    setVisible(!passed);
    if (!passed) track("age_gate_view");
  }, [gated, pathname]);

  if (!gated || !visible) return null;

  function confirmAdult() {
    try { window.localStorage.setItem(STORAGE_KEY, "true"); } catch { /* Consent still applies to this page. */ }
    track("age_gate_pass");
    track("age_gate_accepted");
    setVisible(false);
  }

  function decline() {
    track("age_gate_fail");
    window.location.href = "https://www.google.com";
  }

  return (
    <div className="gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div className="gateCard">
        <p className="eyebrow">ANTES DE ENTRAR</p>
        <h1 id="age-gate-title">Esta sección es solo para adultos.</h1>
        <p>
          Esta superficie legacy puede incluir contenido o experiencias restringidas a mayores de 18 años. La capa general de Mara Creator Revenue OS no requiere este gate global.
        </p>
        <div className="gateActions">
          <button onClick={confirmAdult}>Tengo 18+ · entrar</button>
          <button className="secondary" onClick={decline}>Salir</button>
        </div>
      </div>
    </div>
  );
}
