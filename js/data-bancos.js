'use strict';

/* ============================================================
   DATA BANCOS — POD COMERCIAL COLOMBIA
   Subnichos Evergreen + Temporada.
   Mantiene dominios comerciales existentes y los adapta a Colombia.
   Cada subnicho tiene keywords, regiones, audiencias y banco propio.
   ============================================================ */

const POD_NICHO_GROUPS = {
  evergreen: "Comercial Evergreen",
  temporada: "Comercial Temporada"
};

const POD_REGIONS = {
  todas: "Todas",
  costa_caribe: "Costa Caribe",
  barranquilla: "Barranquilla — propia",
  paisa: "Paisa",
  rolo: "Rolo / Bogotá",
  andina: "Andina",
  pacifica: "Pacífica",
  llanos: "Llanos",
  amazonia: "Amazonía"
};

/* Compatibilidad de regiones hijas: Barranquilla hereda Costa Caribe, Paisa/Rolo heredan Andina. Sin esto, las regiones nuevas quedaban vacías. */
const POD_REGION_FALLBACK = {
  barranquilla: ["barranquilla", "costa_caribe"],
  paisa: ["paisa", "andina"],
  rolo: ["rolo", "andina"],
  costa_caribe: ["costa_caribe"],
  andina: ["andina"],
  pacifica: ["pacifica"],
  llanos: ["llanos"],
  amazonia: ["amazonia"]
};

const POD_SUBNICHE_GROUPS = {
  evergreen: [
    "humor_costeno",
    "humor_colombiano",
    "comida_sabor",
    "musica_ritmo_col",
    "oficios_emprendimiento_col",
    "familia_roles_col",
    "deporte_barra_col",
    "fe_popular_col",
    "naturaleza_territorio_col",
    "artesania_tradicion_col",
    "metas_logro_col",
    "comunidad_barrio_col",
    "viaje_ruta_col",
    "celebracion_col",
    "barranquilla_curramba",
    "calle_urbano_col",
    "resistencia_orgullo_col",
    "sonido_ritmo_urbano_col",
    "concreto_ciudad_col"
  ],
  temporada: [
    "carnaval_fiesta",
    "semana_santa_valle",
    "dia_madre_padre",
    "vacaciones_feria",
    "amor_amistad_indep",
    "navidad_colombia"
  ]
};

