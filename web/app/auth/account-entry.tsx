"use client";

import { FormEvent, useEffect, useState } from "react";
import { clearMaraLocalDeviceState } from "@/lib/local-device-state";
import { track } from "@/lib/analytics";
import styles from "./auth.module.css";

type Mode = "signup" | "signin";
type AuthState = "checking" | "authenticated" | "anonymous";

function messageFor(error?: string) {
  switch (error) {
    case "backend_not_configured": return "La cuenta de Mara todavía no está disponible.";
    case "invalid_email": return "Ese correo no parece válido.";
    case "invalid_password": return "Usa una contraseña de al menos 8 caracteres.";
    case "invalid_credentials": return "Correo o contraseña incorrectos.";
    case "signup_rate_limited": return "Hay demasiados correos de confirmación en este momento. Prueba nuevamente más tarde.";
    case "signup_failed": return "No pude crear la cuenta con esos datos.";
    default: return "No pude completar eso. Inténtalo otra vez.";
  }
}

function safeReturnPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export function AccountEntry() {
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [controlBusy, setControlBusy] = useState(false);
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [message, setMessage] = useState("");
  const [returnTo, setReturnTo] = useState<string | null>(null);

  useEffect(() => {
    setReturnTo(safeReturnPath(new URLSearchParams(window.location.search).get("returnTo")));
    let active = true;
    void fetch("/api/auth/me", { cache: "no-store", credentials: "same-origin", signal: AbortSignal.timeout(5000) })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as { authenticated?: boolean };
        if (!active) return;
        setAuthState(payload.authenticated ? "authenticated" : "anonymous");
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

    try {
      const response = await fetch(mode === "signup" ? "/api/auth/signup" : "/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
        setMessage("Cuenta creada. Revisa tu correo para confirmar la dirección y después vuelve a entrar.");
        setMode("signin");
        return;
      }

      track(mode === "signup" ? "signup_completed" : "signin_completed", { surface: "auth" });
      window.location.assign(returnTo ?? "/creator");
    } catch {
      setMessage("No pude conectar con Mara. Inténtalo nuevamente.");
    } finally {
      setBusy(false);
    }
  }

  function resetDevice() {
    clearMaraLocalDeviceState();
    setMessage("Datos locales borrados. Tu cuenta, compras y datos guardados en Mara no fueron eliminados.");
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
      setMessage("Sesión cerrada y datos locales borrados. Tu cuenta no fue eliminada.");
    } catch {
      setMessage("No pude cerrar la sesión. Inténtalo otra vez.");
    } finally {
      setControlBusy(false);
    }
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>MARA · CUENTA</p>
        <h1 className={styles.title}>
          {authState === "authenticated" ? "Tu cuenta está activa." : mode === "signup" ? "Crea tu cuenta." : "Entra a Mara."}
        </h1>
        <p className={styles.lead}>
          {authState === "authenticated"
            ? "Administra tu negocio en Creator OS o vuelve a la compra que estabas realizando."
            : mode === "signup"
              ? "Una cuenta te permite administrar tu negocio como creador o completar y conservar tus compras como cliente."
              : "Entra para continuar con tu Creator OS, tus compras o el checkout que dejaste pendiente."}
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

            <button className={styles.submit} type="submit" disabled={busy || authState === "checking"}>
              {busy ? "Procesando…" : mode === "signup" ? "Crear cuenta" : "Entrar"}
            </button>
          </form>
        </> : null}

        {message ? <p className={styles.message} role="status">{message}</p> : null}

        {authState === "authenticated" ? (
          <div className={styles.deviceControls} aria-label="Control de cuenta">
            <p className={styles.deviceLabel}>Cuenta</p>
            <a className={styles.deviceAction} href={returnTo ?? "/creator"}>{returnTo ? "Continuar" : "Abrir Creator OS"}</a>
            <button type="button" className={styles.deviceAction} onClick={() => void signOut()} disabled={controlBusy}>
              {controlBusy ? "Cerrando…" : "Cerrar sesión"}
            </button>
          </div>
        ) : null}

        <section className={styles.deviceControls} aria-label="Datos de este dispositivo">
          <p className={styles.deviceLabel}>Este dispositivo</p>
          <button type="button" className={styles.deviceAction} onClick={resetDevice} disabled={controlBusy}>
            Borrar datos locales
          </button>
        </section>

        <p className={styles.privacy}>
          Cerrar sesión o borrar datos locales no elimina tu cuenta ni tus compras. El tratamiento de datos se rige por la política de privacidad de Mara.
        </p>
        <a className={styles.back} href={returnTo ?? "/"}>{returnTo ? "Volver a la oferta" : "Volver a Mara"}</a>
      </section>
    </main>
  );
}
