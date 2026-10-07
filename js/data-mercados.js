'use strict';

/* ============================================================
   DATA MERCADOS — CAPA GLOBAL / MULTI-MERCADO
   Permite vender en mercados anglosajones, LATAM, España,
   Colombia y diáspora sin limitar la herramienta a un país.
   ============================================================ */

const POD_MARKET_ORDER = [
  "colombia",
  "global_en",
  "global_es",
  "gospel_es",
  "gospel_en",
  "anglo",
  "latam",
  "spain",
  "diaspora_col",
  "custom"
];

const POD_MARKETS = {

  global_en: {
    label: "Global / English",
    language: "en",
    culture: "global",
    audiencePack: "global",
    bankPacks: ["universal", "anglo"],
    legal: "strict",
    description: "Mercado internacional en inglés para Etsy, Amazon Merch, Redbubble, TeePublic, Displate y similares."
  },

  anglo: {
    label: "Anglo US/UK/CA/AU",
    language: "en",
    culture: "anglo",
    audiencePack: "global",
    bankPacks: ["universal", "anglo"],
    legal: "strict",
    description: "Mercado anglosajón con códigos culturales propios de Estados Unidos, Reino Unido, Canadá y Australia."
  },

  colombia: {
    label: "Colombia",
    language: "es",
    culture: "colombia",
    audiencePack: "colombia",
    bankPacks: ["universal", "colombia"],
    legal: "standard",
    description: "Mercado colombiano con regiones, humor local, temporadas y audiencias culturales propias."
  },

  latam: {
    label: "LATAM Español",
    language: "es",
    culture: "latam",
    audiencePack: "latam",
    bankPacks: ["universal", "latam"],
    legal: "standard",
    description: "Mercado hispanohablante amplio para México, Centroamérica, Caribe hispano, Andina y Cono Sur."
  },

  spain: {
    label: "España",
    language: "es",
    culture: "spain",
    audiencePack: "global_es",
    bankPacks: ["universal", "spain"],
    legal: "standard",
    description: "Mercado español con español europeo y referencias culturales propias."
  },

  diaspora_col: {
    label: "Diáspora Colombia",
    language: "spanglish",
    culture: "diaspora_col",
    audiencePack: "diaspora",
    bankPacks: ["universal", "colombia", "anglo"],
    legal: "strict",
    description: "Colombianos y latinos en USA, UK, Canadá o España. Identidad cultural con inglés, español o spanglish."
  },

  custom: {
    label: "Personalizado",
    language: "auto",
    culture: "custom",
    audiencePack: "global",
    bankPacks: ["universal"],
    legal: "standard",
    description: "Mercado manual para futuras expansiones o pruebas."
  },

  global_es: {
    label: "Global / Español",
    language: "es",
    culture: "global",
    audiencePack: "global_es",
    bankPacks: ["universal", "global_es"],
    legal: "standard",
    description: "Mercado global en español neutro, sin regionalismos. Para LATAM amplio y USA hispano."
  },

  gospel_es: {
    label: "Gospel / Español — Universal",
    language: "es",
    culture: "gospel",
    audiencePack: "gospel",
    bankPacks: ["gospel_es"],
    legal: "standard",
    doctrine: "trinitario_cristocentrico",
    description: "Gospel universal en español. Trinitario y cristocéntrico. Sin región, Dios es el mismo en todo lugar. Regla anti-herejía activa."
  },

  gospel_en: {
    label: "Gospel / English — Universal",
    language: "en",
    culture: "gospel",
    audiencePack: "gospel",
    bankPacks: ["gospel_en"],
    legal: "strict",
    doctrine: "trinitario_cristocentrico",
    description: "Gospel universal in English. Trinitarian, Christ-centered. No region. Anti-heresy rule on."
  }
};

const POD_LANGUAGES = {
  auto: "Auto — según mercado",
  en: "English",
  es: "Spanish",
  spanglish: "Spanglish / Diaspora"
};

