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
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>MARA · PRIVATE CREATOR PILOT</p>
          <h1>Tu audiencia ya quiere cosas. Deja de adivinarlas.</h1>
          <p className={styles.lede}>
            Mara te ayuda a construir un World, entender qué quiere tu comunidad y convertir esa demanda en ofertas — sin obligarte a convertir tu identidad real en el producto.
          </p>
          <a className={styles.heroAction} href="#pilot">Quiero conocer el piloto</a>
        </div>
        <aside className={styles.heroProof} aria-label="La promesa de Mara para creadoras">
          <p className={styles.kicker}>LA ECUACIÓN</p>
          <strong>Más señal.<br />Más control.<br />Menos exposición.</strong>
          <p>Tu personaje puede ser público. Tú decides cuánto de ti también lo es.</p>
        </aside>
      </section>

      <section className={styles.promiseSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>TU WORLD ES UN NEGOCIO, NO UN PERFIL</p>
          <h2>Mara conecta lo que muestras con lo que la gente realmente quiere.</h2>
        </div>
        <div className={styles.promiseGrid}>
          <article>
            <span>01</span>
            <strong>Define tu identidad y tus límites</strong>
            <p>Personaje, voz, contenido real selectivo o interacción acotada. Tú eliges hasta dónde llegar.</p>
          </article>
          <article>
            <span>02</span>
            <strong>Deja que tu comunidad te diga qué quiere</strong>
            <p>WANT, PLEDGE y COMMIT separan curiosidad de intención real para que no produzcas a ciegas.</p>
          </article>
          <article>
            <span>03</span>
            <strong>Convierte la señal en una oferta</strong>
            <p>Mara organiza demanda, contexto comercial, clientes, fulfillment e historial para que sepas qué hacer después.</p>
          </article>
          <article>
            <span>04</span>
            <strong>Haz que el negocio recuerde</strong>
            <p>Compras, preferencias y recurrencia forman contexto para vender mejor sin vivir pegada a un chat.</p>
          </article>
        </div>
      </section>

      <section className={styles.businessStrip}>
        <div><span>PRIVACY</span><strong>Tú controlas la exposición.</strong></div>
        <div><span>DEMAND</span><strong>La audiencia deja señales útiles.</strong></div>
        <div><span>COMMERCE</span><strong>Lo que tiene sentido se vuelve oferta.</strong></div>
        <div><span>MEMORY</span><strong>La relación comercial no parte de cero.</strong></div>
      </section>

      <section className={styles.split} id="pilot">
        <div className={styles.exposureCard}>
          <p className={styles.kicker}>NO HAY UNA SOLA FORMA DE SER CREADORA</p>
          <h2>Monetiza hasta donde tú quieras exponerte.</h2>
          <ol>
            <li><b>Solo personaje.</b><span> Identidad pública virtual, escritura y productos digitales.</span></li>
            <li><b>Voz.</b><span> Audios o interacción de voz cuando tú lo autorices.</span></li>
            <li><b>Contenido real selectivo.</b><span> Tú decides exactamente qué se vincula a tu World.</span></li>
            <li><b>Interacción directa acotada.</b><span> Ventanas y formatos definidos por ti, cuando estén operativamente habilitados.</span></li>
          </ol>
          <div className={styles.callout}>
            <span>LO IMPORTANTE</span>
            <p>La meta no es que publiques más. Es que ganes mejor por el tiempo que decides dedicar y sin aumentar innecesariamente tu exposición pública.</p>
          </div>
          <p className={styles.note}>
            Mara ofrece pseudonimato público y exposición controlada, no anonimato regulatorio. Verificación de mayoría de edad, identidad, consentimiento y elegibilidad de pagos siguen siendo parte de la infraestructura privada cuando corresponda.
          </p>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <div className={styles.formHead}>
            <p className={styles.kicker}>PILOTO PRIVADO</p>
            <h2>Cuéntanos qué negocio te gustaría poder operar.</h2>
            <p>No te estamos vendiendo un curso ni prometiendo ingresos. Queremos probar Mara con pocas creadoras adultas y aprender qué genera valor real.</p>
          </div>

          {submitState === "success" ? (
            <div className={styles.success} role="status">
              <strong>Ya quedó.</strong>
              <p>Registramos tu interés para contactarte sobre el piloto. Esto todavía no crea una cuenta, activa cobros ni garantiza aceptación.</p>
            </div>
          ) : (
            <>
              <label>
                Correo de contacto
                <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@email.com" required />
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
                      <input type="checkbox" checked={productInterests.includes(value)} onChange={() => toggleProduct(value)} />
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
                <input type="checkbox" checked={adultConsent} onChange={(event) => setAdultConsent(event.target.checked)} required />
                <span>Soy mayor de 18 años y autorizo que Mara use estos datos únicamente para contactarme respecto del piloto privado.</span>
              </label>

              <button type="submit" disabled={!canSubmit}>{submitState === "submitting" ? "Enviando…" : "Quiero entrar al piloto"}</button>

              {submitState === "error" ? (
                <p className={styles.error} role="alert">No pudimos registrar tu solicitud. El piloto puede no estar habilitado en este entorno o hubo un problema temporal.</p>
              ) : null}

              <p className={styles.finePrint}>
                Solicitar acceso no garantiza aceptación ni ingresos. Los pagos a creadoras siguen desactivados hasta contar con proveedor, verificación y requisitos operativos compatibles con el modelo real de Mara.
              </p>
            </>
          )}
        </form>
      </section>
    </main>
  );
}