const POD_SUBNICHES = {

  /* ================= EVERGREEN ================= */

  humor_costeno: {
    nombre: "Humor Costeño",
    grupo: "evergreen",
    regiones: ["costa_caribe"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "coste_adulto_m",
      "coste_adulta_f",
      "unisex_nacional"
    ],
    keywords: [
      "no joda",
      "eche",
      "bochinche",
      "mamagallismo",
      "costeñol",
      "calor",
      "brisa",
      "hamaca",
      "fritanga",
      "paseo de olla",
      "corroncho",
      "picó",
      "costeño",
      "costeña",
      "costa",
      "caribe"
    ],
    bank: {
      costa_caribe: [
        "hamaca que sostiene tres generaciones y una mentira",
        "ventilador de techo como testigo de todas las verdades",
        "limonada de coco que resuelve lo que la diplomacia no pudo",
        "puesto de fritanga donde el calor firma la conversación",
        "sombra de almendro que organiza la tertulia del barrio",
        "picó que presta el bajo para la felicidad ajena",
        "abuela costeña regañando con cariño y sazón",
        "bicicleta con parrilla que carga más que su peso"
      ],
      nacional: [
        "costeñol traducido a gesto",
        "calor que une al barrio",
        "carcajada que se escucha de esquina a esquina"
      ]
    }
  },

  humor_colombiano: {
    nombre: "Humor Colombiano",
    grupo: "evergreen",
    regiones: ["andina", "todas"],
    audiencias: [
      "andino_joven_m",
      "andino_joven_f",
      "andino_adulto_m",
      "andino_adulta_f",
      "unisex_nacional"
    ],
    keywords: [
      "qué pena",
      "hágale pues",
      "mijo",
      "parcero",
      "tinto",
      "transmilenio",
      "arepa",
      "silletero",
      "feria",
      "cachaco",
      "paisa",
      "rolo",
      "caleño",
      "colombiano",
      "colombianidad"
    ],
    bank: {
      nacional: [
        "tinto que espera sin juzgar",
        "arepa que une lo que la política separa",
        "transmilenio como escuela de paciencia",
        "paraguas roto que sigue defendiendo la ciudad",
        "mercado de plaza donde se negocia la vida",
        "recibo de la tienda con confianza apuntada",
        "bus escalera cargando pueblo y promesas",
        "feria que convierte la esquina en sala de visitas"
      ]
    }
  },

  comida_sabor: {
    nombre: "Comida & Sabor",
    grupo: "evergreen",
    regiones: ["costa_caribe", "andina", "pacifica", "llanos", "amazonia", "todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "coste_adulto_m",
      "coste_adulta_f",
      "andino_joven_m",
      "andino_joven_f",
      "andino_adulto_m",
      "andino_adulta_f",
      "pacifico_raiz",
      "llanos_identidad",
      "amazonia_territorio",
      "infantil_col",
      "unisex_nacional"
    ],
    keywords: [
      "arepa",
      "bollo",
      "suero",
      "bandeja paisa",
      "tamal",
      "lechona",
      "ajiaco",
      "mondongo",
      "encocado",
      "mamona",
      "café",
      "cafe",
      "panela",
      "queso",
      "sancocho",
      "arroz con coco",
      "pescado frito",
      "comida",
      "sabor",
      "cocina"
    ],
    bank: {
      costa_caribe: [
        "arepa de huevo en puesto de plaza",
        "bollo limpio envuelto en hoja",
        "suero atollabuey en mesa de madera",
        "arroz con coco que perfuma la casa",
        "pescado frito con patacón y promesa",
        "limonada de coco servida en vaso de vidrio"
      ],
      andina: [
        "bandeja paisa con todos los componentes",
        "ajiaco en olla de barro",
        "tamal tolimense con chocolate",
        "lechona de fiesta con cuero crocante",
        "mondongo que resucita la mañana",
        "arepa de choclo con queso"
      ],
      pacifica: [
        "encocado de piangua en hoja de bijao",
        "sopa de borojó servida en totuma",
        "arroz con coco dulce de costa pacífica",
        "pescado del manglar con hierbas",
        "tamal de pipián"
      ],
      llanos: [
        "mamona asada con yuca y guacamole",
        "carne a la llanera en fogón",
        "queso llanero rallado",
        "café cerrero de sabana",
        "hallaca de maíz"
      ],
      amazonia: [
        "pescado de río envuelto en hoja",
        "fruto de selva con nombre propio",
        "café amazónico en taza caliente",
        "comida de comunidad junto al agua"
      ],
      nacional: [
        "café de origen en taza de barro",
        "panela con queso fresco",
        "agua de panela con limón",
        "arroz con coco",
        "cacao con historia",
        "cocina que huele a hogar"
      ]
    }
  },

  musica_ritmo_col: {
    nombre: "Música & Ritmo",
    grupo: "evergreen",
    regiones: ["costa_caribe", "andina", "pacifica", "llanos", "todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "coste_adulto_m",
      "coste_adulta_f",
      "andino_joven_m",
      "andino_joven_f",
      "andino_adulto_m",
      "andino_adulta_f",
      "pacifico_raiz",
      "llanos_identidad",
      "unisex_nacional"
    ],
    keywords: [
      "vallenato",
      "champeta",
      "cumbia",
      "porro",
      "puya",
      "acordeón",
      "acordeon",
      "salsa",
      "reggaetón",
      "reggaeton",
      "joropo",
      "currulao",
      "marimba",
      "gaita",
      "picó",
      "vinilo",
      "música",
      "musica",
      "ritmo"
    ],
    bank: {
      costa_caribe: [
        "acordeón que respira como un ser vivo",
        "picó que ilumina la esquina",
        "gaita que abre camino",
        "champeta que se baila descalza",
        "porro que levanta la fiesta",
        "tambor alegre que manda en la cumbiamba"
      ],
      andina: [
        "vinilo rayado que suena mejor que nuevo",
        "rock bogotano en garaje",
        "salsa que abraza después del trabajo",
        "guitarra de serenata puntual",
        "audífonos que protegen la ciudad"
      ],
      pacifica: [
        "marimba de chonta llamando al río",
        "currulao que huele a manglar",
        "cununo que marca el paso",
        "canto de arrullo para la comunidad"
      ],
      llanos: [
        "arpa que amansa el horizonte",
        "joropo que levanta polvo",
        "cuatro llanero junto al fogón",
        "zapateo que retumba en la sabana"
      ],
      nacional: [
        "ritmo que se hereda",
        "bocina vieja que sigue fiel",
        "canción que identifica al barrio",
        "baile que no necesita permiso"
      ]
    }
  },

  oficios_emprendimiento_col: {
    nombre: "Oficios & Emprendimiento",
    grupo: "evergreen",
    regiones: ["todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "coste_adulto_m",
      "coste_adulta_f",
      "andino_joven_m",
      "andino_joven_f",
      "andino_adulto_m",
      "andino_adulta_f",
      "pacifico_raiz",
      "llanos_identidad",
      "amazonia_territorio",
      "unisex_nacional"
    ],
    keywords: [
      "trabajo",
      "oficio",
      "obrero",
      "mecánico",
      "mecanico",
      "enfermera",
      "maestro",
      "maestra",
      "carpintero",
      "panadero",
      "barbero",
      "agricultor",
      "campesino",
      "taller",
      "tienda",
      "negocio",
      "emprendedor",
      "emprendimiento",
      "cliente",
      "mandil",
      "delantal",
      "herramienta"
    ],
    bank: {
      costa_caribe: [
        "mototaxi como oficina rodante",
        "vendedor de plaza con voz de mercado",
        "artesano de totumo",
        "cocinera de fritanga con receta propia",
        "palenquera con fruta y memoria",
        "pescador que lee el mar antes del sol"
      ],
      andina: [
        "cafetero de madrugada",
        "silletero con montaña al hombro",
        "comerciante de San Andresito",
        "maestro de obra",
        "panadero de barrio",
        "taller con herramientas heredadas"
      ],
      pacifica: [
        "minero artesanal",
        "pescadora de piangua",
        "partera sabia",
        "constructor de canoa"
      ],
      llanos: [
        "llanero de faena",
        "vaquero de sabana",
        "quesero de finca",
        "domador de camino"
      ],
      amazonia: [
        "guía de selva",
        "artesano de fibra",
        "pescador de río",
        "guardián de semilla"
      ],
      nacional: [
        "el mandil colgado que guarda cien historias",
        "herramientas ordenadas como índice de un oficio",
        "la mesa de trabajo al amanecer",
        "el carnet gastado con foto de veinte años atrás",
        "manos con callos sosteniendo el fruto del propio trabajo",
        "el letrero pintado a mano",
        "la boleta del primer pago enmarcada",
        "el café de las cinco de la mañana"
      ]
    }
  },

  familia_roles_col: {
    nombre: "Familia & Roles",
    grupo: "evergreen",
    regiones: ["todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "coste_adulto_m",
      "coste_adulta_f",
      "andino_joven_m",
      "andino_joven_f",
      "andino_adulto_m",
      "andino_adulta_f",
      "pacifico_raiz",
      "llanos_identidad",
      "amazonia_territorio",
      "infantil_col",
      "unisex_nacional"
    ],
    keywords: [
      "familia",
      "mamá",
      "mama",
      "papá",
      "papa",
      "abuela",
      "abuelo",
      "hermano",
      "hermana",
      "primo",
      "prima",
      "compadre",
      "comadre",
      "hogar",
      "mesa",
      "cocina",
      "reunión",
      "reunion"
    ],
    bank: {
      costa_caribe: [
        "abuela costeña con olla y sentencia",
        "tía que manda sin pedir permiso",
        "primo mayor que presta la bicicleta",
        "compadre que aparece cuando hace falta",
        "mamá soltera caribe",
        "silla mecedora con memoria"
      ],
      andina: [
        "familia paisa numerosa",
        "madre cabeza de hogar bogotana",
        "abuelo rolo de café largo",
        "tía de tamal y consejo",
        "hermanos que comparten cobija y secrets"
      ],
      pacifica: [
        "abuela cantaora",
        "madre del río",
        "comunidad que cría",
        "familia extendida de manglar"
      ],
      llanos: [
        "abuelo llanero",
        "familia de finca",
        "hermanos de sabana",
        "mesa larga de vaquería"
      ],
      amazonia: [
        "familia de comunidad",
        "abuela de semilla",
        "niños de río",
        "casa sobre pilotes"
      ],
      nacional: [
        "la mesa larga donde caben todos",
        "la silla extra que siempre se agrega",
        "la receta de la abuela con sus tachaduras",
        "la foto familiar con todos en su mejor segundo",
        "el abrazo de llegada",
        "el nombre propio repetido en la familia",
        "la casa que siempre huele a café",
        "el pariente que organiza la reunión"
      ]
    }
  },

  deporte_barra_col: {
    nombre: "Deporte & Barra",
    grupo: "evergreen",
    regiones: ["costa_caribe", "andina", "pacifica", "llanos", "todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "coste_adulto_m",
      "coste_adulta_f",
      "andino_joven_m",
      "andino_joven_f",
      "andino_adulto_m",
      "andino_adulta_f",
      "pacifico_raiz",
      "llanos_identidad",
      "infantil_col",
      "unisex_nacional"
    ],
    keywords: [
      "junior",
      "unión magdalena",
      "union magdalena",
      "real cartagena",
      "béisbol",
      "beisbol",
      "boxeo",
      "nacional",
      "medellín",
      "medellin",
      "américa",
      "america",
      "millonarios",
      "ciclismo",
      "patinaje",
      "fútbol sala",
      "futbol sala",
      "selección",
      "seleccion",
      "barra",
      "deporte"
    ],
    bank: {
      costa_caribe: [
        "Junior como sentimiento",
        "Unión Magdalena con alma de puerto",
        "Real Cartagena con muralla y esperanza",
        "béisbol de barrio",
        "boxeo de esquina",
        "kilómetro de playa como cancha"
      ],
      andina: [
        "Nacional de corazón verde",
        "Medellín poderoso",
        "América caleño",
        "Millonarios embajador",
        "ciclismo de montaña",
        "patinaje de barrio"
      ],
      pacifica: [
        "fútbol de arena",
        "balón que llega en lancha",
        "cancha improvisada entre lluvia",
        "barra con tambor"
      ],
      llanos: [
        "coleo como destreza",
        "caballo y jinete",
        "cancha de sabana",
        "equipo de vereda"
      ],
      nacional: [
        "camiseta firmada por los que estuvieron",
        "balón gastado con nombre",
        "grito de gol compartido",
        "medalla escolar",
        "selección que une al país",
        "cancha de barrio"
      ]
    }
  },

  fe_popular_col: {
    nombre: "Fe Popular Cultural",
    grupo: "evergreen",
    regiones: ["costa_caribe", "andina", "pacifica", "llanos", "amazonia", "todas"],
    audiencias: [
      "coste_adulto_m",
      "coste_adulta_f",
      "andino_adulto_m",
      "andino_adulta_f",
      "pacifico_raiz",
      "llanos_identidad",
      "amazonia_territorio",
      "unisex_nacional"
    ],
    keywords: [
      "virgen del carmen",
      "divino niño",
      "promesa",
      "vela",
      "velas",
      "milagro",
      "procesión",
      "procesion",
      "exvoto",
      "santo",
      "altar popular",
      "romería",
      "romeria",
      "señor de los milagros",
      "virgen de chiquinquirá",
      "virgen de chiquinquira",
      "fe popular"
    ],
    bank: {
      costa_caribe: [
        "Virgen del Carmen cuidando el camino",
        "Divino Niño en la tienda del barrio",
        "vela encendida por promesa cumplida",
        "procesión con música y fe",
        "altar popular con flores de papel",
        "milagro contado en voz baja"
      ],
      andina: [
        "Señor de los Milagros en Buga",
        "Virgen de Chiquinquirá",
        "procesión de Popayán",
        "vela de silencio",
        "cofradía con capirote",
        "capilla de carretera"
      ],
      pacifica: [
        "santo de río",
        "vela que acompaña la canoa",
        "canto de promesa",
        "altar de madera oscura"
      ],
      llanos: [
        "cruz de sabana",
        "vela de madrugada",
        "promesa de camino",
        "capilla de pueblo"
      ],
      amazonia: [
        "fe de comunidad",
        "vela junto al río",
        "promesa de selva",
        "espíritu de territorio"
      ],
      nacional: [
        "exvoto pintado a mano",
        "vela encendida",
        "romería con polvo y esperanza",
        "promesa cumplida",
        "altar casero",
        "milagro pequeño de cada día"
      ]
    }
  },

  naturaleza_territorio_col: {
    nombre: "Naturaleza & Territorio",
    grupo: "evergreen",
    regiones: ["costa_caribe", "andina", "pacifica", "llanos", "amazonia", "todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "coste_adulto_m",
      "coste_adulta_f",
      "andino_joven_m",
      "andino_joven_f",
      "andino_adulto_m",
      "andino_adulta_f",
      "pacifico_raiz",
      "llanos_identidad",
      "amazonia_territorio",
      "infantil_col",
      "unisex_nacional"
    ],
    keywords: [
      "sierra nevada",
      "río magdalena",
      "rio magdalena",
      "manglar",
      "páramo",
      "paramo",
      "café",
      "cafe",
      "selva",
      "nevado",
      "orquídea",
      "orquidea",
      "cóndor",
      "condor",
      "flamenco",
      "tortuga marina",
      "amazonía",
      "amazonia",
      "llano",
      "territorio",
      "naturaleza"
    ],
    bank: {
      costa_caribe: [
        "mar Caribe como espejo",
        "manglares que sostienen la costa",
        "Sierra Nevada respirando",
        "río Magdalena con memoria",
        "flamencos en La Guajira",
        "tortugas buscando hogar"
      ],
      andina: [
        "páramo que fabrica agua",
        "cafetales de montaña",
        "nevado con poncho de nube",
        "orquídea nacional",
        "cóndor sobre el valle",
        "frailejones en fila"
      ],
      pacifica: [
        "selva que cae al mar",
        "río Atrato",
        "ballenas llegando",
        "manglar con vida",
        "lluvia persistente"
      ],
      llanos: [
        "llano infinito",
        "garzas al atardecer",
        "sabana con ganado",
        "caño de agua clara",
        "sol que dobla el horizonte"
      ],
      amazonia: [
        "río que parece mar",
        "delfín rosado",
        "jaguar en silencio",
        "selva sonora",
        "canoa bajo anaconda verde"
      ],
      nacional: [
        "biodiversidad como orgullo",
        "mapa de Colombia con detalle natural",
        "dos mares",
        "tres cordilleras",
        "país que amanece verde"
      ]
    }
  },

  artesania_tradicion_col: {
    nombre: "Artesanía & Tradición",
    grupo: "evergreen",
    regiones: ["costa_caribe", "andina", "pacifica", "llanos", "amazonia", "todas"],
    audiencias: [
      "coste_adulto_m",
      "coste_adulta_f",
      "andino_adulto_m",
      "andino_adulta_f",
      "pacifico_raiz",
      "llanos_identidad",
      "amazonia_territorio",
      "unisex_nacional"
    ],
    keywords: [
      "sombrero vueltiao",
      "mochila arhuaca",
      "hamaca san jacinto",
      "cerámica raquira",
      "tejido wayuu",
      "cestería",
      "cesteria",
      "totumo",
      "filigrana",
      "ruana",
      "artesanía",
      "artesania",
      "tradición",
      "tradicion"
    ],
    bank: {
      costa_caribe: [
        "sombrero vueltiao",
        "mochila arhuaca",
        "hamaca san jacinto",
        "totumo convertido en taza",
        "trenzado de palma"
      ],
      andina: [
        "cerámica raquira",
        "ruana de lana",
        "sombrero aguadeño",
        "filigrana momposina",
        "candela de fogón"
      ],
      pacifica: [
        "marimba artesanal",
        "tejido de fibra",
        "canoa tallada",
        "madera con memoria"
      ],
      llanos: [
        "cuero trabajado",
        "soga trenzada",
        "sombrero llanero",
        "silla de montar"
      ],
      amazonia: [
        "tejido de comunidad",
        "semilla como joya",
        "cerámica ancestral",
        "pintura de tierra"
      ],
      nacional: [
        "manos que tejen historia",
        "objeto hecho a mano",
        "tradición que pasa de abuela a nieta",
        "detalle artesanal con firma local"
      ]
    }
  },

  metas_logro_col: {
    nombre: "Metas & Logro",
    grupo: "evergreen",
    regiones: ["todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "andino_joven_m",
      "andino_joven_f",
      "andino_adulto_m",
      "llanos_identidad",
      "unisex_nacional"
    ],
    keywords: [
      "meta",
      "metas",
      "objetivo",
      "logro",
      "éxito",
      "exito",
      "disciplina",
      "constancia",
      "esfuerzo",
      "superación",
      "superacion",
      "progreso",
      "hazaña",
      "record",
      "récord",
      "reto",
      "victoria",
      "campeonato",
      "ganar",
      "lograr",
      "podio",
      "maratón",
      "maraton"
    ],
    bank: {
      nacional: [
        "la pared de la maratón: 42 kilómetros escritos a mano",
        "el reloj que marca la hora en que empezó todo",
        "una escalera donde cada peldaño lleva una fecha",
        "la meta escrita en el espejo con marcador",
        "el último intento que sí salió, guardado como trofeo",
        "la bandera propia en la cima de la montaña",
        "la lista de metas tachada línea por línea",
        "el podio improvisado en la sala de la casa",
        "la primera medalla guardada como oro",
        "el calendario con una sola palabra repetida: TODAVÍA"
      ]
    }
  },

  comunidad_barrio_col: {
    nombre: "Comunidad & Barrio",
    grupo: "evergreen",
    regiones: ["todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "coste_adulto_m",
      "coste_adulta_f",
      "andino_joven_m",
      "andino_joven_f",
      "andino_adulto_m",
      "andino_adulta_f",
      "pacifico_raiz",
      "llanos_identidad",
      "amazonia_territorio",
      "infantil_col",
      "unisex_nacional"
    ],
    keywords: [
      "comunidad",
      "familia",
      "amigos",
      "equipo",
      "hermandad",
      "barrio",
      "pueblo",
      "grupo",
      "unión",
      "union",
      "juntos",
      "mesa",
      "tienda",
      "esquina",
      "vecinos"
    ],
    bank: {
      nacional: [
        "la mesa larga donde caben todos",
        "el grupo que nunca duerme, dibujado en un solo gesto",
        "balón de barrio con nombre de todos en el cuero",
        "la silla extra que siempre se agrega",
        "la foto del equipo en la pared del local",
        "la receta de la abuela escrita con sus tachaduras",
        "fuego de campamento rodeado de sillas desiguales",
        "el coro del barrio desentonando a gusto",
        "manos distintas sosteniendo la misma tarea",
        "el local pequeño que siempre tiene espacio para uno más"
      ]
    }
  },

  viaje_ruta_col: {
    nombre: "Viaje & Ruta",
    grupo: "evergreen",
    regiones: ["todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "andino_joven_m",
      "andino_joven_f",
      "llanos_identidad",
      "amazonia_territorio",
      "unisex_nacional"
    ],
    keywords: [
      "viaje",
      "ruta",
      "camino",
      "aventura",
      "montaña",
      "montana",
      "mar",
      "sendero",
      "mochilero",
      "explorar",
      "mapa",
      "brújula",
      "brujula",
      "nómada",
      "nomada",
      "carretera",
      "acampar",
      "viajero",
      "destino",
      "horizonte"
    ],
    bank: {
      nacional: [
        "el mapa con los lugares tachados a lápiz",
        "mochila abierta con la ruta asomando",
        "el kilómetro cero pintado en la acera",
        "brújula que apunta a casa",
        "el tanque lleno y ninguna dirección elegida",
        "huellas de neumático que se convierten en ruta",
        "la postal enviada desde el lugar equivocado y amada igual",
        "carretera que se hace nube al horizonte",
        "el sello del pasaporte como tatuaje de época",
        "acampar bajo un cielo que no cobra por las estrellas"
      ]
    }
  },

  celebracion_col: {
    nombre: "Celebración",
    grupo: "evergreen",
    regiones: ["todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "coste_adulto_m",
      "coste_adulta_f",
      "andino_joven_m",
      "andino_joven_f",
      "andino_adulto_m",
      "andino_adulta_f",
      "pacifico_raiz",
      "llanos_identidad",
      "infantil_col",
      "unisex_nacional"
    ],
    keywords: [
      "cumpleaños",
      "cumpleanos",
      "boda",
      "aniversario",
      "fiesta",
      "celebración",
      "celebracion",
      "graduación",
      "graduacion",
      "recuerdo",
      "regalo",
      "homenaje",
      "brindis",
      "pastel",
      "mérito",
      "merito"
    ],
    bank: {
      nacional: [
        "las velas del pastel contando los años buenos",
        "copas chocando en el momento exacto",
        "el confeti que aún cae del techo del recuerdo",
        "la foto grupal con todos en su mejor segundo",
        "la camiseta firmada por los que estuvieron",
        "papel picado que aún resiste el viento",
        "el regalo hecho a mano envuelto en periódico",
        "la hora feliz que se convirtió en tradición",
        "un pastel cuyo ingrediente real es la gente",
        "el brindis de los que empezaron sin nada"
      ]
    }
  },

  calle_urbano_col: {
    nombre: "Calle & Urbano",
    grupo: "evergreen",
    regiones: ["todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "andino_joven_m",
      "andino_joven_f",
      "pacifico_raiz",
      "unisex_nacional"
    ],
    keywords: [
      "calle",
      "barrio",
      "esquina",
      "cuadra",
      "bloque",
      "urban",
      "urbano",
      "urbana",
      "hood",
      "manzana",
      "vecindario",
      "territorio",
      "local",
      "tiendita"
    ],
    bank: {
      nacional: [
        "el muro que cuenta el barrio",
        "esquina con nombre propio",
        "el jugador de dominó que nunca pierde",
        "bici con cinta en el manubrio",
        "la tiendita de la esquina que abre de madrugada",
        "globo que se escapó y sigue volando",
        "el tag que firma sin robar la pared",
        "portería de dos piedras y un sueño",
        "la fila de la peluquería como noticiero",
        "escalón que fue asiento, mesa y escritorio"
      ]
    }
  },

  resistencia_orgullo_col: {
    nombre: "Resistencia & Orgullo",
    grupo: "evergreen",
    regiones: ["todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "coste_adulto_m",
      "coste_adulta_f",
      "andino_joven_m",
      "andino_joven_f",
      "pacifico_raiz",
      "llanos_identidad",
      "amazonia_territorio",
      "unisex_nacional"
    ],
    keywords: [
      "resistencia",
      "lucha",
      "firme",
      "de pie",
      "no rendirse",
      "contra",
      "fuerza",
      "aguante",
      "raza",
      "orgullo",
      "levantarse",
      "pelear",
      "guerra",
      "batalla",
      "coraje",
      "valiente"
    ],
    bank: {
      nacional: [
        "puño abierto que contiene una semilla",
        "la barbilla arriba cuando todo baja",
        "sirenas que llegan tarde al territorio",
        "la verja pintada de colores aunque la pinten gris",
        "candado con llave perdida que sigue cerrado",
        "barrio que se abriga con lo que tiene",
        "la calle mojada que refleja los colores que le faltan",
        "voz que no necesita micrófono",
        "zapatos gastados que conocen cada hueco",
        "la gorra puesta de frente cuando hay que mirar de frente"
      ]
    }
  },

  sonido_ritmo_urbano_col: {
    nombre: "Sonido & Ritmo Urbano",
    grupo: "evergreen",
    regiones: ["todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "andino_joven_m",
      "andino_joven_f",
      "pacifico_raiz",
      "unisex_nacional"
    ],
    keywords: [
      "música",
      "musica",
      "beat",
      "rap",
      "freestyle",
      "flow",
      "sonido",
      "bocina",
      "vinilo",
      "dj",
      "turntable",
      "ritmo",
      "volumen",
      "auriculares",
      "parlante",
      "track",
      "rola"
    ],
    bank: {
      nacional: [
        "bocina en la ventana que prestó el ritmo al barrio",
        "auriculares como casco de batalla cotidiana",
        "el beat que dobla la esquina antes que la gente",
        "vinilo rayado que suena mejor que nuevo",
        "parlante hecho de dos cajas y fe",
        "el silencio de tres segundos antes del drop",
        "cable enredado que conecta la manzana",
        "la freestyle aprendida en la fila del bus",
        "micrófono improvisado y ritmo de brocha",
        "el volumen exacto donde empieza el barrio"
      ]
    }
  },

  concreto_ciudad_col: {
    nombre: "Concreto & Ciudad",
    grupo: "evergreen",
    regiones: ["todas"],
    audiencias: [
      "coste_joven_m",
      "andino_joven_m",
      "andino_joven_f",
      "andino_adulto_m",
      "pacifico_raiz",
      "unisex_nacional"
    ],
    keywords: [
      "ciudad",
      "concreto",
      "cement",
      "edificio",
      "asfalto",
      "metro",
      "tren",
      "puente",
      "antena",
      "ventana",
      "reja",
      "muro",
      "pared",
      "skyline"
    ],
    bank: {
      nacional: [
        "edificio que mira a otro edificio",
        "la sombra del puente como casa",
        "antena que atrapa señales y pájaros",
        "piscina seca convertida en pista",
        "la escalera eléctrica como beat de tornamesa",
        "ventana repetida que hace retícula",
        "vapor que dibuja nubes de fábrica",
        "reja que enmarca el atardecer gratis",
        "pared con capas de todos los inviernos",
        "cruce peatonal donde la gente cruza igual"
      ]
    }
  },

  barranquilla_curramba: {
    nombre: "Barranquilla · Curramba",
    nombre_es: "Barranquilla · Curramba",
    grupo: "evergreen",
    regiones: ["barranquilla", "costa_caribe"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "coste_adulto_m",
      "coste_adulta_f",
      "infantil_col",
      "unisex_nacional"
    ],
    keywords: [
      "barranquilla",
      "curramba",
      "arenosa",
      "quilla",
      "puerta de oro",
      "junior",
      "tiburon",
      "malecón",
      "magdalena",
      "picó",
      "verbena",
      "arroyo",
      "buseta",
      "raspao",
      "arepa e huevo"
    ],
    bank: {
      barranquilla: [
        "aleta de tiburón sobre camiseta rojiblanca",
        "buseta con letrero de la 8 pintado a mano",
        "arroyo que se vuelve río en aguacero",
        "arepa e huevo abierta por la mitad",
        "arroz de lisa servido en hoja de plátano",
        "bollo de yuca amarrado con pita",
        "raspao de corozo con leche condensada",
        "picó con bafles hasta el segundo piso",
        "verbena con fandango hasta el amanecer",
        "joselito que se va con las cenizas",
        "batalla de flores sobre la vía 40",
        "guacherna de tambores en la noche",
        "monocuco de overol y máscara burlona",
        "cumbiambera con pollera amarilla girando",
        "garabato con machete de madera",
        "congo con turbante y bastón de mando",
        "farol del malecón sobre el río magdalena",
        "ventana al mundo con vidrios de colores",
        "brisa del río que despeina el malecón",
        "currambero con sombrero vueltiao ladeado"
      ]
    }
  },

  /* ================= TEMPORADA ================= */

  carnaval_fiesta: {
    nombre: "Carnaval & Fiesta",
    grupo: "temporada",
    regiones: ["costa_caribe"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "coste_adulto_m",
      "coste_adulta_f",
      "infantil_col",
      "unisex_nacional"
    ],
    keywords: [
      "carnaval",
      "barranquilla",
      "disfraz",
      "marimonda",
      "monocuco",
      "cumbiamba",
      "danza",
      "fiesta",
      "reina",
      "batalla de flores",
      "tambor",
      "gozadera"
    ],
    bank: {
      costa_caribe: [
        "marimonda que se ríe del mundo",
        "monocuco que guarda secretos",
        "cumbiamba que levanta polvo",
        "carroza con barrio entero",
        "disfraz hecho a mano",
        "reina popular",
        "batalla de flores",
        "tambor que llama"
      ]
    }
  },

  semana_santa_valle: {
    nombre: "Semana Santa & Festival",
    grupo: "temporada",
    regiones: ["andina", "pacifica"],
    audiencias: [
      "andino_adulto_m",
      "andino_adulta_f",
      "pacifico_raiz",
      "unisex_nacional"
    ],
    keywords: [
      "semana santa",
      "mompox",
      "popayán",
      "popayan",
      "procesión",
      "procesion",
      "vela",
      "silencio",
      "cofradía",
      "cofradia",
      "festival vallenato",
      "vallenato"
    ],
    bank: {
      andina: [
        "Mompox con río y silencio",
        "Popayán en procesión",
        "vela que cuida la noche",
        "cofradía con paso lento",
        "altar de piedra",
        "campana puntual"
      ],
      pacifica: [
        "semana santa de río",
        "vela en canoa",
        "canto religioso con tambor",
        "procesión entre lluvia"
      ],
      nacional: [
        "festival vallenato",
        "acordeón de competencia",
        "parranda con respeto",
        "compositor de esquina"
      ]
    }
  },

  dia_madre_padre: {
    nombre: "Día de la Madre / Padre",
    grupo: "temporada",
    regiones: ["todas"],
    audiencias: [
      "coste_adulto_m",
      "coste_adulta_f",
      "andino_adulto_m",
      "andino_adulta_f",
      "pacifico_raiz",
      "llanos_identidad",
      "amazonia_territorio",
      "infantil_col",
      "unisex_nacional"
    ],
    keywords: [
      "día de la madre",
      "dia de la madre",
      "día del padre",
      "dia del padre",
      "mamá",
      "mama",
      "papá",
      "papa",
      "regalo",
      "abrazo",
      "carta",
      "desayuno",
      "flores",
      "homenaje"
    ],
    bank: {
      nacional: [
        "desayuno sorpresa con pan caliente",
        "carta hecha a mano",
        "abrazo largo",
        "flores de jardín propio",
        "foto enmarcada",
        "herramienta heredada",
        "delantal con nombre",
        "taza con frase cierta",
        "madre que sostiene la casa",
        "padre que enseña sin discurso"
      ]
    }
  },

  vacaciones_feria: {
    nombre: "Vacaciones & Feria",
    grupo: "temporada",
    regiones: ["costa_caribe", "andina", "pacifica", "llanos", "todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "andino_joven_m",
      "andino_joven_f",
      "infantil_col",
      "unisex_nacional"
    ],
    keywords: [
      "vacaciones",
      "feria",
      "flores",
      "mar",
      "santa marta",
      "medellín",
      "medellin",
      "viaje",
      "escuela",
      "playa",
      "descanso",
      "verano"
    ],
    bank: {
      costa_caribe: [
        "fiestas del mar",
        "playa con arena caliente",
        "pescado frito en vacaciones",
        "atardecer de puerto"
      ],
      andina: [
        "feria de las flores",
        "silletero con espalda orgullosa",
        "desfile de colores",
        "vuelta a la escuela"
      ],
      pacifica: [
        "vacaciones de río",
        "canoa con vacaciones",
        "playa pacífica",
        "feria de pueblo"
      ],
      llanos: [
        "feria ganadera",
        "vacaciones de finca",
        "cabalgata",
        "polvo de sabana"
      ],
      nacional: [
        "maleta lista",
        "bus de vacaciones",
        "recreo largo",
        "plan improvisado",
        "recuerdo de carretera"
      ]
    }
  },

  amor_amistad_indep: {
    nombre: "Amor y Amistad / Independencia",
    grupo: "temporada",
    regiones: ["costa_caribe", "andina", "todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "andino_joven_m",
      "andino_joven_f",
      "unisex_nacional"
    ],
    keywords: [
      "amor y amistad",
      "septiembre",
      "amigo secreto",
      "independencia",
      "cartagena",
      "halloween criollo",
      "regalo",
      "amistad",
      "noviembre"
    ],
    bank: {
      costa_caribe: [
        "Cartagena amurallada",
        "farol de independencia",
        "fiesta de noviembre",
        "muralla con atardecer"
      ],
      andina: [
        "amigo secreto",
        "carta sin firmar",
        "dulce de septiembre",
        "amistad de ciudad"
      ],
      nacional: [
        "amor y amistad",
        "regalo pequeño pero pensado",
        "halloween criollo",
        "disfraz casero",
        "parche de amigos",
        "corazón y sable de juguete"
      ]
    }
  },

  navidad_colombia: {
    nombre: "Navidad & Año Nuevo Colombia",
    grupo: "temporada",
    regiones: ["todas"],
    audiencias: [
      "coste_joven_m",
      "coste_joven_f",
      "coste_adulto_m",
      "coste_adulta_f",
      "andino_joven_m",
      "andino_joven_f",
      "andino_adulto_m",
      "andino_adulta_f",
      "pacifico_raiz",
      "llanos_identidad",
      "amazonia_territorio",
      "infantil_col",
      "unisex_nacional"
    ],
    keywords: [
      "navidad",
      "diciembre",
      "novena",
      "aguinaldo",
      "pesebre",
      "año nuevo",
      "ano nuevo",
      "velitas",
      "noche de velitas",
      "familia",
      "buñuelo",
      "natilla",
      "farol"
    ],
    bank: {
      nacional: [
        "noche de velitas",
        "novena en familia",
        "pesebre con barrio incluido",
        "aguinaldo con promesa",
        "año nuevo con maleta",
        "buñuelo y natilla",
        "farol artesanal",
        "diciembre en la esquina",
        "mesa de diciembre",
        "abuela que reparte abrazos"
      ]
    }
  }
};

