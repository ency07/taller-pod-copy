'use strict';

/* ============================================================
   DATA PRODUCTOS — REGLAS Y SESGOS POR SOPORTE
   Define cómo debe comportarse el arte según el producto físico.
   Diferenciación real: textil vs lámina metálica vs gorra.
   ============================================================ */

const PRODUCT_BIAS = {
  "CAMISETA SOFT": {
    trat: ["SOFT", "MODERN"],
    layout: [
      "Axial centrado",
      "Emblema circular",
      "Columna apilada",
      "Tarjeta interior"
    ],
    density: ["Balanced", "Minimal"],
    hierarchy: ["BALANCEADO", "TEXTO_DOMINANTE"],
    scale: "gráfico de pecho medio o espalda completa; lectura clara a distancia social; silueta reconocible; cero microtexto; fondo controlado o transparente; detalle medio-bajo viable en tela suave",
    mockup: "camiseta puesta (frontal y tres cuartos)",
    safeMargin: "respetar costuras laterales, cuello y dobladillo inferior"
  },
  "CAMISETA APPAREL": {
    trat: ["MODERN", "SOFT"],
    layout: [
      "Sello descentrado",
      "Editorial asimétrica",
      "Tarjeta interior",
      "Split 2/3-1/3"
    ],
    density: ["Minimal", "Balanced"],
    hierarchy: ["TEXTO_DOMINANTE", "BALANCEADO"],
    scale: "gráfico compacto para pecho izquierdo o composición editorial de espalda media; mucho aire negativo; estética de marca; tipografía con intención; menos masa pesada",
    mockup: "prenda fashion (plana o modelo)",
    safeMargin: "respetar costuras y zona de etiqueta"
  },
  "HOODIE": {
    trat: ["HEAVY", "MODERN"],
    layout: [
      "Sangrado total",
      "Tríptico de bandas",
      "Banda horizontal",
      "Diagonal descendente"
    ],
    density: ["Heavy", "Balanced"],
    hierarchy: ["OBJETO_DOMINANTE", "BALANCEADO"],
    scale: "gráfico amplio que aprovecha el frente o espalda oversized; masas visuales fuertes; alto contraste; lectura contundente; detalle medio viable en tela gruesa; cero delicadeza extrema",
    mockup: "hoodie puesto (frontal y espalda)",
    safeMargin: "respetar bolsillo canguro, capucha y costuras laterales"
  },
  "GORRA": {
    trat: ["MODERN", "HEAVY", "SOFT"],
    layout: [
      "Emblema circular",
      "Sello descentrado",
      "Axial centrado",
      "Tarjeta interior"
    ],
    density: ["Minimal", "Balanced"],
    hierarchy: ["OBJETO_DOMINANTE", "TEXTO_DOMINANTE"],
    scale: "motivo compacto de un solo foco en panel frontal curvo; texto breve y legible a tamaño reducido; silueta reconocible en miniatura; cero escenas completas; cero frases largas; detalle bajo viable para bordado, parche o impresión",
    mockup: "gorra frontal y tres cuartos + acercamiento del panel",
    safeMargin: "respetar costuras del panel, visera y botón superior"
  },
  "ILUSTRACION PREMIUM APPAREL": {
    trat: ["SOFT", "MODERN"],
    layout: [
      "Editorial asimétrica",
      "Retícula áurea",
      "Órbita radial",
      "Arco y cúpula"
    ],
    density: ["Balanced", "Heavy"],
    hierarchy: ["OBJETO_DOMINANTE", "BALANCEADO"],
    scale: "ilustración amplia para lienzo completo 4:5; detalle legible pero viable en textil premium; más profundidad que camiseta soft; atmósfera controlada; jerarquía clara; no es póster de pared",
    mockup: "prenda premium o presentación textil enmarcada",
    safeMargin: "respetar márgenes de impresión textil amplia"
  },
  "MUG": {
    trat: ["MODERN", "SOFT", "EXPRESSIVE"],
    layout: ["Emblema circular", "Sello descentrado", "Banda horizontal", "Tarjeta interior"],
    density: ["Minimal", "Balanced"],
    hierarchy: ["TEXTO_DOMINANTE", "BALANCEADO", "OBJETO_DOMINANTE"],
    scale: "arte para zona imprimible visible de una taza; foco legible de frente, sin detalles criticos junto al asa; medidas dependen del proveedor",
    mockup: "taza con asa visible en vista frontal y tres cuartos, mas vista plana del arte",
    safeMargin: "deja margen en el area imprimible y confirma la plantilla exacta del proveedor"
  },
  "MOCHILA": {
    trat: ["HEAVY", "MODERN"],
    layout: [
      "Emblema circular",
      "Axial centrado",
      "Banda horizontal",
      "Tarjeta interior"
    ],
    density: ["Balanced", "Minimal"],
    hierarchy: ["OBJETO_DOMINANTE", "BALANCEADO"],
    scale: "motivo contenido para panel frontal o bolsillo delantero; un solo foco reconocible; cero escenas completas; detalle medio viable en lona o poliéster; lectura clara a distancia social",
    mockup: "mochila frontal y tres cuartos + acercamiento del panel impreso",
    safeMargin: "respetar cierres, costuras, correas y bordes del bolsillo; no extender el arte sobre herrajes"
  },
  "TOTE BAG": {
    trat: ["SOFT", "MODERN"],
    layout: [
      "Axial centrado",
      "Emblema circular",
      "Editorial asimétrica",
      "Tarjeta interior"
    ],
    density: ["Balanced", "Minimal"],
    hierarchy: ["BALANCEADO", "TEXTO_DOMINANTE", "OBJETO_DOMINANTE"],
    scale: "arte para cara frontal plana y amplia; admite composición generosa o patrón repetido en modelos de sublimación; detalle medio viable en tela; cero microtexto",
    mockup: "bolso de frente plano + vista tres cuartos con asas visibles",
    safeMargin: "respetar asas, costuras laterales y dobladillo inferior; no invadir la zona de las asas"
  },
  "FUNDA MÓVIL": {
    trat: ["MODERN", "SOFT"],
    layout: [
      "Axial centrado",
      "Tarjeta interior",
      "Sello descentrado",
      "Emblema circular"
    ],
    density: ["Minimal", "Balanced"],
    hierarchy: ["OBJETO_DOMINANTE", "BALANCEADO"],
    scale: "arte para trasera pequeña de funda; motivo compacto de trazo grueso; texto mínimo o nulo; cero microtexto y cero detalle fino; el recorte de cámara manda sobre la composición",
    mockup: "funda en vista trasera plana + tres cuartos sobre teléfono",
    safeMargin: "respetar recorte de cámara, bordes curvos y botones laterales; nada indispensable bajo el recorte"
  },
  "DISPLATE": {
    trat: ["MODERN", "HEAVY"],
    layout: [
      "Retícula áurea",
      "Editorial asimétrica",
      "Arco y cúpula",
      "Tarjeta interior",
      "Sangrado total",
      "Split 2/3-1/3"
    ],
    density: ["Balanced", "Heavy"],
    hierarchy: ["OBJETO_DOMINANTE", "BALANCEADO"],
    scale: "composición de póster a lienzo completo rectangular; full-bleed permitido; margen de seguridad obligatorio para marco/montaje; detalle alto permitido; atmósfera y textura ricas; lectura fuerte a distancia variable; fondo completo si la obra lo pide; NO usar lógica de camiseta, pecho ni estampado textil",
    mockup: "lámina metálica en pared (ambiente real) + vista frontal plana",
    safeMargin: "mínimo 5% del lienzo libre en los cuatro bordes para montaje seguro"
  }
};

