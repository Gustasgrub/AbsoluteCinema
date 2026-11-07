import { useState } from 'react';
import { genreLabel } from '../utils/format.js';

/*
 * Plakatas. Jei filmas turi poster_url – rodomas paveikslėlis (<img>),
 * kitaip SVG plakatas sugeneruojamas iš žanro, pavadinimo, ID ir studijos spalvos:
 *  - žanras nusako spalvas ir geometrinį motyvą (kiekvienam žanrui – keli variantai);
 *  - ID parenka variantą ir smulkius poslinkius, todėl to paties žanro plakatai skiriasi;
 *  - studijos spalva šiek tiek nuspalvina foną ir apatinę juostelę.
 */

// [fonas, tekstas/formos, akcentas]
const PALETTES = {
  action: ['#c9302c', '#17130e', '#f2a93b'],
  adventure: ['#2f6b4f', '#f2eadc', '#f2a93b'],
  animation: ['#f2a93b', '#17130e', '#d7372a'],
  comedy: ['#f4d48f', '#17130e', '#d7372a'],
  crime: ['#17130e', '#f2eadc', '#d7372a'],
  documentary: ['#d9ccb3', '#17130e', '#1f6f68'],
  drama: ['#1f3a93', '#f2eadc', '#f2a93b'],
  family: ['#86b8ac', '#17130e', '#f2eadc'],
  fantasy: ['#4b2f78', '#f2eadc', '#f2a93b'],
  horror: ['#0d0b09', '#f2eadc', '#c9302c'],
  musical: ['#a8231b', '#f2eadc', '#f2a93b'],
  mystery: ['#1d2b2f', '#f2eadc', '#86b8ac'],
  romance: ['#e3a39b', '#17130e', '#a8231b'],
  'sci-fi': ['#0f2236', '#f2eadc', '#f2a93b'],
  thriller: ['#2a2622', '#f2a93b', '#c9302c'],
  war: ['#4a4a3a', '#f2eadc', '#c9302c'],
};

// Pseudo-atsitiktiniai skaičiai, visada vienodi tam pačiam filmui
function seeded(seed) {
  let value = (seed * 9301 + 49297) % 233280;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

// Sumaišo dvi HEX spalvas (amount 0..1)
function mix(hexA, hexB, amount) {
  const a = hexA.match(/\w\w/g).map((part) => parseInt(part, 16));
  const b = hexB.match(/\w\w/g).map((part) => parseInt(part, 16));
  return `#${a.map((value, i) => Math.round(value + (b[i] - value) * amount).toString(16).padStart(2, '0')).join('')}`;
}

// Pavadinimą suskaido į eilutes, kad tilptų į plakatą (ne daugiau 4 eilučių)
function wrapTitle(title) {
  const words = title.toUpperCase().split(/\s+/);
  for (let maxChars = 10; maxChars <= 22; maxChars += 1) {
    const lines = [];
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length <= maxChars || !line) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
    if (lines.length <= 4) return lines;
  }
  return [title.toUpperCase()];
}

const short = (text, max) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