/* ============================================================
   HELPERS PÚBLICOS
   ============================================================ */

function getRegionLabel(region) {
  return POD_REGIONS[region] || region || "Todas";
}

function getSubnicheIds(group, region) {
  let ids = [];

  if (group === "evergreen") ids = POD_SUBNICHE_GROUPS.evergreen.slice();
  else if (group === "temporada") ids = POD_SUBNICHE_GROUPS.temporada.slice();
  else ids = POD_SUBNICHE_GROUPS.evergreen.concat(POD_SUBNICHE_GROUPS.temporada);

  return ids.filter(function (id) {
    const s = POD_SUBNICHES[id];
    if (!s) return false;

    if (!region || region === "todas") return true;

    const regs = s.regiones || [];
    if (regs.includes("todas") || regs.includes(region)) return true;
    // Herencia: barranquilla ve costa_caribe, paisa/rolo ven andina
    const fb = (typeof POD_REGION_FALLBACK !== "undefined" ? POD_REGION_FALLBACK[region] : null) || [region];
    return fb.some(function (r) { return regs.includes(r); });
  });
}

/* NOTA: getSubnicheLabel y getSubnicheOptionsHTML viven SOLO en data-mercados.js
   (firma market-aware: getSubnicheLabel(id, marketId),
   getSubnicheOptionsHTML(marketId, group, region, selectedId)).
   Antes estaban duplicadas aquí y, al cargar este script DESPUÉS de
   data-mercados.js, pisaban la versión correcta: el selector de subnicho
   mostraba la misma lista colombiana en todos los mercados. No redefinir. */