const POD_MARKET_REGIONS = {

  global_en: [
    { id: "global", label: "Global" }
  ],

  anglo: [
    { id: "global", label: "Anglo general" },
    { id: "us", label: "United States" },
    { id: "uk", label: "United Kingdom" },
    { id: "ca", label: "Canada" },
    { id: "au", label: "Australia" }
  ],

  colombia: [
    { id: "todas", label: "Todas / Nacional" },
    { id: "barranquilla", label: "Barranquilla — propia" },
    { id: "costa_caribe", label: "Costa Caribe general" },
    { id: "paisa", label: "Paisa" },
    { id: "rolo", label: "Rolo / Bogotá" },
    { id: "andina", label: "Andina general" },
    { id: "pacifica", label: "Pacífica" },
    { id: "llanos", label: "Llanos" },
    { id: "amazonia", label: "Amazonía" }
  ],

  latam: [
    { id: "latam", label: "LATAM general" },
    { id: "mexico", label: "México" },
    { id: "caribe", label: "Caribe hispano" },
    { id: "andina", label: "Andina" },
    { id: "cono_sur", label: "Cono Sur" }
  ],

  spain: [
    { id: "spain", label: "España general" }
  ],

  diaspora_col: [
    { id: "global", label: "Diáspora general" },
    { id: "us", label: "Estados Unidos" },
    { id: "uk", label: "Reino Unido" },
    { id: "ca", label: "Canadá" },
    { id: "es", label: "España" }
  ],

  custom: [
    { id: "global", label: "Global" }
  ],

  global_es: [
    { id: "global_es", label: "Global hispano — sin región" }
  ],

  gospel_es: [
    { id: "universal_es", label: "Universal ES — no aplica región" }
  ],

  gospel_en: [
    { id: "universal_en", label: "Universal EN — no region" }
  ]
};

/* ============================================================
   SUBNICHOS GLOBALES EVERGREEN
   Estos funcionan para cualquier mercado anglosajón.
   ============================================================ */

