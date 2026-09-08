"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./creator.module.css";

type SubmitState = "idle" | "submitting" | "success" | "error";

const PRODUCTS = [
  ["digital_content", "Contenido y colecciones digitales"],
  ["audio", "Audios y notas de voz"],
  ["personalized", "Productos personalizados"],
  ["chat", "Chat privado en ventanas definidas"],
  ["scheduled_sessions", "Sesiones agendadas de 15/30/60 min"],
  ["membership", "Membresía / acceso recurrente"],
] as const;

export default function CreatorsPage() {
  const [email, setEmail] = useState("");
  const [exposureLevel, setExposureLevel] = useState("character_only");
  const [audienceSize, setAudienceSize] = useState("not_sure");
  const [currentCreatorStatus, setCurrentCreatorStatus] = useState("never");
  const [productInterests, setProductInterests] = useState<string[]>([]);
  const [adultConsent, setAdultConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const canSubmit = useMemo(
    () => email.trim().length > 4 && adultConsent && submitState !== "submitting",
    [email, adultConsent, submitState],
  );

  function toggleProduct(value: string) {
    setProductInterests((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitState("submitting");

    try {
      const response = await fetch("/api/creator-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          exposureLevel,
          productInterests,
          audienceSize,
          currentCreatorStatus,
          adultConsent,
          website,
        }),
      });

      if (!response.ok) throw new Error("creator-interest-failed");
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>MARA · PRIVATE CREATOR PILOT</p>
        <h1>Tu personaje puede ser público. Tú no tienes que serlo.</h1>
        <p className={styles.lede}>
          Estamos preparando un piloto para mujeres adultas que quieren monetizar una identidad digital sin convertir su nombre, cara o vida pública en el producto.
        </p>
        <div className={styles.promiseGrid}>
          <article>
            <span>01</span>
            <strong>Crea un personaje</strong>
            <p>Nombre, identidad visual, personalidad y límites definidos por ti.</p>
          </article>
          <article>
            <span>02</span>
            <strong>Elige qué vendes</strong>
            <p>Contenido, audio, experiencias, personalización o tiempo agendado. Nada es obligatorio.</p>
          </article>
          <article>
            <span>03</span>
            <strong>Mantén control de tu exposición</strong>
            <p>Tu identidad legal puede requerir verificación privada; no tiene por qué convertirse en tu identidad pública.</p>
          </article>
        </div>
      </section>

      <section className={styles.split}>
        <div className={styles.exposureCard}>
          <p className={styles.kicker}>TU NIVEL, TUS LÍMITES</p>
          <h2>No existe una sola forma de ser creadora en Mara.</h2>
          <ol>
            <li><b>Solo personaje.</b> Productos digitales sin exposición personal pública.</li>
            <li><b>Voz.</b> Audios o interacción de voz, solo si quieres.</li>
            <li><b>Contenido real selectivo.</b> Tú decides exactamente qué aparece.</li>
            <li><b>Interacción directa.</b> Ventanas pagadas y agendadas, bajo tus reglas.</li>
          </ol>
          <p className={styles.note}>
            Mara busca ofrecer pseudonimato público, no anonimato regulatorio. El piloto será solo para personas adultas verificadas y sujeto a requisitos legales, de consentimiento y de pagos antes de activar monetización real.
          </p>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <p className={styles.kicker}>SOLICITAR ACCESO AL PILOTO</p>
          <h2>Cuéntanos qué versión te serviría.</h2>

          {submitState === "success" ? (
            <div className={styles.success} role="status">
              <strong>Interés registrado.</strong>
              <p>Esto no crea una cuenta ni activa pagos. Tu correo queda únicamente como contacto para evaluar el piloto privado.</p>
            </div>
          ) : (
            <>
              <label>
                Correo de contacto
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </label>

              <label>
                ¿Hasta dónde te gustaría exponerte?
                <select value={exposureLevel} onChange={(event) => setExposureLevel(event.target.value)}>
                  <option value="character_only">Solo personaje / avatar</option>
                  <option value="voice">Personaje + mi voz</option>
                  <option value="selective_real_content">Contenido real selectivo</option>
                  <option value="direct_interaction">Interacción directa agendada</option>
                  <option value="not_sure">Todavía no lo sé</option>
                </select>
              </label>

              <fieldset>
                <legend>¿Qué te interesaría monetizar?</legend>
                <div className={styles.checkGrid}>
                  {PRODUCTS.map(([value, label]) => (
                    <label className={styles.check} key={value}>
                      <input
                        type="checkbox"
                        checked={productInterests.includes(value)}
                        onChange={() => toggleProduct(value)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className={styles.twoCol}>
                <label>
                  Audiencia actual
                  <select value={audienceSize} onChange={(event) => setAudienceSize(event.target.value)}>
                    <option value="not_sure">Prefiero no decir / no sé</option>
                    <option value="none">No tengo audiencia</option>
                    <option value="under_5k">Menos de 5 mil</option>
                    <option value="5k_25k">5 mil–25 mil</option>
                    <option value="25k_plus">Más de 25 mil</option>
                  </select>
                </label>

                <label>
                  Experiencia como creadora
                  <select value={currentCreatorStatus} onChange={(event) => setCurrentCreatorStatus(event.target.value)}>
                    <option value="never">Nunca he vendido contenido/experiencias</option>
                    <option value="private_creator">He vendido de forma privada</option>
                    <option value="public_creator">Ya tengo una marca pública</option>
                    <option value="not_sure">Prefiero no decir</option>
                  </select>
                </label>
              </div>

              <label className={styles.honeypot} aria-hidden="true">
                Sitio web
                <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
              </label>

              <label className={styles.consent}>
                <input
                  type="checkbox"
                  checked={adultConsent}
                  onChange={(event) => setAdultConsent(event.target.checked)}
                  required
                />
                <span>Soy mayor de 18 años y autorizo que Mara use estos datos únicamente para contactarme respecto del piloto privado.</span>
              </label>

              <button type="submit" disabled={!canSubmit}>
                {submitState === "submitting" ? "Enviando…" : "Quiero conocer el piloto"}
              </button>

              {submitState === "error" && (
                <p className={styles.error} role="alert">
                  No pudimos registrar tu solicitud. El piloto todavía no está habilitado en este entorno o hubo un problema temporal.
                </p>
              )}

              <p className={styles.finePrint}>
                Solicitar acceso no garantiza aceptación ni ingresos. Todavía no estamos activando pagos a creadoras. Antes del piloto comercial existirán verificaciones de mayoría de edad, identidad, consentimiento y elegibilidad de pagos según corresponda.
              </p>
            </>
          )}
        </form>
      </section>
    </main>
  );
}
