/* Convierte bancos.txt en JSONs de banco personal listos para
   Editor de bancos > Importar (uno por mercado). Formato editor:
   {"<subnicho>": [...objetos], "__phrase__<subnicho>": [...frases]}.
   Secciones del txt: humor Barranquilla (objetos + frases), gospel ES,
   gospel EN (versículos mezclados, se separan por idioma de la cita).
   Esos bancos viajan entre dispositivos vía Supabase (exportMemoryObject
   incluye todas las claves POD2|personalBank|*).
   Ejecutar:  node scripts/txt-a-bancos.js */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const lines = fs.readFileSync(path.join(ROOT, 'bancos.txt'), 'utf8').split(/\r?\n/);

function isHeader(t) {
  const s = t.trim();
  return s.length >= 8 && s.length <= 60 && s === s.toUpperCase() && !/[a-záéíóúñü]/.test(s);
}
const headerIdx = [];
lines.forEach((l, i) => { if (isHeader(l)) headerIdx.push(i); });
if (headerIdx.length < 2) { console.error('FAIL no se hallaron las 2 secciones'); process.exit(1); }

const secHumorObj = lines.slice(0, headerIdx[0]);
const secHumorFrases = lines.slice(headerIdx[0] + 1, headerIdx[1]);
const secGospel = lines.slice(headerIdx[1] + 1);

function clean(arr, needCitation) {
  const out = [];
  const seen = new Set();
  arr.forEach((l) => {
    const t = String(l).trim().replace(/\s+/g, ' ');
    if (t.length < 2) return;
    if (isHeader(t)) return;
    if (needCitation && !/\d+\s*:\s*\d+/.test(t)) return; // fuera notas/conversación
    const sig = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (!sig || seen.has(sig)) return;
    seen.add(sig);
    out.push(t);
  });
  return out;
}

const EN_BOOKS = ['genesis','exodus','leviticus','numbers','deuteronomy','joshua','judges','samuel','kings','chronicles','ezra','nehemiah','esther','job','psalm','psalms','proverbs','ecclesiastes','isaiah','jeremiah','lamentations','ezekiel','daniel','hosea','matthew','mark','luke','john','acts','romans','corinthians','galatians','ephesians','philippians','colossians','thessalonians','timothy','titus','philemon','hebrews','james','peter','jude','revelation'];
const ES_BOOKS = ['génesis','genesis','éxodo','levítico','números','deuteronomio','josué','jueces','samuel','reyes','crónicas','esdras','nehemías','ester','job','salmos','salmo','proverbios','eclesiastés','isaías','jeremías','lamentaciones','ezequiel','daniel','oseas','mateo','marcos','lucas','juan','hechos','romanos','corintios','gálatas','efesios','filipenses','colosenses','tesalonicenses','timoteo','tito','filemón','hebreos','santiago','pedro','judas','apocalipsis'];

function bookOf(line) {
  const m = line.match(/[—–-]\s*([1-3]?\s*[A-Za-záéíóúñü.]+)\s*\d+\s*:\s*\d+/);
  if (!m) return '';
  return m[1].toLowerCase().replace(/\./g, '').trim();
}

function isEN(line) {
  const b = bookOf(line);
  if (b) {
    if (EN_BOOKS.some((x) => b.indexOf(x) !== -1)) return true;
    if (ES_BOOKS.some((x) => b.indexOf(x) !== -1)) return false;
  }
  return /Psalm|Proverbs|LORD|Thou|thee|thy |thine|hath|doth|ye\b|Blessed|saith|cometh|hallowed/i.test(line);
}

const humorObj = clean(secHumorObj, false);
const humorFrases = clean(secHumorFrases, false);
let verses = clean(secGospel, true).map((l) => {
  let t = l;
  const m = t.match(/^(Isaiah 41:10)\s*[—–-]\s*(.+)$/);
  if (m) t = m[2].trim() + ' — ' + m[1];
  t = t.replace('Galatas 2:20', 'Galatians 2:20');
  return t;
});

const es = verses.filter((l) => !isEN(l));
const en = verses.filter((l) => isEN(l));

const col = { humor_costeno: humorObj, __phrase__humor_costeno: humorFrases };
const ges = { __phrase__comun: es };
const gen = { __phrase__comun: en };

fs.writeFileSync(path.join(ROOT, 'banco-personal-colombia.json'), JSON.stringify(col, null, 2), 'utf8');
fs.writeFileSync(path.join(ROOT, 'banco-personal-gospel-es.json'), JSON.stringify(ges, null, 2), 'utf8');
fs.writeFileSync(path.join(ROOT, 'banco-personal-gospel-en.json'), JSON.stringify(gen, null, 2), 'utf8');

console.log('humor objetos (humor_costeno): ' + humorObj.length);
console.log('humor frases (__phrase__humor_costeno): ' + humorFrases.length);
console.log('versos ES gospel-es: ' + es.length + ' | EN gospel-en: ' + en.length);
