'use strict';

/* ============================================================
   DATA ESTILOS — 38 estilos visuales POD
   Paletas, tipografías, tratamientos, pools de dirección.
   Vocabulario 100% comercial. Sin referencias religiosas.
   ============================================================ */

const ESTILO_INFO = {
  "Bohemian": "orgánico, botánico, cálido, hecho a mano",
  "Anime / Manga": "dinámico, líneas de acción, expresivo, alto impacto",
  "Retro 70s": "halftone, colores tierra, letras redondeadas, nostálgico",
  "Dark Tattoo": "grabado, línea negra, confrontacional, ritual",
  "Brutalist": "bloques, tipografía masiva, crudo, industrial",
  "Y2K / Cyber": "digital, glitch, interfaz, neón o cromado",
  "Hand-Drawn": "boceto, línea imperfecta, íntimo, de cuaderno",
  "Minimal Modern": "geometría limpia, mucho espacio, contemporáneo",
  "Vitral / Mosaico": "vidrio emplomado, luz transmitida, teselas, solemnidad",
  "Grabado / Linóleo": "talla en madera, alto contraste blanco/negro, marca de gubia",
  "Gótico Ornamental": "blackletter, heráldica, incunable, negro profundo",
  "Stencil Urbano": "plantilla de spray, bordes duros, calle, capas",
  "Cómic / Halftone": "tramas de puntos, contorno grueso, viñeta, acción",
  "Pixel / 8-bit": "retícula de píxeles, paleta limitada, HUD, dithering",
  "Acuarela Suelta": "mancha húmeda, reserva de papel, respiración, luz",
  "Sumi-e / Tinta Lavada": "pincel oriental, vacío activo, un gesto, papel washi",
  "Barroco Ornamental": "talla dorada, claroscuro, drama, retablo",
  "Vintage Desgastado": "tinta agrietada, halftone fantasma, emblema de oficio",
  "Bordado / Puntada": "hilo, parche, textura de tela, oficio a mano",
  "Folk Popular": "exvoto popular, papel picado, brocha, alegría de pueblo",
  "Grunge / DIY": "fotocopia rasgada, cinta adhesiva, tinta corrida, honestidad cruda",
  "Risograph": "dos tintas desregistradas, grano de riso, flúor sobre papel",
  "Surf / Skate 90s": "curvas de tabla, sun-fade, contorno doble, cultura de calle",
  "Retro 80s Neon": "rejilla en perspectiva, neón sobre negro, cromados",
  "Vaporwave": "pasteles ácidos, estatuas, glitch suave, nostalgia eterna",
  "Collage Cut-Paper": "recortes superpuestos, bordes blancos, sombra de capa",
  "Papercraft 3D": "capas de papel con sombra, profundidad física, relieve",
  "Airbrush Smooth": "degradados suaves, brillos, luz difusa, acabado custom",
  "Blueprint / Technical": "línea técnica sobre azul, cotas, plano de ingeniería",
  "Paste-up Wheatpaste": "póster pegado en muro, arrugas, capas de ciudad",
  "Photomontage / Dada": "fotografía B/N recortada, un acento de color, montaje",
  "Kids Storybook": "formas amables, paleta de cuento, trazo orgánico",
  "Ukiyo-e / Woodblock": "ola de Hokusai, contorno plano, papel envejecido, sello rojo",
  "Irezumi / Wabori": "tatuaje japonés, barras de viento, negro denso, koi",
  "Tattoo Old School": "línea gruesa, flash americano, paleta limitada, permanente",
  "Foil Stamp / Metallic": "oro estampado, relieve, reflejo dirigido, fondo limpio",
  "Puff Print / 3D Ink": "tinta expandida, relieve redondeado, brillo mate, tangible"
};

const ESTILOS_LIST = Object.keys(ESTILO_INFO);

const SATURACION = {
  "Bohemian": ["flores genéricas sin propósito", "manos genéricas sin contexto botánico"],
  "Anime / Manga": ["ojos grandes sin narrativa", "pose de acción desconectada del concepto"],
  "Retro 70s": ["sol/rayos genérico", "paleta setentera sin sentido"],
  "Dark Tattoo": ["calavera con texto pegado", "cruz genérica sin narrativa"],
  "Brutalist": ["bloques de texto sin jerarquía", "distress decorativo"],
  "Y2K / Cyber": ["matrix rain genérico", "glitch sin significado"],
  "Hand-Drawn": ["boceto genérico sin narrativa", "lettering cursivo vacío"],
  "Minimal Modern": ["ícono suelto sin composición"],
  "Vitral / Mosaico": ["ventanal decorativo sin escena", "mosaico de colores random sin jerarquía de luz"],
  "Grabado / Linóleo": ["grabado decorativo sin contraste real", "talla fina genérica sin fuerza de gubia"],
  "Gótico Ornamental": ["gótico de banda de metal sin mensaje", "blackletter ilegible por acumulación"],
  "Stencil Urbano": ["graffiti ilegible sin jerarquía", "spray decorativo sin mensaje"],
  "Cómic / Halftone": ["viñeta sin narrativa", "onomatopeya vacía de contenido"],
  "Pixel / 8-bit": ["pixel art sin paleta definida", "referencia de juego sin sentido"],
  "Acuarela Suelta": ["acuarela decorativa sin composición", "mancha por mancha sin reserva ni aire"],
  "Sumi-e / Tinta Lavada": ["trazo decorativo sin mensaje", "vacío sin composición"],
  "Barroco Ornamental": ["ornamento sin foco", "dorado por dorar sin jerarquía"],
  "Vintage Desgastado": ["distress que borra el texto", "vintage sin emblema ni jerarquía"],
  "Bordado / Puntada": ["bordado simulado sin dirección de puntada", "hilo por hilo sin jerarquía"],
  "Folk Popular": ["folk sin narrativa", "patrón decorativo que compite con el texto"],
  "Grunge / DIY": ["suciedad decorativa sin sentido", "ransom-note ilegible por acumulación"],
  "Risograph": ["desregistro que borra el texto", "flúor por flúor sin jerarquía de lectura"],
  "Surf / Skate 90s": ["logo de marca vacío", "distorsión que rompe la legibilidad"],
  "Retro 80s Neon": ["neón sin mensaje", "glow que compite con el texto"],
  "Vaporwave": ["estatua decorativa sin contraste", "pastel que borra el contraste"],
  "Collage Cut-Paper": ["recorte sin composición", "capas que tapan la palabra"],
  "Papercraft 3D": ["sombra que ensucia el texto", "capas sin jerarquía de lectura"],
  "Airbrush Smooth": ["brillo que difumina la palabra", "gradiente sin foco"],
  "Blueprint / Technical": ["plano decorativo sin contenido", "letra técnica ilegible"],
  "Paste-up Wheatpaste": ["arrugas que destruyen la lectura", "capas sin protagonista"],
  "Photomontage / Dada": ["montaje sin sentido", "recorte aleatorio sin composición"],
  "Kids Storybook": ["cuento vacío", "amabilidad sin profundidad"],
  "Ukiyo-e / Woodblock": ["ola decorativa sin mensaje", "sello rojo sin contenido"],
  "Irezumi / Wabori": ["densidad que tapa el texto", "koi sin dirección ni sentido"],
  "Tattoo Old School": ["flash copiado sin verdad", "cinta ilegible"],
  "Foil Stamp / Metallic": ["oro por oro sin jerarquía", "reflejo que borra el texto"],
  "Puff Print / 3D Ink": ["relieve sin jerarquía", "expansión que deforma la letra"]
};

const LAYOUTS = [
  "Axial centrado: eje vertical único; símbolo centrado; textos centrados debajo",
  "Emblema circular: insignia en círculo o escudo; los textos curvan alrededor del símbolo",
  "Editorial asimétrica: masa a dos tercios; texto en columna lateral con aire; firma en el margen",
  "Retícula áurea: bloque principal 1:1.618; texto en la banda menor",
  "Diagonal descendente: masa y texto caen de arriba-izq a abajo-der; vacío en esquina superior derecha",
  "Diagonal ascendente: masa y texto suben de abajo-izq a arriba-der; vacío en esquina inferior derecha",
  "Banda horizontal: franja de texto cruza el lienzo; el símbolo interrumpe la banda y la rompe",
  "Tarjeta interior: todo dentro de un marco con margen generoso; el fondo respira",
  "Columna apilada: símbolo arriba; textos apilados en columna estrecha de 3-4 líneas",
  "Sangrado total: masa a sangre en dos o tres lados; el texto cae en la esquina opuesta",
  "Sello descentrado: emblema pequeño en un cuadrante; gran vacío dominante",
  "Split 2/3-1/3: dos campos verticales; símbolo en uno, texto en el otro",
  "Órbita radial: textos giran en órbita alrededor del símbolo; lectura circular",
  "Arco y cúpula: masa bajo un arco; textos siguiendo la curva superior",
  "Escalinata: bloques escalonados en descenso; el texto vive entre peldaños",
  "Tríptico de bandas: tres bandas horizontales con jerarquía distinta; el símbolo ocupa la central"
];

const TIPOS = [
  "Grotesca black condensada: ultra-bold, mayúsculas, tracking cerrado, puede desbordar el marco",
  "Serif clásica titulada: versalitas, interletra amplia, aire ceremonial",
  "Serif moderna alto contraste: didona, contraste vertical extremo, filetes finos",
  "Lettering brush gestual: pincel seco, gesto visible, baseline variable",
  "Script de pluma: caligrafía con ligaduras, inclinación 15 grados",
  "Sans humanista limpia: caja alta y baja, tracking medio, legibilidad máxima",
  "Mono técnica: monoespaciada, aspecto de plano técnico",
  "Display caligráfica expresiva: trazo ampuloso, ornamentos, gesto barroco contenido",
  "Geométrica deconstructivista: geometría fragmentada, cortes y desplazamientos",
  "Gótica blackletter: ornamentación vertical, negro denso, solemnidad dura",
  "Slab pesada de oficio: slab industrial, peso máximo, aspecto de sello",
  "Itálica solemne: itálica ceremonial, interlínea amplia",
  "Rounded amable: formas redondeadas, peso medio, terminales suaves",
  "Stencil de plantilla: puentes de plantilla, spray, bordes duros",
  "Custom modular geométrica: letras por módulos y retícula visible",
  "Manuscrita de cuaderno: mano suelta, trazo irregular, marca íntima"
];

const TRATAMIENTOS = [
  "HEAVY: masas densas al 60-80%, contraste alto, tinta cargada, grano marcado, bordes duros",
  "SOFT: masas ligeras al 30-50%, contraste medio-bajo, degradados suaves, grano fino",
  "MODERN: masas planas al 40-60%, contraste medio, tintas planas limpias, geometría neta"
];

const FORMAS = [
  "silueta sólida a una tinta",
  "contorno lineal calibrado",
  "geometrizado por módulos",
  "orgánico gestual con pincel",
  "fragmentado en planos",
  "tallado en bloque",
  "grabado a buril con tramas",
  "manchado acuoso",
  "construido por retícula visible",
  "caligráfico de un solo trazo"
];

const INTEGRACION = [
  "las letras brotan del propio símbolo: el título nace de su humo, su luz o su estructura",
  "el título abraza y parte el símbolo: mitad de la palabra dentro de la forma, mitad fuera",
  "palabras construidas con elementos del objeto: la tipografía ES materia del símbolo",
  "el texto corre por el contorno del símbolo como una cinta que lo envuelve sin esconderlo",
  "las letras habitan la estructura del objeto: se apoyan en sus barras, ventanas o eslabones",
  "el símbolo y el texto se entrelazan: ramas o trazos del objeto atraviesan las palabras y salen al otro lado",
  "el título rompe la silueta del símbolo y lo extiende: el objeto sigue dibujado dentro de las letras",
  "texto y símbolo comparten una sola línea de dibujo: donde termina el trazo empieza la letra",
  "la palabra principal es un elemento más del objeto: un letrero que cuelga de él, una luz dentro, un sello sobre él",
  "el texto fluye con el movimiento del símbolo: sube con el humo, cae con el agua, gira con la rueda"
];

const COLOR_FAMILIES = {
  "tierra cálida": [
    "Terracota / Oliva / Hueso",
    "Ámbar / Musgo / Crema",
    "Mostaza / Naranja Quemado / Crema",
    "Terracota / Crema / Verde oliva",
    "Dorado suave / Terracota / Marfil",
    "Coral suave / Arena / Verde oliva",
    "Óxido / Arena / Crema"
  ],
  "bosque / sage": [
    "Oliva / Arena / Óxido suave",
    "Rosa Empolvado / Verde Salvia / Crema",
    "Verde bosque / Crema / Cobre",
    "Lavanda / Sage / Crema cálida",
    "Verde Aguacate / Café / Hueso",
    "Musgo / Crema / Carbón suave"
  ],
  "retro vibrante": [
    "Rosa Vintage / Turquesa / Crema",
    "Amarillo Mostaza / Marrón Chocolate / Crema",
    "Mostaza / Turquesa / Crema",
    "Naranja quemado / Crema / Verde menta"
  ],
  "noche / contraste": [
    "Negro + Blanco + Acento Rojo",
    "Azul Noche + Blanco + Dorado",
    "Monocromo alto contraste + un color de energía",
    "Blanco + Negro + Amarillo eléctrico",
    "Negro / Blanco / un acento vivo"
  ],
  "neón / cyber": [
    "Negro + Cian Eléctrico",
    "Negro + Magenta / Cian glitch",
    "Blanco + Violeta Eléctrico + Negro",
    "Negro / Verde terminal / Blanco",
    "Gris Frío / Negro + acento neón",
    "Cian / Magenta / Negro"
  ],
  "industrial": [
    "Carbón / Gris Frío / Negro",
    "Óxido / Carbón",
    "Concreto / Negro + un acento industrial",
    "Amarillo Industrial / Negro / Concreto",
    "Negro / Blanco sucio / Óxido"
  ],
  "tinta / ritual": [
    "Monocromo Negro / Marfil",
    "Negro + Rojo Sangre / Crema",
    "Sepia / Tinta Antigua",
    "Negro + Verde Musgo Oscuro / Hueso",
    "Carbón / Crema / un acento de sangre",
    "Tinta Envejecida / Crema"
  ],
  "papel / suave": [
    "Grafito / Crema / un acento de acuarela",
    "Carbón + Arena",
    "Monocromo Negro / Marfil con textura de papel",
    "Sepia / Crema / Carbón",
    "Gris cálido / Crema / un toque de óxido",
    "Washi / Ocre / Índigo"
  ],
  "mínimo frío": [
    "Gris Frío / Negro",
    "Monocromo Negro / Marfil",
    "Paleta Natural Desaturada",
    "Blanco sobre blanco + un trazo negro",
    "Negro / Gris / un acento mínimo",
    "Azul Blueprint / Blanco Técnico"
  ],
  "dorado / premium": [
    "Negro + Dorado / Marfil",
    "Crema / Oro envejecido / Carbón",
    "Marfil / Bronce / Negro suave",
    "Blanco cálido / Oro / Sombra"
  ],
  "flúor / risografía": [
    "Rosa Flúor / Azul Eléctrico / Crema",
    "Naranja Flúor / Azul Tinta / Hueso",
    "Rosa Riso / Verde Menta / Crema",
    "Naranja Neón / Azul Cobalto / Papel"
  ],
  "pastel ácido / vapor": [
    "Rosa Pastel / Turquesa / Lavanda",
    "Menta / Rosa / Amarillo Pálido",
    "Lila / Cian / Durazno",
    "Rosa Pálido / Azul Cielo / Crema"
  ]
};