// Teksto "hash'as" (FNV-1a): tas pats pavadinimas visada duoda tą patį skaičių,
// o skirtingi pavadinimai – tolygiai pasiskirsčiusius. "be" – druska, parinkta, kad
// vienos studijos to paties žanro filmai gautų skirtingas kompozicijas.
function hashText(text) {
  let hash = 2166136261;
  for (const char of `be${text}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

// Kiek skirtingų kompozicijų turi kiekvienas žanras
const VARIANTS = { fantasy: 3, 'sci-fi': 3, drama: 3, comedy: 3 };

// Geometrinis motyvas viršutinėje plakato dalyje (plotas ~200×190)
function Motif({ genre, variant, bg, fg, accent, r }) {
  switch (`${genre}:${variant % (VARIANTS[genre] ?? 2)}`) {
    case 'fantasy:2': // portalas su žvaigždėmis
      return (
        <g>
          {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={r(8, 192)} cy={r(8, 180)} r={r(0.6, 1.8)} fill={fg} />)}
          <circle cx="100" cy="96" r="72" fill="none" stroke={accent} strokeWidth="10" />
          <circle cx="100" cy="96" r="54" fill="none" stroke={fg} strokeWidth="1.5" strokeDasharray="3 6" />
          <rect x="84" y="90" width="32" height="58" rx="16" fill={accent} />
        </g>
      );
    case 'sci-fi:2': // horizonto tinklelis ir dryžuota saulė
      return (
        <g>
          <circle cx="100" cy="96" r="52" fill={accent} />
          {[78, 90, 102, 114].map((y, i) => <rect key={y} x="40" y={y} width="120" height={2 + i * 2} fill={bg} />)}
          <rect x="0" y="120" width="200" height="80" fill={bg} />
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`v${i}`} x1={100 + (i - 4) * 12} y1="120" x2={100 + (i - 4) * 60} y2="200" stroke={fg} strokeOpacity="0.5" />
          ))}
          {[126, 136, 150, 170].map((y) => <line key={y} x1="0" y1={y} x2="200" y2={y} stroke={fg} strokeOpacity="0.5" />)}
        </g>
      );
    case 'drama:2': // apšviestas langas
      return (
        <g>
          <rect x="54" y="34" width="92" height="124" fill={accent} />
          <g stroke={bg} strokeWidth="8">
            <line x1="100" y1="34" x2="100" y2="158" />
            <line x1="54" y1="96" x2="146" y2="96" />
          </g>
          <rect x="54" y="34" width="92" height="124" fill="none" stroke={fg} strokeWidth="3" />
          <polygon points="54,158 146,158 186,200 14,200" fill={accent} opacity="0.25" />
        </g>
      );
    case 'comedy:2': // įstrižos juostos ir kamuolys
      return (
        <g>
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={-60 + i * 40} y="-20" width="18" height="240" fill={accent} opacity="0.75" transform="rotate(25 100 100)" />
          ))}
          <circle cx={r(80, 120)} cy="100" r="40" fill={fg} />
          <circle cx="88" cy="88" r="10" fill={bg} opacity="0.5" />
        </g>
      );
    case 'sci-fi:0': // planeta su orbitomis
      return (
        <g fill="none" stroke={fg}>
          {[34, 56, 78].map((radius) => <circle key={radius} cx="100" cy="100" r={radius} strokeOpacity="0.35" strokeWidth="1.5" />)}
          <circle cx="100" cy="100" r="16" fill={accent} stroke="none" />
          <circle cx={100 + 56 * Math.cos(r(0, 6))} cy={100 + 56 * Math.sin(r(0, 6))} r="6" fill={fg} stroke="none" />
        </g>
      );
    case 'sci-fi:1': // planeta su žiedu ir žvaigždės
      return (
        <g>
          {Array.from({ length: 18 }, (_, i) => <circle key={i} cx={r(8, 192)} cy={r(8, 180)} r={r(0.6, 1.8)} fill={fg} />)}
          <circle cx={r(80, 120)} cy="95" r="44" fill={accent} />
          <ellipse cx="100" cy="95" rx="86" ry="16" fill="none" stroke={fg} strokeWidth="4" transform={`rotate(${r(-25, -10)} 100 95)`} />
        </g>
      );
    case 'fantasy:0': // pusmėnulis ir žvaigždės
      return (
        <g>
          <circle cx={r(95, 125)} cy="88" r="46" fill={accent} />
          <circle cx={r(118, 145)} cy="74" r="40" fill={bg} />
          {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={r(14, 186)} cy={r(14, 170)} r={r(0.8, 2.2)} fill={fg} />)}
        </g>
      );
    case 'fantasy:1': // pilis prieš didelį mėnulį
      return (
        <g>
          <circle cx="100" cy="92" r="70" fill={accent} opacity="0.9" />
          <g fill={fg}>
            <rect x="52" y="104" width="22" height="86" />
            <polygon points="48,106 63,72 78,106" />
            <rect x="80" y="84" width="40" height="106" />
            <polygon points="76,86 100,40 124,86" />
            <rect x="126" y="112" width="22" height="78" />
            <polygon points="122,114 137,84 152,114" />
          </g>
          <rect x="95" y="120" width="10" height="16" rx="5" fill={accent} />
        </g>
      );
    case 'drama:0':
    case 'war:0': // saulė ant horizonto
    case 'war:1':
      return (
        <g>
          <circle cx={r(80, 120)} cy="150" r="58" fill={accent} />
          <rect x="0" y="150" width="200" height="60" fill={bg} />
          <line x1="0" y1="150" x2="200" y2="150" stroke={fg} strokeWidth="2" />
          {genre === 'war' &&
            Array.from({ length: 16 }, (_, i) => (
              <line key={i} x1={8 + i * 12} y1="150" x2={8 + i * 12} y2={150 - r(6, 22)} stroke={fg} strokeWidth="2" />
            ))}
        </g>
      );
    case 'drama:1': // vieniša figūra ir ilgas šešėlis
      return (
        <g>
          <rect x="0" y="0" width="200" height="190" fill={accent} opacity="0.18" />
          <circle cx={r(150, 165)} cy="44" r="18" fill={accent} />
          <line x1="0" y1="160" x2="200" y2="160" stroke={fg} strokeWidth="2" />
          <polygon points="96,160 108,160 40,190 14,190" fill={fg} opacity="0.25" />
          <circle cx="102" cy="104" r="9" fill={fg} />
          <rect x="94" y="116" width="16" height="44" rx="7" fill={fg} />
        </g>
      );
    case 'thriller:0':
    case 'crime:0': // žaliuzės ir šviesos ruožas
      return (
        <g>
          <rect x={r(110, 140)} y="0" width="34" height="200" fill={accent} opacity="0.9" />
          {Array.from({ length: 11 }, (_, i) => <rect key={i} x="0" y={10 + i * 17} width="200" height="7" fill={fg} opacity="0.16" />)}
        </g>
      );
    case 'thriller:1':
    case 'crime:1': // stebinti akis
      return (
        <g>
          <path d="M14 100 Q 100 20 186 100 Q 100 180 14 100 Z" fill={fg} />
          <circle cx={r(90, 110)} cy="100" r="34" fill={accent} />
          <circle cx={r(95, 105)} cy="100" r="13" fill={bg} />
          {Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={30 + i * 17.5} y1="52" x2={22 + i * 19.5} y2="30" stroke={fg} strokeWidth="2" strokeLinecap="round" />
          ))}
        </g>
      );
    case 'horror:0': // varvantys lašai
      return (
        <g fill={accent}>
          {Array.from({ length: 7 }, (_, i) => <rect key={i} x={14 + i * 26} y="-10" width="16" height={r(40, 150)} rx="8" />)}
        </g>
      );
    case 'horror:1': // praviros durys tamsoje
      return (
        <g>
          <rect x="60" y="30" width="80" height="150" fill={fg} opacity="0.12" />
          <polygon points="60,30 112,40 112,170 60,180" fill={accent} />
          <polygon points="112,40 140,30 140,180 112,170" fill={fg} opacity="0.08" />
          <circle cx="104" cy="108" r="4" fill={bg} />
        </g>
      );
    case 'romance:0':
    case 'romance:1': // du persidengiantys apskritimai
      return (
        <g style={{ mixBlendMode: 'multiply' }}>
          <circle cx={variant % 2 ? 84 : 78} cy={variant % 2 ? 90 : 100} r="50" fill={accent} opacity="0.85" />
          <circle cx={variant % 2 ? 116 : 122} cy={variant % 2 ? 112 : 100} r={variant % 2 ? 40 : 50} fill={fg} opacity="0.55" />
        </g>
      );
    case 'action:0': // sprogimas
      return (
        <g>
          <polygon
            points={Array.from({ length: 24 }, (_, i) => {
              const angle = (i / 24) * Math.PI * 2;
              const radius = i % 2 === 0 ? 88 : 46;
              return `${100 + radius * Math.cos(angle)},${100 + radius * Math.sin(angle)}`;
            }).join(' ')}
            fill={accent}
          />
          <circle cx="100" cy="100" r="22" fill={fg} />
        </g>
      );
    case 'action:1': // greičio linijos ir rodyklės
      return (
        <g>
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x="-40" y={14 + i * 20} width={r(120, 260)} height="8" fill={i % 3 ? fg : accent} transform="skewX(-30)" />
          ))}
          <polygon points="120,60 170,100 120,140 132,100" fill={accent} />
        </g>
      );
    case 'adventure:0':
    case 'adventure:1': // kalnai ir saulė
      return (
        <g>
          <circle cx={r(40, 160)} cy="60" r="22" fill={accent} />
          <polygon points={variant % 2 ? '0,180 60,60 120,180' : '0,180 70,70 140,180'} fill={fg} opacity="0.85" />
          <polygon points={variant % 2 ? '80,180 150,80 220,180' : '70,180 140,95 210,180'} fill={accent} opacity="0.9" />
        </g>
      );
    case 'comedy:0': // konfeti
      return (
        <g>
          {Array.from({ length: 22 }, (_, i) => (
            <circle key={i} cx={r(10, 190)} cy={r(10, 170)} r={r(3, 11)} fill={i % 2 ? accent : fg} opacity={i % 3 ? 1 : 0.6} />
          ))}
          <path d="M20 150 Q 60 120 100 150 T 180 150" fill="none" stroke={fg} strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case 'comedy:1': // abstraktus veidas su šypsena
      return (
        <g>
          <circle cx="100" cy="98" r="70" fill={accent} />
          <circle cx="76" cy="80" r="9" fill={fg} />
          <circle cx="124" cy="80" r="9" fill={fg} />
          <path d="M62 112 Q 100 156 138 112" fill="none" stroke={fg} strokeWidth="8" strokeLinecap="round" />
        </g>
      );
    case 'musical:0':
    case 'musical:1': // garso bangos
      return (
        <g fill="none" stroke={fg} strokeWidth="3">
          {[30, 52, 74, 96].map((radius, i) => (
            <path key={radius} d={`M 30 ${100 - radius} A ${radius} ${radius} 0 0 1 30 ${100 + radius}`} opacity={1 - i * 0.2} />
          ))}
          <circle cx="30" cy="100" r="12" fill={accent} stroke="none" />
        </g>
      );
    case 'mystery:0':
    case 'mystery:1': // rakto skylutė
      return (
        <g>
          <circle cx="100" cy="88" r="70" fill="none" stroke={accent} strokeWidth="3" strokeDasharray="4 8" />
          <circle cx="100" cy="76" r="22" fill={fg} />
          <polygon points="88,90 112,90 122,140 78,140" fill={fg} />
        </g>
      );
    case 'documentary:0':
    case 'documentary:1': // kadrų tinklelis
      return (
        <g>
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={18 + (i % 4) * 42} y={18 + Math.floor(i / 4) * 52} width="36" height="44" fill={i === variant % 12 ? accent : fg} opacity={i % 5 ? 0.25 : 0.6} />
          ))}
        </g>
      );
    case 'animation:1':
    case 'family:1': // trys "šeimos" apskritimai
      return (
        <g>
          <circle cx="70" cy="110" r="46" fill={accent} />
          <circle cx="132" cy="122" r="34" fill={fg} opacity="0.85" />
          <circle cx="104" cy="64" r="20" fill={fg} />
          <circle cx={r(30, 170)} cy="30" r="6" fill={accent} />
        </g>
      );
    default: // animation:0, family:0 – žaismingos formos
      return (
        <g>
          <rect x={r(20, 50)} y="40" width="90" height="90" rx="45" fill={accent} transform={`rotate(${r(-20, 20)} 100 100)`} />
          <rect x={r(90, 120)} y="70" width="70" height="70" rx="18" fill={fg} opacity="0.85" transform={`rotate(${r(-30, 30)} 120 110)`} />
          <circle cx={r(40, 160)} cy="160" r="14" fill={fg} />
        </g>
      );
  }
}

function GeneratedPoster({ movie }) {
  const [baseBg, fg, accent] = PALETTES[movie.genre] || PALETTES.drama;
  const brand = movie.studio?.brand_color || accent;
  const seed = Number(movie.id) || 1;
  const random = seeded(seed);
  const r = (min, max) => min + random() * (max - min);
  const variant = hashText(movie.title || '');
  const bg = mix(baseBg, brand, 0.12 + (seed % 4) * 0.04); // studijos spalvos atspalvis

  const lines = wrapTitle(movie.title || 'Untitled');
  const longest = Math.max(...lines.map((line) => line.length));
  const fontSize = Math.min(40, 180 / (longest * 0.5), 104 / lines.length);
  const titleBottom = 258;
  const ruleY = titleBottom - lines.length * fontSize * 0.92 - 8;
  const credit = movie.type === 'series' ? 'Created by' : 'Directed by';
  const top = [genreLabel(movie.genre), movie.release_year].filter(Boolean).join(' · ').toUpperCase();

  return (
    <svg className="poster poster--generated" viewBox="0 0 200 300" role="img" aria-label={`${movie.title} poster`}>
      <rect width="200" height="300" fill={bg} />
      <Motif genre={movie.genre} variant={variant} bg={bg} fg={fg} accent={accent} r={r} />
      <rect x="0" y="0" width="200" height="22" fill={bg} opacity="0.8" />
      {/* Viršutinė eilutė: studija kairėje, žanras ir metai dešinėje – kartu ne daugiau ~34 simbolių */}
      <text x="12" y="15" className="poster__small" fill={fg}>{short((movie.studio?.name || '').toUpperCase(), Math.max(6, 32 - top.length))}</text>
      <text x="188" y="15" className="poster__small" fill={fg} textAnchor="end">{top}</text>
      <rect x="0" y={ruleY - 6} width="200" height={300 - ruleY} fill={bg} opacity="0.55" />
      <line x1="12" x2="188" y1={ruleY} y2={ruleY} stroke={fg} strokeWidth="1" opacity="0.6" />
      {lines.map((line, i) => (
        <text key={i} x="12" y={titleBottom - (lines.length - 1 - i) * fontSize * 0.92} className="poster__title" fill={fg} fontSize={fontSize}>
          {line}
        </text>
      ))}
      <text x="12" y="281" className="poster__small" fill={fg} opacity="0.85">
        {short(`${credit} ${movie.director || ''}`.toUpperCase(), 42)}
      </text>
      <rect x="0" y="292" width="200" height="8" fill={brand} />
    </svg>
  );
}

export default function Poster({ movie }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (movie.poster_url && !imageFailed) {
    return (
      <img
        className="poster poster--image"
        src={movie.poster_url}
        alt={`${movie.title} poster`}
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return <GeneratedPoster movie={movie} />;
}
