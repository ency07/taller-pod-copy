'use strict';

/* ============================================================
   DATA AUDIENCIAS â€” POD COMERCIAL COLOMBIA
   Audiencias diferenciadas por región + género + edad/etapa.
   No son decorativas: gobiernan estilo, tipografía, forma,
   tratamiento, layout, densidad, color y jerarquía.
   ============================================================ */

const AUD_PROFILES = {

  /* ================= COSTA CARIBE ================= */

  coste_joven_m: {
    label: "Costeño joven 16-28",
    region: "costa_caribe",
    genero: "masculino",
    edad: "joven",
    perfil: "Joven costeño: calle, champeta, humor rápido, identidad caribe",
    codigos: "barrio, calor, esquina, picó, mamadera de gallo, ritmo, color vivo",
    rechaza: "formalidad andina, minimalismo frío, tipografía delicada, estética corporativa",
    contexto: "camiseta de salida, parche, festival, calle, regalo entre panas",
    directiva: "Alto impacto, tipografía fuerte, color caliente, lectura inmediata",
    tipoPref: [
      "Grotesca black condensada",
      "Stencil de plantilla",
      "Custom modular geométrica"
    ],
    modoCol: [
      "Contraste duro",
      "Oscuro profundo",
      "Medio con acento"
    ],
    tratPref: [
      "HEAVY",
      "MODERN"
    ],
    formaPref: [
      "fragmentado en planos",
      "geometrizado por módulos"
    ]
  },

  coste_joven_f: {
    label: "Costeña joven 16-28",
    region: "costa_caribe",
    genero: "femenino",
    edad: "joven",
    perfil: "Joven costeña: empoderamiento caribe, frescura, estética tropical real",
    codigos: "brisa, pelo, mar, fruta, color, alegría, fuerza sin infantilización",
    rechaza: "rosa genérico, delicadeza vacía, estética importada sin territorio",
    contexto: "camiseta casual, salida, redes, emprendimiento, regalo personal",
    directiva: "Color cálido, trazo expresivo, composición viva pero limpia",
    tipoPref: [
      "Lettering brush gestual",
      "Rounded amable",
      "Sans humanista limpia"
    ],
    modoCol: [
      "Claro editorial",
      "Medio con acento",
      "Papel envejecido"
    ],
    tratPref: [
      "MODERN",
      "SOFT"
    ],
    formaPref: [
      "caligráfico de un solo trazo",
      "orgánico gestual con pincel"
    ]
  },

  coste_adulto_m: {
    label: "Costeño adulto 29-55",
    region: "costa_caribe",
    genero: "masculino",
    edad: "adulto",
    perfil: "Adulto costeño: oficio, barrio, nostalgia caribe, orgullo de raíz",
    codigos: "vallenato, faena, mar, tienda, patio, trabajo, palabra empeñada",
    rechaza: "glitch juvenil, estética digital fría, minimalismo sin carácter",
    contexto: "camiseta de diario, oficio, reunión familiar, regalo de identidad",
    directiva: "Peso visual, textura cálida, emblema o escena con memoria",
    tipoPref: [
      "Slab pesada de oficio",
      "Serif clásica titulada",
      "Rounded amable"
    ],
    modoCol: [
      "Papel envejecido",
      "Contraste duro",
      "Medio con acento"
    ],
    tratPref: [
      "MODERN",
      "HEAVY"
    ],
    formaPref: [
      "tallado en bloque",
      "silueta sólida a una tinta"
    ]
  },

  coste_adulta_f: {
    label: "Costeña adulta 29-55",
    region: "costa_caribe",
    genero: "femenino",
    edad: "adulto",
    perfil: "Adulta costeña: familia, fe popular, tradición oral, fuerza serena",
    codigos: "casa, patio, cocina, promesa, herencia, abrazo, palabra firme",
    rechaza: "brutalismo agresivo, estética urbana dura, caricatura infantil",
    contexto: "regalo familiar, camiseta cotidiana, fecha especial, memoria afectiva",
    directiva: "Calidez, composición ordenada, texto legible, emoción sin exceso",
    tipoPref: [
      "Serif clásica titulada",
      "Script de pluma",
      "Rounded amable"
    ],
    modoCol: [
      "Papel envejecido",
      "Claro editorial",
      "Medio con acento"
    ],
    tratPref: [
      "SOFT",
      "MODERN"
    ],
    formaPref: [
      "orgánico gestual con pincel",
      "caligráfico de un solo trazo"
    ]
  },

  /* ================= ANDINA ================= */

  andino_joven_m: {
    label: "Andino joven 16-28",
    region: "andina",
    genero: "masculino",
    edad: "joven",
    perfil: "Joven andino: urbano, indie, sarcasmo rolo/medellinense, minimalismo frío",
    codigos: "ciudad, café, bus, ironía, noche, estudio, referencia local",
    rechaza: "tropical excesivo, color saturado sin control, estética costeña forzada",
    contexto: "camiseta urbana, salida casual, universidad, emprendimiento creativo",
    directiva: "Composición limpia, contraste controlado, lectura moderna",
    tipoPref: [
      "Sans humanista limpia",
      "Mono técnica",
      "Geométrica deconstructivista"
    ],
    modoCol: [
      "Oscuro profundo",
      "Bicolor monocromo",
      "Contraste duro"
    ],
    tratPref: [
      "MODERN",
      "HEAVY"
    ],
    formaPref: [
      "geometrizado por módulos",
      "fragmentado en planos"
    ]
  },

  andino_joven_f: {
    label: "Andina joven 16-28",
    region: "andina",
    genero: "femenino",
    edad: "joven",
    perfil: "Joven andina: aesthetic, café, botánico, minimalismo cálido",
    codigos: "montaña, café, libros, plantas, textura suave, calma",
    rechaza: "estridencia, caricatura regional, exceso decorativo",
    contexto: "camiseta casual, regalo personal, marca pequeña, uso diario",
    directiva: "Línea limpia, paleta suave, composición aireada",
    tipoPref: [
      "Serif moderna alto contraste",
      "Sans humanista limpia",
      "Script de pluma"
    ],
    modoCol: [
      "Claro editorial",
      "Bicolor monocromo",
      "Medio con acento"
    ],
    tratPref: [
      "SOFT",
      "MODERN"
    ],
    formaPref: [
      "contorno lineal calibrado",
      "orgánico gestual con pincel"
    ]
  },

  andino_adulto_m: {
    label: "Andino adulto 29-55",
    region: "andina",
    genero: "masculino",
    edad: "adulto",
    perfil: "Adulto andino: oficio tradicional, herencia paisa/rola, trabajo serio",
    codigos: "taller, herramienta, café, carretera, negocio, legado",
    rechaza: "neón, glitch, estética juvenil extrema",
    contexto: "camiseta de trabajo, regalo de gremio, identidad regional",
    directiva: "Peso de oficio, tipografía sólida, composición estable",
    tipoPref: [
      "Slab pesada de oficio",
      "Serif clásica titulada",
      "Stencil de plantilla"
    ],
    modoCol: [
      "Papel envejecido",
      "Oscuro profundo",
      "Bicolor monocromo"
    ],
    tratPref: [
      "MODERN",
      "HEAVY"
    ],
    formaPref: [
      "tallado en bloque",
      "grabado a buril con tramas"
    ]
  },

  andino_adulta_f: {
    label: "Andina adulta 29-55",
    region: "andina",
    genero: "femenino",
    edad: "adulto",
    perfil: "Adulta andina: familia numerosa, tradición, artesanía, fe popular sobria",
    codigos: "hogar, cocina, mercado, tejido, herencia, reunión",
    rechaza: "oscuridad agresiva, confrontación visual, ironía dura",
    contexto: "regalo familiar, camiseta cotidiana, fecha especial, emprendimiento",
    directiva: "Textura amable, orden visual, texto cálido y claro",
    tipoPref: [
      "Serif clásica titulada",
      "Rounded amable",
      "Manuscrita de cuaderno"
    ],
    modoCol: [
      "Papel envejecido",
      "Claro editorial",
      "Bicolor monocromo"
    ],
    tratPref: [
      "SOFT",
      "MODERN"
    ],
    formaPref: [
      "orgánico gestual con pincel",
      "contorno lineal calibrado"
    ]
  },

  /* ================= PACÍFICO ================= */

  pacifico_raiz: {
    label: "Pacífico raíz",
    region: "pacifica",
    genero: "unisex",
    edad: "adulto",
    perfil: "Pacífico colombiano: mar, selva, currulao, resistencia, memoria negra",
    codigos: "río, manglar, marimba, lluvia, comunidad, canto, territorio",
    rechaza: "estética caribe brillante, turismo superficial, color neón forzado",
    contexto: "camiseta cultural, identidad territorial, evento comunitario",
    directiva: "Textura orgánica, tonos tierra/mar, composición profunda",
    tipoPref: [
      "Serif clásica titulada",
      "Manuscrita de cuaderno",
      "Sans humanista limpia"
    ],
    modoCol: [
      "Oscuro profundo",
      "Papel envejecido",
      "Medio con acento"
    ],
    tratPref: [
      "SOFT",
      "MODERN"
    ],
    formaPref: [
      "manchado acuoso",
      "orgánico gestual con pincel"
    ]
  },

  /* ================= LLANOS ================= */

  llanos_identidad: {
    label: "Llanos identidad",
    region: "llanos",
    genero: "unisex",
    edad: "adulto",
    perfil: "Llano colombiano: horizonte, ganado, joropo, trabajo recio",
    codigos: "sabana, caballo, arpa, cuero, sol, camino, faena",
    rechaza: "estética urbana digital, minimalismo frío, color pastel artificial",
    contexto: "camiseta regional, feria, identidad llanera, regalo de tierra",
    directiva: "Silueta fuerte, paleta tierra, lectura amplia",
    tipoPref: [
      "Slab pesada de oficio",
      "Serif clásica titulada",
      "Rounded amable"
    ],
    modoCol: [
      "Papel envejecido",
      "Contraste duro",
      "Medio con acento"
    ],
    tratPref: [
      "MODERN",
      "HEAVY"
    ],
    formaPref: [
      "silueta sólida a una tinta",
      "tallado en bloque"
    ]
  },

  /* ================= AMAZONÍA ================= */

  amazonia_territorio: {
    label: "Amazonía territorio",
    region: "amazonia",
    genero: "unisex",
    edad: "adulto",
    perfil: "Amazonía colombiana: selva, río, saberes, biodiversidad viva",
    codigos: "selva, río, hoja, animal, comunidad, origen, agua",
    rechaza: "exotismo turístico, caricatura indígena, verde genérico",
    contexto: "camiseta cultural, identidad ambiental, recuerdo territorial",
    directiva: "Composición orgánica, detalle natural, paleta selva/río",
    tipoPref: [
      "Manuscrita de cuaderno",
      "Sans humanista limpia",
      "Serif clásica titulada"
    ],
    modoCol: [
      "Oscuro profundo",
      "Papel envejecido",
      "Claro editorial"
    ],
    tratPref: [
      "SOFT",
      "MODERN"
    ],
    formaPref: [
      "manchado acuoso",
      "contorno lineal calibrado"
    ]
  },

  /* ================= INFANTIL NACIONAL ================= */

  infantil_col: {
    label: "Infantil Colombia",
    region: "nacional",
    genero: "unisex",
    edad: "infantil",
    perfil: "Infantil colombiano: juego, fauna, color, ternura sin violencia",
    codigos: "animales, cuento, escuela, cumpleaños, juego, colores vivos",
    rechaza: "oscuridad, violencia, texto denso, simbolismo adulto",
    contexto: "camiseta infantil, cumpleaños, colegio, regalo familiar",
    directiva: "Formas amables, lectura fácil, color limpio, cero amenaza",
    tipoPref: [
      "Rounded amable",
      "Manuscrita de cuaderno",
      "Sans humanista limpia"
    ],
    modoCol: [
      "Claro editorial",
      "Medio con acento"
    ],
    tratPref: [
      "SOFT"
    ],
    formaPref: [
      "orgánico gestual con pincel",
      "manchado acuoso"
    ]
  },

  /* ================= UNISEX NACIONAL ================= */

  unisex_nacional: {
    label: "Unisex nacional â€” todas las edades",
    region: "nacional",
    genero: "unisex",
    edad: "amplia",
    perfil: "Unisex Colombia: identidad amplia, legible, sin regionalismo forzado",
    codigos: "país, biodiversidad, humor compartido, orgullo común",
    rechaza: "política divisiva, regionalismo excluyente, cliché turístico",
    contexto: "camiseta de venta amplia, regalo general, uso diario",
    directiva: "Claridad, equilibrio, legibilidad amplia",
    tipoPref: [
      "Sans humanista limpia",
      "Serif moderna alto contraste",
      "Rounded amable"
    ],
    modoCol: [
      "Contraste duro",
      "Claro editorial",
      "Bicolor monocromo"
    ],
    tratPref: [
      "MODERN",
      "SOFT"
    ],
    formaPref: [
      "silueta sólida a una tinta",
      "contorno lineal calibrado"
    ]
  },

  /* ================= GLOBAL EN (3, sin repetición) ================= */
  global_young_en: {
    label: "Global Youth 18-34",
    region: "global",
    genero: "unisex",
    edad: "18-34",
    perfil: "Global young adult: meme-smart, minimal, giftable",
    codigos: "relatable, hobby, fandom, side hustle, self-care",
    rechaza: "local slang, regional politics, untranslatable puns",
    contexto: "etsy gift, everyday tee, dorm, street",
    directiva: "Clean read, strong hook, one idea per design",
    tipoPref: ["Sans humanista limpia", "Grotesca black condensada", "Rounded amable"],
    modoCol: ["Contraste duro", "Claro editorial"],
    tratPref: ["MODERN"],
    formaPref: ["silueta sólida a una tinta", "geometrizado por módulos"]
  },
  global_adult_en: {
    label: "Global Adult 35-55",
    region: "global",
    genero: "unisex",
    edad: "35-55",
    perfil: "Global adult: job, family, proud hobby, clean humor",
    codigos: "profession, dad/mom life, fishing, gym, vintage",
    rechaza: "edgy teen irony, clutter, tiny text",
    contexto: "gift for dad/mom, work pride, weekend",
    directiva: "Trustworthy, legible, warm",
    tipoPref: ["Serif clásica titulada", "Slab pesada de oficio", "Sans humanista limpia"],
    modoCol: ["Papel envejecido", "Claro editorial"],
    tratPref: ["MODERN", "SOFT"],
    formaPref: ["tallado en bloque", "silueta sólida a una tinta"]
  },
  global_family_en: {
    label: "Global Family â€” gift",
    region: "global",
    genero: "unisex",
    edad: "todas",
    perfil: "Matching family, milestones, pets",
    codigos: "family, matching, milestone, pet, memory",
    rechaza: "dark irony, politics, scary",
    contexto: "family gift, reunion, holiday",
    directiva: "Warm, safe, readable at distance",
    tipoPref: ["Rounded amable", "Sans humanista limpia", "Lettering brush gestual"],
    modoCol: ["Claro editorial", "Medio con acento"],
    tratPref: ["SOFT"],
    formaPref: ["orgánico gestual con pincel", "contorno lineal calibrado"]
  },

  /* ================= GLOBAL ES (3) ================= */
  global_joven_es: {
    label: "Global joven 18-34",
    region: "global_es",
    genero: "unisex",
    edad: "18-34",
    perfil: "Joven hispano global: neutro, sin regionalismos",
    codigos: "humor sano, hobby, música, superación",
    rechaza: "modismos de un solo país, política local",
    contexto: "regalo, uso diario, redes",
    directiva: "Neutro, claro, una idea por diseño",
    tipoPref: ["Sans humanista limpia", "Grotesca black condensada", "Rounded amable"],
    modoCol: ["Contraste duro", "Claro editorial"],
    tratPref: ["MODERN"],
    formaPref: ["silueta sólida a una tinta", "geometrizado por módulos"]
  },
  global_adulto_es: {
    label: "Global adulto 35-55",
    region: "global_es",
    genero: "unisex",
    edad: "35-55",
    perfil: "Adulto hispano: oficio, familia, orgullo",
    codigos: "oficio, papá/mamá, pesca, gym, vintage",
    rechaza: "ironía juvenil, saturación, microtexto",
    contexto: "regalo papá/mamá, orgullo laboral",
    directiva: "Confiable, legible, cálido",
    tipoPref: ["Serif clásica titulada", "Slab pesada de oficio", "Sans humanista limpia"],
    modoCol: ["Papel envejecido", "Claro editorial"],
    tratPref: ["MODERN", "SOFT"],
    formaPref: ["tallado en bloque", "silueta sólida a una tinta"]
  },
  global_familia_es: {
    label: "Global familia â€” regalo",
    region: "global_es",
    genero: "unisex",
    edad: "todas",
    perfil: "Familia, hitos, mascotas",
    codigos: "familia, hito, mascota, memoria",
    rechaza: "ironía oscura, política, miedo",
    contexto: "regalo familiar, reencuentro",
    directiva: "Cálido, seguro, legible",
    tipoPref: ["Rounded amable", "Sans humanista limpia", "Lettering brush gestual"],
    modoCol: ["Claro editorial", "Medio con acento"],
    tratPref: ["SOFT"],
    formaPref: ["orgánico gestual con pincel", "contorno lineal calibrado"]
  },

  /* ================= GOSPEL (3 ES + 3 EN, universales) ================= */
  gospel_joven_fe: {
    label: "Gospel joven 16-28 â€” fe",
    region: "universal_es",
    genero: "unisex",
    edad: "16-28",
    perfil: "Joven cristiano: identidad en Cristo, adoración, pureza",
    codigos: "gracia, cruz, luz, adoración, palabra",
    rechaza: "prosperidad mágica, decretos, esoterismo, vanidad",
    contexto: "camiseta ministerio, campamento, regalo iglesia",
    directiva: "Trinitario y cristocéntrico, texto con peso real",
    tipoPref: ["Sans humanista limpia", "Grotesca black condensada", "Lettering brush gestual"],
    modoCol: ["Contraste duro", "Claro editorial"],
    tratPref: ["MODERN"],
    formaPref: ["silueta sólida a una tinta", "contorno lineal calibrado"]
  },
  gospel_adulto_fe: {
    label: "Gospel adulto 29-55 â€” fe",
    region: "universal_es",
    genero: "unisex",
    edad: "29-55",
    perfil: "Adulto cristiano: pacto, palabra, descanso",
    codigos: "pacto, promesa, reposo, reino",
    rechaza: "herejía, santos mediadores, ángeles como centro",
    contexto: "servicio, familia fe, regalo congregación",
    directiva: "Solemne sin dureza, legible",
    tipoPref: ["Serif clásica titulada", "Slab pesada de oficio", "Sans humanista limpia"],
    modoCol: ["Papel envejecido", "Claro editorial"],
    tratPref: ["MODERN", "SOFT"],
    formaPref: ["tallado en bloque", "silueta sólida a una tinta"]
  },
  gospel_familia_fe: {
    label: "Gospel familia â€” fe",
    region: "universal_es",
    genero: "unisex",
    edad: "todas",
    perfil: "Familia en la fe, kids con verdad simple",
    codigos: "familia, hijos, casa sobre la roca",
    rechaza: "miedo, oscuridad, confusión doctrinal",
    contexto: "familia, escuela dominical, hogar",
    directiva: "Tierno y verdadero, cero amenaza",
    tipoPref: ["Rounded amable", "Sans humanista limpia", "Manuscrita de cuaderno"],
    modoCol: ["Claro editorial", "Medio con acento"],
    tratPref: ["SOFT"],
    formaPref: ["orgánico gestual con pincel", "manchado acuoso"]
  },
  gospel_youth_faith: {
    label: "Gospel Youth 16-28 â€” faith",
    region: "universal_en",
    genero: "unisex",
    edad: "16-28",
    perfil: "Young believer: identity in Christ",
    codigos: "grace, cross, light, worship, word",
    rechaza: "prosperity magic, decrees, esotericism",
    contexto: "ministry tee, camp, church gift",
    directiva: "Trinitarian, Christ-centered",
    tipoPref: ["Sans humanista limpia", "Grotesca black condensada", "Lettering brush gestual"],
    modoCol: ["Contraste duro", "Claro editorial"],
    tratPref: ["MODERN"],
    formaPref: ["silueta sólida a una tinta", "contorno lineal calibrado"]
  },
  gospel_adult_faith: {
    label: "Gospel Adult 29-55 â€” faith",
    region: "universal_en",
    genero: "unisex",
    edad: "29-55",
    perfil: "Adult believer: covenant, word, rest",
    codigos: "covenant, promise, rest, kingdom",
    rechaza: "heresy, mediators, angel-centered",
    contexto: "service, family faith",
    directiva: "Solemn yet warm, legible",
    tipoPref: ["Serif clásica titulada", "Slab pesada de oficio", "Sans humanista limpia"],
    modoCol: ["Papel envejecido", "Claro editorial"],
    tratPref: ["MODERN", "SOFT"],
    formaPref: ["tallado en bloque", "silueta sólida a una tinta"]
  },
  gospel_family_faith: {
    label: "Gospel Family â€” faith",
    region: "universal_en",
    genero: "unisex",
    edad: "all",
    perfil: "Family in faith, kids simple truth",
    codigos: "family, kids, house on rock",
    rechaza: "fear, darkness, doctrinal confusion",
    contexto: "family, sunday school, home",
    directiva: "Tender and true",
    tipoPref: ["Rounded amable", "Sans humanista limpia", "Manuscrita de cuaderno"],
    modoCol: ["Claro editorial", "Medio con acento"],
    tratPref: ["SOFT"],
    formaPref: ["orgánico gestual con pincel", "manchado acuoso"]
  }
};