const HEX_DE_PALETA = {
  "Terracota / Oliva / Hueso": ["#B5563B", "#6B7043", "#F2E8D5", "#2E241C"],
  "Ámbar / Musgo / Crema": ["#D69A3C", "#7A7A52", "#F5EBD8", "#3A2E1E"],
  "Mostaza / Naranja Quemado / Crema": ["#D9A441", "#C1633B", "#F6ECDA", "#33261A"],
  "Terracota / Crema / Verde oliva": ["#B5563B", "#F2E4CE", "#71753F", "#2C241A"],
  "Dorado suave / Terracota / Marfil": ["#D8B36A", "#B5563B", "#F4EEDF", "#2E2418"],
  "Coral suave / Arena / Verde oliva": ["#E08A6D", "#E8D9BE", "#7A7E4C", "#2F2A20"],
  "Óxido / Arena / Crema": ["#B45A2E", "#DCC49B", "#F4EAD8", "#2E2318"],
  "Oliva / Arena / Óxido suave": ["#75764A", "#DCC9A6", "#C07A4A", "#2C2A1E"],
  "Rosa Empolvado / Verde Salvia / Crema": ["#D9AFA8", "#A8B5A0", "#F6EFE2", "#3A342C"],
  "Verde bosque / Crema / Cobre": ["#2F4A38", "#F2E8D2", "#B0713F", "#1C2A20"],
  "Lavanda / Sage / Crema cálida": ["#B4A7C9", "#A8B5A0", "#F6EFE2", "#342E3A"],
  "Verde Aguacate / Café / Hueso": ["#7A8C4F", "#6B4A32", "#F0E8D8", "#26201A"],
  "Musgo / Crema / Carbón suave": ["#5E6B45", "#F2EAD8", "#3A3D36", "#20241E"],
  "Rosa Vintage / Turquesa / Crema": ["#E37C7C", "#3FA8A0", "#F6ECDA", "#31272A"],
  "Amarillo Mostaza / Marrón Chocolate / Crema": ["#D9A441", "#4A3226", "#F4EAD5", "#2A1E16"],
  "Mostaza / Turquesa / Crema": ["#D9A441", "#3FA8A0", "#F6ECDA", "#2E2A22"],
  "Naranja quemado / Crema / Verde menta": ["#C86432", "#F4EAD8", "#9CC8B4", "#2E241A"],
  "Negro + Blanco + Acento Rojo": ["#12141A", "#F5F5F0", "#C23B2E", "#3A3F4A"],
  "Azul Noche + Blanco + Dorado": ["#141C2E", "#F5F2E8", "#D4AF37", "#2A364E"],
  "Monocromo alto contraste + un color de energía": ["#111318", "#F5F5F0", "#E8483C", "#2E323A"],
  "Blanco + Negro + Amarillo eléctrico": ["#F5F5F0", "#111318", "#F2C230", "#3A3F4A"],
  "Negro / Blanco / un acento vivo": ["#12141A", "#F5F5F0", "#E86A2E", "#33363E"],
  "Negro + Cian Eléctrico": ["#0B0D12", "#20E0E0", "#3A4254", "#F2F6F6"],
  "Negro + Magenta / Cian glitch": ["#0B0D12", "#E83CC8", "#20E0E0", "#3A3244"],
  "Blanco + Violeta Eléctrico + Negro": ["#F2F0F6", "#7A2EE0", "#121016", "#4A3E5E"],
  "Negro / Verde terminal / Blanco": ["#0B0D12", "#3CE06A", "#F2F6F2", "#22302A"],
  "Gris Frío / Negro + acento neón": ["#1A1E24", "#0B0D12", "#E0409A", "#3E4650"],
  "Cian / Magenta / Negro": ["#20C8D8", "#D838B8", "#0E0C14", "#4A4458"],
  "Carbón / Gris Frío / Negro": ["#2A2E34", "#8A9098", "#14161A", "#D8DCE0"],
  "Óxido / Carbón": ["#B0562E", "#22262C", "#E8DCCE", "#4A3428"],
  "Concreto / Negro + un acento industrial": ["#B8BCC2", "#14161A", "#E8A020", "#3A4048"],
  "Amarillo Industrial / Negro / Concreto": ["#E8B820", "#14161A", "#B8BCC2", "#3A3220"],
  "Negro / Blanco sucio / Óxido": ["#14161A", "#E8E4DC", "#B0562E", "#3A3E44"],
  "Monocromo Negro / Marfil": ["#14141A", "#F2ECDD", "#4A4A50", "#8A887C"],
  "Negro + Rojo Sangre / Crema": ["#14141A", "#A82820", "#F2E8D5", "#3A2A28"],
  "Sepia / Tinta Antigua": ["#3A2C1E", "#C8B896", "#F0E6D0", "#5E4630"],
  "Negro + Verde Musgo Oscuro / Hueso": ["#14141A", "#3E4A34", "#EFE6D0", "#2A3226"],
  "Carbón / Crema / un acento de sangre": ["#22262A", "#F2EAD8", "#9E2B24", "#4A5056"],
  "Tinta Envejecida / Crema": ["#2A2620", "#F2EAD5", "#6B6252", "#4A4438"],
  "Grafito / Crema / un acento de acuarela": ["#3A3E44", "#F4EEDF", "#7A9EC2", "#5A5E64"],
  "Carbón + Arena": ["#26282C", "#D8CBB2", "#4A4E54", "#8A8578"],
  "Monocromo Negro / Marfil con textura de papel": ["#16161C", "#F2ECDD", "#46464E", "#8A887C"],
  "Sepia / Crema / Carbón": ["#5E4A34", "#F2E8D2", "#2A2824", "#8A7A5E"],
  "Gris cálido / Crema / un toque de óxido": ["#6B675E", "#F4EEDF", "#B0562E", "#3E3C36"],
  "Washi / Ocre / Índigo": ["#E8DCBE", "#C9A876", "#23406B", "#3A2E1E"],
  "Gris Frío / Negro": ["#3E444C", "#14161A", "#B8BEC6", "#5A626C"],
  "Paleta Natural Desaturada": ["#8A8578", "#D8D2C4", "#4A463E", "#B8AC98"],
  "Blanco sobre blanco + un trazo negro": ["#F6F4EE", "#EDEAE2", "#14141A", "#D8D4CA"],
  "Negro / Gris / un acento mínimo": ["#14141A", "#3E424A", "#F2F0EA", "#C23B2E"],
  "Azul Blueprint / Blanco Técnico": ["#0B2B4A", "#10375E", "#DCE8F4", "#F2F6FA"],
  "Negro + Dorado / Marfil": ["#0E1016", "#D4AF37", "#F2ECDD", "#2E3240"],
  "Crema / Oro envejecido / Carbón": ["#F2EAD5", "#B8963E", "#26241E", "#8A7440"],
  "Marfil / Bronce / Negro suave": ["#F2ECDD", "#8A6A3A", "#1E1C22", "#B89858"],
  "Blanco cálido / Oro / Sombra": ["#F6F0E2", "#C9A84C", "#2A2822", "#8A7440"],
  "Rosa Flúor / Azul Eléctrico / Crema": ["#FF4FA3", "#2A3ED8", "#F6EFE2", "#1A1F33"],
  "Naranja Flúor / Azul Tinta / Hueso": ["#FF6A2E", "#1E3A8A", "#F2ECDD", "#141B33"],
  "Rosa Riso / Verde Menta / Crema": ["#FF7BAC", "#59D9A4", "#F6EFE2", "#22352C"],
  "Naranja Neón / Azul Cobalto / Papel": ["#FF7A1A", "#1E4FC2", "#F4F0E4", "#131C36"],
  "Rosa Pastel / Turquesa / Lavanda": ["#F2A7C3", "#7BD4D4", "#C9B8E8", "#3A3244"],
  "Menta / Rosa / Amarillo Pálido": ["#A8E6CF", "#F2B8C6", "#F5E6A8", "#3E3A34"],
  "Lila / Cian / Durazno": ["#C3A8E8", "#7BD4E0", "#F5C6A5", "#3A3444"],
  "Rosa Pálido / Azul Cielo / Crema": ["#F2C4D0", "#A5C8E8", "#F5F0E4", "#383444"]
};

const COLOR_MODES = [
  "Oscuro profundo",
  "Claro editorial",
  "Papel envejecido",
  "Contraste duro",
  "Bicolor monocromo",
  "Medio con acento"
];

function lum(h) {
  h = String(h || "").replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.substr(0, 2), 16) || 0;
  const g = parseInt(h.substr(2, 2), 16) || 0;
  const b = parseInt(h.substr(4, 2), 16) || 0;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexScheme(palStr, mode) {
  const sw = HEX_DE_PALETA[palStr] || ["#14141A", "#3E424A", "#8A8578", "#F2ECDD"];
  const s = [...sw].sort((a, b) => lum(a) - lum(b));
  const d = s[0], m1 = s[1], m2 = s[2] || s[1], m3 = s[3] || s[2], l = s[s.length - 1];
  const M = {
    "Oscuro profundo": { bg: d, dom: m2, acc: l, ink: l },
    "Claro editorial": { bg: l, dom: d, acc: m3, ink: d },
    "Papel envejecido": { bg: m3, dom: d, acc: m2, ink: m1 },
    "Contraste duro": { bg: d, dom: l, acc: m3, ink: l },
    "Bicolor monocromo": { bg: m1, dom: l, acc: m2, ink: d },
    "Medio con acento": { bg: m2, dom: d, acc: l, ink: d }
  };
  const e = { ...(M[mode] || M["Oscuro profundo"]) };
  if (e.acc === e.ink && m3 && m3 !== e.ink) e.acc = m3;
  return e;
}

const POOLS = {
  jerarquia: [
    "Símbolo 70% / Texto 30%",
    "Texto 70% / Símbolo 30%",
    "50 / 50 equilibrado",
    "Símbolo dominante + texto descubrible",
    "Texto dominante + símbolo descubrible",
    "Jerarquía en capas de lectura",
    "Jerarquía radial desde el punto de verdad",
    "Jerarquía ascendente (de abajo hacia arriba)"
  ],
  densidad: ["Heavy", "Balanced", "Minimal"],
  funcionSimbolica: [
    "Transformación / orden",
    "Sistema / proceso",
    "Objeto convertido en metáfora del nicho",
    "Escena / narrativa condensada",
    "Contraste de estados (antes / después)",
    "Crecimiento / raíz / fruto",
    "Emblema de identidad",
    "Arquitectura de la verdad",
    "Presencia / ausencia significativa",
    "Pacto / sello / marca"
  ],
  negativeSpace: [
    "Órbita y vacío central",
    "Bloques de respiración laterales",
    "Campo de tinta con margen vivo",
    "Vacíos verticales que guían la lectura",
    "Cortes diagonales de aire",
    "Aire alrededor del motivo principal",
    "Perímetro simétrico controlado",
    "Vacío como protagonista",
    "Fragmentos separados por silencio visual"
  ],
  intencionEmocional: [
    "Espera activa / tensión",
    "Grito interior contenido",
    "Paz que no es pasividad",
    "Urgencia de la verdad",
    "Intimidad con lo esencial",
    "Confrontación honesta",
    "Asombro ante lo simple",
    "Dolor que se vuelve esperanza",
    "Certeza silenciosa",
    "Llamado a decidir"
  ],
  disposicionObjetos: [
    "objeto principal protagónico y un segundo objeto como eco secundario, separado y menor",
    "dos objetos en equilibrio, ninguno pisa al otro",
    "objeto secundario emerge desde el principal, leído como consecuencia",
    "objeto principal de frente; el secundario asoma detrás, apenas insinuado",
    "objeto principal arriba, secundario abajo anclando la composición",
    "los dos objetos se miran: diálogo visual entre el símbolo y su eco",
    "objeto principal ocupa dos tercios; el secundario es nota final, no competidor",
    "el secundario es la raíz del principal: ambos leídos en un solo gesto"
  ],
  distribucionTexto: [
    "el título nace dentro de la silueta; el texto de apoyo ocupa el vacío negativo que deja el objeto",
    "el texto principal cruza un eje de la composición y el símbolo interrumpe las letras sin perder lectura",
    "los textos siguen dos tramos del contorno del símbolo; el tercero funciona como sello integrado",
    "la frase principal forma el marco visual y el objeto rompe uno de sus lados",
    "el título se desplaza a una columna lateral que comparte retícula con el objeto; el apoyo entra en la imagen",
    "la palabra principal se construye con la materia o las partes visibles del objeto; los otros niveles completan su estructura",
    "el texto se integra en la arquitectura del objeto; cada línea ocupa una superficie real del símbolo",
    "la frase principal sigue una diagonal propia del movimiento del objeto; los textos menores equilibran el lado opuesto",
    "el símbolo divide el bloque tipográfico en dos partes que se leen como una sola frase",
    "el texto de apoyo se entrelaza con un elemento secundario y el título permanece ligado al objeto principal"
  ]
};

const TEXTO_FALLBACK_SECULAR = {
  textoApoyo: [
    "segundo nivel como frase clave real del nicho: dice algo concreto con cuerpo tipográfico amplio y legible",
    "texto de apoyo que explica el símbolo en una línea honesta: sin frase motivacional vacía, con presencia que no se achica frente al título",
    "línea de identidad (origen, oficio, carácter) en letra de diseño, sin perder lectura",
    "segundo texto como llamado directo: claro, concreto, con peso visual propio",
    "frase de fundamento con jerarquía real: ancha, firme, a la altura del título, no como pie de página",
    "texto de apoyo que sostiene el mensaje con tamaño que lo hace parte del diseño"
  ],
  textoTerciario: [
    "tercer nivel: dato de serie o lema corto legible en serif de lectura, cuerpo medio",
    "línea de detalle en tipografía clara, sin imitar microtexto: se lee a un paso",
    "sello de dominio y número de serie como texto editorial, entendible desde el primer golpe de vista",
    "frase corta de identidad como marca al pie, en tipo de lectura",
    "remate breve y con espacio, nunca ilegible"
  ]
};

const OBJECT_BANK_COMMON = [
  "árbol cuyas ramas sostienen lo que importa",
  "faro que sigue encendido sin visitantes",
  "puente que une dos orillas que se creían ajenas",
  "semilla que parte el concreto",
  "fuego que no se apaga en la tormenta",
  "camino estrecho que sube sin pedir permiso",
  "puerta que solo se abre desde dentro",
  "ancla que no toca el fondo pero sostiene",
  "vaso de barro con grietas de oro",
  "río que encuentra su cauce entre piedras",
  "libro que espera abierto en la página justa",
  "escalera sin cima a la vista pero con el siguiente peldaño claro",
  "brújula que señala lo que el dueño eligió",
  "llave que abre la puerta correcta",
  "manto que abriga a quien lo necesita",
  "reloj que marca la hora de empezar",
  "montaña que se escala un paso por día",
  "barca que zarpa con lo puesto",
  "farol que ilumina justo el siguiente paso",
  "huella que marca el camino para el que viene detrás"
];