function getKeywordsForSubniche(id) {
  const s = POD_SUBNICHES[id];
  return s && Array.isArray(s.keywords) ? s.keywords : [];
}

function getAudiencesForSubniche(id, region) {
  const s = POD_SUBNICHES[id];
  if (!s || !Array.isArray(s.audiencias)) return [];

  const regionalAudiences = typeof getAudiencesForRegion === "function"
    ? getAudiencesForRegion(region)
    : null;

  if (!regionalAudiences || !regionalAudiences.length) return s.audiencias;

  return s.audiencias.filter(function (aud) {
    return regionalAudiences.includes(aud);
  });
}

/* Idioma de una clave de banco: 'en'/'es' si la definió banco-global.js,
   null si el banco es de un solo idioma (colombiano, gospel, común). */
function _bankKeyLang(key) {
  const en = typeof POD_BANK_KEYS_EN !== 'undefined' ? POD_BANK_KEYS_EN : null;
  const es = typeof POD_BANK_KEYS_ES !== 'undefined' ? POD_BANK_KEYS_ES : null;
  if (en && en.indexOf(key) !== -1) return 'en';
  if (es && es.indexOf(key) !== -1) return 'es';
  return null;
}

/* Regiones cuyo banco está en inglés (mismo criterio que motor-nucleo). */
const BANK_EN_REGIONS = ['global', 'us', 'uk', 'ca', 'au', 'anglo', 'universal_en'];