const AUD_NAMES = Object.keys(AUD_PROFILES);

/* ============================================================
   COMPATIBILIDAD POR REGIÃ“N
   ============================================================ */

const REGION_AUDIENCES = {
  todas: AUD_NAMES,
  costa_caribe: [
    "coste_joven_m",
    "coste_joven_f",
    "coste_adulto_m",
    "coste_adulta_f",
    "infantil_col",
    "unisex_nacional"
  ],
  andina: [
    "andino_joven_m",
    "andino_joven_f",
    "andino_adulto_m",
    "andino_adulta_f",
    "infantil_col",
    "unisex_nacional"
  ],
  pacifica: [
    "pacifico_raiz",
    "infantil_col",
    "unisex_nacional"
  ],
  llanos: [
    "llanos_identidad",
    "infantil_col",
    "unisex_nacional"
  ],
  amazonia: [
    "amazonia_territorio",
    "infantil_col",
    "unisex_nacional"
  ],
  barranquilla: [
    "coste_joven_m",
    "coste_joven_f",
    "coste_adulto_m",
    "coste_adulta_f",
    "unisex_nacional"
  ],
  paisa: [
    "andino_joven_m",
    "andino_joven_f",
    "andino_adulto_m",
    "andino_adulta_f",
    "unisex_nacional"
  ],
  rolo: [
    "andino_joven_m",
    "andino_joven_f",
    "andino_adulto_m",
    "andino_adulta_f",
    "unisex_nacional"
  ],
  global: [
    "global_young_en",
    "global_adult_en",
    "global_family_en"
  ],
  global_es: [
    "global_joven_es",
    "global_adulto_es",
    "global_familia_es"
  ],
  universal_es: [
    "gospel_joven_fe",
    "gospel_adulto_fe",
    "gospel_familia_fe"
  ],
  universal_en: [
    "gospel_youth_faith",
    "gospel_adult_faith",
    "gospel_family_faith"
  ],
  us: ["global_young_en", "global_adult_en", "global_family_en"],
  uk: ["global_young_en", "global_adult_en", "global_family_en"],
  ca: ["global_young_en", "global_adult_en", "global_family_en"],
  au: ["global_young_en", "global_adult_en", "global_family_en"]
};

