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
        <h1 id="age-gate-title">For adults only.</h1>
        <p>You must be 18 or older to enter. Mara Vera is an AI-generated virtual character.</p>
        <div className="gateActions">
          <button onClick={confirmAdult}>I’m 18+</button>
          <button className="secondary" onClick={decline}>Leave</button>
        </div>
      </div>
    </div>
  );
}
