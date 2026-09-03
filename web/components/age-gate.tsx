"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "mara_age_gate_passed";

export function AgeGate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const passed = window.localStorage.getItem(STORAGE_KEY) === "true";
    if (!passed) {
      setVisible(true);
      track("age_gate_view");
    }
  }, []);

  if (!visible) return null;

  function confirmAdult() {
    window.localStorage.setItem(STORAGE_KEY, "true");
    track("age_gate_pass");
    setVisible(false);
  }

  function decline() {
    track("age_gate_fail");
    window.location.href = "https://www.google.com";
  }

  return (
    <div className="gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div className="gateCard">
        <p className="eyebrow">MARA VERA</p>
        <h1 id="age-gate-title">Solo para adultos.</h1>
        <p>Debes tener 18 años o más para entrar. Mara Vera es un personaje virtual generado con IA.</p>
        <div className="gateActions">
          <button onClick={confirmAdult}>Tengo 18+</button>
          <button className="secondary" onClick={decline}>Salir</button>
        </div>
      </div>
    </div>
  );
}