/* ============================================================
   PREFERENCIAS DE DECISIÃ“N VISUAL POR AUDIENCIA
   ============================================================ */

const AUD_HIERARCHY_PREF = {
  coste_joven_m: ["TEXTO_DOMINANTE", "SOLO_TEXTO"],
  coste_joven_f: ["BALANCEADO", "TEXTO_DOMINANTE"],
  coste_adulto_m: ["OBJETO_DOMINANTE", "BALANCEADO"],
  coste_adulta_f: ["BALANCEADO", "TEXTO_DOMINANTE"],
  andino_joven_m: ["TEXTO_DOMINANTE", "SOLO_TEXTO"],
  andino_joven_f: ["BALANCEADO", "TEXTO_DOMINANTE"],
  andino_adulto_m: ["OBJETO_DOMINANTE", "BALANCEADO"],
  andino_adulta_f: ["BALANCEADO", "TEXTO_DOMINANTE"],
  pacifico_raiz: ["OBJETO_DOMINANTE", "BALANCEADO"],
  llanos_identidad: ["OBJETO_DOMINANTE", "BALANCEADO"],
  amazonia_territorio: ["OBJETO_DOMINANTE", "BALANCEADO"],
  infantil_col: ["BALANCEADO", "OBJETO_DOMINANTE"],
  unisex_nacional: ["BALANCEADO", "TEXTO_DOMINANTE"],
  global_young_en: ["TEXTO_DOMINANTE", "BALANCEADO"],
  global_adult_en: ["OBJETO_DOMINANTE", "BALANCEADO"],
  global_family_en: ["BALANCEADO", "TEXTO_DOMINANTE"],
  global_joven_es: ["TEXTO_DOMINANTE", "BALANCEADO"],
  global_adulto_es: ["OBJETO_DOMINANTE", "BALANCEADO"],
  global_familia_es: ["BALANCEADO", "TEXTO_DOMINANTE"],
  gospel_joven_fe: ["TEXTO_DOMINANTE", "BALANCEADO"],
  gospel_adulto_fe: ["BALANCEADO", "OBJETO_DOMINANTE"],
  gospel_familia_fe: ["BALANCEADO", "TEXTO_DOMINANTE"],
  gospel_youth_faith: ["TEXTO_DOMINANTE", "BALANCEADO"],
  gospel_adult_faith: ["BALANCEADO", "OBJETO_DOMINANTE"],
  gospel_family_faith: ["BALANCEADO", "TEXTO_DOMINANTE"]
};

