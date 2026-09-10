"use client";

import { FormEvent, useEffect, useState } from "react";
import { flushPendingPreferenceEvents } from "@/lib/preference-client";
import { flushPendingRitualMemory } from "@/lib/ritual-client";
import { bindMaraDeviceToAccount, checkMaraDeviceAccount, clearMaraLocalDeviceState, deviceVersion } from "@/lib/local-device-state";
import { flushPendingPrivateStyle } from "@/lib/private-moment-client";
import { flushPendingWorldKnowledge } from "@/lib/world-client";
import { track } from "@/lib/analytics";
import styles from "./auth.module.css";

type Mode = "signup" | "signin";
type AuthState = "checking" | "authenticated" | "anonymous";

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
  const [controlBusy, setControlBusy] = useState(false);
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    void fetch("/api/auth/me", { cache: "no-store", credentials: "same-origin", signal: AbortSignal.timeout(5000) })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as { authenticated?: boolean; user?: { id?: string } };
        if (!active) return;
        setAuthState(payload.authenticated ? "authenticated" : "anonymous");
        if (payload.authenticated && payload.user?.id) bindMaraDeviceToAccount(payload.user.id);
      })
      .catch(() => {
        if (active) setAuthState("anonymous");
      });

    return () => {
      active = false;
    };
  }, []);

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

      // Auth succeeded, but do not merge a previous account's local cache into
      // the new account. The server-verified identity is the only owner source.
      if (await checkMaraDeviceAccount(true) !== "authenticated") {
        setMessage("Entraste, pero no pude comprobar tu memoria todavía. Vuelve a intentarlo; la copia local sigue aquí.");
        return;
      }

      const transferVersion = deviceVersion();
      await flushPendingPreferenceEvents();
      if (transferVersion !== deviceVersion()) return;
      await flushPendingRitualMemory();
      if (transferVersion !== deviceVersion()) return;
      await flushPendingPrivateStyle();
      if (transferVersion !== deviceVersion()) return;
      await flushPendingWorldKnowledge();
      if (transferVersion !== deviceVersion()) return;
      track(mode === "signup" ? "signup_completed" : "signin_completed", { surface: "auth" });
      if (mode === "signup") track("signup_complete", { surface: "auth" });
      window.location.assign("/experience?account=ready");
    } catch {
      setMessage("No pude conectar con la memoria de Mara.");
    } finally {
      setBusy(false);
    }
  }

  function resetDevice() {
    clearMaraLocalDeviceState();
    track("launch_state_reset", { surface: "auth" });
    setMessage("Borré la copia local de Mara en este dispositivo. No borré tu cuenta. Si vuelves a entrar con una cuenta, Mara puede recuperar lo que esa cuenta conserve.");
  }

  async function signOut() {
    setControlBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "same-origin",
      });
      if (!response.ok) {
        setMessage("No pude cerrar la sesión. Inténtalo otra vez.");
        return;
      }

      clearMaraLocalDeviceState();
      setAuthState("anonymous");
      setMessage("Sesión cerrada y copia local borrada. Tu cuenta no fue eliminada.");
    } catch {
      setMessage("No pude cerrar la sesión. Inténtalo otra vez.");
    } finally {
      setControlBusy(false);
    }
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>MARA · MEMORIA</p>
        <h1 className={styles.title}>{authState === "authenticated" ? "Tu historia sigue aquí." : mode === "signup" ? "¿Quieres que me acuerde?" : "Volviste."}</h1>
        <p className={styles.lead}>
          {authState === "authenticated" ? "Ya estás dentro. Vuelve con Mara para seguir desde lo que tu cuenta recuerda." : mode === "signup"
            ? "Crea una cuenta y puedo conservar tus elecciones aunque cambies de dispositivo."
            : "Entra y seguimos desde lo que ya dejamos a medias."}
        </p>

        {authState !== "authenticated" ? <>
        <div className={styles.tabs} aria-label="Cuenta">
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

          <button className={styles.submit} type="submit" disabled={busy || authState === "checking" || (mode === "signup" && !adultConfirmed)}>
            {busy ? "Un segundo…" : mode === "signup" ? "Que te acuerdes" : "Seguir"}
          </button>
        </form>
        </> : null}

        {message ? <p className={styles.message} role="status">{message}</p> : null}

        <section className={styles.deviceControls} aria-label="Control de cuenta y dispositivo">
          <p className={styles.deviceLabel}>Este dispositivo</p>
          <button type="button" className={styles.deviceAction} onClick={resetDevice} disabled={controlBusy}>
            Borrar copia local
          </button>
          {authState === "authenticated" ? (
            <button type="button" className={styles.deviceAction} onClick={() => void signOut()} disabled={controlBusy}>
              {controlBusy ? "Cerrando…" : "Cerrar sesión"}
            </button>
          ) : null}
        </section>

        <p className={styles.privacy}>
          Guardamos tus elecciones y el avance de estas historias. Borrar la copia local no elimina la memoria de tu cuenta: puede recuperarse cuando vuelvas con Mara.
        </p>
        <a className={styles.back} href="/experience">Volver con Mara</a>
      </section>
    </main>
  );
}