const STYLE_CANDIDATES = {
  OFICIO: ["Vintage Desgastado", "Retro 70s", "Hand-Drawn", "Folk Popular", "Collage Cut-Paper", "Blueprint / Technical", "Bordado / Puntada", "Risograph", "Kids Storybook", "Minimal Modern"],
  METAS: ["Brutalist", "Cómic / Halftone", "Retro 80s Neon", "Airbrush Smooth", "Stencil Urbano", "Grabado / Linóleo", "Pixel / 8-bit", "Foil Stamp / Metallic", "Retro 70s", "Surf / Skate 90s"],
  COMUNIDAD: ["Folk Popular", "Kids Storybook", "Collage Cut-Paper", "Retro 70s", "Hand-Drawn", "Bordado / Puntada", "Acuarela Suelta", "Risograph", "Vaporwave", "Puff Print / 3D Ink"],
  VIAJE: ["Ukiyo-e / Woodblock", "Acuarela Suelta", "Sumi-e / Tinta Lavada", "Vintage Desgastado", "Paste-up Wheatpaste", "Photomontage / Dada", "Blueprint / Technical", "Hand-Drawn", "Retro 70s", "Minimal Modern"],
  CELEBRACION: ["Folk Popular", "Retro 80s Neon", "Foil Stamp / Metallic", "Papercraft 3D", "Kids Storybook", "Retro 70s", "Airbrush Smooth", "Collage Cut-Paper", "Surf / Skate 90s", "Vaporwave"],
  CALLE: ["Stencil Urbano", "Paste-up Wheatpaste", "Grunge / DIY", "Collage Cut-Paper", "Photomontage / Dada", "Brutalist", "Risograph", "Retro 80s Neon", "Retro 70s", "Y2K / Cyber"],
  RESISTENCIA: ["Stencil Urbano", "Grunge / DIY", "Brutalist", "Dark Tattoo", "Gótico Ornamental", "Irezumi / Wabori", "Grabado / Linóleo", "Retro 80s Neon", "Cómic / Halftone", "Surf / Skate 90s"],
  SONIDO: ["Retro 80s Neon", "Y2K / Cyber", "Vaporwave", "Pixel / 8-bit", "Risograph", "Grunge / DIY", "Stencil Urbano", "Surf / Skate 90s", "Collage Cut-Paper", "Brutalist"],
  CONCRETO: ["Brutalist", "Blueprint / Technical", "Minimal Modern", "Stencil Urbano", "Photomontage / Dada", "Ukiyo-e / Woodblock", "Grunge / DIY", "Y2K / Cyber", "Risograph", "Grabado / Linóleo"],
  pets: ["Kids Storybook", "Hand-Drawn", "Minimal Modern", "Retro 70s", "Acuarela Suelta", "Folk Popular", "Collage Cut-Paper", "Ukiyo-e / Woodblock", "Pixel / 8-bit", "Puff Print / 3D Ink"],
  professions: ["Vintage Desgastado", "Blueprint / Technical", "Brutalist", "Hand-Drawn", "Retro 70s", "Bordado / Puntada", "Folk Popular", "Stencil Urbano", "Minimal Modern", "Risograph"],
  hobbies: ["Hand-Drawn", "Retro 70s", "Minimal Modern", "Kids Storybook", "Acuarela Suelta", "Ukiyo-e / Woodblock", "Pixel / 8-bit", "Collage Cut-Paper", "Vintage Desgastado", "Sumi-e / Tinta Lavada"],
  sarcasm_introvert: ["Brutalist", "Y2K / Cyber", "Retro 80s Neon", "Vaporwave", "Stencil Urbano", "Grunge / DIY", "Risograph", "Minimal Modern", "Pixel / 8-bit", "Photomontage / Dada"],
  fitness_mental: ["Brutalist", "Airbrush Smooth", "Retro 80s Neon", "Y2K / Cyber", "Minimal Modern", "Stencil Urbano", "Cómic / Halftone", "Retro 70s", "Grabado / Linóleo", "Blueprint / Technical"],
  family_milestones: ["Folk Popular", "Kids Storybook", "Hand-Drawn", "Retro 70s", "Acuarela Suelta", "Bordado / Puntada", "Collage Cut-Paper", "Airbrush Smooth", "Papercraft 3D", "Vintage Desgastado"],
  music_fandom: ["Retro 80s Neon", "Y2K / Cyber", "Vaporwave", "Retro 70s", "Risograph", "Stencil Urbano", "Grunge / DIY", "Collage Cut-Paper", "Pixel / 8-bit", "Brutalist"],
  food_drink: ["Folk Popular", "Retro 70s", "Hand-Drawn", "Kids Storybook", "Acuarela Suelta", "Vintage Desgastado", "Bordado / Puntada", "Airbrush Smooth", "Ukiyo-e / Woodblock", "Risograph"],
  outdoors_nature: ["Ukiyo-e / Woodblock", "Acuarela Suelta", "Sumi-e / Tinta Lavada", "Hand-Drawn", "Minimal Modern", "Retro 70s", "Blueprint / Technical", "Vintage Desgastado", "Folk Popular", "Bohemian"],
  retro_nostalgia: ["Retro 70s", "Retro 80s Neon", "Vaporwave", "Vintage Desgastado", "Surf / Skate 90s", "Pixel / 8-bit", "Airbrush Smooth", "Collage Cut-Paper", "Risograph", "Y2K / Cyber"],
  travel_adventure: ["Ukiyo-e / Woodblock", "Acuarela Suelta", "Vintage Desgastado", "Hand-Drawn", "Blueprint / Technical", "Paste-up Wheatpaste", "Photomontage / Dada", "Retro 70s", "Sumi-e / Tinta Lavada", "Minimal Modern"],
  inspirational_clean: ["Minimal Modern", "Hand-Drawn", "Airbrush Smooth", "Foil Stamp / Metallic", "Acuarela Suelta", "Sumi-e / Tinta Lavada", "Bohemian", "Bordado / Puntada", "Papercraft 3D", "Blueprint / Technical"],
  humor_costeno: ["Folk Popular", "Cómic / Halftone", "Retro 70s", "Hand-Drawn", "Collage Cut-Paper", "Risograph", "Surf / Skate 90s", "Grunge / DIY", "Pixel / 8-bit", "Stencil Urbano"],
  humor_colombiano: ["Hand-Drawn", "Retro 70s", "Collage Cut-Paper", "Cómic / Halftone", "Grunge / DIY", "Risograph", "Folk Popular", "Pixel / 8-bit", "Stencil Urbano", "Vintage Desgastado"],
  comida_sabor: ["Folk Popular", "Retro 70s", "Hand-Drawn", "Acuarela Suelta", "Ukiyo-e / Woodblock", "Kids Storybook", "Airbrush Smooth", "Vintage Desgastado", "Bordado / Puntada", "Collage Cut-Paper"],
  musica_ritmo_col: ["Retro 80s Neon", "Y2K / Cyber", "Vaporwave", "Retro 70s", "Risograph", "Stencil Urbano", "Grunge / DIY", "Surf / Skate 90s", "Cómic / Halftone", "Collage Cut-Paper"],
  oficios_emprendimiento_col: ["Vintage Desgastado", "Blueprint / Technical", "Hand-Drawn", "Retro 70s", "Folk Popular", "Bordado / Puntada", "Brutalist", "Risograph", "Collage Cut-Paper", "Minimal Modern"],
  familia_roles_col: ["Folk Popular", "Kids Storybook", "Hand-Drawn", "Acuarela Suelta", "Bordado / Puntada", "Collage Cut-Paper", "Retro 70s", "Airbrush Smooth", "Papercraft 3D", "Vintage Desgastado"],
  deporte_barra_col: ["Brutalist", "Cómic / Halftone", "Retro 80s Neon", "Stencil Urbano", "Airbrush Smooth", "Surf / Skate 90s", "Pixel / 8-bit", "Grabado / Linóleo", "Retro 70s", "Y2K / Cyber"],
  fe_popular_col: ["Folk Popular", "Vitral / Mosaico", "Barroco Ornamental", "Bordado / Puntada", "Grabado / Linóleo", "Hand-Drawn", "Foil Stamp / Metallic", "Vintage Desgastado", "Ukiyo-e / Woodblock", "Acuarela Suelta"],
  naturaleza_territorio_col: ["Ukiyo-e / Woodblock", "Acuarela Suelta", "Sumi-e / Tinta Lavada", "Hand-Drawn", "Minimal Modern", "Bohemian", "Blueprint / Technical", "Retro 70s", "Vintage Desgastado", "Folk Popular"],
  artesania_tradicion_col: ["Folk Popular", "Bordado / Puntada", "Hand-Drawn", "Vintage Desgastado", "Bohemian", "Ukiyo-e / Woodblock", "Acuarela Suelta", "Collage Cut-Paper", "Grabado / Linóleo", "Minimal Modern"],
  carnaval_fiesta: ["Folk Popular", "Retro 80s Neon", "Cómic / Halftone", "Retro 70s", "Airbrush Smooth", "Collage Cut-Paper", "Surf / Skate 90s", "Risograph", "Y2K / Cyber", "Vaporwave"],
  semana_santa_valle: ["Vitral / Mosaico", "Barroco Ornamental", "Grabado / Linóleo", "Gótico Ornamental", "Foil Stamp / Metallic", "Ukiyo-e / Woodblock", "Acuarela Suelta", "Hand-Drawn", "Sumi-e / Tinta Lavada", "Vintage Desgastado"],
  dia_madre_padre: ["Folk Popular", "Kids Storybook", "Hand-Drawn", "Acuarela Suelta", "Bordado / Puntada", "Collage Cut-Paper", "Retro 70s", "Airbrush Smooth", "Minimal Modern", "Papercraft 3D"],
  vacaciones_feria: ["Surf / Skate 90s", "Retro 70s", "Acuarela Suelta", "Ukiyo-e / Woodblock", "Hand-Drawn", "Collage Cut-Paper", "Airbrush Smooth", "Vaporwave", "Retro 80s Neon", "Folk Popular"],
  amor_amistad_indep: ["Folk Popular", "Hand-Drawn", "Collage Cut-Paper", "Retro 70s", "Kids Storybook", "Vaporwave", "Retro 80s Neon", "Airbrush Smooth", "Acuarela Suelta", "Bordado / Puntada"],
  navidad_colombia: ["Folk Popular", "Kids Storybook", "Hand-Drawn", "Collage Cut-Paper", "Airbrush Smooth", "Papercraft 3D", "Vintage Desgastado", "Bordado / Puntada", "Retro 70s", "Acuarela Suelta"],
  valentines: ["Hand-Drawn", "Airbrush Smooth", "Folk Popular", "Collage Cut-Paper", "Retro 70s", "Vaporwave", "Minimal Modern", "Foil Stamp / Metallic", "Kids Storybook", "Papercraft 3D"],
  st_patricks: ["Folk Popular", "Hand-Drawn", "Vintage Desgastado", "Retro 70s", "Collage Cut-Paper", "Kids Storybook", "Bordado / Puntada", "Risograph", "Airbrush Smooth", "Acuarela Suelta"],
  easter: ["Folk Popular", "Kids Storybook", "Hand-Drawn", "Acuarela Suelta", "Collage Cut-Paper", "Bohemian", "Retro 70s", "Papercraft 3D", "Bordado / Puntada", "Airbrush Smooth"],
  mothers_day: ["Folk Popular", "Hand-Drawn", "Acuarela Suelta", "Bordado / Puntada", "Collage Cut-Paper", "Kids Storybook", "Retro 70s", "Airbrush Smooth", "Minimal Modern", "Papercraft 3D"],
  fathers_day: ["Vintage Desgastado", "Hand-Drawn", "Blueprint / Technical", "Retro 70s", "Bordado / Puntada", "Brutalist", "Collage Cut-Paper", "Folk Popular", "Airbrush Smooth", "Minimal Modern"],
  pride: ["Retro 80s Neon", "Vaporwave", "Y2K / Cyber", "Risograph", "Hand-Drawn", "Collage Cut-Paper", "Brutalist", "Airbrush Smooth", "Folk Popular", "Minimal Modern"],
  back_to_school: ["Kids Storybook", "Hand-Drawn", "Retro 70s", "Collage Cut-Paper", "Pixel / 8-bit", "Cómic / Halftone", "Minimal Modern", "Vintage Desgastado", "Folk Popular", "Risograph"],
  halloween: ["Dark Tattoo", "Gótico Ornamental", "Cómic / Halftone", "Grunge / DIY", "Irezumi / Wabori", "Grabado / Linóleo", "Retro 80s Neon", "Collage Cut-Paper", "Stencil Urbano", "Pixel / 8-bit"],
  thanksgiving: ["Folk Popular", "Vintage Desgastado", "Hand-Drawn", "Retro 70s", "Acuarela Suelta", "Bordado / Puntada", "Kids Storybook", "Collage Cut-Paper", "Airbrush Smooth", "Ukiyo-e / Woodblock"],
  christmas: ["Folk Popular", "Kids Storybook", "Foil Stamp / Metallic", "Hand-Drawn", "Collage Cut-Paper", "Airbrush Smooth", "Papercraft 3D", "Vintage Desgastado", "Bordado / Puntada", "Vitral / Mosaico"],
  new_year: ["Retro 80s Neon", "Y2K / Cyber", "Foil Stamp / Metallic", "Airbrush Smooth", "Minimal Modern", "Vaporwave", "Retro 70s", "Risograph", "Brutalist", "Collage Cut-Paper"],
  black_friday: ["Brutalist", "Y2K / Cyber", "Retro 80s Neon", "Minimal Modern", "Vaporwave", "Risograph", "Collage Cut-Paper", "Grunge / DIY", "Pixel / 8-bit", "Stencil Urbano"],
  valentines: ["Hand-Drawn", "Airbrush Smooth", "Folk Popular", "Collage Cut-Paper", "Retro 70s", "Vaporwave", "Minimal Modern", "Foil Stamp / Metallic", "Kids Storybook", "Papercraft 3D"],
  st_patricks: ["Folk Popular", "Hand-Drawn", "Vintage Desgastado", "Retro 70s", "Collage Cut-Paper", "Kids Storybook", "Bordado / Puntada", "Risograph", "Airbrush Smooth", "Acuarela Suelta"],
  easter: ["Folk Popular", "Kids Storybook", "Hand-Drawn", "Acuarela Suelta", "Collage Cut-Paper", "Bohemian", "Retro 70s", "Papercraft 3D", "Bordado / Puntada", "Airbrush Smooth"],
  mothers_day: ["Folk Popular", "Hand-Drawn", "Acuarela Suelta", "Bordado / Puntada", "Collage Cut-Paper", "Kids Storybook", "Retro 70s", "Airbrush Smooth", "Minimal Modern", "Papercraft 3D"],
  fathers_day: ["Vintage Desgastado", "Hand-Drawn", "Blueprint / Technical", "Retro 70s", "Bordado / Puntada", "Brutalist", "Collage Cut-Paper", "Folk Popular", "Airbrush Smooth", "Minimal Modern"],
  pride: ["Retro 80s Neon", "Vaporwave", "Y2K / Cyber", "Risograph", "Hand-Drawn", "Collage Cut-Paper", "Brutalist", "Airbrush Smooth", "Folk Popular", "Minimal Modern"],
  back_to_school: ["Kids Storybook", "Hand-Drawn", "Retro 70s", "Collage Cut-Paper", "Pixel / 8-bit", "Cómic / Halftone", "Minimal Modern", "Vintage Desgastado", "Folk Popular", "Risograph"],
  halloween: ["Dark Tattoo", "Gótico Ornamental", "Cómic / Halftone", "Grunge / DIY", "Irezumi / Wabori", "Grabado / Linóleo", "Retro 80s Neon", "Collage Cut-Paper", "Stencil Urbano", "Pixel / 8-bit"],
  thanksgiving: ["Folk Popular", "Vintage Desgastado", "Hand-Drawn", "Retro 70s", "Acuarela Suelta", "Bordado / Puntada", "Kids Storybook", "Collage Cut-Paper", "Airbrush Smooth", "Ukiyo-e / Woodblock"],
  christmas: ["Folk Popular", "Kids Storybook", "Foil Stamp / Metallic", "Hand-Drawn", "Collage Cut-Paper", "Airbrush Smooth", "Papercraft 3D", "Vintage Desgastado", "Bordado / Puntada", "Vitral / Mosaico"],
  new_year: ["Retro 80s Neon", "Y2K / Cyber", "Foil Stamp / Metallic", "Airbrush Smooth", "Minimal Modern", "Vaporwave", "Retro 70s", "Risograph", "Brutalist", "Collage Cut-Paper"],
  black_friday: ["Brutalist", "Y2K / Cyber", "Retro 80s Neon", "Minimal Modern", "Vaporwave", "Risograph", "Collage Cut-Paper", "Grunge / DIY", "Pixel / 8-bit", "Stencil Urbano"]
};

/* ============================================================
   STYLE_POOLS — Instrucciones de dirección artística por estilo
   Vocabulario 100% comercial/secular. Sin referencias religiosas.
   ============================================================ */