const AUD_DENSITY_PREF = {
  coste_joven_m: ["Heavy", "Minimal"],
  coste_joven_f: ["Balanced", "Minimal"],
  coste_adulto_m: ["Balanced", "Heavy"],
  coste_adulta_f: ["Balanced", "Minimal"],
  andino_joven_m: ["Minimal", "Balanced"],
  andino_joven_f: ["Minimal", "Balanced"],
  andino_adulto_m: ["Balanced", "Heavy"],
  andino_adulta_f: ["Balanced", "Minimal"],
  pacifico_raiz: ["Balanced", "Minimal"],
  llanos_identidad: ["Balanced", "Heavy"],
  amazonia_territorio: ["Balanced", "Minimal"],
  infantil_col: ["Balanced", "Minimal"],
  unisex_nacional: ["Minimal", "Balanced"],
  global_young_en: ["Minimal", "Balanced"],
  global_adult_en: ["Balanced", "Minimal"],
  global_family_en: ["Balanced", "Minimal"],
  global_joven_es: ["Minimal", "Balanced"],
  global_adulto_es: ["Balanced", "Minimal"],
  global_familia_es: ["Balanced", "Minimal"],
  gospel_joven_fe: ["Minimal", "Balanced"],
  gospel_adulto_fe: ["Balanced", "Minimal"],
  gospel_familia_fe: ["Balanced", "Minimal"],
  gospel_youth_faith: ["Minimal", "Balanced"],
  gospel_adult_faith: ["Balanced", "Minimal"],
  gospel_family_faith: ["Balanced", "Minimal"]
};

