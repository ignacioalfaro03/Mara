"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./creator.module.css";

type SubmitState = "idle" | "submitting" | "success" | "error";

const PRODUCTS = [
  ["digital_content", "Contenido y productos digitales"],
  ["audio", "Audios, notas de voz y formatos privados"],
  ["personalized", "Productos o entregables personalizados"],
  ["chat", "Acceso o mensajería privada acotada"],
  ["scheduled_sessions", "Sesiones o servicios agendados"],
  ["membership", "Membresía / acceso recurrente"],
] as const;

export default function CreatorsPage() {
  const [email, setEmail] = useState("");
  const [exposureLevel, setExposureLevel] = useState("not_sure");
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
          <p className={styles.eyebrow}>MARA · CREATOR REVENUE OS</p>
          <h1>Gana más con la audiencia que ya tienes.</h1>
          <p className={styles.lede}>
            Mara reúne tus ofertas, ventas y clientes para mostrarte qué está funcionando, quién puede volver a comprar y cuál es la siguiente mejor acción para hacer crecer tus ingresos.
          </p>
          <a className={styles.heroAction} href="#pilot">Quiero probar Mara</a>
        </div>
        <aside className={styles.heroProof} aria-label="La ecuación de Mara">
          <p className={styles.kicker}>LA ECUACIÓN</p>
          <strong>Audiencia.<br />Clientes.<br />Revenue.</strong>
          <p>Tu audiencia vive en redes. Mara te ayuda a convertirla en un negocio que puedes entender y operar.</p>
        </aside>
      </section>

      <section className={styles.promiseSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>NO NECESITAS OTRA RED SOCIAL</p>
          <h2>Necesitas saber qué vender, a quién y qué hacer después.</h2>
        </div>
        <div className={styles.promiseGrid}>
          <article>
            <span>01</span>
            <strong>Publica una oferta</strong>
            <p>Crea algo claro que puedas vender y comparte tu link desde Instagram, TikTok, YouTube, X, WhatsApp o donde ya tengas audiencia.</p>
          </article>
          <article>
            <span>02</span>
            <strong>Convierte seguidores en clientes</strong>
            <p>La compra deja de ser una transacción aislada: pasa a formar parte de una relación comercial que puedes seguir.</p>
          </article>
          <article>
            <span>03</span>
            <strong>Entiende a tus compradores</strong>
            <p>GMV, recurrencia, historial, preferencias declaradas y contexto permitido quedan organizados en un CRM creador-cliente.</p>
          </article>
          <article>
            <span>04</span>
            <strong>Actúa sobre oportunidades</strong>
            <p>Mara prioriza acciones: entregar, recuperar, reactivar, volver a vender o no hacer nada cuando todavía no existe una señal suficiente.</p>
          </article>
        </div>
      </section>

      <section className={styles.businessStrip}>
        <div><span>COMMERCE</span><strong>Vende desde tu propio link.</strong></div>
        <div><span>CRM</span><strong>Cada comprador se vuelve cliente.</strong></div>
        <div><span>INTELLIGENCE</span><strong>Detecta la siguiente oportunidad.</strong></div>
        <div><span>REPEAT</span><strong>Optimiza para que vuelvan a comprar.</strong></div>
      </section>

      <section className={styles.split} id="pilot">
        <div className={styles.exposureCard}>
          <p className={styles.kicker}>CREATOR BUSINESS, NO VANITY METRICS</p>
          <h2>Mara está diseñada para operar ingresos, no para perseguir likes.</h2>
          <ol>
            <li><b>Trae tu audiencia.</b><span> No tienes que reconstruirla dentro de Mara para empezar.</span></li>
            <li><b>Vende algo real.</b><span> Contenido, servicios, personalizados, membresías u otros formatos permitidos que puedas cumplir.</span></li>
            <li><b>Construye CRM con cada compra.</b><span> Historial, recurrencia y contexto comercial dejan de vivir dispersos.</span></li>
            <li><b>Deja que Mara priorice.</b><span> La capa de inteligencia existe para convertir datos en acciones, no para llenar dashboards.</span></li>
          </ol>
          <div className={styles.callout}>
            <span>NORTH STAR</span>
            <p>GMV por creador activo. Mara funciona si te ayuda a convertir mejor, aumentar recompra y hacer crecer tus ingresos sin multiplicar tu carga operativa.</p>
          </div>
          <p className={styles.note}>
            El piloto inicial mantiene control de acceso y mayoría de edad mientras cerramos infraestructura de pagos, compliance y operación. La tesis de producto es creator-commerce general y no depende de una identidad virtual ni de una categoría de contenido específica.
          </p>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <div className={styles.formHead}>
            <p className={styles.kicker}>PILOTO PRIVADO</p>
            <h2>Cuéntanos cómo monetizas — o quieres monetizar — tu audiencia.</h2>
            <p>No te estamos vendiendo un curso ni prometiendo ingresos. Queremos probar Mara con pocos creadores y medir si realmente aumenta la capacidad de vender y recomprar.</p>
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
                ¿Cómo prefieres presentarte frente a tu audiencia?
                <select value={exposureLevel} onChange={(event) => setExposureLevel(event.target.value)}>
                  <option value="not_sure">Todavía no lo sé / depende del producto</option>
                  <option value="selective_real_content">Con mi marca o identidad pública</option>
                  <option value="character_only">Con una persona, marca o avatar separado</option>
                  <option value="voice">Principalmente mediante voz / formatos sin exposición constante</option>
                  <option value="direct_interaction">Con interacción directa o servicios agendados</option>
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
                    <option value="none">Todavía no tengo audiencia</option>
                    <option value="under_5k">Menos de 5 mil</option>
                    <option value="5k_25k">5 mil–25 mil</option>
                    <option value="25k_plus">Más de 25 mil</option>
                  </select>
                </label>

                <label>
                  Experiencia monetizando
                  <select value={currentCreatorStatus} onChange={(event) => setCurrentCreatorStatus(event.target.value)}>
                    <option value="never">Nunca he vendido a mi audiencia</option>
                    <option value="private_creator">He vendido de forma puntual o privada</option>
                    <option value="public_creator">Ya monetizo una marca/audiencia pública</option>
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

              <button type="submit" disabled={!canSubmit}>{submitState === "submitting" ? "Enviando…" : "Quiero probar Mara"}</button>

              {submitState === "error" ? (
                <p className={styles.error} role="alert">No pudimos registrar tu solicitud. El piloto puede no estar habilitado en este entorno o hubo un problema temporal.</p>
              ) : null}

              <p className={styles.finePrint}>
                Solicitar acceso no garantiza aceptación ni ingresos. Los pagos y payouts reales siguen desactivados hasta contar con proveedor, verificación y requisitos operativos compatibles con el modelo de Mara.
              </p>
            </>
          )}
        </form>
      </section>
    </main>
  );
}