/* Idioma que DEBE tener el banco del mercado activo. Declarado por el mercado
   (en/es/spanglish) o inferido por la región cuando el mercado es 'auto'. */
function bankLangFor(marketId, region) {
  let lang = null;
  if (marketId && typeof getMarket === 'function') {
    try { lang = (getMarket(marketId) || {}).language || null; } catch (e) { lang = null; }
  }
  if (lang === 'en') return 'en';
  if (lang === 'es' || lang === 'spanglish') return 'es';

  // Mercado 'auto' (personalizado): si la región pasada no pertenece al mercado
  // (dato legacy o corrupto) se ignora y se usa la región principal del mercado,
  // para que no infiera el idioma desde una región desconocida.
  var r = region;
  if (marketId && typeof POD_MARKET_REGIONS !== 'undefined' && POD_MARKET_REGIONS[marketId]) {
    var known = POD_MARKET_REGIONS[marketId].some(function (x) { return x && x.id === r; });
    if (!known && POD_MARKET_REGIONS[marketId][0]) r = POD_MARKET_REGIONS[marketId][0].id;
  }
  return BANK_EN_REGIONS.indexOf(r) !== -1 ? 'en' : 'es';
}

/* Devuelve los objetos de un subnicho SIEMPRE en el idioma del mercado.
   Antes, si la región no tenía clave exacta, la rama final concatenaba TODAS
   las claves del banco y un subnicho global mezclaba objetos EN con ES. */