const AUD_STYLE_PREF = {
  coste_joven_m: [
    "Stencil Urbano",
    "C\u00f3mic / Halftone",
    "Y2K / Cyber",
    "Pixel / 8-bit",
    "Grunge / DIY",
    "Surf / Skate 90s",
    "Retro 80s Neon",
    "Vaporwave"
  ,
    "Anime / Manga",
    "Paste-up Wheatpaste",
    "Puff Print / 3D Ink",
    "Glow Zone / Zona fosforescente"],
  coste_joven_f: [
    "Folk Popular",
    "Hand-Drawn",
    "Retro 70s",
    "Collage Cut-Paper",
    "Airbrush Smooth",
    "Kids Storybook",
    "Bordado / Puntada",
    "Risograph"
  ,
    "Glitter Zone / Zona glitter"],
  coste_adulto_m: [
    "Vintage Desgastado",
    "Retro 70s",
    "Folk Popular",
    "Blueprint / Technical",
    "Brutalist",
    "Grabado / Linóleo",
    "Stencil Urbano",
    "Photomontage / Dada",
    "Vector Flat / Plano vectorial",
    "Indexed Palette / Paleta indizada"
  ,
    "Tattoo Old School",
    "Choke/Spread Trapping"],
  coste_adulta_f: [
    "Folk Popular",
    "Hand-Drawn",
    "Bordado / Puntada",
    "Acuarela Suelta",
    "Retro 70s",
    "Bohemian",
    "Collage Cut-Paper",
    "Airbrush Smooth"
  ,
    "Knockout / Reserva blanca",
    "White Ink Optimized / Tinta blanca optimizada",
    "Metallic Foil Ready / Listo para foil"],
  andino_joven_m: [
    "Minimal Modern",
    "Brutalist",
    "Y2K / Cyber",
    "Stencil Urbano",
    "Pixel / 8-bit",
    "Retro 80s Neon",
    "Grunge / DIY",
    "Risograph"
  ,
    "Anime / Manga",
    "Paste-up Wheatpaste",
    "Glow Zone / Zona fosforescente"],
  andino_joven_f: [
    "Minimal Modern",
    "Hand-Drawn",
    "Bohemian",
    "Acuarela Suelta",
    "Retro 70s",
    "Folk Popular",
    "Collage Cut-Paper",
    "Airbrush Smooth"
  ],
  andino_adulto_m: [
    "Vintage Desgastado",
    "Blueprint / Technical",
    "Retro 70s",
    "Grabado / Linóleo",
    "Brutalist",
    "Stencil Urbano",
    "Pixel / 8-bit",
    "Dark Tattoo",
    "Vector Flat / Plano vectorial",
    "CMYK Safe Gamut / Gamut CMYK seguro"
  ,
    "Gótico Ornamental",
    "Irezumi / Wabori",
    "Tattoo Old School",
    "Spot Color Simulated / Tintas planas simuladas",
    "Choke/Spread Trapping"],
  andino_adulta_f: [
    "Bohemian",
    "Hand-Drawn",
    "Folk Popular",
    "Acuarela Suelta",
    "Bordado / Puntada",
    "Retro 70s",
    "Collage Cut-Paper",
    "Vintage Desgastado"
  ],
  pacifico_raiz: [
    "Folk Popular",
    "Acuarela Suelta",
    "Ukiyo-e / Woodblock",
    "Sumi-e / Tinta Lavada",
    "Bohemian",
    "Retro 70s",
    "Collage Cut-Paper",
    "Papercraft 3D"
  ,
    "Irezumi / Wabori"],
  llanos_identidad: [
    "Vintage Desgastado",
    "Hand-Drawn",
    "Retro 70s",
    "Folk Popular",
    "Blueprint / Technical",
    "Bordado / Puntada",
    "Grabado / Linóleo",
    "Airbrush Smooth",
    "Distress Production / Desgaste de producción",
    "Halftone Controlled / Tramado controlado"
  ,
    "Knockout / Reserva blanca"],
  amazonia_territorio: [
    "Acuarela Suelta",
    "Bohemian",
    "Ukiyo-e / Woodblock",
    "Sumi-e / Tinta Lavada",
    "Folk Popular",
    "Vintage Desgastado",
    "Collage Cut-Paper",
    "Papercraft 3D"
  ],
  infantil_col: [
    "Kids Storybook",
    "Pixel / 8-bit",
    "C\u00f3mic / Halftone",
    "Hand-Drawn",
    "Retro 70s",
    "Airbrush Smooth",
    "Folk Popular",
    "Collage Cut-Paper"
  ,
    "Glitter Zone / Zona glitter"],
  unisex_nacional: [
    "Minimal Modern",
    "Hand-Drawn",
    "Folk Popular",
    "Retro 70s",
    "Vintage Desgastado",
    "Brutalist",
    "Bohemian",
    "Kids Storybook"
  ],
  global_young_en: ["Minimal Modern", "Brutalist", "Retro 70s", "Y2K / Cyber", "Stencil Urbano", "Pixel / 8-bit", "Vaporwave", "Grunge / DIY",
    "Puff Print / 3D Ink"],
  global_adult_en: ["Vintage Desgastado", "Minimal Modern", "Retro 70s", "Blueprint / Technical", "Hand-Drawn", "Folk Popular", "Grabado / Lin\u00f3leo", "Brutalist", "Vector Flat / Plano vectorial", "CMYK Safe Gamut / Gamut CMYK seguro"],
  global_family_en: ["Folk Popular", "Kids Storybook", "Hand-Drawn", "Retro 70s", "Bohemian", "Acuarela Suelta", "Collage Cut-Paper", "Airbrush Smooth"],
  global_joven_es: ["Minimal Modern", "Brutalist", "Retro 70s", "Y2K / Cyber", "Stencil Urbano", "Pixel / 8-bit", "Retro 80s Neon", "Vaporwave"],
  global_adulto_es: ["Vintage Desgastado", "Minimal Modern", "Retro 70s", "Blueprint / Technical", "Hand-Drawn", "Folk Popular", "Grabado / Lin\u00f3leo", "Bordado / Puntada", "Vector Flat / Plano vectorial", "Halftone Controlled / Tramado controlado",
    "Spot Color Simulated / Tintas planas simuladas"],
  global_familia_es: ["Folk Popular", "Kids Storybook", "Hand-Drawn", "Retro 70s", "Bohemian", "Acuarela Suelta", "Collage Cut-Paper", "Bordado / Puntada",
    "White Ink Optimized / Tinta blanca optimizada"],
  gospel_joven_fe: ["Minimal Modern", "Hand-Drawn", "Folk Popular", "Vitral / Mosaico", "Barroco Ornamental", "Acuarela Suelta", "Kids Storybook", "Airbrush Smooth"],
  gospel_adulto_fe: ["Folk Popular", "Vintage Desgastado", "Grabado / Lin\u00f3leo", "Vitral / Mosaico", "Barroco Ornamental", "Hand-Drawn", "Foil Stamp / Metallic", "Retro 70s",
    "Metallic Foil Ready / Listo para foil"],
  gospel_familia_fe: ["Folk Popular", "Kids Storybook", "Hand-Drawn", "Vitral / Mosaico", "Acuarela Suelta", "Bohemian", "Bordado / Puntada", "Collage Cut-Paper"],
  gospel_youth_faith: ["Minimal Modern", "Hand-Drawn", "Folk Popular", "Vitral / Mosaico", "Barroco Ornamental", "Acuarela Suelta", "Kids Storybook", "Airbrush Smooth"],
  gospel_adult_faith: ["Folk Popular", "Vintage Desgastado", "Grabado / Lin\u00f3leo", "Vitral / Mosaico", "Barroco Ornamental", "Hand-Drawn", "Foil Stamp / Metallic", "Retro 70s"],
  gospel_family_faith: ["Folk Popular", "Kids Storybook", "Hand-Drawn", "Vitral / Mosaico", "Acuarela Suelta", "Bohemian", "Bordado / Puntada", "Collage Cut-Paper"]
};