const POD_GLOBAL_SUBNICHES = {

  evergreen: {

    pets: {
      label: "Pets and Animals",
      keywords: [
        "pet",
        "pets",
        "dog",
        "cat",
        "puppy",
        "kitten",
        "dog mom",
        "cat dad",
        "dog lover",
        "cat lover",
        "breed",
        "rescue",
        "veterinary",
        "vet",
        "animal"
      ]
    },

    professions: {
      label: "Professions and Careers",
      keywords: [
        "job",
        "career",
        "nurse",
        "teacher",
        "engineer",
        "programmer",
        "developer",
        "chef",
        "mechanic",
        "electrician",
        "welder",
        "entrepreneur",
        "small business",
        "work",
        "profession"
      ]
    },

    hobbies: {
      label: "Hobbies and Niche Interests",
      keywords: [
        "hobby",
        "gaming",
        "gamer",
        "fishing",
        "reading",
        "booktok",
        "book lover",
        "cycling",
        "hiking",
        "chess",
        "dnd",
        "gardening",
        "plants",
        "plant lover",
        "crafts"
      ]
    },

    sarcasm_introvert: {
      label: "Sarcasm and Introvert Humor",
      keywords: [
        "sarcasm",
        "sarcastic",
        "introvert",
        "introverted",
        "funny quote",
        "humor",
        "deadpan",
        "anti-social",
        "coffee humor",
        "meme quote",
        "relatable",
        "irony"
      ]
    },

    fitness_mental: {
      label: "Fitness and Mental Health",
      keywords: [
        "gym",
        "fitness",
        "workout",
        "running",
        "yoga",
        "mental health",
        "self care",
        "motivation",
        "discipline",
        "wellness",
        "healing",
        "growth"
      ]
    },

    family_milestones: {
      label: "Family and Milestones",
      keywords: [
        "family",
        "mom",
        "dad",
        "grandma",
        "grandpa",
        "baby",
        "wedding",
        "anniversary",
        "graduation",
        "milestone",
        "gift",
        "family gift"
      ]
    },

    music_fandom: {
      label: "Music and Generic Fandom",
      keywords: [
        "music",
        "music lover",
        "vinyl",
        "record",
        "concert",
        "playlist",
        "instrument",
        "guitar",
        "drums",
        "band lover",
        "audio"
      ]
    },

    food_drink: {
      label: "Food and Drink",
      keywords: [
        "foodie",
        "coffee",
        "wine",
        "beer",
        "bbq",
        "pizza",
        "tacos",
        "snack",
        "chef",
        "kitchen",
        "recipe",
        "drink"
      ]
    },

    outdoors_nature: {
      label: "Outdoors and Nature",
      keywords: [
        "outdoors",
        "camping",
        "hiking",
        "national park",
        "mountain",
        "lake",
        "adventure",
        "wildlife",
        "nature",
        "forest",
        "trail"
      ]
    },

    retro_nostalgia: {
      label: "Retro and Nostalgia",
      keywords: [
        "retro",
        "vintage",
        "80s",
        "90s",
        "nostalgia",
        "classic",
        "old school",
        "retro sunset",
        "throwback"
      ]
    },

    travel_adventure: {
      label: "Travel and Adventure",
      keywords: [
        "travel",
        "adventure",
        "wanderlust",
        "road trip",
        "map",
        "explore",
        "destination",
        "traveler",
        "journey"
      ]
    },

    inspirational_clean: {
      label: "Inspirational Clean",
      keywords: [
        "inspirational",
        "positive",
        "clean quote",
        "encouragement",
        "hope",
        "kind",
        "strength",
        "mindset",
        "uplifting"
      ]
    }
  },

  temporada: {

    valentines: {
      label: "Valentine's Day",
      keywords: [
        "valentine",
        "valentines day",
        "love",
        "couple",
        "heart",
        "romantic gift"
      ]
    },

    st_patricks: {
      label: "St. Patrick's Day",
      keywords: [
        "st patrick",
        "st patricks day",
        "irish",
        "shamrock",
        "luck"
      ]
    },

    easter: {
      label: "Easter",
      keywords: [
        "easter",
        "bunny",
        "egg hunt",
        "spring",
        "resurrection",
        "faith"
      ]
    },

    mothers_day: {
      label: "Mother's Day",
      keywords: [
        "mother",
        "mom",
        "mothers day",
        "mama",
        "mom gift"
      ]
    },

    fathers_day: {
      label: "Father's Day",
      keywords: [
        "father",
        "dad",
        "fathers day",
        "papa",
        "dad gift"
      ]
    },

    pride: {
      label: "Pride",
      keywords: [
        "pride",
        "lgbtq",
        "rainbow",
        "love is love",
        "ally"
      ]
    },

    back_to_school: {
      label: "Back to School",
      keywords: [
        "back to school",
        "teacher",
        "student",
        "school",
        "classroom"
      ]
    },

    halloween: {
      label: "Halloween",
      keywords: [
        "halloween",
        "spooky",
        "ghost",
        "pumpkin",
        "witch",
        "skeleton"
      ]
    },

    thanksgiving: {
      label: "Thanksgiving",
      keywords: [
        "thanksgiving",
        "turkey",
        "grateful",
        "family dinner",
        "autumn"
      ]
    },

    christmas: {
      label: "Christmas",
      keywords: [
        "christmas",
        "xmas",
        "santa",
        "holiday",
        "gift",
        "winter"
      ]
    },

    new_year: {
      label: "New Year",
      keywords: [
        "new year",
        "resolution",
        "celebration",
        "fresh start",
        "party"
      ]
    },

    black_friday: {
      label: "Black Friday / Cyber Monday",
      keywords: [
        "black friday",
        "cyber monday",
        "sale",
        "deal",
        "shopping"
      ]
    }
  }
};

/* ============================================================
   MARKETPLACES Y REGLAS LEGALES
   ============================================================ */

const POD_MARKETPLACES = {
  generic: "Generic",
  etsy: "Etsy",
  amazon: "Amazon Merch on Demand",
  redbubble: "Redbubble",
  teepublic: "TeePublic",
  displate: "Displate"
};

const POD_LEGAL_RULES = {
  directive: "Do not include trademarks, brand names, sports team names, university names, celebrities, copyrighted characters, song lyrics, movie quotes, logos, franchises, or protected intellectual property. Use original phrases and original artwork only.",
  prohibitedCategories: [
    "trademarks",
    "brands",
    "sports teams",
    "universities",
    "celebrities",
    "fictional characters",
    "movie quotes",
    "song lyrics",
    "copyrighted artwork",
    "logos",
    "franchises"
  ]
};

/* ============================================================
   HELPERS DE MERCADO
   ============================================================ */