function getBankForSubniche(id, region, marketId) {
  const s = POD_SUBNICHES[id];
  if (!s || !s.bank) return [];

  const out = new Set();

  function addArray(arr) {
    (arr || []).forEach(function (item) {
      if (item && typeof item === "string") out.add(item.trim());
    });
  }

  const lang = bankLangFor(marketId, region);
  const keys = Object.keys(s.bank);
  const allowed = keys.filter(function (k) {
    const kl = _bankKeyLang(k);
    return kl === null || kl === lang;
  });

  function addKey(k) {
    if (allowed.indexOf(k) !== -1) addArray(s.bank[k]);
  }

  if (region && region !== "todas" && s.bank[region] && allowed.indexOf(region) !== -1) {
    addKey(region);
    addKey("nacional");
  } else if (region && region !== "todas" && typeof POD_REGION_FALLBACK !== "undefined" && POD_REGION_FALLBACK[region]) {
    // Herencia sin mezclar todo: barranquilla->costa_caribe, paisa/rolo->andina
    var done = false;
    POD_REGION_FALLBACK[region].forEach(function (r) {
      if (allowed.indexOf(r) !== -1) { addArray(s.bank[r]); done = true; }
    });
    addKey("nacional");
    if (!done) allowed.forEach(function (k) { addArray(s.bank[k]); });
  } else if (region === "todas" || !region) {
    addKey("nacional");

    if (!out.size) {
      const primary = (s.regiones || []).find(function (r) {
        return r !== "todas" && allowed.indexOf(r) !== -1;
      });
      if (primary) addArray(s.bank[primary]);
    }
    if (!out.size && allowed.length) addArray(s.bank[allowed[0]]);
  } else {
    // Región sin clave para este banco: solo claves del MISMO idioma.
    allowed.forEach(function (k) { addArray(s.bank[k]); });
  }

  if (!out.size) {
    allowed.forEach(function (k) { addArray(s.bank[k]); });
  }

  return Array.from(out).filter(Boolean);
}

function detectSubnicheFromText(text, group, region) {
  const t = String(text || "").toLowerCase();
  const ids = getSubnicheIds(group, region);

  let bestId = null;
  let bestScore = 0;

  ids.forEach(function (id) {
    const keywords = getKeywordsForSubniche(id);
    let score = 0;

    keywords.forEach(function (kw) {
      if (kw && t.includes(String(kw).toLowerCase())) score += 1;
    });

    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  });

  return bestScore > 0 ? bestId : null;
}

function getSubnicheSummary(id, region) {
  const s = POD_SUBNICHES[id];
  if (!s) return "";

  const bankCount = getBankForSubniche(id, region).length;
  const keywords = getKeywordsForSubniche(id).length;
  const audiences = getAudiencesForSubniche(id, region).length;

  return s.nombre + " · " + bankCount + " objetos · " + keywords + " keywords · " + audiences + " audiencias compatibles";
}

/* Compatibilidad explícita para otros scripts */
window.POD_NICHO_GROUPS = POD_NICHO_GROUPS;
window.POD_REGIONS = POD_REGIONS;
window.POD_SUBNICHE_GROUPS = POD_SUBNICHE_GROUPS;
window.POD_SUBNICHES = POD_SUBNICHES;