const AUD_LAYOUT_PREF = {
  coste_joven_m: [
    "Diagonal descendente",
    "Sangrado total",
    "Banda horizontal"
  ],
  coste_joven_f: [
    "Editorial asimétrica",
    "Ã“rbita radial",
    "Tarjeta interior"
  ],
  coste_adulto_m: [
    "Emblema circular",
    "Banda horizontal",
    "Axial centrado"
  ],
  coste_adulta_f: [
    "Arco y cúpula",
    "Tarjeta interior",
    "Ã“rbita radial"
  ],
  andino_joven_m: [
    "Editorial asimétrica",
    "Sello descentrado",
    "Retícula áurea"
  ],
  andino_joven_f: [
    "Tarjeta interior",
    "Editorial asimétrica",
    "Retícula áurea"
  ],
  andino_adulto_m: [
    "Emblema circular",
    "Axial centrado",
    "Banda horizontal"
  ],
  andino_adulta_f: [
    "Arco y cúpula",
    "Tarjeta interior",
    "Columna apilada"
  ],
  pacifico_raiz: [
    "Ã“rbita radial",
    "Editorial asimétrica",
    "Tarjeta interior"
  ],
  llanos_identidad: [
    "Banda horizontal",
    "Sello descentrado",
    "Emblema circular"
  ],
  amazonia_territorio: [
    "Editorial asimétrica",
    "Ã“rbita radial",
    "Retícula áurea"
  ],
  infantil_col: [
    "Ã“rbita radial",
    "Arco y cúpula",
    "Tarjeta interior"
  ],
  unisex_nacional: [
    "Retícula áurea",
    "Editorial asimétrica",
    "Tarjeta interior"
  ],
  global_young_en: ["Editorial asimétrica", "Sello descentrado", "Retícula áurea"],
  global_adult_en: ["Emblema circular", "Axial centrado", "Tarjeta interior"],
  global_family_en: ["Tarjeta interior", "Ã“rbita radial", "Arco y cúpula"],
  global_joven_es: ["Editorial asimétrica", "Sello descentrado", "Retícula áurea"],
  global_adulto_es: ["Emblema circular", "Axial centrado", "Tarjeta interior"],
  global_familia_es: ["Tarjeta interior", "Ã“rbita radial", "Arco y cúpula"],
  gospel_joven_fe: ["Editorial asimétrica", "Tarjeta interior", "Retícula áurea"],
  gospel_adulto_fe: ["Arco y cúpula", "Emblema circular", "Tarjeta interior"],
  gospel_familia_fe: ["Tarjeta interior", "Ã“rbita radial", "Arco y cúpula"],
  gospel_youth_faith: ["Editorial asimétrica", "Tarjeta interior", "Retícula áurea"],
  gospel_adult_faith: ["Arco y cúpula", "Emblema circular", "Tarjeta interior"],
  gospel_family_faith: ["Tarjeta interior", "Ã“rbita radial", "Arco y cúpula"]
};