const STYLE_POOLS = {
  "Bohemian": {
    arquitectura: ["sello botánico central con margen orgánico", "marco de enredadera asimétrica", "tapiz vertical colgante con zonas de respiración", "composición tipo herbario con etiquetas", "guirnalda que enmarca sin cerrar", "estructura de pétalos superpuestos en capas", "altar de mesa con elementos naturales", "corona vegetal abierta hacia arriba"],
    composicion: ["asimétrica orgánica con peso inferior", "circular abierto hacia un lado", "vertical con elementos que caen", "fragmentada en zonas de densidad distinta", "flujo de izquierda a derecha como crecimiento", "espiral suave desde el centro"],
    textoPrincipal: ["lettering manual que crece como tallo", "título formado por ramas entrelazadas", "palabra única como centro de una flor abierta", "texto en arco suave entre hojas", "lettering que parece escrito con tinta de planta", "título que brota desde la base del símbolo"],
    textoApoyo: ["segundo nivel como cita de herbario en tipografía amplia y legible: se lee desde lejos, no es una etiqueta diminuta", "frase clave del nicho que sigue el contorno de una hoja con peso suficiente para sostenerse junto al título", "texto de apoyo como raíz visual del título: ancho, firme, terroso, presente", "línea de fundamento en tinta vegetal con cuerpo medio-alto, integrada al panel botánico", "escritura que se lee como parte del dibujo, con tamaño de diseño y no de pie de página", "segundo texto como suelo del que nace el símbolo: sólido, legible, sin perder carácter", "frase de identidad que bordea el marco sin encogerse: ocupa su propia franja", "cita de oficio tejida entre tallos con cuerpo tipográfico considerable"],
    textoTerciario: ["tercer nivel: dato de serie corto con serifa de campo, legible sin esfuerzo", "apéndice de identidad en cinta vegetal, cuerpo medio, honra la página", "marca de colección (serie y número) como sello botánico en tipografía de lectura", "frase corta de cierre como ex libris vegetal, clara y ancha", "tríptico de identidad en caligrafía de herbario: ORIGEN · OFICIO · IMPACTO, cada uno legible"],
    tecnica: ["Botanical Illustration", "Hand-Drawn línea fina", "Watercolor Texture", "Línea suelta tipo tinta diluida", "Grabado botánico", "Gouache mate"],
    relacion: ["texto crece desde el símbolo como una planta", "símbolo enmarca el texto de forma natural", "texto y símbolo se entrelazan sin competir", "texto de apoyo actúa como suelo del que nace el símbolo"]
  },
  "Anime / Manga": {
    arquitectura: ["panel dinámico diagonal a toda página", "splash page con líneas de velocidad", "viñeta rota con bordes que se quiebran", "marco tipo cómic con zona de impacto", "composición de acción congelada en un instante", "doble página de revelación"],
    composicion: ["diagonal dramática de esquina a esquina", "close-up expresivo con fondo de energía", "figura cortada por el borde del panel", "vertical ascendente con perspectiva forzada", "explosión radial desde el punto de verdad", "contrapicado que eleva el símbolo"],
    textoPrincipal: ["onomatopeya convertida en título de impacto", "título que irradia como efecto de energía", "texto quebrado en ángulo, tipo grito", "palabra clave dentro de una explosión de líneas", "título que cruza el panel como una hoja", "lettering que vibra con el golpe"],
    textoApoyo: ["línea de identidad como sello de escena en la base, en cuerpo claro y legible desde el primer golpe", "texto de apoyo como crédito de verdad: franja propia, ancha, sin compactarse", "segundo nivel como subtítulo de momento decisivo: amplio, dinámico, con aire", "frase interna del personaje simbólico en globo de diálogo con tipografía de lectura cómoda", "fundamento colocado como marca de agua de la escena, aun así legible y con cuerpo", "segunda línea en degradado de velocidad con tamaño de diseño, sin achicarse", "frase destacada en banner de impacto: ancho, presente, imposible de ignorar", "texto de cierre en viñeta baja con cuerpo suficiente para no perderse en la acción"],
    textoTerciario: ["tercer nivel como subtítulo de episodio: dato de serie en caja, legible", "apunte de creador en esquina con peso tipográfico real", "marca de arco (número de capítulo) como sello de página entendible a un vistazo", "frase corta de identidad en letra de rótulo clara", "tríptico de identidad en tres viñetas: ORIGEN, OFICIO, IMPACTO, cada uno con su espacio"],
    tecnica: ["Cel-shading", "Speed Lines", "Ink + Screentone", "Line Weight variable", "Screen tone dramático", "Ink wash dinámico"],
    relacion: ["texto es parte del efecto de energía del símbolo", "símbolo rompe el marco, el texto queda como ancla", "texto grita desde el gesto del símbolo", "texto de apoyo ancla la escena a la verdad del nicho"]
  },
  "Retro 70s": {
    arquitectura: ["cartel de cine setentero con zona de título", "insignia circular con margen de textura", "banda ondulada que estructura el layout", "etiqueta de disco de vinilo expandida", "póster de concierto con capas de información", "marco de tarot reinterpretado"],
    composicion: ["central con marco circular abierto", "capas tipo póster de concierto", "horizontal con rayos o degradado de fondo", "simétrica con peso en el tercio superior", "degradado tipo atardecer como estructura", "bandas horizontales de color"],
    textoPrincipal: ["texto curvo tipo banda de arcoíris", "lettering script vintage sobre cinta", "título apilado con sombra duplicada retro", "palabra única en letras infladas 3D", "título con contorno doble tipo neón vintage", "lettering bloque con textura de impresión"],
    textoApoyo: ["frase clave como pie de cartel de cine: ancho, centrado, legible a distancia", "texto de apoyo en estilo de créditos de imprenta con cuerpo generoso", "segundo nivel como sello de autenticidad: cinta o placa con tipografía de lectura", "fundamento colocado como garantía de empaque retro, grande y claro", "línea que se lee como eslogan de identidad, no de producto: con aire y peso", "frase destacada en banda de arcoíris con tipografía de cartel, sin microletra", "segundo texto como letra de canción en la contraportada del disco: legible", "frase de confianza en el oficio en sello de empaque, bien legible"],
    textoTerciario: ["tercer nivel: número de serie y dominio como ticket de cine, tipografía de lectura", "dato de serie en marquesina de cartel, clara y ancha", "apunte editorial en cinta: una frase por extenso, sin comprimirse", "tríptico de identidad en tres sellos redondos, cada uno rotulado", "pie de imprenta con fecha de edición: texto editorial real"],
    tecnica: ["Halftone grueso", "Textura Riso Print", "Línea gruesa + relleno plano", "Grano de película Súper 8", "Print offset envejecido", "Screen print de 2-3 tintas"],
    relacion: ["texto envuelve al símbolo como una cinta", "símbolo y texto comparten el mismo marco circular", "texto flota sobre los rayos, símbolo al centro", "texto de apoyo cierra el cartel como verdad final"]
  },
  "Dark Tattoo": {
    arquitectura: ["tótem lineal vertical ritual", "emblema central con peso de grabado", "escudo partido en dos mitades narrativo", "composición de placa metálica grabada", "estructura de sello ceremonial", "altar de tinta negra"],
    composicion: ["eje vertical estricto", "simétrica ritual con tensión central", "radial desde un punto de tinta", "fragmentada con líneas de corte", "peso inferior que ancla el símbolo", "composición de sello circular denso"],
    textoPrincipal: ["texto siguiendo el contorno del símbolo", "título en banner tipo tatuaje clásico", "palabra en gótico condensado como marca de piel", "título fracturado y vuelto a unir", "lettering que parece tallado en la misma sesión", "texto como cicatriz legible"],
    textoApoyo: ["frase clave grabada como inscripción en la base: cuerpo fuerte, legible sobre la tinta", "texto de apoyo que funciona como cicatriz legible: ancho, firme, con presencia", "segundo nivel en cinta enrollada con peso real: las palabras se leen al vuelo", "fundamento como placa metálica bajo el emblema: tipografía de grabado grande", "línea que se lee como voto, no como decoración: clara a un paso", "frase destacada en pergamino de piel, con cuerpo de letra legible", "segundo texto dentro del símbolo: entre líneas, sí, pero respetado por el lector", "frase de identidad en borde de tótem: legible, digna del grabado"],
    textoTerciario: ["tercer nivel: sello de serie y dominio grabado en placa, entendible", "dato de serie en cinta final: corta y clara", "voto breve de compromiso en letras de memorial, legible", "tríptico de identidad en tres placas: ORIGEN, OFICIO, IMPACTO, cada una sellada", "número de la serie como marca de piel: tipografía que se lee"],
    tecnica: ["Tattoo Linework", "Engraving", "Ink Drawing con crosshatch denso", "Dotwork", "Blackwork selectivo", "Woodcut moderno"],
    relacion: ["texto grabado como parte de la textura del símbolo", "símbolo oculta y revela el texto entre sus líneas", "texto de apoyo ancla el ritual a la verdad", "texto y símbolo comparten la misma grieta de significado"]
  },
  "Brutalist": {
    arquitectura: ["sistema modular en grilla estricta", "bloque tipográfico masivo como estructura", "panel tipo señalética industrial", "andamio / contenedor como marco", "estructura de hormigón con una sola grieta de luz", "torre de bloques desplazados"],
    composicion: ["modular en bloques de peso desigual", "asimétrica con bordes cortados", "superposición de capas rígidas", "cuadrícula rota con un bloque desplazado", "peso extremo en un solo eje", "composición de cartel de obra"],
    textoPrincipal: ["tipografía gigante recortada por el símbolo", "texto en bloque compacto sin aire innecesario", "título apilado como ladrillos", "palabra a ancho completo de margen a margen", "título como sello de advertencia industrial", "lettering stencil de gran formato"],
    textoApoyo: ["frase clave como código de especificación: mega tipografía industrial, clara como un letrero", "texto de apoyo en formato de ficha técnica: sin ruido, cuerpo grande, puesto con intención", "segundo nivel como número de serie de la verdad: bloque legible, no patrón decorativo", "fundamento colocado como sello de conformidad: estampado, firme, legible", "línea que funciona como advertencia, no adorno: letra que da orden al ojo", "frase destacada en cartel de obra: texto de señalización real, alto contraste", "segundo texto en placa de concreto con tipografía de señal: presente y claro", "frase de identidad en banda industrial: horizontal, ancha, sin comprimirse"],
    textoTerciario: ["tercer nivel: número de serie del sistema en letra stencil, legible", "dato de serie en etiqueta de código: texto real, no patrón", "apunte de especificación en tipografía de fábrica, lectura cómoda", "tríptico de identidad en tres bloques: ORIGEN, OFICIO, IMPACTO, cada bloque rotulado", "marca de dominio en sello de control de calidad: entendible a la primera"],
    tecnica: ["Brutalist Block", "Geometric Construction", "Screenprint Distress", "Risografía de un solo color", "Stencil industrial", "Concrete texture + type"],
    relacion: ["texto funciona como estructura, el símbolo se apoya en él", "texto rompe el símbolo en bloques", "símbolo y texto comparten la misma grilla", "texto de apoyo es la etiqueta de verdad sobre el sistema"]
  },
  "Y2K / Cyber": {
    arquitectura: ["interfaz / HUD como marco completo", "grid digital con nodos de conexión", "terminal de código como fondo estructural", "ventana de sistema con barras de título", "escáner / radar como composición circular", "desktop de sistema operativo simbólico"],
    composicion: ["capas tipo ventanas de sistema", "fragmentada tipo glitch controlado", "circular tipo escáner con datos", "isométrica tipo mapa de red", "jerarquía de paneles de información", "overlay de datos sobre símbolo"],
    textoPrincipal: ["texto tipo terminal monoespaciado con glitch", "título con efecto de interferencia duplicado", "texto que se decodifica desde código", "palabra clave como notificación del sistema", "título con efecto de barra de carga", "lettering pixel / bitmap"],
    textoApoyo: ["línea de log del sistema en terminal, pero en cuerpo tipográfico amplio y legible", "texto de apoyo en metadata de archivo: claro, sin parpadeo que lo oculte", "segundo nivel como comentario de código legítimo: sale del fondo, se lee", "fundamento como timestamp de la verdad: cronología visible y legible", "output final del proceso en banner de sistema: alto contraste, lectura fácil", "frase destacada como ventana emergente: texto grande dentro del panel", "segundo texto como estado de marca en barra de progreso: rotulado y claro", "frase de identidad en HUD central: tipografía de interfaz con cuerpo de lectura"],
    textoTerciario: ["tercer nivel: identificación de archivo en etiqueta, legible a un vistazo", "dato de serie como línea de terminal destacada, sin microglitch que la borre", "marca de versión y dominio en barra de estado, tipografía de lectura", "tríptico de identidad en tres pestañas del sistema: ORIGEN, OFICIO, IMPACTO, rotuladas", "frase corta de cierre como notificación, clara y ancha"],
    tecnica: ["Glitch controlado", "Geometric Construction", "Halftone digital", "Chromatic Aberration", "UI / HUD rendering", "Scanline + noise"],
    relacion: ["texto se decodifica desde el símbolo como interfaz", "símbolo y texto comparten la misma grilla digital", "texto flota como notificación sobre el símbolo", "texto de apoyo es el log que confirma la verdad"]
  },
  "Hand-Drawn": {
    arquitectura: ["página de cuaderno con notas al margen", "ilustración suelta sin marco rígido", "composición tipo carta escrita a mano", "hoja de agenda con tachaduras significativas", "boceto de proceso con capas visibles", "mapa dibujado a mano con ruta marcada"],
    composicion: ["suelta, sin ejes rígidos", "asimétrica íntima", "viñeta central con anotaciones alrededor", "flujo que sigue el gesto de la mano", "espacio de respiración tipo margen de cuaderno", "capas de boceto superpuestas"],
    textoPrincipal: ["lettering manual imperfecto y honesto", "título tachado y reescrito (corrección de verdad)", "texto como entrada de diario personal", "palabra única subrayada dos veces a mano", "título escrito como promesa personal", "lettering que parece pensado en voz alta"],
    textoApoyo: ["frase clave como nota al margen con flecha, en tamaño de escritura real y legible", "texto de apoyo añadido después con peso: subrayado, sin perder lectura", "segundo nivel como post-it dibujado que carga verdad: letra clara, sin encogerse", "fundamento como firma al final de una carta: grande, a mano, entendible", "línea que se lee como recordatorio, no adorno: con tinta firme", "frase destacada como entrada de diario: palabra por palabra, legible", "segundo texto tachado y reescrito (corrección de verdad): lo corregido se entiende", "frase de identidad en borde de página: manuscrita con cuerpo"],
    textoTerciario: ["tercer nivel: nombre de serie y dominio como anotación al pie, clara", "dato de serie como post-it: letra limpia, se lee sin estrujar", "nota de compromiso como sello manuscrito legible", "tríptico de identidad en tres apuntes: ORIGEN, OFICIO, IMPACTO, cada uno rotulado", "fecha de edición como firma del artista: entendible"],
    tecnica: ["Hand-Drawn", "Ink Drawing suelto", "Etching ligero", "Carboncillo", "Lápiz con presión variable", "Brush pen imperfecto"],
    relacion: ["texto es una nota junto al dibujo, con función real", "símbolo y texto parecen escritos en la misma sesión", "texto corrige o completa el símbolo", "texto de apoyo ancla el boceto a la verdad del nicho"]
  },
  "Minimal Modern": {
    arquitectura: ["símbolo de vacío centrado con margen generoso", "composición de una sola línea estructural", "grid limpio de dos zonas", "una forma geométrica flotando con propósito", "estructura de ausencia controlada", "marco invisible definido solo por aire"],
    composicion: ["negative space dominante", "central minimalista", "asimétrica con mucho aire", "peso extremo en un solo punto", "vacío como protagonista activo", "equilibrio de una sola tensión"],
    textoPrincipal: ["microtipografía funcional de una sola palabra", "texto alineado al borde con precisión", "palabra en peso ultra ligero, muy controlada", "solo la frase esencial, sin adorno", "tipografía que desaparece hasta que se necesita", "lettering de un solo trazo"],
    textoApoyo: ["única línea secundaria precisa: cuerpo medio, funcional, con autoridad", "texto de apoyo que funciona como firma de verdad: sobrio, amplio, legible", "segundo nivel casi invisible pero legible: existe porque carga peso conceptual", "fundamento integrado al símbolo con tipografía clara y contenida", "línea de cierre en una sola frase: ancho, aire, y lectura perfecta", "frase destacada como única segunda línea: sin adorno, con verdad", "texto de apoyo flotando con margen generoso: presencia en silencio", "frase esencial en peso medio: lo mínimo con todo el peso"],
    textoTerciario: ["tercer nivel: dato de serie esencial, mínima pero legible", "dominio y número de serie como funda tipográfica: claro y discreto", "una palabra de cierre como remate, en tipografía de lectura", "tríptico de identidad en tres palabras: ORIGEN · OFICIO · IMPACTO, separadas con aire", "línea de continuidad de la serie, breve, en tipo legible"],
    tecnica: ["Monoline", "Geometric Construction", "Line Art de un solo trazo", "Vector puro sin textura", "Etched line", "Blind emboss + un trazo"],
    relacion: ["texto y símbolo separados por espacio deliberado", "símbolo explica el texto sin decorarlo", "texto de apoyo es la única ancla verbal necesaria", "el símbolo y el texto de apoyo forman un solo sistema"]
  },
  "Vitral / Mosaico": {
    arquitectura: ["ventanal gótico completo con plomo visible", "rosetón circular con escena central", "mosaico de teselas irregulares con junta de plomo", "tríptico de tres paneles de vidrio", "ventanal en arco ojival con margen de piedra", "fragmento de vitral con el plomo cruzando el símbolo"],
    composicion: ["radial desde el centro del rosetón", "simétrica ceremonial con eje vertical", "fragmentada en teselas que se leen como un todo", "arco ojival que estructura el peso hacia arriba", "bandas de color translúcido que cruzan el símbolo", "central con luz atravesando desde atrás"],
    textoPrincipal: ["título en vidrio emplomado: letras como piezas de vitral", "texto tallado en la piedra del dintel", "lettering con brillo de vidrio soplado", "título integrado a la trama del mosaico, letra por tesela", "palabra que brilla retroiluminada en el corazón del ventanal", "texto en filacteria de vitral, banda legible"],
    textoApoyo: ["frase clave en banda de vidrio claro: cuerpo amplio, se lee contra la luz", "texto de apoyo como inscripción en el dintel de piedra: ancho, firme, tallado para durar", "segundo nivel en filacteria inferior con cuerpo de lectura, no de adorno", "fundamento como leyenda del vitral: placa de piedra bajo el ventanal, legible a un paso", "línea de verdad entre dos paneles: el plomo no la rompe, la sostiene", "frase destacada en vidrio de color claro con cuerpo tipográfico de diseño", "segundo texto como nombre grabado en la base del altar del ventanal", "frase de cierre en teselas grandes de vidrio pálido: cada palabra entera, nunca fragmentada"],
    textoTerciario: ["tercer nivel: dato de serie en piedra tallada, legible", "sello de serie como marca del vidriero en una esquina del panel", "tríptico de identidad en tres medallones: ORIGEN, OFICIO, IMPACTO, cada uno rotulado", "fecha de edición como inscripción de consagración", "nombre del dominio en la junta de piedra, en letra de lectura"],
    tecnica: ["Stained Glass render", "Mosaico bizantino", "Plomo + vidrio de color", "Vidrio emplomado con luz transmitida", "Teselado irregular", "Rosetón gótico"],
    relacion: ["el texto vive dentro del vitral como otra pieza más", "la luz atraviesa el símbolo y llega al texto", "texto y símbolo comparten la misma armadura de plomo", "texto de apoyo es la piedra que sostiene el vidrio"]
  },
  "Grabado / Linóleo": {
    arquitectura: ["matriz de linóleo a sangre total", "marco de taco con borde irregular de gubia", "composición de grabado en dos planchas (negro + acento)", "viñeta central con virutas del tallado visibles", "friso horizontal tipo xilografía antigua", "bloque de madera tallada como único campo"],
    composicion: ["alto contraste blanco/negro sin grises", "figura central tallada con gruesos trazos de gubia", "diagonal de talla que guía la lectura", "simétrica rústica con peso en el centro", "textura de veta de madera atravesando el símbolo", "radial de cuchillas alrededor del punto de verdad"],
    textoPrincipal: ["título tallado a cuchillo en el mismo taco", "lettering en negativo: letras blancas dentro de bloque negro", "texto con marca de gubia en cada trazo", "título en madera tallada con astillas visibles", "palabra grabada al reverso, espejada como matriz", "lettering de trazo ancho tipo cartel de mercado"],
    textoApoyo: ["frase clave tallada en banda inferior: trazo ancho, legible sin esfuerzo", "texto de apoyo como cartel de mercado: letras grandes, madera honesta", "segundo nivel en negativo sobre bloque negro: cada palabra entera", "fundamento grabado como inscripción de dintel: firme, a un paso se lee", "línea de verdad con interlineado de imprenta antigua, cuerpo generoso", "frase destacada en filacteria tallada, banda sólida", "segundo texto como marca del grabador: clara, con presencia", "frase de cierre en letras de sierra y formón: nada de microtalla"],
    textoTerciario: ["tercer nivel: dato de serie en letra de colofón, legible", "sello del taller grabado en esquina con nombre de serie", "tríptico de identidad en tres viñetas talladas rotuladas", "colofón de imprenta con dominio y número", "inscripción breve de compromiso en el margen del taco"],
    tecnica: ["Linocut", "Woodcut", "Xilografía", "Grabado a buril", "Block print de 2 tintas", "Talla directa con gubia"],
    relacion: ["texto y símbolo salen del mismo taco: una sola talla", "el negro del grabado envuelve al texto como tierra", "texto de apoyo es el borde del taco que contiene la escena", "texto tallado forma parte de la veta de la madera"]
  },
  "Gótico Ornamental": {
    arquitectura: ["página de incunable con orla completa", "arco ojival con tracería gótica", "marco victoriano de hierro forjado", "emblema heráldico con yelmo y filacteria", "catedral de una sola nave en silueta", "medallón con cenefa de tréboles y agujas"],
    composicion: ["simétrica heráldica estricta", "vertical ascensional hacia la aguja", "central densa con aire tallado en los márgenes", "escudo partido en cuartos", "peso superior con caída de luz al centro", "estructura de portada de catedral"],
    textoPrincipal: ["blackletter denso como título principal", "título en fraktur con capitular iluminada", "palabra en letra gótica con florituras de hierro", "título grabado en placa de bronce", "lettering de incunable con tinta negra profunda", "texto gótico dentro de filacteria flotante"],
    textoApoyo: ["frase clave en romana de imprenta antigua: contraste con la gótica, cuerpo amplio y legible", "texto de apoyo como glosa al margen del incunable: letra de lectura, nunca microtexto", "segundo nivel en versalitas espaciadas bajo el título: aire ceremonial", "fundamento como inscripción de lápida: claro, solemne, legible a un paso", "línea de verdad en banda inferior con cuerpo de rotulación de templo", "frase destacada en letra redonda de catálogo: palabra por palabra legible", "segundo texto como leyenda heráldica en la filacteria inferior", "frase de cierre en versalitas doradas sobre negro: presencia plena"],
    textoTerciario: ["tercer nivel: dato de serie en letra de catálogo, legible", "sello de serie como marca de imprenta antigua", "tríptico de identidad en tres medallones góticos rotulados", "colofón con dominio y número en letra de taller", "inscripción de dedicatoria en el margen"],
    tecnica: ["Blackletter typography", "Grabado victoriano", "Heráldica lineal", "Tinta negra + oro plano", "Iluminación de capitular", "Hierro forjado"],
    relacion: ["la letra gótica ES el símbolo: arquitectura de tinta", "el texto de apoyo contrasta y ordena la densidad gótica", "símbolo y texto comparten la solemnidad del mismo hierro", "texto de apoyo es el aire que respira el negro"]
  },
  "Stencil Urbano": {
    arquitectura: ["plantilla sobre muro con goteo controlado", "capas de stencil apiladas con registro visible", "cartel pegado con cinta en las esquinas", "mega plantilla de una sola pieza", "spray con borde duro y halo de pintura", "plantilla rasgada que revela capa anterior"],
    composicion: ["central con impacto directo", "asimétrica de calle con margen de muro", "diagonal de spray que cruza el lienzo", "superposición de capas urbanas", "símbolo gigante cortado por el borde", "contrapicado de muro"],
    textoPrincipal: ["título en stencil de una pieza con puentes visibles", "lettering de spray con goteo medido", "palabra estarcida a gran formato", "título en dos capas de color desregistradas", "texto de plantilla militar reinterpretado", "lettering con textura de rodillo"],
    textoApoyo: ["frase clave en stencil de segunda capa: cuerpo grande, se lee desde la acera", "texto de apoyo como pancarta pegada: ancha, tensa, legible", "segundo nivel en spray fino pero de cuerpo de diseño, no de firma", "fundamento como serigrafía de tela: tintas planas, letras firmes", "línea de verdad estarcida en banda inferior: alto contraste", "frase destacada en cartel de obra urbana: palabra por palabra legible", "segundo texto en plantilla desregistrada: roja sobre negra, cuerpo pleno", "frase de cierre con borde duro de plantilla: sin difuminar"],
    textoTerciario: ["tercer nivel: dato de serie en stencil pequeño pero legible", "sello de serie como tag de taller ordenado", "tríptico de identidad en tres plantillas rotuladas", "número de dominio rociado en esquina, lectura clara", "fecha de edición como sello de censura reinterpretado"],
    tecnica: ["Stencil multicolor", "Spray con halo", "Serigrafía urbana", "Rodillo de espuma", "Capas desregistradas", "Textura de muro"],
    relacion: ["el texto es parte de la plantilla: mismos puentes, mismo golpe", "el símbolo parte el texto y ambos quedan de pie", "texto de apoyo es el muro que sostiene el spray", "texto y símbolo comparten la misma mano urgente"]
  },
  "Cómic / Halftone": {
    arquitectura: ["página de cómic con viñeta principal dominante", "splash page con título de cabecera", "viñeta partida con zona de impacto", "panel de acción con bordes gruesos", "composición de portada con logo arriba", "doble viñeta de revelación"],
    composicion: ["diagonal de acción con líneas de velocidad", "close-up con tramas de puntos al 40%", "contrapicado heroico", "central con estallido radial", "figura cortada por el borde de viñeta", "perspectiva forzada hacia el símbolo"],
    textoPrincipal: ["título en lettering de cómic con contorno y sombra dura", "palabra en burbuja de grito con trazo grueso", "texto en onomatopeya gigante", "título de cabecera con perspectiva", "lettering con relleno de trama y borde negro", "texto que rompe la viñeta"],
    textoApoyo: ["frase clave en caja de narrador: cuerpo de lectura, borde fino", "texto de apoyo como subtítulo de escena: ancho, claro", "segundo nivel en burbuja de pensamiento con tipografía legible", "fundamento como caption de apertura: palabra por palabra con cuerpo de diseño", "línea de verdad en banda inferior del panel: legible a un paso", "frase destacada en recuadro amarillo de cómic clásico", "segundo texto en globo secundario: cuerpo suficiente", "frase de cierre con contorno blanco sobre trama: presencia total"],
    textoTerciario: ["tercer nivel: dato de serie en caja de esquina, legible", "sello de serie como número del cómic", "tríptico de identidad en tres viñetas rotuladas", "créditos de guion y arte como marca de dominio", "apunte editorial en margen con peso real"],
    tecnica: ["Halftone de puntos", "Contorno negro grueso", "Color plano saturado", "Screentone", "Sombra dura de 2 niveles", "Tramas de imprenta"],
    relacion: ["el texto entra en la viñeta como otro personaje", "el símbolo rompe el panel y el texto lo ancla", "texto de apoyo es el narrador que interpreta la escena", "el estallido del símbolo deja sitio exacto a la verdad escrita"]
  },
  "Pixel / 8-bit": {
    arquitectura: ["pantalla de videojuego con HUD mínimo", "escena de 8-bit con cielo degradado en bandas", "sprite central en retícula visible", "mapa de niveles con la meta como objetivo", "diálogo de juego en caja inferior", "game over convertido en anuncio de vida"],
    composicion: ["retícula estricta de píxeles", "central con sprite protagonista", "bandas horizontales de cielo en escalerilla", "isométrica de bloques", "simétrica de menú", "perspectiva de carretera pixelada hacia el horizonte"],
    textoPrincipal: ["título en fuente pixel de 8-bit gruesa", "texto de menú principal con cursor parpadeante", "palabra como score máximo (HI-SCORE)", "título en caja de diálogo con borde pixel", "lettering pixel con sombra dura de 1 bit", "texto de insert coin convertido en invitación"],
    textoApoyo: ["frase clave en caja de diálogo con cuerpo pixel legible: nada de fuente ilegible", "texto de apoyo como tutorial del juego: instrucción clara, cuerpo real", "segundo nivel en menú de opciones: línea por línea, se lee", "fundamento como texto de victoria (YOU WIN) con cuerpo de diseño", "línea de verdad en banda inferior tipo HUD: contraste alto", "frase destacada en caja de texto retro, palabra por palabra", "segundo texto como subtítulo de pantalla de carga, legible", "frase de cierre en fuente pixel mediana: cada letra entera"],
    textoTerciario: ["tercer nivel: dato de serie en barra de estado, legible", "sello de serie como copyright de cartucho reinterpretado", "tríptico de identidad en tres iconos del inventario rotulados", "número de nivel como número de set: legible", "fecha de edición en pantalla de guardado"],
    tecnica: ["Pixel art 8-bit", "Dithering controlado", "Paleta limitada de 8-16 colores", "Fuente bitmap", "Sprites con contorno de 1px", "Degradado en bandas"],
    relacion: ["el texto es parte del HUD: función real, lectura real", "el sprite del símbolo deja el centro y el texto lo titula", "texto de apoyo es la instrucción que interpreta el juego", "todo pixelado, nada ilegible"]
  },
  "Acuarela Suelta": {
    arquitectura: ["mancha acuosa central con margen de papel en blanco", "lavado de fondo con reserva del símbolo", "composición de sketchbook de viaje", "dos lavados que se encuentran formando el símbolo", "ventana de agua enmarcada por el papel", "capa de sal y grano visible"],
    composicion: ["vacío protagonista: la mancha ocupa un tercio", "flujo de agua de arriba a abajo", "asimétrica húmeda con borde seco a un lado", "central con halo de humedad", "diagonal de pigmento que guía al texto", "equilibrio entre mancha y silencio de papel"],
    textoPrincipal: ["lettering con borde húmedo: el agua muerde la letra", "título en tinta china sobre el lavado seco", "palabra reservada en blanco dentro de la mancha", "texto con salpicaduras controladas", "título en sepia con borde difuso controlado", "lettering de pincel redondo con presión variable"],
    textoApoyo: ["frase clave en tinta seca sobre papel: cuerpo claro, contraste seguro", "texto de apoyo debajo del lavado, sobre papel limpio: legibilidad total", "segundo nivel en sepia medio: cuerpo de lectura", "fundamento como pie de obra de acuarelista: firma y verdad juntas", "línea de cierre en peso medio sobre la zona clara", "frase destacada en tinta china: palabra por palabra nítida", "segundo texto con subrayado de pincel: presencia cálida", "frase de identidad sobre reserva blanca: la luz del papel sostiene la palabra"],
    textoTerciario: ["tercer nivel: dato de serie en tinta fina legible", "sello de serie como sello de artista en rojo", "tríptico de identidad en tres lavados rotulados", "fecha de edición como data de obra", "nombre del dominio en letra de catálogo"],
    tecnica: ["Acuarela suelta", "Wet-on-wet controlado", "Reserva de papel", "Tinta china sobre lavado", "Sal y grano", "Papel de algodón texturizado"],
    relacion: ["el texto vive en la zona seca: la mancha lo respeta", "la luz del papel es la que ilumina la palabra", "símbolo y texto comparten el mismo agua y la misma pausa", "texto de apoyo es la orilla que contiene el río de pigmento"]
  },
  "Sumi-e / Tinta Lavada": {
    arquitectura: ["pergamino vertical con tres zonas de aire", "un solo trazo grueso como columna del diseño", "símbolo arriba, texto abajo, vacío entre ambos", "círculo enso abierto como marco", "dos lavados de densidad opuesta", "campo de tinta con un trazo de luz"],
    composicion: ["vacío activo: menos es más", "asimétrica con peso en un solo gesto", "vertical de respiración oriental", "el trazo termina donde empieza la verdad", "equilibrio de una sola tensión", "silencio de papel como marco"],
    textoPrincipal: ["caligrafía de un solo gesto con pincel cargado", "título en trazo seco (kasure) visible", "palabra en tinta negra profunda con punta seca al final", "lettering de pincel con ritmo de respiración", "título que nace del mismo trazo del símbolo", "palabra con entrada de pincel marcada"],
    textoApoyo: ["frase clave en tinta media con cuerpo amplio: el vacío la honra", "texto de apoyo en columna vertical o banda horizontal: siempre legible", "segundo nivel en gris de lavado claro pero con peso de diseño", "fundamento en tinta seca: cada palabra entera", "línea de verdad bajo el enso: breve y rotunda", "frase destacada en caligrafía contenida, palabra por palabra", "segundo texto como colofón del pergamino: legible y digno", "frase de cierre en tinta fresca: lo mínimo con todo el peso"],
    textoTerciario: ["tercer nivel: dato de serie en tinta fina, legible", "sello rojo del artista con nombre de serie", "tríptico de identidad en tres trazos rotulados", "fecha de edición como sello de estudio", "dominio en sello secundario"],
    tecnica: ["Sumi-e", "Tinta lavada en gradiente", "Pincel seco (kasure)", "Papel washi", "Enso de un trazo", "Sello rojo de artista"],
    relacion: ["el texto nace donde el trazo descansa", "el vacío entre símbolo y texto es parte del mensaje", "texto de apoyo es el silencio que confirma la palabra", "un solo gesto: el símbolo lo pinta, el texto lo dice"]
  },
  "Barroco Ornamental": {
    arquitectura: ["retablo completo con columnas salomónicas", "marco barroco de talla dorada", "medallón central con cartela superior", "composición de altar mayor", "nube de gloria como estructura superior", "frontón curvo con volutas"],
    composicion: ["teatralidad dirigida: luz de un solo lado", "simétrica monumental con clímax central", "diagonal ascensional de drama", "claroscuro fuerte con foco en el símbolo", "capas de profundidad con escena principal al fondo", "remate superior en gloria, base firme en tierra"],
    textoPrincipal: ["título en cartela central de talla dorada", "lettering de bronce fundido", "texto en versalitas romanas dentro de filacteria", "título con capitular iluminada", "palabra dorada sobre nube de gloria", "lettering de placa de altar"],
    textoApoyo: ["frase clave en romana de grabado: cuerpo amplio, aire clásico", "texto de apoyo en cartela secundaria: legible a un paso", "segundo nivel en versalitas espaciadas con aire de catálogo", "fundamento como inscripción de base del retablo: firme y clara", "línea de verdad en banda inferior con filetes dorados", "frase destacada en letra de catálogo, palabra por palabra", "segundo texto como leyenda de medallón: completa y legible", "frase de cierre en dorado sobre sombra: presencia plena"],
    textoTerciario: ["tercer nivel: dato de serie en placa de bronce, legible", "sello de serie como marca de taller barroco", "tríptico de identidad en tres medallones con gloria rotulada", "dedicatoria en cartela inferior", "dominio en escudo secundario"],
    tecnica: ["Claroscuro dramático", "Talla dorada", "Óleo con luz dirigida", "Grabado barroco", "Filacteria tallada", "Gloria de nubes"],
    relacion: ["el texto tiene su cartela: jerarquía de retablo", "la gloria del símbolo ilumina la palabra", "texto de apoyo es la base tallada que sostiene el clamor", "todo orna, nada esconde: cada palabra a la vista"]
  },
  "Vintage Desgastado": {
    arquitectura: ["print de camiseta lavada cien veces", "etiqueta de reliquia con doblez", "cartel envejecido al sol con margen quemado", "sello de aniversario con textura de tinta fantasma", "marca de fábrica antigua", "parche de tela con bordes cosidos"],
    composicion: ["central con desgaste en los bordes", "halftone fantasma detrás del símbolo", "simétrica de emblema clásico", "peso al centro con textura de lavado uniforme", "banda de texto sobre el símbolo, ambas desgastadas", "silueta con tinta despedida en zonas de doblez"],
    textoPrincipal: ["título con tinta agrietada por los lavados", "lettering en arco tipo emblema de trabajo", "texto con relleno desgastado en el centro", "palabra con doble contorno de imprenta vieja", "título estampado con falta de tinta controlada", "lettering serif gordas de cartel antiguo"],
    textoApoyo: ["frase clave en banda inferior de emblema: letras gordas, legibles", "texto de apoyo como subtítulo de etiqueta vintage: cuerpo real", "segundo nivel en tipografía de imprenta antigua: legible con grano", "fundamento estampado con desgaste uniforme: palabra entera", "línea de verdad en cinta de etiqueta: contraste mantenido", "frase destacada en tipografía de sello postal antiguo", "segundo texto en el anillo exterior del emblema, legible a un paso", "frase de cierre con tinta fantasma pero cuerpo completo"],
    textoTerciario: ["tercer nivel: dato de serie en sello de fundación, legible", "sello de serie como número de lote antiguo", "tríptico de identidad en tres sellos rotulados", "año de edición como fecha de fundación", "dominio en cinta de garantía"],
    tecnica: ["Distress de lavado", "Halftone fantasma", "Tinta agrietada", "Estampado de 2 tintas desgastadas", "Grano de tela", "Doble exposición de print"],
    relacion: ["el desgaste afecta a todo por igual: texto incluido, nunca ilegible", "el emblema enmarca la verdad como marca de oficio", "texto de apoyo es la etiqueta que garantiza el contenido", "tinta vieja, verdad nueva"]
  },
  "Bordado / Puntada": {
    arquitectura: ["parche bordado con borde de merrow", "rectángulo de tela con puntada de contador", "emblema de pecho con chain stitch", "composición de sampler escolar", "parche escudo con hilo satinado", "etiqueta de cuello convertida en promesa"],
    composicion: ["central de parche con margen de tela", "simétrica de escudo", "dirección de puntada que guía la lectura", "banda de texto bordada bajo el símbolo", "hilo en degradado de tono dentro de la letra", "peso al centro con textura de tejido"],
    textoPrincipal: ["título en chain stitch grueso", "lettering bordado en satin stitch con brillo", "texto en puntada de cruz estilizada", "palabra en aplique de fieltro con pespunte", "título en punto de tallo con curvas limpias", "lettering con hilo metálico contenido"],
    textoApoyo: ["frase clave en puntada de contador: cuerpo amplio, cuenta de hilo clara", "texto de apoyo en banda bordada: cada palabra entera, bien tensada", "segundo nivel en pespunte a mano: legible y honesto", "fundamento como etiqueta tejida: contraste de hilo sobre tela", "línea de verdad en satin stitch: brillo que se lee", "frase destacada en punto atrás fino pero de cuerpo de diseño", "segundo texto en aplique con contorno: presencia firme", "frase de cierre en hilo de dos tonos: sombra que no borra"],
    textoTerciario: ["tercer nivel: dato de serie en pespunte legible", "sello de serie como etiqueta de lote bordada", "tríptico de identidad en tres parches rotulados", "año de edición en puntada de contador", "dominio en etiqueta de manga"],
    tecnica: ["Satin stitch", "Chain stitch", "Puntada de contador", "Aplique de tela", "Hilo metálico contenido", "Textura de tejido base"],
    relacion: ["el hilo dibuja el símbolo y cose la verdad", "texto de apoyo es la costura que une el diseño", "todo el diseño comparte la misma tensión de bastidor", "la puntada es la trama: símbolo y palabra en el mismo hilo"]
  },
  "Folk Popular": {
    arquitectura: ["exvoto popular con marco de flores", "composición plana de alebrije", "retablo andino en dos registros", "azulejo de talavera ampliado", "banderines de papel picado como marco", "emblema de santuario popular"],
    composicion: ["plana sin perspectiva: todo al frente", "patrón decorativo que enmarca el símbolo", "simétrica festiva con remate superior", "dos registros: cielo del símbolo, tierra del texto", "flujo de guirnalda que guía al texto", "central con marco de flor de cuatro pétalos"],
    textoPrincipal: ["lettering popular con flores saliendo de las letras", "título en estilo de rotulación de exvoto", "texto en hilera de banderines", "palabra dentro de corazón sagrado pintado", "lettering de rótulo de capilla", "título con mirada de rotulación pintada a mano"],
    textoApoyo: ["frase clave en rótulo popular: letras gordas y alegres, legibles", "texto de apoyo en banda de tela: cuerpo de diseño", "segundo nivel como renglón de exvoto: se lee entero", "fundamento en tipografía de imprenta popular: clara y cálida", "línea de verdad entre dos guirnaldas: ancha y presente", "frase destacada en letra de letrero de santuario", "segundo texto en franja de papel picado: cuerpo suficiente", "frase de cierre pintada a brocha: trazo seguro, lectura fácil"],
    textoTerciario: ["tercer nivel: dato de serie en renglón inferior, legible", "sello de serie como marca del artesano", "tríptico de identidad en tres medallones populares rotulados", "fecha de edición como fecha de milagro agradecido", "dominio en cinta de exvoto"],
    tecnica: ["Pintura popular plana", "Papel picado", "Mosaico de talavera", "Brocha gruesa", "Patrón floral decorativo", "Exvoto narrativo"],
    relacion: ["el texto es parte de la ofrenda pintada", "las flores del marco no tapan: acompañan la palabra", "símbolo y texto comparten la misma mano festiva", "texto de apoyo es la tierra del retablo donde crece la verdad"]
  },
  "Grunge / DIY": {
    arquitectura: ["página fotocopiada y rasgada con bordes vivos", "cartel de zine con cinta adhesiva en las esquinas", "montaje de recortes con tinta corrida de copiadora", "capa de cartón doblado con marca de doblez", "collage de fanzine con grapas visibles", "cartel reagrupado con cintas cruzadas"],
    composicion: ["central sucia con grano de copiadora al máximo", "asimétrica de recortes superpuestos", "diagonal de desgarro que guía la lectura", "apilada en capas de papel", "peso a un lado con margen mordido por el desgarro", "superposición de fotocopias desregistradas"],
    textoPrincipal: ["título ransom-note: letras recortadas de distinto cuerpo", "palabra estampada con tinta corrida", "lettering con marcador grueso sobre fotocopia", "título tachado y re-estampado encima", "texto con borde quemado por fotocopiadora", "palabra en sello de goma con tinta irregular"],
    textoApoyo: ["frase clave recortada en tira de papel: letras gordas, se lee aunque la copia esté sucia", "texto de apoyo pegado con cinta: banda ancha, cuerpo de lectura", "segundo nivel estampado en sello: tinta a medias, pero cada palabra entera", "fundamento en marcador sobre cartón: trazo firme, legible a un paso", "línea de verdad mecanografiada en máquina vieja: cuerpo completo, nada micro", "frase destacada en recorte de periódico: tipografía de imprenta legible", "segundo texto en etiqueta de typewriter subrayada: clara, con presencia", "frase de cierre en letra a mano sobre el desgarro: honesta y legible"],
    textoTerciario: ["tercer nivel: dato de serie en sello de goma, legible", "sello de serie como número de fanzine", "tríptico de identidad en tres recortes rotulados", "fecha de edición mecanografiada en la esquina", "dominio en etiqueta de cassette"],
    tecnica: ["Fotocopia de alta y baja copia", "Rasgado de papel", "Cinta adhesiva real", "Tinta corrida", "Typewriter", "Sello de goma"],
    relacion: ["el texto es otro recorte del mismo zine", "el desgarro parte el diseño y el texto lo cierra", "la cinta sostiene el símbolo y la verdad por igual", "nada es decorativo: cada suciedad es honestidad, cada palabra se lee"]
  },
  "Risograph": {
    arquitectura: ["print risográfico de dos tintas desregistradas", "póster de riso con grano visible y márgenes de máquina", "capa de tinta flúor cruzando la capa de tinta oscura", "mancha de tinta con textura de rodillo", "registro desplazado a propósito con doble imagen del símbolo", "banner de riso con borde de impresión visible"],
    composicion: ["central con doble registro desplazado", "asimétrica de dos capas de color", "banda flúor detrás del símbolo", "superposición de tintas que crea un tercer color en el cruce", "peso a un lado con aire de papel", "simétrica con desregistro uniforme"],
    textoPrincipal: ["título en la capa oscura con la capa flúor desregistrada detrás", "lettering de trazo sólido con grano de riso", "texto en tinta flúor sobre fondo oscuro", "título duplicado: una capa nítida, una fantasma", "palabra en stencil de risografía", "lettering con textura de rodillo de tinta"],
    textoApoyo: ["frase clave en la capa de lectura: cuerpo amplio, el desregistro nunca la borra", "texto de apoyo en tinta sólida sobre zona clara: contraste garantizado", "segundo nivel en banda inferior con grano de riso: cada palabra entera", "fundamento en tipografía de cartel risográfico: ancha y legible", "línea de verdad en la capa flúor pero con cuerpo de diseño, no de detalle", "frase destacada en una sola tinta: máxima legibilidad", "segundo texto con doble imagen fantasma: se lee la nítida, se siente el eco", "frase de cierre en letras gordas de riso: presencia plena"],
    textoTerciario: ["tercer nivel: dato de serie en letra de colofón risográfico, legible", "sello de serie como marca de tirada (edición N de M)", "tríptico de identidad en tres tintas rotuladas", "fecha de edición en pie de imprenta riso", "dominio en banda de registro"],
    tecnica: ["Risograph 2 tintas", "Desregistro controlado", "Tinta flúor", "Grano de riso", "Superposición multiply", "Rodillo de tinta"],
    relacion: ["dos tintas, dos naturalezas, un solo mensaje: el desregistro es identidad", "el texto vive en la capa que se lee; la fantasma lo glorifica", "símbolo y texto comparten la misma tirada imperfecta", "la superposición crea el tercer color donde la verdad cruza la gracia"]
  },
  "Surf / Skate 90s": {
    arquitectura: ["tabla de surf en vertical como estructura total", "pala de skate como marco del símbolo", "insignia de marca de skate con curvas deformadas", "cartel de campeonato de los 90", "flyer de evento de skate con pila de textos", "emblema curvo tipo deck graphics"],
    composicion: ["curvas de deck que deforman el marco", "central con sun-fade de sol vertical", "diagonal de ola o rampa", "bandas de color degradadas por el sol", "simétrica de logo deportivo", "peso abajo con textura de lija"],
    textoPrincipal: ["título deformado en curva de tabla", "lettering grueso con distorsión de lente", "palabra con contorno doble estilo 90s", "título con sombra proyectada dura", "lettering caligráfico de firma de skater", "texto curvado en arco de logo"],
    textoApoyo: ["frase clave en banda inferior del deck: letras gruesas, legibles", "texto de apoyo como slogan de marca: ancho, directo, se lee al pasar", "segundo nivel en tipografía deportiva 90s: cuerpo completo", "fundamento en cinta de contorno: palabra por palabra firme", "línea de verdad bajo el logo: contraste mantenido aunque el sol la queme", "frase destacada en banda curva: legible en todo el arco", "segundo texto en etiqueta de evento: fecha y verdad, bien legibles", "frase de cierre con contorno y relleno planos: presencia total"],
    textoTerciario: ["tercer nivel: dato de serie en etiqueta de serie, legible", "sello de serie como número de edición limitada", "tríptico de identidad en tres ruedas rotuladas", "fecha de edición como fecha de evento", "dominio en la barra del deck"],
    tecnica: ["Distorsión de curvas", "Sun-fade", "Textura de lija", "Contorno doble", "Color plano 90s", "Grano de sal y arena"],
    relacion: ["el texto corre la curva como el skater la rampa", "el símbolo es la marca y la verdad es el patrocinio", "texto de apoyo es la banda que sujeta todo", "deformación en la forma, firmeza en la palabra"]
  },
  "Retro 80s Neon": {
    arquitectura: ["rejilla en perspectiva como suelo del diseño", "horizonte de neón con sol de franjas", "marco de tubo de neón alrededor del símbolo", "skyline nocturno con luces de neón", "ventana de arcade iluminada", "círculo de neón como halo del símbolo"],
    composicion: ["central con resplandor de neón", "perspectiva profunda hacia el horizonte", "simétrica con tubo de luz como marco", "diagonal de rayo de neón", "peso abajo en la rejilla, luz arriba", "glow radial desde el símbolo"],
    textoPrincipal: ["título en tubo de neón encendido", "lettering cromado con reflejo de horizonte", "texto con glow rosa y contorno cian", "palabra en luces de marquesina", "título en font vectorial 80s con degradado", "lettering de letrero nocturno"],
    textoApoyo: ["frase clave en luz blanca sobre negro: máximo contraste, se lee de lejos", "texto de apoyo en tubo fino pero de cuerpo de diseño: nada de cable ilegible", "segundo nivel en tipografía de marquesina: cada letra encendida y legible", "fundamento en banda inferior con glow controlado: cuerpo completo", "línea de verdad sobre la rejilla: tinta clara sobre oscura, legible", "frase destacada en panel de arcade: palabra por palabra iluminada", "segundo texto como rótulo de la ciudad sobre la colina: se ve desde lejos", "frase de cierre en neón blanco: la luz no compite, anuncia"],
    textoTerciario: ["tercer nivel: dato de serie en display digital, legible", "sello de serie como INSERT COIN reinterpretado", "tríptico de identidad en tres letreros rotulados", "fecha de edición en display de arcade", "dominio en letrero secundario"],
    tecnica: ["Neón tubo", "Glow radial", "Cromado 80s", "Rejilla en perspectiva", "Degradado cian-magenta", "Luz sobre negro"],
    relacion: ["la luz del neón es la metáfora: la palabra es lámpara", "el texto encendido vive sobre el negro del mundo", "símbolo y texto comparten el mismo tubo de gloria", "el brillo no adorna: proclama"]
  },
  "Vaporwave": {
    arquitectura: ["estatua clásica central con rejilla de fondo", "ventana de sistema operativo en pastel", "marbete de museo para una verdad eterna", "jardín de bustos con cielo degradado", "escalera clásica hacia el horizonte", "marco de columnas con glitch suave"],
    composicion: ["central solemne con paleta ácida", "perspectiva de rejilla hacia el infinito", "simétrica de museo", "peso al centro con aire pastel", "diagonal de glitch suave cruzando", "apilada en capas de ventana"],
    textoPrincipal: ["título en serif espaciada estilo vaporwave", "lettering con degradado pastel", "texto con glitch de una sola línea", "palabra en mayúsculas espaciadas con aire eterno", "título en tipografía de ventana de sistema", "lettering de mármol con luz rosada"],
    textoApoyo: ["frase clave en serif legible sobre pastel: contraste garantizado", "texto de apoyo en banda sólida: cuerpo de lectura, no de decoración", "segundo nivel en tipografía de sistema: clara, cada palabra entera", "fundamento como marbete de museo: la verdad eterna con ficha legible", "línea de verdad sobre la rejilla: tinta oscura sobre claro", "frase destacada en ventana emergente pastel: texto grande", "segundo texto en banda de glitch: el glitch no la toca", "frase de cierre en serif espaciada: lo fugaz no borra lo eterno"],
    textoTerciario: ["tercer nivel: dato de serie en marbete, legible", "sello de serie como número de catálogo de museo", "tríptico de identidad en tres bustos rotulados", "fecha de edición en pie de sistema", "dominio en etiqueta de ventana"],
    tecnica: ["Paleta pastel ácida", "Glitch suave", "Rejilla perspectiva", "Estatua render", "Degradado cielo", "Ventana de sistema"],
    relacion: ["la estatua envejece, la palabra permanece: contraste conceptual", "el texto es la ficha que interpreta la eternidad", "símbolo y texto comparten la calma del museo", "todo fuga de tono, nada fuga de legibilidad"]
  },
  "Collage Cut-Paper": {
    arquitectura: ["collage de papeles rasgados con bordes blancos visibles", "capas de papel superpuestas como escena", "recorte de revista como símbolo central", "montaje de tijera con sombra de capa", "composición de papel picado superpuesto", "lienzo de papel pegado con dobleces"],
    composicion: ["superposición de capas con sombra entre niveles", "asimétrica de recortes", "central con borde blanco alrededor del símbolo", "flujo diagonal de papeles", "peso abajo con capa más grande", "vacíos de fondo entre recortes"],
    textoPrincipal: ["título en letras recortadas de papel de colores", "lettering pegado capa por capa", "palabra en recorte de revista ampliada", "título de papel rasgado con borde blanco", "texto en cinta de papel curvada", "lettering de tijera con sombra"],
    textoApoyo: ["frase clave en tira de papel: letras grandes, sombra que la separa del fondo", "texto de apoyo en banda de papel liso: cuerpo completo", "segundo nivel en recorte tipográfico: cada palabra entera, bien pegada", "fundamento en papel de cartas: tipografía legible con borde", "línea de verdad en papel de contraste: se lee sobre todas las capas", "frase destacada en recorte de libro: palabra por palabra", "segundo texto en etiqueta pegada: clara y a un paso", "frase de cierre en papel de color con letra blanca: presencia plena"],
    textoTerciario: ["tercer nivel: dato de serie en papel pequeño pero legible", "sello de serie como etiqueta de esquina", "tríptico de identidad en tres recortes rotulados", "fecha de edición en trozo de calendario", "dominio en pestaña de carpeta"],
    tecnica: ["Papel rasgado", "Tijera limpia", "Sombra de capa", "Superposición física", "Texturas de papel", "Bordes blancos"],
    relacion: ["cada capa es parte de la historia: la verdad es la capa superior", "el texto es un recorte más del mismo testimonio", "la sombra separa niveles: el texto siempre encima", "lo roto se recompone en una sola escena"]
  },
  "Papercraft 3D": {
    arquitectura: ["diorama de papel con niveles de profundidad", "capas apiladas con sombra exacta entre ellas", "arco de papel con cinco niveles de profundidad", "símbolo construido en relieve de capas", "marco de papel con efecto túnel", "escena de papel con primer plano y fondo"],
    composicion: ["profundidad por capas hacia el símbolo", "central con túnel de sombras", "asimétrica en relieve", "diagonal de capas descendente", "peso al fondo con capas mayores arriba", "simétrica de retablo de papel"],
    textoPrincipal: ["título en relieve: letra recortada y elevada sobre base", "lettering con sombra propia de 2 niveles", "palabra en capa superior más gruesa", "texto calado en la capa de fondo", "título de papel en tres grosores", "lettering flotante con sombra proyectada"],
    textoApoyo: ["frase clave en capa media: letras gordas con sombra que las despega", "texto de apoyo en banda de papel: contraste alto entre capas", "segundo nivel en relieve bajo: legible gracias a la sombra", "fundamento calado en la última capa: la luz pasa por la verdad", "línea de cierre en papel contrastado: se lee sobre el nivel inferior", "frase destacada en capa propia: palabra por palabra despegada", "segundo texto en pestaña de papel: clara y con cuerpo", "frase de cierre en relieve blanco sobre capa oscura: presencia total"],
    textoTerciario: ["tercer nivel: dato de serie en pestaña legible", "sello de serie como marca de la base", "tríptico de identidad en tres niveles rotulados", "fecha de edición en la capa inferior", "dominio en borde de marco"],
    tecnica: ["Papel calado", "Capas con espaciadores", "Sombra proyectada exacta", "Relieve gradual", "Tijera de precisión", "Papel de algodón"],
    relacion: ["la profundidad de las capas es la profundidad de la verdad", "el texto vive en su capa: jerarquía física y jerarquía de lectura", "la sombra ordena: nunca tapa la palabra", "cada nivel baja hasta la base: la palabra es la base"]
  },
  "Airbrush Smooth": {
    arquitectura: ["panel de mural aerografiado con brillos suaves", "marco de luz difusa alrededor del símbolo", "fondo de gradiente de dos tonos con halo", "capó custom con emblema aerografiado", "cielo degradado como campo del diseño", "círculo de brillo como pedestal"],
    composicion: ["central con halo de luz suave", "simétrica con gradiente radial", "peso abajo, luz arriba", "diagonal de destello", "curvas de brillo que guían la lectura", "profundidad de niebla en el fondo"],
    textoPrincipal: ["lettering aerografiado con brillo en el borde superior", "título cromado suave", "texto con degradado dentro de la letra", "palabra con contorno suave y halo", "título con reflejo líquido", "lettering 3D aerografiado con sombra suave"],
    textoApoyo: ["frase clave en tinta sólida sobre gradiente claro: contraste garantizado", "texto de apoyo en banda de color plano: cuerpo de lectura pleno", "segundo nivel con halo mínimo pero cuerpo completo: legible siempre", "fundamento en tipografía con borde oscuro: se lee sobre cualquier luz", "línea de verdad en zona de máxima calma del gradiente", "frase destacada en panel sólido: palabra por palabra nítida", "segundo texto con contorno fino: presencia sin competencia", "frase de cierre en blanco sobre el fondo más profundo: luz y palabra"],
    textoTerciario: ["tercer nivel: dato de serie en placa aerografiada, legible", "sello de serie como firma de taller custom", "tríptico de identidad en tres emblemas rotulados", "fecha de edición en la placa inferior", "dominio en rótulo secundario"],
    tecnica: ["Aerógrafo", "Gradiente radial", "Brillo especular", "Fringe suave", "Máscara de plantilla fina", "Luz difusa"],
    relacion: ["la luz suave rodea al texto: nunca lo difumina", "el brillo del símbolo baja al texto y lo corona", "todo transición, todo legible", "la calma del aire sostiene la firmeza de la palabra"]
  },
  "Blueprint / Technical": {
    arquitectura: ["plano técnico completo con cartela", "retícula de blueprint con cota principal", "despiece del símbolo en tres vistas", "plano de alzado con sección cortada", "cuadrícula milimetrada como campo", "plancha técnica con margen de plotter"],
    composicion: ["central con cotas alrededor del símbolo", "asimétrica de despiece", "simétrica de alzado frontal", "peso al centro con anotaciones perimetrales", "diagonal de línea de cota", "superposición de vistas"],
    textoPrincipal: ["título en tipografía técnica de plano", "lettering estarcido de plancha", "texto en rotulación de cotas ampliada", "palabra como denominación del proyecto", "título en mayúsculas técnicas espaciadas", "lettering de sello de aprobación"],
    textoApoyo: ["frase clave en banda de notas del plano: tipografía técnica grande, legible", "texto de apoyo en cartela: cuerpo de lectura, cada palabra rotulada", "segundo nivel como nota de especificación: clara y completa", "fundamento en sello de aprobación: APROBADO, bien legible", "línea de verdad como cota maestra: la medida más importante está escrita", "frase destacada en recuadro de notas: palabra por palabra técnica y legible", "segundo texto en leyenda de símbolos: clara y con cuerpo", "frase de cierre en tipografía de plano: precisión y verdad"],
    textoTerciario: ["tercer nivel: dato de serie como número de plancha, legible", "sello de serie como escala 1:1 de la verdad", "tríptico de identidad en tres vistas rotuladas", "fecha de edición en cartela de revisión", "dominio en rótulo de proyecto"],
    tecnica: ["Blueprint azul", "Línea técnica blanca", "Cotas y flechas", "Retícula milimetrada", "Sello de aprobación", "Plotter de tinta"],
    relacion: ["el símbolo está medido: la identidad tiene plan", "el texto es la especificación que interpreta el dibujo", "cada cota señala al símbolo, cada nota señala a la verdad", "nada decorativo: todo documento de una verdad real"]
  },
  "Paste-up Wheatpaste": {
    arquitectura: ["póster pegado a muro con arrugas y burbujas", "capas de carteles rasgados que se solapan", "muro urbano con un solo póster protagonista", "papel pegado con bordes levantados", "cartel sobre cartel: la verdad encima", "esquina de calle con póster doble"],
    composicion: ["central con arrugas radiales", "asimétrica de capas rasgadas", "peso al póster nuevo, ciudad vieja alrededor", "diagonal de rasgado que revela el cartel anterior", "superposición con esquinas levantadas", "vacío de muro alrededor del pegado"],
    textoPrincipal: ["título del cartel principal: serigrafía urbana con tinta sólida", "lettering de gaceta pegada", "texto con tinta que caló el papel", "palabra en rótulo de campaña", "título con arruga que lo cruza pero no lo borra", "lettering de cartel de evento callejero"],
    textoApoyo: ["frase clave en banda del cartel: letras gordas, la arruga no las rompe", "texto de apoyo en el papel superior: cuerpo completo, tinta firme", "segundo nivel en el cartel de debajo asomando: legible en su franja", "fundamento estampado en el nuevo póster: palabra por palabra", "línea de verdad sobre el rasgado: contraste alto sobre el muro", "frase destacada en cartel: se lee a un metro, no a un centímetro", "segundo texto en etiqueta de esquina: clara, bien pegada", "frase de cierre en tinta negra sobre papel claro: máxima legibilidad"],
    textoTerciario: ["tercer nivel: dato de serie en pie de cartel, legible", "sello de serie como número de campaña", "tríptico de identidad en tres carteles rotulados", "fecha de edición como fecha de pegado", "dominio en la gaceta inferior"],
    tecnica: ["Wheatpaste", "Arrugas de papel húmedo", "Rasgado de capas", "Serigrafía urbana", "Tinta calada", "Textura de muro"],
    relacion: ["el mensaje está pegado en la calle: público, no privado", "el cartel viejo es la ley; el nuevo, la gracia", "el texto vive en el papel que resiste la intemperie", "la arruga cuenta el paso del tiempo; la palabra sigue entera"]
  },
  "Photomontage / Dada": {
    arquitectura: ["fotografía blanco y negro recortada con borde blanco", "montaje dadaísta de dos épocas", "retrato fotográfico con corona recortada y pegada", "escena fotográfica con elemento imposible", "recorte con textura de periódico", "collage fotográfico con una sola pieza de color"],
    composicion: ["central fotográfico con fondo vacío", "asimétrica de recortes", "peso a la figura principal", "diagonal de recorte", "superposición de escalas imposibles", "vacío de papel alrededor de la foto"],
    textoPrincipal: ["título en tipografía de imprenta recortada", "lettering de sello sobre la foto", "texto en banda de periódico", "palabra estampada en rojo sobre blanco y negro", "título en cinta mecanografiada", "lettering de letra de cambio antigua"],
    textoApoyo: ["frase clave en tipografía de imprenta: negra sobre claro, cuerpo completo", "texto de apoyo en banda sólida debajo de la foto: legible a un paso", "segundo nivel en letra de pie de foto pero grande: cuerpo de diseño", "fundamento estampado: tinta de verdad sobre imagen real", "línea de cierre en el único color del diseño", "frase destacada en recuadro tipográfico: palabra por palabra", "segundo texto en cinta adhesiva escrita: clara y honesta", "frase de cierre en blanco sobre banda negra: contraste pleno"],
    textoTerciario: ["tercer nivel: dato de serie como fecha del suceso, legible", "sello de serie como marca de archivo", "tríptico de identidad en tres recortes rotulados", "fecha de edición en el margen del recorte", "dominio en pie de archivo"],
    tecnica: ["Fotografía blanco y negro", "Recorte con tijera", "Un acento de color", "Grano de periódico", "Montaje analógico", "Borde blanco de foto"],
    relacion: ["la carne real del blanco y negro sostiene al Verbo hecho carne", "el acento de color es la gracia en la imagen histórica", "el texto ancla la foto a la verdad: pie de foto de la eternidad", "lo documental y lo eterno en un solo plano"]
  },
  "Kids Storybook": {
    arquitectura: ["página de cuento ilustrado con viñeta principal", "escena de libro infantil con margen de texto", "ventana de casa de campo ilustrada", "camino de cuento que cruza la página", "cómoda de juguete como estantería del diseño", "montaña amable con sol sonriente"],
    composicion: ["central amable con aire alrededor", "curvas suaves que enmarcan", "peso abajo con suelo de cuento", "simétrica de ilustración clásica", "flujo de nube que guía la mirada", "escena con perspectiva amable"],
    textoPrincipal: ["título en tipografía redondeada de cuento", "lettering con brillo de estrella", "palabra dentro de banderín ilustrado", "texto con contorno suave", "título arqueado con remates amables", "lettering que camina por el sendero"],
    textoApoyo: ["frase clave en renglón grande de cuento: se lee en voz alta sin esfuerzo", "texto de apoyo en banda ilustrada: cuerpo completo, tinta firme", "segundo nivel en tipografía redonda mediana: cada palabra entera", "fundamento en el margen de la página: letra de lectura clara", "línea de verdad en el suelo del dibujo: la base de la escena", "frase destacada en banda inferior: palabra por palabra legible", "segundo texto en etiqueta de estantería: clara y cálida", "frase de cierre en tipografía amable: grande, redonda, presente"],
    textoTerciario: ["tercer nivel: dato de serie en pie de página ilustrado, legible", "sello de serie como lomo de libro", "tríptico de identidad en tres ilustraciones rotuladas", "fecha de edición en colofón de cuento", "dominio en la loma del camino"],
    tecnica: ["Ilustración de libro infantil", "Tinta y color plano", "Formas redondeadas", "Paleta cálida", "Trazo orgánico", "Textura de papel de cuento"],
    relacion: ["el texto es el renglón que el adulto lee y el niño entiende", "el símbolo ilumina la escena y el texto la cuenta", "todo amable, nada banal: identidad para pequeños", "la ilustración abre camino a la palabra"]
  },
  "Ukiyo-e / Woodblock": {
    arquitectura: ["grabado japonés con marco de papel envejecido", "ola como estructura superior del diseño", "monte sagrado al fondo como símbolo secundario", "ban de madera con sello rojo", "cartel de teatro kabuki reinterpretado", "abanico abierto como campo del diseño"],
    composicion: ["curva de ola que guía hacia el símbolo", "plana sin perspectiva profunda", "peso abajo en la espuma", "central con aire de papel", "simétrica de emblema de templo", "bandas horizontales de nube estilizada"],
    textoPrincipal: ["título en rotulación vertical japonesa reinterpretada", "lettering de pincel con contorno plano", "palabra en columna vertical con sello", "título horizontal con remates de brocha", "texto en cartela de madera", "lettering de cartel de festival"],
    textoApoyo: ["frase clave en banda horizontal inferior: tipografía clara, cuerpo de diseño", "texto de apoyo en cartela rectangular: legible sobre el papel", "segundo nivel en columna vertical con cuerpo suficiente", "fundamento en rotulación de madera tallada: cada palabra entera", "línea de verdad bajo la ola: contraste de tinta sobre papel", "frase destacada en banda tipo ema: palabra por palabra", "segundo texto como inscripción del templo: clara y solemne", "frase de cierre en tinta negra sobre papel claro: máxima lectura"],
    textoTerciario: ["tercer nivel: dato de serie en sello secundario, legible", "sello de serie como hanko del artista", "tríptico de identidad en tres sellos rotulados", "fecha de edición en el sello de era", "dominio en la cartela de madera"],
    tecnica: ["Grabado japonés", "Contorno plano", "Papel envejecido", "Sello rojo hanko", "Gradiente plano de banda", "Línea de brocha"],
    relacion: ["la ola obedece: la creación reconoce a su Señor", "el texto en cartela es la voz sobre el mar", "símbolo y texto comparten la calma del papel", "el sello rojo marca la verdad como el hanko marca el arte"]
  },
  "Irezumi / Wabori": {
    arquitectura: ["composición de espalda completa como lienzo", "barras de viento cruzando el diseño", "emblema de koi ascendente con agua", "dragón entre nubes como marco", "peonías enmarcando el símbolo central", "manga completa adaptada a formato vertical"],
    composicion: ["ascendente: el koi sube la corriente", "curva de agua que enmarca el símbolo", "diagonal de viento y salpicadura", "denso en bordes, aire en el centro", "peso abajo en el agua, gloria arriba", "simétrica ritual con negro de fondo"],
    textoPrincipal: ["título en rotulación vertical de densidad de tinta", "lettering de brocha gruesa japonesa", "palabra en columna con fundido de tinta", "título dentro de banda de viento", "texto con terminales en gota de tinta", "lettering de sello de maestro"],
    textoApoyo: ["frase clave en banda horizontal: tinta negra sólida, cuerpo de lectura", "texto de apoyo en rotulación vertical secundaria: legible columna por columna", "segundo nivel en tono de lavado medio pero con cuerpo completo", "fundamento en negro denso con letra clara: contraste de piel", "línea de verdad en banda de fondo: se lee entre las barras de viento", "frase destacada en cartela japonesa: palabra por palabra", "segundo texto como inscripción de dedicatoria: clara y firme", "frase de cierre en blanco sobre negro total: lo único que brilla en la piel"],
    textoTerciario: ["tercer nivel: dato de serie en sello pequeño legible", "sello de serie como hanko del taller", "tríptico de identidad en tres emblemas rotulados", "fecha de edición en la banda inferior", "dominio en sello de dedicación"],
    tecnica: ["Wabori", "Barras de viento", "Negro denso de fondo", "Gradiente de tinta en piel", "Brocha gruesa", "Salpicadura de agua"],
    relacion: ["el koi que sube es el que persevera: la fe tiene dirección", "el texto navega entre barras de viento sin perderse", "la densidad del negro hace brillar la palabra", "todo el cuerpo es lienzo: la verdad se lleva puesta"]
  },
  "Tattoo Old School": {
    arquitectura: ["flash de pared de estudio: símbolo con banner", "emblema de ancla y estrella con cinta", "cartela de barco con cuerda", "corazón con estandarte", "marco de estrella náutica", "composición de flash sheet con una pieza protagonista"],
    composicion: ["central de flash con banner para texto", "simétrica náutica", "peso abajo en la ancla", "diagonal de cinta que cruza", "radial de rayos de estrella", "curvas de cinta que ordenan la lectura"],
    textoPrincipal: ["título en cinta clásica de tatuaje", "lettering bold náutico con doble línea", "palabra en letras de flash americano", "título curvado en el banner superior", "texto con terminales en rombo", "lettering de carta marítima"],
    textoApoyo: ["frase clave en segunda cinta: letras gruesas, se lee a un paso", "texto de apoyo en tipografía de flash: negra, sólida, con cuerpo", "segundo nivel en letra de banner menor: completa y legible", "fundamento en la base del emblema: cada palabra clavada", "línea de verdad en cinta horizontal: contraste pleno", "frase destacada en pergamino de flash: palabra por palabra", "segundo texto en placa de bronce náutica: clara", "frase de cierre en blanco sobre banda roja: presencia total"],
    textoTerciario: ["tercer nivel: dato de serie en placa pequeña legible", "sello de serie como marca del estudio", "tríptico de identidad en tres flashes rotulados", "fecha de edición como fecha del tatuaje", "dominio en la bandera náutica"],
    tecnica: ["Línea gruesa negra", "Paleta limitada", "Sombreado whip", "Flash americano", "Relleno plano", "Doble contorno"],
    relacion: ["lo marcado en la piel no se borra: el pacto es permanente", "la cinta sostiene la verdad como el banner sostiene el nombre", "texto y símbolo comparten la misma línea gruesa", "flash clásico, verdad eterna"]
  },
  "Foil Stamp / Metallic": {
    arquitectura: ["estampado dorado sobre fondo profundo limpio", "marco de filete metálico doble", "medallón metálico con relieve", "placa de oro con emblema repujado", "banda metálica cruzando el diseño", "sello de cera dorada como centro"],
    composicion: ["central solemne con reflejo dirigido", "simétrica de placa", "peso al centro con vacío alrededor", "línea de brillo que cruza el emblema", "radial de destello contenido", "mínima con un solo gesto metálico"],
    textoPrincipal: ["título estampado en oro con relieve", "lettering de foil con reflejo diagonal", "texto en plata sobre negro", "palabra repujada con borde de presión", "título en dorado viejo sobre marfil", "lettering de moneda con canto"],
    textoApoyo: ["frase clave en tinta sólida: el metal está en el título, la lectura en el apoyo", "texto de apoyo en tipografía con peso: contraste garantizado sobre el fondo", "segundo nivel en banda con filete dorado fino: cuerpo completo", "fundamento como placa grabada: cada palabra cincelada y legible", "línea de verdad en oro sobre oscuro: se lee porque brilla, se lee porque es ancha", "frase destacada en panel liso: palabra por palabra", "segundo texto en tinta oscura sobre claro: el complemento del brillo", "frase de cierre en metal claro sobre fondo profundo: presencia plena"],
    textoTerciario: ["tercer nivel: dato de serie en placa pequeña legible", "sello de serie como contraste de la acuñación", "tríptico de identidad en tres sellos rotulados", "fecha de edición en la base de la placa", "dominio en filete inferior"],
    tecnica: ["Foil dorado", "Estampado en seco", "Relieve de presión", "Reflejo dirigido", "Papel de algodón oscuro", "Filete metálico"],
    relacion: ["el oro no adorna: glorifica", "el reflejo recorre símbolo y texto por igual", "el texto plano sostiene al metal brillante", "lo precioso está en la verdad, el metal la declara"]
  },
  "Puff Print / 3D Ink": {
    arquitectura: ["print puff con relieve visible en el símbolo", "capa de tinta expandida sobre base plana", "emblema inflado con sombra de altura", "letras puff como estructura principal", "banda de tinta 3D cruzando el diseño", "silueta con borde redondeado y altura"],
    composicion: ["central con relieve protagonista", "simétrica de estampado", "peso en el volumen del símbolo", "sombra de altura que guía la lectura", "curvas de tinta que ordenan", "fondo plano, símbolo elevado"],
    textoPrincipal: ["título en puff: letras infladas con altura real", "lettering de tinta expandida con brillo mate", "palabra en relieve con borde redondeado", "texto puff en dos grosores", "título con sombra de elevación", "lettering 3D de camiseta premium"],
    textoApoyo: ["frase clave en tinta plana: el relieve es del título, la claridad del apoyo", "texto de apoyo en serigrafía sólida: cuerpo completo y contraste alto", "segundo nivel en puff fino: legible por la sombra que proyecta", "fundamento en tinta plana sobre el fondo: palabra por palabra", "línea de verdad en banda plana: se lee sin brillos que estorben", "frase destacada en serigrafía limpia: máxima legibilidad", "segundo texto en relieve bajo: presencia tangible", "frase de cierre en tinta con altura: se ve y se siente"],
    textoTerciario: ["tercer nivel: dato de serie en placa plana, legible", "sello de serie como etiqueta de lavado reinterpretada", "tríptico de identidad en tres prints rotulados", "fecha de edición en el cuello de la prenda", "dominio en la etiqueta inferior"],
    tecnica: ["Puff print", "Tinta expandida", "Relieve redondeado", "Brillo mate", "Serigrafía de base", "Doble capa de altura"],
    relacion: ["la Palabra se hizo carne y se toca: el relieve es encarnación", "el texto plano y el símbolo elevado se jerarquizan sin competir", "la sombra del puff ordena la lectura", "fe tangible: se ve y se siente"]
  }
};

