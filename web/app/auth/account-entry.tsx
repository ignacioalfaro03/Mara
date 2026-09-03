"use client";

import { FormEvent, useState } from "react";
import { flushPendingPreferenceEvents } from "@/lib/preference-client";
import { track } from "@/lib/analytics";
import styles from "./auth.module.css";

type Mode = "signup" | "signin";

function messageFor(error?: string) {
  switch (error) {
    case "backend_not_configured": return "La memoria de cuenta todavía no está conectada.";
    case "invalid_email": return "Ese correo no parece válido.";
    case "invalid_password": return "Usa una contraseña de al menos 8 caracteres.";
    case "adult_confirmation_required": return "Para crear una cuenta debes confirmar que tienes 18 años o más.";
    case "invalid_credentials": return "Correo o contraseña incorrectos.";
    case "signup_rate_limited": return "Hay demasiados correos de confirmación en este momento. Espera un poco y prueba otra vez.";
    case "signup_failed": return "No pude crear la cuenta con esos datos.";
    default: return "No pude completar eso. Inténtalo otra vez.";
  }
}

export function AccountEntry() {
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    track(mode === "signup" ? "signup_started" : "signin_started", { surface: "auth" });
    if (mode === "signup") track("signup_start", { surface: "auth" });

    try {
      const response = await fetch(mode === "signup" ? "/api/auth/signup" : "/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, adultConfirmed }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        needsConfirmation?: boolean;
      };

      if (!response.ok) {
        setMessage(messageFor(payload.error));
        return;
      }

      if (payload.needsConfirmation) {
        setMessage("Listo. Revisa tu correo para confirmar la cuenta y después vuelve a entrar.");
        setMode("signin");
        return;
      }

      await flushPendingPreferenceEvents();
      track(mode === "signup" ? "signup_completed" : "signin_completed", { surface: "auth" });
      if (mode === "signup") track("signup_complete", { surface: "auth" });
      window.location.assign("/experience?account=ready");
    } catch {
      setMessage("No pude conectar con la memoria de Mara.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>MARA · MEMORIA</p>
        <h1 className={styles.title}>{mode === "signup" ? "¿Quieres que me acuerde?" : "Volviste."}</h1>
        <p className={styles.lead}>
          {mode === "signup"
            ? "Crea una cuenta y puedo conservar tus elecciones aunque cambies de dispositivo."
            : "Entra y seguimos desde lo que ya dejamos a medias."}
        </p>

        <div className={styles.tabs} role="tablist" aria-label="Cuenta">
          <button type="button" className={mode === "signup" ? styles.tabActive : styles.tab} onClick={() => { setMode("signup"); setMessage(""); }}>Crear cuenta</button>
          <button type="button" className={mode === "signin" ? styles.tabActive : styles.tab} onClick={() => { setMode("signin"); setMessage(""); }}>Entrar</button>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <label className={styles.field}>
            Correo
            <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className={styles.field}>
            Contraseña
            <input type="password" minLength={8} maxLength={128} autoComplete={mode === "signup" ? "new-password" : "current-password"} required value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>

          {mode === "signup" ? (
            <label className={styles.check}>
              <input type="checkbox" checked={adultConfirmed} onChange={(event) => setAdultConfirmed(event.target.checked)} />
              <span>Confirmo que tengo 18 años o más.</span>
            </label>
          ) : null}

          <button className={styles.submit} type="submit" disabled={busy || (mode === "signup" && !adultConfirmed)}>
            {busy ? "Un segundo…" : mode === "signup" ? "Que te acuerdes" : "Seguir"}
          </button>
        </form>

        {message ? <p className={styles.message} role="status">{message}</p> : null}

        <p className={styles.privacy}>
          Guardamos elecciones concretas para continuidad. No convertimos una pose, look o respuesta en una etiqueta sobre tu sexualidad, soledad, dependencia o estado emocional.
        </p>
        <a className={styles.back} href="/experience">Volver con Mara</a>
      </section>
    </main>
  );
}