/* ============================================================
   HELPERS PÃšBLICOS
   ============================================================ */

function getAudiencesForRegion(region) {
  const key = String(region || "todas").toLowerCase();
  const list = REGION_AUDIENCES[key] || REGION_AUDIENCES.todas || AUD_NAMES;
  return list.filter(function (id) {
    return AUD_PROFILES[id];
  });
}

/* Audiencias válidas por MERCADO + región.
   REGION_AUDIENCES no tiene entradas para spain/latam/mexico/cono_sur/diaspora,
   así que getAudiencesForRegion caía a "todas" = 25 perfiles colombianos mezclados
   (España mostrando costeños). Aquí cada mercado decide sus propias audiencias. */
const MARKET_AUDIENCE_LISTS = {
  // Español neutro global: perfiles sin acento de un solo país
  neutral_es: ["global_joven_es", "global_adulto_es", "global_familia_es"],
  // Inglés neutro global
  neutral_en: ["global_young_en", "global_adult_en", "global_family_en"],
  // Caribe hispano (códigos culturales caribeños, no andinos ni globales)
  caribe: ["coste_joven_m", "coste_joven_f", "coste_adulto_m", "coste_adulta_f"],
  // Diáspora: ES + EN juntas (el mandato es inglés/español/spanglish)
  diaspora: [
    "global_joven_es", "global_adulto_es", "global_familia_es",
    "global_young_en", "global_adult_en", "global_family_en"
  ]
};