const STYLE_COLOR_PREF = {
  "Bohemian": ["tierra cálida", "bosque / sage", "papel / suave", "dorado / premium"],
  "Anime / Manga": ["noche / contraste", "neón / cyber", "retro vibrante"],
  "Retro 70s": ["retro vibrante", "tierra cálida", "bosque / sage"],
  "Dark Tattoo": ["tinta / ritual", "noche / contraste", "industrial"],
  "Brutalist": ["industrial", "noche / contraste", "mínimo frío"],
  "Y2K / Cyber": ["neón / cyber", "noche / contraste", "mínimo frío"],
  "Hand-Drawn": ["papel / suave", "tinta / ritual", "tierra cálida"],
  "Minimal Modern": ["mínimo frío", "papel / suave", "dorado / premium"],
  "Vitral / Mosaico": ["dorado / premium", "noche / contraste", "bosque / sage", "tinta / ritual"],
  "Grabado / Linóleo": ["tinta / ritual", "papel / suave", "mínimo frío", "industrial"],
  "Gótico Ornamental": ["tinta / ritual", "noche / contraste", "dorado / premium"],
  "Stencil Urbano": ["industrial", "noche / contraste", "neón / cyber", "mínimo frío"],
  "Cómic / Halftone": ["retro vibrante", "noche / contraste", "neón / cyber"],
  "Pixel / 8-bit": ["neón / cyber", "noche / contraste", "retro vibrante", "mínimo frío"],
  "Acuarela Suelta": ["papel / suave", "bosque / sage", "tierra cálida", "mínimo frío"],
  "Sumi-e / Tinta Lavada": ["tinta / ritual", "mínimo frío", "papel / suave"],
  "Barroco Ornamental": ["dorado / premium", "noche / contraste", "tinta / ritual"],
  "Vintage Desgastado": ["tierra cálida", "retro vibrante", "papel / suave", "industrial"],
  "Bordado / Puntada": ["tierra cálida", "bosque / sage", "papel / suave", "dorado / premium"],
  "Folk Popular": ["retro vibrante", "tierra cálida", "bosque / sage"],
  "Grunge / DIY": ["papel / suave", "tinta / ritual", "industrial"],
  "Risograph": ["flúor / risografía", "retro vibrante", "neón / cyber", "papel / suave"],
  "Surf / Skate 90s": ["retro vibrante", "tierra cálida", "neón / cyber"],
  "Retro 80s Neon": ["neón / cyber", "noche / contraste", "retro vibrante"],
  "Vaporwave": ["pastel ácido / vapor", "neón / cyber", "mínimo frío"],
  "Collage Cut-Paper": ["papel / suave", "retro vibrante", "tierra cálida", "mínimo frío"],
  "Papercraft 3D": ["papel / suave", "mínimo frío", "tierra cálida"],
  "Airbrush Smooth": ["noche / contraste", "neón / cyber", "dorado / premium"],
  "Blueprint / Technical": ["mínimo frío", "industrial", "noche / contraste"],
  "Paste-up Wheatpaste": ["papel / suave", "industrial", "tierra cálida"],
  "Photomontage / Dada": ["noche / contraste", "mínimo frío", "tinta / ritual"],
  "Kids Storybook": ["retro vibrante", "tierra cálida", "bosque / sage"],
  "Ukiyo-e / Woodblock": ["papel / suave", "bosque / sage", "tinta / ritual"],
  "Irezumi / Wabori": ["tinta / ritual", "noche / contraste", "industrial"],
  "Tattoo Old School": ["retro vibrante", "tinta / ritual", "noche / contraste"],
  "Foil Stamp / Metallic": ["dorado / premium", "noche / contraste", "mínimo frío"],
  "Puff Print / 3D Ink": ["retro vibrante", "neón / cyber", "tierra cálida"]
};

