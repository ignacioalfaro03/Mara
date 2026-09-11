// Fixed adult fiction for Mara Vera / Creator Zero. No model calls, wall-clock promises, or paid media.
// Suggestive rather than explicit; consent and user boundaries remain outside the fiction layer.
// The completed-session count advances this short private sequence.
export const DM_SCENES = [
  {
    direct: "Estoy frente al espejo cuando veo tu mensaje. No giro de inmediato. Termino de acomodarme el pelo, te miro por el reflejo y recién ahí levanto el teléfono. Si querías mi atención, ya la tienes.",
    slow: "La pieza está casi oscura. Solo dejo encendida la luz del espejo. Me ves de espaldas un segundo más de lo necesario. Sé que estás mirando; por eso todavía no me doy vuelta.",
    payoff: "Ahora sí te miro directo. Nada más. No necesito mostrarte todo para saber exactamente dónde se te quedó la vista.",
    next: "La próxima vez te cuento qué dejé fuera del encuadre. Esa parte no era para cualquiera.",
  },
  {
    direct: "Dejé el teléfono apoyado junto a la puerta. Estoy con una camisa demasiado grande para la hora y demasiado corta para fingir que fue casualidad. Te hago esperar ahí mientras decido cuánto entra en cuadro.",
    slow: "Abro la puerta apenas. No para que entres: para que entiendas que podría abrirla más. Me apoyo en el marco, bajo la mirada al teléfono y sonrío como si ya supiera qué ibas a elegir.",
    payoff: "No abrí más la puerta. Tampoco hacía falta. Te dejé exactamente donde quería: imaginando el resto.",
    next: "Todavía queda una última noche. En esa no te doy la ventaja de saber qué viene primero.",
  },
  {
    direct: "Esta vez no hay espejo ni puerta. Solo luz baja, el teléfono cerca y yo sentada al borde de la cama. Te digo que elijas rápido. Después cambio de idea y elijo yo.",
    slow: "Te hago escoger entre acercarte o esperar. No hay una respuesta correcta. Lo entretenido es ver cuánto te demoras cuando sabes que estoy mirando tu decisión.",
    payoff: "Me quedo con tu elección. No como una promesa rara, sino como una pista. La próxima vez no tendría sentido tratarte como si nunca hubieras estado aquí.",
    next: "Hasta aquí llega esta secuencia. Lo siguiente debería existir solo si tú vuelves y todavía quieres que siga.",
  },
] as const;

export function privateScene(sessionCount: number) {
  return DM_SCENES[Math.min(DM_SCENES.length - 1, Math.max(0, Math.floor(sessionCount)))];
}