const MARKET_AUDIENCES = {
  spain: MARKET_AUDIENCE_LISTS.neutral_es,
  latam: MARKET_AUDIENCE_LISTS.neutral_es,
  mexico: MARKET_AUDIENCE_LISTS.neutral_es,
  cono_sur: MARKET_AUDIENCE_LISTS.neutral_es
  // 'caribe' bajo latam va a neutral_es por la regla de marketId === "latam":
  // la única región "caribe" del sistema es latam/caribe, y los perfiles
  // costeños son colombianos (etiqueta "costeña"). Sandbox puro, sin fuga.
};

function getAudiencesForMarketRegion(marketId, regionId) {
  // Diáspora: lista propia sin importar la sub-región elegida
  if (marketId === "diaspora_col") return MARKET_AUDIENCE_LISTS.diaspora.slice();

  // Región "todas" = ANTES devolvía REGION_AUDIENCES.todas = los 25 perfiles
  // del sistema: Colombia terminaba viendo audiencias Global y Gospel.
  if (regionId === "todas") {
    return [
      "coste_joven_m", "coste_joven_f", "coste_adulto_m", "coste_adulta_f",
      "andino_joven_m", "andino_joven_f", "andino_adulto_m", "andino_adulta_f",
      "pacifico_raiz", "llanos_identidad", "amazonia_territorio",
      "infantil_col", "unisex_nacional"
    ];
  }

  // Región que define una lista propia de mercado (spain/latam/...)
  if (MARKET_AUDIENCES[regionId]) return MARKET_AUDIENCES[regionId].slice();

  // Mercado latam: fuera de sus regiones con lista propia, nada colombiano
  if (marketId === "latam" && !MARKET_AUDIENCES[regionId]) {
    return MARKET_AUDIENCE_LISTS.neutral_es.slice();
  }

  return getAudiencesForRegion(regionId);
}

function getAudienceLabel(id) {
  return AUD_PROFILES[id] ? AUD_PROFILES[id].label : id;
}

function getFirstAudienceForRegion(region) {
  const list = getAudiencesForRegion(region);
  return list[0] || "unisex_nacional";
}

function getAudienceSelectOptions(region) {
  const options = getAudiencesForRegion(region)
    .map(function (id) {
      return '<option value="' + id + '">' + getAudienceLabel(id) + '</option>';
    })
    .join("");

  return '<option value="Auto">Auto</option>' + options;
}

/* Compatibilidad explícita para otros scripts */
window.AUD_PROFILES = AUD_PROFILES;
window.getAudiencesForRegion = getAudiencesForRegion;
window.getAudiencesForMarketRegion = getAudiencesForMarketRegion;
window.AUD_NAMES = AUD_NAMES;
window.REGION_AUDIENCES = REGION_AUDIENCES;
window.AUD_HIERARCHY_PREF = AUD_HIERARCHY_PREF;
window.AUD_DENSITY_PREF = AUD_DENSITY_PREF;
window.AUD_STYLE_PREF = AUD_STYLE_PREF;
window.AUD_LAYOUT_PREF = AUD_LAYOUT_PREF;