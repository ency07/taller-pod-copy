'use strict';
/* ============================================================
   BANCOS GLOBALES — EN y ES
   ============================================================
   Problema que resuelve:
   POD_GLOBAL_SUBNICHES (data-mercados.js) define 12 subnichos evergreen
   y 12 de temporada con label + keywords, pero NUNCA se registraban en
   POD_SUBNICHES y no tenían `bank`. Consecuencia comprobada en navegador:
     getBankForSubniche('pets','global')      -> 0 objetos
     getBankForSubniche('professions','global')-> 0 objetos
   Así, en cualquier mercado Global el pool era solo OBJECT_BANK_COMMON
   (20 objetos idénticos en todas las generaciones).

   Registro:
   - POD_SUBNICHES[id].bank claves por región de mercado:
       global, us, uk, ca, au -> inglés (misma referencia)
       global_es, es          -> español (misma referencia)
     Claves explícitas por región para que getBankForSubniche() no caiga
     a su rama "else" (que concatena TODAS las claves y mezclaría idiomas).
   - nombre: label legible (corrige "pets::pets" en el selector).
   - keywords: heredadas de POD_GLOBAL_SUBNICHES (detección automática).
   ============================================================ */

(function () {
  if (typeof POD_SUBNICHES === 'undefined' || typeof POD_GLOBAL_SUBNICHES === 'undefined') return;

  /* ---------------- EVERGREEN · ENGLISH ---------------- */
  const EN_EVERGREEN = {
    pets: [
      'leash coiled like a promise by the door',
      'collar tag engraved with one small name',
      'ball waiting where the hallway turns',
      'paw print pressed into wet cement',
      'empty bowl that never stays empty long',
      'window perch where the cat judges the street',
      'soft bed shaped like a curled dog',
      'treat held above a sit that already happened'
    ],
    professions: [
      'hammer worn to the shape of a hand',
      'name badge pinned over a beating heart',
      'stethoscope coiled like a lifeline',
      'apron stained with honest work',
      'hard hat resting on a rolled blueprint',
      'pencil tucked behind a listening ear',
      'coffee cup before the sun is up',
      'tool belt that knows every pocket by touch'
    ],
    hobbies: [
      'thread wound tight on a wooden spool',
      'skateboard leaning where the wall is chipped',
      'camera lens catching the last light of day',
      'brush still wet with three colors',
      'vinyl record spinning on a bedroom shelf',
      'pencil sharpened to a point of patience',
      'guitar pick caught between two strings',
      'plant repotted on a slow Saturday'
    ],
    sarcasm_introvert: [
      'door closed behind a polite handwritten sign',
      'battery icon holding on at one percent',
      'mute button as big as a full moon',
      'mug that reads not yet in plain letters',
      'curtain drawn against the group photo',
      'chair saved at the far corner of the room',
      'airplane mode worn like a daily uniform',
      'one sock missing entirely on purpose'
    ],
    fitness_mental: [
      'shoe laced tight before doubt wakes up',
      'mat rolled firm like a kept promise',
      'breath drawn in over a slow count of four',
      'water bottle half full on purpose',
      'streak mark on a paper calendar',
      'dumbbell resting beside an open notebook',
      'run at sunrise with no one watching',
      'rest day written into the plan in ink'
    ],
    family_milestones: [
      'height marks climbing a door frame',
      'graduation tassel kept in a glass jar',
      'first house key hanging on a nail',
      'chair pulled up to the adult table',
      'recipe card in a grandmother handwriting',
      'moving box labeled KITCHEN in marker',
      'invitation with the date circled twice',
      'photo corner turned down to find it later'
    ],
    music_fandom: [
      'wristband still on after the encore',
      'ticket stub folded into a worn wallet',
      'setlist taped to a bedroom wall',
      'old guitar string kept in a tin',
      'headphones split to share one side',
      'lyrics written across the back of a hand',
      'amplifier still warm after the last song',
      'drumstick thrown into a waiting crowd'
    ],
    food_drink: [
      'pan cracked straight down the middle',
      'spoon standing upright in thick chocolate',
      'steam rising off a second cup poured',
      'container returned home empty and clean',
      'knife that only ever cuts ripe fruit',
      'recipe doubled without being asked twice',
      'bread torn by hand instead of sliced',
      'salt pinched between two certain fingers'
    ],
    outdoors_nature: [
      'trail worn wide into two wandering paths',
      'camp chair facing absolutely no particular view',
      'pine resin stuck to a jacket cuff',
      'river stone carried home in a pocket',
      'map folded to the wrong page again',
      'rope coiled before the climb begins',
      'fog lifting slowly off a quiet valley',
      'tent stake pulled loose at first light'
    ],
    retro_nostalgia: [
      'cassette rewound with a pencil corner',
      'plastic antenna bent to catch the signal',
      'booth seat cracked in an all night diner',
      'polaroid developing warm in a palm',
      'calendar still showing last month',
      'coin returned from a patient arcade machine',
      'receipt curled soft inside a glove box',
      'dial tone that took a whole minute to start'
    ],
    travel_adventure: [
      'boarding pass torn cleanly in half',
      'suitcase covered in a first trip sticker',
      'window seat claimed well before takeoff',
      'passport page curling at its corner',
      'key card to a room with a real view',
      'road map marked with a stubborn pen',
      'luggage tag carrying a foreign address',
      'departure board flipping its letters over'
    ],
    inspirational_clean: [
      'ladder leaning on an unfinished wall',
      'seed envelope opened over dark soil',
      'blank page waiting without any fear',
      'step drawn in chalk before the ledge',
      'thread pulled through a very first stitch',
      'compass held steady with no north yet',
      'door standing wide open in daylight',
      'small boat pushed off from shallow water'
    ]
  };

  /* ---------------- EVERGREEN · ESPAÑOL ---------------- */
  const ES_EVERGREEN = {
    pets: [
      'correa enrollada como una promesa junto a la puerta',
      'placa del collar grabada con un solo nombre',
      'pelota esperando donde dobla el pasillo',
      'huella de patita hundida en el cemento mojado',
      'comedero vacío que nunca dura mucho vacío',
      'rincón de la ventana donde el gato juzga la calle',
      'cama blanda con forma de perro enroscado',
      'premio levantado sobre una sentada que ya pasó'
    ],
    professions: [
      'martillo gastado con la forma de una mano',
      'escarapela prendida sobre el corazón que late',
      'estetoscopio enroscado como una línea de vida',
      'delantal manchado de trabajo honesto',
      'casco apoyado sobre un plano enrollado',
      'lápiz metido detrás de una oreja que escucha',
      'taza de café antes de que salga el sol',
      'arnés de herramientas que conoce cada bolsillo'
    ],
    hobbies: [
      'hilo tensado en un carretello de madera',
      'patineta apoyada donde la pared está descascarada',
      'lente de cámara atrapando la última luz del día',
      'pincel todavía mojado con tres colores',
      'vinilo girando en el estante del cuarto',
      'lápiz afilado con la paciencia justa',
      'plectro atrapado entre dos cuerdas',
      'maceta trasplantada en un sábado lento'
    ],
    sarcasm_introvert: [
      'puerta cerrada tras un letrero amable escrito a mano',
      'batería sosteniendo el uno por ciento',
      'botón de silencio del tamaño de la luna llena',
      'taza que dice todavía no en letras claras',
      'cortina corrida contra la foto grupal',
      'silla reservada en la esquina más lejana',
      'modo avión usado como uniforme diario',
      'una media perdida entera a propósito'
    ],
    fitness_mental: [
      'cordón amarrado antes de que despierte la duda',
      'colchoneta enrollada firme como promesa cumplida',
      'respiración contada despacio hasta cuatro',
      'botella de agua medio llena a propósito',
      'racha marcada en un calendario de papel',
      'mancuerna apoyada junto a un cuaderno abierto',
      'correr al amanecer sin nadie mirando',
      'día de descanso escrito con tinta en el plan'
    ],
    family_milestones: [
      'medidas de crecimiento subiendo por el marco de la puerta',
      'botón de graduación guardado en un frasco de vidrio',
      'la primera llave de casa colgada de un clavo',
      'silla acercada a la mesa de los mayores',
      'receta manuscrita con letra de abuela',
      'caja de mudanza rotulada COCINA con marcador',
      'invitación con la fecha rodeada dos veces',
      'esquina de la foto doblada para encontrarla luego'
    ],
    music_fandom: [
      'pulsera puesta todavía después del bis',
      'entrada doblada en la cartera gastada',
      'setlist pegado en la pared del cuarto',
      'cuerda vieja guardada en una lata',
      'audífonos partidos para compartir un lado',
      'letras escritas en el dorso de una mano',
      'amplificador todavía tinte tras la última canción',
      'baqueta lanzada hacia el público que espera'
    ],
    food_drink: [
      'molde partido en dos por el centro',
      'cuchara clavada en chocolate espeso',
      'vapor subiendo de una segunda taza servida',
      'tupín devuelto limpio y vacío a casa',
      'cuchillo que solo corta la fruta madura',
      'receta duplicada sin que nadie la pida',
      'pan partido a mano en vez de rebanado',
      'sal tomada entre dos dedos sin dudar'
    ],
    outdoors_nature: [
      'sendero ensanchado en dos caminos que se alejan',
      'silla de camping mirando nada en particular',
      'resina de pino pegada al puño de la chaqueta',
      'piedra de río guardada en el bolsillo',
      'mapa doblado en la página equivocada otra vez',
      'cuerda enrollada antes de que empiece la subida',
      'neblina levantándose sobre un valle quieto',
      'palo de tienda arrancado al primer alba'
    ],
    retro_nostalgia: [
      'cassette rebobinado con la punta de un lápiz',
      'antena de plástico torcida para coger la señal',
      'banca partida en una fonda abierta de noche',
      'polaroid revelándose caliente en la palma',
      'calendario todavía en el mes pasado',
      'moneda devuelta por una máquina de videojuegos paciente',
      'recibo enroscado dentro de la guantera',
      'tono de llamada que tardó un minuto en salir'
    ],
    travel_adventure: [
      'tarjeta de embarque partida limpiamente en dos',
      'maleta cubierta con el calco de un primer viaje',
      'asiento de ventanilla tomado mucho antes del despegue',
      'página del pasaporte levantada en la esquina',
      'tarjeta de habitación con vista de verdad',
      'mapa carretero marcado con pluma terca',
      'etiqueta de equipaje con dirección extranjera',
      'tablero de salidas dándole vuelta a las letras'
    ],
    inspirational_clean: [
      'escalera apoyada en una pared sin terminar',
      'sobre de semillas abierto sobre tierra oscura',
      'página en blanco esperando sin miedo',
      'paso dibujado con tiza antes del borde',
      'hilo traido por la primera puntada',
      'brújula firme todavía sin norte',
      'puerta parada abierta a plena luz del día',
      'bote pequeño empujado desde el agua poco profunda'
    ]
  };

  /* ---------------- TEMPORADA · ENGLISH ---------------- */
  const EN_SEASON = {
    valentines: [
      'heart drawn with an unsteady line',
      'two tickets torn at the perforation',
      'candy heart carrying one plain word',
      'ribbon tied into a lopsided bow',
      'letter folded into a paper airplane',
      'second cup poured without being asked'
    ],
    st_patricks: [
      'shoe polished for a parade route',
      'paper clover cut with dull scissors',
      'coin dropped into a busker open hat',
      'green ribbon pinned to a worn lapel',
      'kettle waiting on a patient stove',
      'map with a circle drawn and no X'
    ],
    easter: [
      'basket still lined with plastic grass',
      'stone rolled away to one side',
      'candle lit before the sunrise arrives',
      'ribbon on a folded paper lily',
      'shoe left behind at the church door',
      'shell holding exactly one drop of water'
    ],
    mothers_day: [
      'handprint card folded twice and kept',
      'pan already washed and put away',
      'flower cut short for a small vase',
      'apron hung back on its usual hook',
      'recipe doubled without being asked',
      'phone call that runs well past midnight'
    ],
    fathers_day: [
      'tie kept folded in a quiet drawer',
      'wallet bulging with old receipts',
      'belt worn all the way to the last notch',
      'toolbox with one drawer that will not close',
      'chair reclined at exactly the same hour',
      'watch battery changed right on time'
    ],
    pride: [
      'flag held open with both hands',
      'sticker peeling on a lamp post',
      'letter written and finally sent anyway',
      'bead strung tight with a firm knot',
      'banner taped across a doorway',
      'voice carrying clean past the block'
    ],
    back_to_school: [
      'pencil sharpened the night before',
      'backpack far too big for the shoulders',
      'crayon set missing the peach one',
      'lunch note folded into a neat square',
      'name label pressed onto a shoe tongue',
      'bus pass riding in the front pocket'
    ],
    halloween: [
      'pumpkin gutted on yesterday newspaper',
      'cape made from an old bedsheet',
      'candle stub burning inside a jar',
      'candy bar traded up for the good one',
      'mask hanging from a rusted nail',
      'porch light left burning all night'
    ],
    thanksgiving: [
      'table extended with a plain wooden board',
      'plate served before anyone asks',
      'pie crust crimped by a sure thumb',
      'shoes lined up by the door after the walk',
      'leftovers packed in mismatched bowls',
      'chair hauled in from the garage'
    ],
    christmas: [
      'ornament stored away inside a sock',
      'lights tested before they go up',
      'list folded small in a coat pocket',
      'star placed slightly off the center',
      'wrapping paper running an inch short',
      'mug poured again for the last guest'
    ],
    new_year: [
      'clock face with no numbers at all',
      'confetti stuck to the bottom of a shoe',
      'page torn cleanly along the fold',
      'firework smoke drifting over a rooftop',
      'resolution written on a grocery receipt',
      'door held wide open at the stroke of midnight'
    ],
    black_friday: [
      'cart with one wheel that will not stop squeaking',
      'receipt longer than the bag it came in',
      'doorbuster line drawn in chalk before dawn',
      'price tag peeled off but still sticky',
      'bag carried in both arms at once',
      'alarm set an hour before the sale opens'
    ]
  };

  /* ---------------- TEMPORADA · ESPAÑOL ---------------- */
  const ES_SEASON = {
    valentines: [
      'corazón dibujado con una línea torcida',
      'dos entradas partidas por la perforación',
      'caramelito con una sola palabra clara',
      'listón atado en un moño chueco',
      'carta doblada en un avión de papel',
      'segunda taza servida sin que nadie la pida'
    ],
    st_patricks: [
      'zapato lustrado para el recorrido del desfile',
      'trébol de papel recortado con tijera roma',
      'moneda cayendo en el sombrero abierto del músico',
      'cinta verde prendida a la solera gastada',
      'tetera esperando en la estufa paciente',
      'mapa con un círculo marcado y sin equis'
    ],
    easter: [
      'cesta todavía forrada con hierba plástica',
      'piedra corrida hacia un lado',
      'vela encendida antes de que llegue el alba',
      'listón sobre un lirio de papel doblado',
      'zapato dejado en la puerta de la iglesia',
      'caracola que sostiene exactamente una gota'
    ],
    mothers_day: [
      'tarjeta con huella de mano doblada y guardada',
      'sartén ya lavada y guardada en su lugar',
      'flor cortada corta para un florero pequeño',
      'mandil colgado otra vez en su gancho',
      'receta duplicada sin que nadie la pida',
      'llamada que se pasa de medianoche'
    ],
    fathers_day: [
      'corbata guardada doblada en un cajón tranquilo',
      'cartera abultada con recibos viejos',
      'cinturón hasta el último agujero',
      'caja de herramientas con un cajón que no cierra',
      'sillón reclinado a la misma hora de siempre',
      'pila del reloj cambiada en fecha'
    ],
    pride: [
      'bandera abierta con las dos manos',
      'calcomanía despegándose en un poste',
      'carta escrita y enviada de todos modos',
      'cuenta de colores con nudo firme',
      'pancarta pegada con cinta sobre el marco',
      'voz que se escucha en toda la cuadra'
    ],
    back_to_school: [
      'lápiz afilado la noche anterior',
      'mochila enorme para los hombros',
      'caja de colores sin el durazno',
      'nota del almuerzo doblada en cuadro',
      'nombre pegado en la lengüeta del zapato',
      'tarjeta de bus en el bolsillo delantero'
    ],
    halloween: [
      'calabaza destripada sobre periódico viejo',
      'capa hecha con una sábana vieja',
      'trocito de vela quemándose en un frasco',
      'caramelo intercambiado por el bueno de verdad',
      'máscara colgada de un clavo oxidado',
      'foco del porche encendido toda la noche'
    ],
    thanksgiving: [
      'mesa ampliada con una tabla de madera',
      'plato servido antes de que nadie pregunte',
      'borde de pay sellado con el pulgar seguro',
      'zapatos alineados tras la caminata',
      'sobras en recipientes que no combinan',
      'silla traída desde el garaje'
    ],
    christmas: [
      'adorno guardado dentro de una media',
      'luces probadas antes de colgarlas',
      'lista doblada chica en el bolsillo del abrigo',
      'estrella puesta un poco descentrada',
      'papel de regalo corto una pulgada',
      'taza servida otra vez para el último invitado'
    ],
    new_year: [
      'esfera del reloj sin números en absoluto',
      'serpentina pegada en la suela de un zapato',
      'página partida limpio por la doblez',
      'humo de cohetes sobre la azotea',
      'propósito escrito en un recibo del mercado',
      'puerta abierta de par en par en punto'
    ],
    black_friday: [
      'carrito con una rueda que no deja de chirriar',
      'recibo más largo que la bolsa que lo trajo',
      'fila marcada con tiza antes del amanecer',
      'etiqueta de precio despegada pero todavía pegajosa',
      'bolsa cargada con las dos manos a la vez',
      'alarma puesta una hora antes de que abra la oferta'
    ]
  };

  /* Claves por región de mercado. Separar EN/ES por región es obligatorio:
     si un id solo tuviera una clave, getBankForSubniche() caería a su rama
     final (concatena TODAS las claves) y mezclaría inglés con español. */
  const EN_KEYS = ['global', 'us', 'uk', 'ca', 'au', 'anglo'];
  const ES_KEYS = ['global_es', 'es', 'latam', 'mexico', 'caribe', 'cono_sur', 'spain'];
  // Exportadas para que getBankForSubniche() pueda filtrar claves por idioma
  // en vez de concatenar todas cuando la región no coincide.
  window.POD_BANK_KEYS_EN = EN_KEYS;
  window.POD_BANK_KEYS_ES = ES_KEYS;

  /* Etiquetas en español: el id es el mismo en global_en y global_es, así que
     el label en inglés no sirve para el mercado hispano ("pets::pets" ya estaba
     resuelto, pero "Pets and Animals" en un selector en español no). */
  const NOMBRE_ES = {
    pets: 'Mascotas y animales',
    professions: 'Oficios y profesiones',
    hobbies: 'Pasatiempos y aficiones',
    sarcasm_introvert: 'Sarcasmo e introversión',
    fitness_mental: 'Fitness y mente',
    family_milestones: 'Hitos familiares',
    music_fandom: 'Música y fandom',
    food_drink: 'Comida y bebida',
    outdoors_nature: 'Naturaleza y aire libre',
    retro_nostalgia: 'Retro y nostalgia',
    travel_adventure: 'Viajes y aventura',
    inspirational_clean: 'Inspiración limpia',
    valentines: 'San Valentín',
    st_patricks: 'San Patricio',
    easter: 'Pascua',
    mothers_day: 'Día de la Madre',
    fathers_day: 'Día del Padre',
    pride: 'Orgullo',
    back_to_school: 'Vuelta al cole',
    halloween: 'Halloween',
    thanksgiving: 'Acción de Gracias',
    christmas: 'Navidad',
    new_year: 'Año Nuevo',
    black_friday: 'Black Friday'
  };

  /* Keywords en español: POD_GLOBAL_SUBNICHES solo trae keywords en inglés,
     así que en latam/spain/global_es la detección automática por concepto no
     encontraba nada ("comida y sabor" no matcheaba "food") y el pool caía a
     los 20 objetos comunes otra vez. */
  const KEYWORDS_ES = {
    pets: ['mascota', 'perro', 'gato', 'perrito', 'gatito', 'animal', 'veterinario'],
    professions: ['oficio', 'trabajo', 'profesion', 'empleo', 'obrero', 'taller', 'jefe'],
    hobbies: ['pasatiempo', 'aficion', 'hobby', 'coleccion', 'manualidad', 'creatividad'],
    sarcasm_introvert: ['sarcasmo', 'introvertido', 'antisocial', 'broma', 'humor seco', 'solitario'],
    fitness_mental: ['ejercicio', 'mente', 'salud', 'rutina', 'correr', 'fuerza'],
    family_milestones: ['familia', 'hijos', 'graduacion', 'casa', 'cumpleanos', 'hito'],
    music_fandom: ['musica', 'concierto', 'banda', 'cancion', 'fan', 'guitarra'],
    food_drink: ['comida', 'cocina', 'receta', 'cafe', 'pan', 'cena'],
    outdoors_nature: ['naturaleza', 'montana', 'rio', 'sendero', 'camping', 'aire libre'],
    retro_nostalgia: ['retro', 'nostalgia', 'vintage', 'recuerdo', 'antiguo', 'cassette'],
    travel_adventure: ['viaje', 'aventura', 'ruta', 'maleta', 'vuelo', 'mapa'],
    inspirational_clean: ['inspiracion', 'sueno', 'proposito', 'superar', 'futuro', 'animo'],
    valentines: ['san valentin', 'amor', 'corazon', 'pareja', 'amor y amistad'],
    st_patricks: ['san patricio', 'irlanda', 'trebol', 'suerte', 'desfile'],
    easter: ['pascua', 'resurreccion', 'cordero', 'iglesia', 'domingo santo'],
    mothers_day: ['madre', 'mama', 'dia de la madre'],
    fathers_day: ['padre', 'papa', 'dia del padre'],
    pride: ['orgullo', 'diversidad', 'bandera', 'respeto', 'amor es amor'],
    back_to_school: ['escuela', 'colegio', 'mochila', 'clases', 'maestro', 'vuelta al cole'],
    halloween: ['halloween', 'calabaza', 'disfraz', 'susto', 'noche de brujas'],
    thanksgiving: ['accion de gracias', 'gratitud', 'cena', 'familia', 'pan'],
    christmas: ['navidad', 'pesebre', 'villancico', 'diciembre', 'regalo', 'belen'],
    new_year: ['ano nuevo', 'brindis', 'resolucion', 'enero', 'cuenta atras'],
    black_friday: ['black friday', 'oferta', 'descuento', 'compra', 'rebaja']
  };

  /* Banco común en inglés. OBJECT_BANK_COMMON (data-estilos.js) está TODO en
     español y motor-nucleo lo concatenaba a todos los mercados: el pool EN
     terminaba con objetos "árbol cuyas ramas sostienen…". Comprobado en navegador. */
  const OBJECT_BANK_COMMON_EN = [
    'tree whose branches hold what matters',
    'lighthouse still burning with no visitors',
    'bridge joining two shores once thought apart',
    'seed splitting concrete in silence',
    'fire that will not go out in the storm',
    'narrow path climbing without asking',
    'door that only opens from the inside',
    'anchor that never touches bottom yet still holds',
    'clay cup mended with gold in its cracks',
    'river finding its way between stones',
    'book left open on the exact right page',
    'ladder with no top but a clear next step',
    'compass pointing where the owner chose',
    'key that opens exactly the right door',
    'coat given to the one who needed it more',
    'clock marking the hour to begin again',
    'mountain climbed one day at a time',
    'boat setting off with everything aboard',
    'lantern lighting just the next step',
    'footprint left for whoever comes after'
  ];

  const MARKET_REGIONES = [
    'global', 'us', 'uk', 'ca', 'au', 'anglo',
    'global_es', 'es', 'latam', 'mexico', 'caribe', 'cono_sur', 'spain', 'todas'
  ];
  const MARKET_AUDIENCIAS = [
    'global_joven_es', 'global_adulto_es', 'global_familia_es',
    'global_young_en', 'global_adult_en', 'global_family_en'
  ];

  function bankFor(english, spanish) {
    const b = {};
    EN_KEYS.forEach(function (k) { b[k] = english; });
    ES_KEYS.forEach(function (k) { b[k] = spanish; });
    return b;
  }

  function registerGroup(groupName, enMap, esMap) {
    Object.keys(enMap).forEach(function (id) {
      const meta = (POD_GLOBAL_SUBNICHES[groupName] || {})[id] || {};
      const nombre = meta.label || id;
      const prev = POD_SUBNICHES[id] || {};
      POD_SUBNICHES[id] = Object.assign({}, prev, {
        nombre: nombre,
        nombre_es: NOMBRE_ES[id] || nombre,
        grupo: groupName,
        regiones: MARKET_REGIONES.slice(),
        audiencias: MARKET_AUDIENCIAS.slice(),
        keywords: (meta.keywords || []).concat(KEYWORDS_ES[id] || []),
        bank: bankFor(enMap[id], esMap[id] || enMap[id])
      });
    });
  }

  registerGroup('evergreen', EN_EVERGREEN, ES_EVERGREEN);
  registerGroup('temporada', EN_SEASON, ES_SEASON);

  window.BANCO_GLOBAL_EN_EVERGREEN = EN_EVERGREEN;
  window.BANCO_GLOBAL_ES_EVERGREEN = ES_EVERGREEN;
  window.BANCO_GLOBAL_EN_TEMPORADA = EN_SEASON;
  window.BANCO_GLOBAL_ES_TEMPORADA = ES_SEASON;
  window.OBJECT_BANK_COMMON_EN = OBJECT_BANK_COMMON_EN;
})();
