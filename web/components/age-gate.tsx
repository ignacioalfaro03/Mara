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
        <h1 id="age-gate-title">Una cosa primero.</h1>
        <p>Tienes que tener 18 años o más. Mara es un personaje virtual generado con IA.</p>
        <div className="gateActions">
          <button onClick={confirmAdult}>Sí, tengo 18+</button>
          <button className="secondary" onClick={decline}>Salir</button>
        </div>
      </div>
    </div>
  );
}
