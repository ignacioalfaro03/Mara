// Fixed, public-safe fiction. No model calls, wall-clock promises, or paid media.
// The existing completed-session count advances this short launch story.
export const DM_SCENES = [
  {
    direct: "Mini escena: Sofi entra a la cocina y me pilla usando una cuchara como micrófono. Yo no bajo la música. Le paso otra cuchara.",
    slow: "Sofi dice que no canta. Dejo una cuchara frente a ella y subo apenas la música. Espero. Ya se sabe la primera frase.",
    payoff: "Duró un coro su dignidad. El segundo lo cantó más fuerte que yo. Que después no te venda otra versión.",
    next: "Si vuelves, te cuento por qué Sofi cortó justo ahí su relato.",
  },
  {
    direct: "Sofi cortó el relato antes del final: la que pidió repetir la canción fue ella. Yo ya había dejado el micrófono-cuchara.",
    slow: "Quedaba el último cuadrado de chocolate. Sofi lo puso entre las dos: una canción más, dijo. Mira quién quería alargar la noche.",
    payoff: "Le dejé el chocolate. La elección de la próxima canción me la quedé yo. Ese fue el trato.",
    next: "Queda mi elección de canción. Esa parte todavía no te la he contado.",
  },
  {
    direct: "Elegí una canción que las dos nos sabemos mal. Inventamos la mitad de la letra. El vecino golpeó la pared justo en nuestro mejor verso.",
    slow: "Bajé la música. Sofi siguió cantando igual, casi en susurros. Esa versión sí que no quedó grabada.",
    payoff: "Se terminó el chocolate, lavamos las dos cucharas y dejamos la música bajita. Así terminó esa noche. Bastante mejor que mi plan de portarme seria.",
    next: "Hasta aquí llega esta historia. Puedes volver a leerla o pasar por donde Sofi.",
  },
] as const;

export function privateScene(sessionCount: number) {
  return DM_SCENES[Math.min(DM_SCENES.length - 1, Math.max(0, Math.floor(sessionCount)))];
}