const PLACEMENT = {
  "CAMISETA SOFT": "pecho centrado medio o espalda completa",
  "CAMISETA APPAREL": "pecho izquierdo pequeño o espalda media editorial",
  "HOODIE": "pecho amplio o espalda oversized",
  "GORRA": "panel frontal de la gorra; composición compacta y centrada, respetando costuras, curva y visera",
  "ILUSTRACION PREMIUM APPAREL": "lienzo completo 4:5 sobre textil premium",
  "MUG": "zona imprimible de taza; diseno legible de frente y separado del asa",
  "MOCHILA": "panel frontal o bolsillo delantero; composición contenida respetando cierres, costuras y correas",
  "TOTE BAG": "cara frontal centrada en área plana amplia; admite repetición en modelos de sublimación",
  "FUNDA MÓVIL": "trasera completa respetando recorte de cámara y bordes curvos",
  "DISPLATE": "lienzo rectangular completo con margen de marco; pieza de pared, no prenda"
};

const PRODUCT_RULES = {
  "GORRA": "GORRA: diseña dentro del panel frontal pequeño y ligeramente curvo. Usa un foco claro, silueta reconocible a tamaño reducido y texto breve; conserva legibilidad y evita microtexto. Ajusta el detalle a una aplicación viable para gorra (bordado, parche o impresión) según el estilo; no supongas que todos los acabados son bordado. No extiendas el arte sobre costuras, visera ni paneles laterales salvo que se pida explícitamente. En la lámina de presentación muestra gorras reales de frente y en vista tres cuartos, con un acercamiento del área impresa o bordada.",
  "MUG": "MUG: crea arte para taza con asa, no lamina plana. Mantén el foco principal en el area visible, evita texto indispensable sobre el asa y conserva lectura en la curvatura. No inventes medidas ni afirmes que la plantilla esta validada; varia segun proveedor.",
  "MOCHILA": "MOCHILA: diseña para panel frontal o bolsillo delantero, no lienzo libre. Un solo foco reconocible; no extiendas el arte sobre cierres, costuras, correas ni herrajes. Detalle medio viable en lona o poliéster. La plantilla exacta varía según proveedor y modelo.",
  "TOTE BAG": "TOTE BAG: diseña para cara frontal plana y amplia. Respeta asas, costuras laterales y dobladillo. En modelos de sublimación se permite patrón repetido en toda la superficie; en algodón estándar, composición centrada. No afirmes medidas; varían por proveedor.",
  "FUNDA MÓVIL": "FUNDA MÓVIL: diseña para trasera pequeña con recorte de cámara. Trazo grueso, motivo compacto, texto mínimo o nulo; prohibido microtexto y detalle fino. Nada indispensable bajo el recorte de cámara ni sobre bordes curvos o botones. La plantilla varía por modelo de teléfono.",
  "DISPLATE": "DISPLATE: esto NO es una camiseta ni un estampado textil. Diseña una obra mural premium para impresión sobre metal. Usa composición rectangular completa (full-bleed permitido). Respeta margen de seguridad mínimo del 5% en los cuatro bordes para montaje. Permite detalle alto, atmósfera, textura rica y fondo completo. La lectura debe funcionar tanto de cerca como de lejos. No uses lógica de pecho, espalda, panel frontal ni placement textil. El mockup debe mostrar la lámina en pared o ambiente real, nunca sobre cuerpo humano. Evita texto pegado a los bordes. La paleta debe ser sólida y limpia para impresión metálica."
};