const STYLE_TIPO_PREF = {
  "Bohemian": ["Script de pluma", "Manuscrita de cuaderno", "Serif clásica titulada", "Lettering brush gestual"],
  "Anime / Manga": ["Grotesca black condensada", "Display caligráfica expresiva", "Geométrica deconstructivista", "Rounded amable"],
  "Retro 70s": ["Rounded amable", "Script de pluma", "Slab pesada de oficio", "Custom modular geométrica"],
  "Dark Tattoo": ["Gótica blackletter", "Slab pesada de oficio", "Stencil de plantilla", "Serif moderna alto contraste"],
  "Brutalist": ["Grotesca black condensada", "Stencil de plantilla", "Mono técnica", "Custom modular geométrica"],
  "Y2K / Cyber": ["Mono técnica", "Geométrica deconstructivista", "Custom modular geométrica", "Grotesca black condensada"],
  "Hand-Drawn": ["Manuscrita de cuaderno", "Lettering brush gestual", "Script de pluma", "Sans humanista limpia"],
  "Minimal Modern": ["Sans humanista limpia", "Serif moderna alto contraste", "Mono técnica", "Itálica solemne"],
  "Vitral / Mosaico": ["Gótica blackletter", "Serif clásica titulada", "Itálica solemne", "Display caligráfica expresiva"],
  "Grabado / Linóleo": ["Slab pesada de oficio", "Grotesca black condensada", "Serif clásica titulada", "Stencil de plantilla"],
  "Gótico Ornamental": ["Gótica blackletter", "Display caligráfica expresiva", "Serif moderna alto contraste", "Itálica solemne"],
  "Stencil Urbano": ["Stencil de plantilla", "Grotesca black condensada", "Custom modular geométrica", "Slab pesada de oficio"],
  "Cómic / Halftone": ["Grotesca black condensada", "Custom modular geométrica", "Rounded amable", "Slab pesada de oficio"],
  "Pixel / 8-bit": ["Mono técnica", "Custom modular geométrica", "Geométrica deconstructivista", "Grotesca black condensada"],
  "Acuarela Suelta": ["Script de pluma", "Serif moderna alto contraste", "Lettering brush gestual", "Itálica solemne"],
  "Sumi-e / Tinta Lavada": ["Itálica solemne", "Manuscrita de cuaderno", "Serif moderna alto contraste", "Mono técnica"],
  "Barroco Ornamental": ["Display caligráfica expresiva", "Serif clásica titulada", "Gótica blackletter", "Itálica solemne"],
  "Vintage Desgastado": ["Slab pesada de oficio", "Script de pluma", "Rounded amable", "Serif clásica titulada"],
  "Bordado / Puntada": ["Rounded amable", "Script de pluma", "Sans humanista limpia", "Serif clásica titulada"],
  "Folk Popular": ["Rounded amable", "Slab pesada de oficio", "Manuscrita de cuaderno", "Custom modular geométrica"],
  "Grunge / DIY": ["Manuscrita de cuaderno", "Mono técnica", "Stencil de plantilla", "Slab pesada de oficio"],
  "Risograph": ["Grotesca black condensada", "Mono técnica", "Custom modular geométrica", "Slab pesada de oficio"],
  "Surf / Skate 90s": ["Rounded amable", "Custom modular geométrica", "Script de pluma", "Grotesca black condensada"],
  "Retro 80s Neon": ["Grotesca black condensada", "Geométrica deconstructivista", "Mono técnica", "Display caligráfica expresiva"],
  "Vaporwave": ["Serif moderna alto contraste", "Serif clásica titulada", "Mono técnica", "Itálica solemne"],
  "Collage Cut-Paper": ["Manuscrita de cuaderno", "Slab pesada de oficio", "Sans humanista limpia", "Custom modular geométrica"],
  "Papercraft 3D": ["Custom modular geométrica", "Slab pesada de oficio", "Sans humanista limpia", "Rounded amable"],
  "Airbrush Smooth": ["Script de pluma", "Serif moderna alto contraste", "Display caligráfica expresiva", "Rounded amable"],
  "Blueprint / Technical": ["Mono técnica", "Stencil de plantilla", "Sans humanista limpia", "Custom modular geométrica"],
  "Paste-up Wheatpaste": ["Slab pesada de oficio", "Stencil de plantilla", "Grotesca black condensada", "Serif clásica titulada"],
  "Photomontage / Dada": ["Mono técnica", "Serif clásica titulada", "Slab pesada de oficio", "Manuscrita de cuaderno"],
  "Kids Storybook": ["Rounded amable", "Manuscrita de cuaderno", "Sans humanista limpia", "Script de pluma"],
  "Ukiyo-e / Woodblock": ["Serif clásica titulada", "Itálica solemne", "Display caligráfica expresiva", "Manuscrita de cuaderno"],
  "Irezumi / Wabori": ["Display caligráfica expresiva", "Itálica solemne", "Gótica blackletter", "Serif moderna alto contraste"],
  "Tattoo Old School": ["Slab pesada de oficio", "Serif clásica titulada", "Grotesca black condensada", "Stencil de plantilla"],
  "Foil Stamp / Metallic": ["Serif moderna alto contraste", "Serif clásica titulada", "Itálica solemne", "Display caligráfica expresiva"],
  "Puff Print / 3D Ink": ["Rounded amable", "Grotesca black condensada", "Slab pesada de oficio", "Custom modular geométrica"]
};

/* Compatibilidad global */
window.ESTILO_INFO = ESTILO_INFO;
window.ESTILOS_LIST = ESTILOS_LIST;
window.SATURACION = SATURACION;
window.LAYOUTS = LAYOUTS;
window.TIPOS = TIPOS;
window.TRATAMIENTOS = TRATAMIENTOS;
window.FORMAS = FORMAS;
window.INTEGRACION = INTEGRACION;
window.COLOR_FAMILIES = COLOR_FAMILIES;
window.HEX_DE_PALETA = HEX_DE_PALETA;
window.COLOR_MODES = COLOR_MODES;
window.lum = lum;
window.hexScheme = hexScheme;
window.POOLS = POOLS;
window.TEXTO_FALLBACK_SECULAR = TEXTO_FALLBACK_SECULAR;
window.OBJECT_BANK_COMMON = OBJECT_BANK_COMMON;
window.STYLE_CANDIDATES = STYLE_CANDIDATES;
window.STYLE_POOLS = STYLE_POOLS;
window.STYLE_COLOR_PREF = STYLE_COLOR_PREF;
window.STYLE_TIPO_PREF = STYLE_TIPO_PREF;