function uniqueArray(arr) {
  const seen = new Set();
  const out = [];

  (arr || []).forEach(function (item) {
    if (!seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  });

  return out;
}

function getMarket(id) {
  return POD_MARKETS[id] || POD_MARKETS.global_en;
}

function getMarketLabel(id) {
  return getMarket(id).label;
}

function getMarketOptionsHTML(selectedId) {
  return POD_MARKET_ORDER.map(function (id) {
    const selected = id === selectedId ? " selected" : "";
    return '<option value="' + id + '"' + selected + '>' + POD_MARKETS[id].label + "</option>";
  }).join("");
}

function getRegionsForMarket(marketId) {
  return POD_MARKET_REGIONS[marketId] || POD_MARKET_REGIONS.global_en;
}

function getRegionOptionsHTML(marketId, selectedId) {
  const regions = getRegionsForMarket(marketId);

  return regions.map(function (region) {
    const selected = region.id === selectedId ? " selected" : "";
    return '<option value="' + region.id + '"' + selected + '>' + region.label + "</option>";
  }).join("");
}

function getDefaultRegionForMarket(marketId) {
  const regions = getRegionsForMarket(marketId);
  return regions.length ? regions[0].id : "global";
}

function getLanguageOptionsHTML(marketId) {
  const market = getMarket(marketId);
  const defaultLang = market.language || "auto";

  return Object.keys(POD_LANGUAGES).map(function (id) {
    const selected = id === defaultLang ? " selected" : "";
    return '<option value="' + id + '"' + selected + '>' + POD_LANGUAGES[id] + "</option>";
  }).join("");
}

function getMarketplaceOptionsHTML(selectedId) {
  return Object.keys(POD_MARKETPLACES).map(function (id) {
    const selected = id === selectedId ? " selected" : "";
    return '<option value="' + id + '"' + selected + '>' + POD_MARKETPLACES[id] + "</option>";
  }).join("");
}

/* ============================================================
   SUBNICHOS POR MERCADO
   ============================================================ */

function getGlobalSubnicheIds(group) {
  if (group === "evergreen") return Object.keys(POD_GLOBAL_SUBNICHES.evergreen || {});
  if (group === "temporada") return Object.keys(POD_GLOBAL_SUBNICHES.temporada || {});

  return Object.keys(POD_GLOBAL_SUBNICHES.evergreen || {}).concat(
    Object.keys(POD_GLOBAL_SUBNICHES.temporada || {})
  );
}

function getColombiaSubnicheIds(group, region) {
  if (typeof getSubnicheIds === "function") {
    return getSubnicheIds(group, region);
  }

  if (typeof POD_SUBNICHE_GROUPS !== "undefined") {
    if (group === "evergreen") return POD_SUBNICHE_GROUPS.evergreen || [];
    if (group === "temporada") return POD_SUBNICHE_GROUPS.temporada || [];

    return (POD_SUBNICHE_GROUPS.evergreen || []).concat(
      POD_SUBNICHE_GROUPS.temporada || []
    );
  }

  return [];
}

function getSubnicheIdsForMarket(marketId, group, region) {
  const market = getMarket(marketId);

  if (marketId === "colombia") {
    return getColombiaSubnicheIds(group, region);
  }

  if (marketId === "gospel_es") {
    return ["gospel_es"];
  }

  if (marketId === "gospel_en") {
    return ["gospel_en"];
  }

  if (marketId === "global_es") {
    return getGlobalSubnicheIds(group);
  }

  if (marketId === "diaspora_col") {
    const colombiaIds = getColombiaSubnicheIds(group, region);
    const globalIds = getGlobalSubnicheIds(group);
    return uniqueArray(colombiaIds.concat(globalIds));
  }

  return getGlobalSubnicheIds(group);
}

function getSubnicheLabel(id, marketId) {
  if (typeof POD_SUBNICHES !== "undefined" && POD_SUBNICHES[id]) {
    const s = POD_SUBNICHES[id];
    // Mercado en español/spanglish -> etiqueta localizada si existe
    if (s.nombre_es) {
      let lang = "en";
      try { lang = (getMarket(marketId) || {}).language || "en"; } catch (e) {}
      if (lang !== "en") return s.nombre_es;
    }
    return s.nombre;
  }

  const evergreen = POD_GLOBAL_SUBNICHES.evergreen || {};
  const temporada = POD_GLOBAL_SUBNICHES.temporada || {};

  if (evergreen[id]) return evergreen[id].label;
  if (temporada[id]) return temporada[id].label;

  return id;
}

function getSubnicheOptionsHTML(marketId, group, region, selectedId) {
  const ids = getSubnicheIdsForMarket(marketId, group, region);

  const options = ids.map(function (id) {
    const selected = id === selectedId ? " selected" : "";
    const label = getSubnicheLabel(id, marketId);
    return '<option value="' + id + '"' + selected + '>' + label + "</option>";
  }).join("");

  return '<option value="auto">Auto</option>' + options;
}

/* ============================================================
   DIRECTIVAS DE IDIOMA Y CULTURA
   ============================================================ */

function getLanguageDirective(marketId, languageOverride) {
  const market = getMarket(marketId);
  const lang = languageOverride && languageOverride !== "auto"
    ? languageOverride
    : market.language;

  if (lang === "en") {
    return "All visible design text and prompt output must be written in natural, native English. Do not translate literally from Spanish.";
  }

  if (lang === "es") {
    return "Todo el texto visible del diseño y el prompt debe estar escrito en español natural.";
  }

  if (lang === "spanglish") {
    return "Use natural bilingual Spanish/English diaspora phrasing. Keep Spanish identity words only when culturally meaningful. Avoid literal translation.";
  }

  return "Use the language appropriate to the selected market.";
}

function getCulturalDirective(marketId) {
  const market = getMarket(marketId);

  if (marketId === "global_en" || marketId === "anglo") {
    return "Adapt the concept to native English-speaking marketplace codes. Do not translate local slang literally. Replace it with an equivalent cultural meaning that sells in US/UK/CA/AU markets.";
  }

  if (marketId === "colombia") {
    return "Maintain Colombian cultural authenticity. Regional codes must match the selected Colombian region. Do not mix incompatible regional references.";
  }

  if (marketId === "latam") {
    return "Use broad Latin American Spanish cultural codes. Avoid country-specific slang unless the region is explicitly selected.";
  }

  if (marketId === "spain") {
    return "Use Spain Spanish cultural codes and natural European Spanish phrasing.";
  }

  if (marketId === "diaspora_col") {
    return "Blend Colombian identity with diaspora context. The design should feel Colombian but understandable abroad. Use English, Spanish or spanglish according to the selected language.";
  }

  if (marketId === "global_es") {
    return "Usa español neutro global. Prohibidos regionalismos de un solo país. Frases que se entiendan en México, Colombia, Argentina, USA hispano y España sin adaptar.";
  }

  if (marketId === "gospel_es") {
    return "Gospel universal en español. Doctrina obligatoria: Trinitario (Padre, Hijo, Espíritu Santo) y cristocéntrico (cruz y resurrección al centro). Prohibido: prosperidad mágica, decretos, ángeles como centro, santos mediadores, esoterismo, horóscopo, energía. Si el concepto viola esto, rechazar y reformular.";
  }

  if (marketId === "gospel_en") {
    return "Universal Gospel in English. Mandatory doctrine: Trinitarian (Father, Son, Holy Spirit) and Christ-centered (cross and resurrection at the center). Forbidden: prosperity magic, decrees, angel-centered art, saint mediators, esotericism, horoscope, energy healing. If the concept violates this, reject and reformulate.";
  }

  return "Adapt the concept to the selected market without losing the core idea.";
}

function getLegalDirective(marketId, marketplaceId) {
  const market = getMarket(marketId);
  let extra = "";

  if (market.legal === "strict") {
    extra = " Extra care required: reject anything that resembles protected IP, trademarked phrases, team logos, brand aesthetics, celebrity likeness, or copyrighted characters.";
  }

  if (marketplaceId === "displate") {
    extra += " The final art must work as a premium wall poster: strong composition, safe margins, no text too close to edges.";
  }

  return POD_LEGAL_RULES.directive + extra;
}

/* ============================================================
   COMPATIBILIDAD GLOBAL
   ============================================================ */

window.POD_MARKET_ORDER = POD_MARKET_ORDER;
window.POD_MARKETS = POD_MARKETS;
window.POD_LANGUAGES = POD_LANGUAGES;
window.POD_MARKET_REGIONS = POD_MARKET_REGIONS;
window.POD_GLOBAL_SUBNICHES = POD_GLOBAL_SUBNICHES;
window.POD_MARKETPLACES = POD_MARKETPLACES;
window.POD_LEGAL_RULES = POD_LEGAL_RULES;