const PRODUCT_MOCKUP_RULES = {
  "CAMISETA SOFT": "dos mockups de camiseta (uno oscuro y otro claro); vista frontal y tres cuartos",
  "CAMISETA APPAREL": "dos mockups de prenda fashion (plana o modelo); vista frontal y detalle",
  "HOODIE": "dos mockups de hoodie (uno oscuro y otro claro); vista frontal y espalda",
  "GORRA": "dos mockups de gorra (vista frontal y tres cuartos) y acercamiento del panel con el acabado elegido",
  "MUG": "taza con asa visible en vista frontal y tres cuartos, mas vista plana del arte",
  "MOCHILA": "dos mockups de mochila (frontal y tres cuartos) y acercamiento del panel impreso",
  "TOTE BAG": "dos mockups de bolso (frente plano y tres cuartos con asas visibles)",
  "FUNDA MÓVIL": "dos mockups de funda (trasera plana y tres cuartos sobre teléfono)",
  "ILUSTRACION PREMIUM APPAREL": "dos mockups de prenda premium o presentación textil enmarcada",
  "DISPLATE": "dos mockups de placa mural metálica: uno frontal plano y otro en ambiente real (pared, habitación, setup)"
};

/* ============================================================
   HELPERS DE PRODUCTO
   ============================================================ */

function getProductBias(product) {
  return PRODUCT_BIAS[product] || PRODUCT_BIAS["CAMISETA SOFT"];
}

function getPlacement(product) {
  return PLACEMENT[product] || PLACEMENT["CAMISETA SOFT"];
}

function getProductRule(product) {
  return PRODUCT_RULES[product] || "";
}

function getMockupRule(product) {
  return PRODUCT_MOCKUP_RULES[product] || PRODUCT_MOCKUP_RULES["CAMISETA SOFT"];
}

function isWallArt(product) {
  return product === "DISPLATE";
}

function isHeadwear(product) {
  return product === "GORRA";
}

function isTextile(product) {
  return product !== "DISPLATE" && product !== "MUG" && product !== "FUNDA MÓVIL";
}
function isDrinkware(product) {
  return product === "MUG";
}
function isCase(product) {
  return product === "FUNDA MÓVIL";
}
function isBag(product) {
  return product === "MOCHILA" || product === "TOTE BAG";
}

function getProductScaleDirective(product) {
  const bias = getProductBias(product);
  return bias.scale || "escala y superficie de impresión adecuadas al producto";
}

function getSafeMarginDirective(product) {
  const bias = getProductBias(product);
  return bias.safeMargin || "respetar márgenes de impresión del producto";
}

/* Compatibilidad global */
window.PRODUCT_BIAS = PRODUCT_BIAS;
window.PLACEMENT = PLACEMENT;
window.PRODUCT_RULES = PRODUCT_RULES;
window.PRODUCT_MOCKUP_RULES = PRODUCT_MOCKUP_RULES;
window.isDrinkware = isDrinkware;
window.isCase = isCase;
window.isBag = isBag;