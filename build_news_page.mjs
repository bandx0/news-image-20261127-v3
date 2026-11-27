// News 27 v3 — one-day world-news broadsheet, 1024x1024.
// Written from scratch in this session. Data: 40 stories verified
// 27 Nov 2026 (events that happened or were first reported that day,
// in any time zone). Layout: masthead + region pills + UTC timeline,
// 3 hero cards + numbers sidebar, 10 illustrated medium cards,
// ALSO ON briefs + light world map, DATE CHECK, footer.
import { writeFileSync } from 'node:fs';

const N = 40;
const DAY = 'Friday 27 November 2026';

// id, city, region, field, tag(O=OFFICIAL C=CONFIRMED R=REPORTED CL=CLAIM),
// headline, deck, source, scene
const STORIES = [
  { id: 1, city: 'KYIV', region: 'EUR', field: 'Conflict', tag: 'O', headline: 'RUSSIA FIRES 155 DRONES AT UKRAINE', deck: '155 drones overnight, 110 downed; 6 killed, 25 hurt across Ukraine.', source: 'Ukraine Air Force', scene: 'drones' },
  { id: 2, city: 'SHANGHAI', region: 'ESA', field: 'Markets', tag: 'C', headline: 'CHINA STOCKS SURGE ON STATE SUPPORT', deck: 'Shanghai +3.7%, CSI 300 +4.2%; chip stocks +17%.', source: 'Reuters', scene: 'market' },
  { id: 3, city: 'WELLINGTON', region: 'OCE', field: 'Politics', tag: 'C', headline: 'NEW ZEALAND LEFT WITH HUNG PARLIAMENT', deck: 'National 40, ACT 13, NZ First 12 — 65 of 130; Opportunity\u2019s 7 hold the balance.', source: 'Reuters', scene: 'parliament' },
  { id: 4, city: 'MAHIA · NZ', region: 'OCE', field: 'Space', tag: 'O', headline: 'ROCKET LAB FLIES 101ST ELECTRON', deck: '00:15 UTC lift-off sets a record 22 launches in a year.', source: 'Rocket Lab', scene: 'rocket' },
  { id: 5, city: 'HANOI', region: 'ESA', field: 'Trade', tag: 'O', headline: 'CPTPP OPENS TALKS WITH 3 MORE', deck: 'UAE, Indonesia and the Philippines to join accession talks.', source: 'Reuters', scene: 'flags' },
  { id: 6, city: 'SEOUL', region: 'ESA', field: 'Diplomacy', tag: 'C', headline: 'SEOUL REPATRIATES SIX NORTH KOREANS', deck: 'Six sent home by sea; a seventh chose to stay.', source: 'Reuters', scene: 'boat' },
  { id: 7, city: 'BRUSSELS', region: 'EUR', field: 'Politics', tag: 'C', headline: 'EU BACKS €45BN UKRAINE LOAN 24–3', deck: '€25bn military + €20bn budget aid; three states decline.', source: 'Reuters', scene: 'coin' },
  { id: 8, city: 'MUMBAI', region: 'SAS', field: 'Markets', tag: 'C', headline: 'SENSEX SLIDES 989 AS BRENT TOPS $97', deck: 'Sensex −989 to 83,339; Nifty −277 as oil climbs.', source: 'Moneycontrol', scene: 'ticker' },
  { id: 9, city: 'NEW YORK', region: 'NAM', field: 'Retail', tag: 'C', headline: 'BLACK FRIDAY: $12.9BN EXPECTED', deck: 'Adobe forecasts record US online sales, up 9.2%.', source: 'Adobe', scene: 'queue' },
  { id: 10, city: 'CANBERRA', region: 'OCE', field: 'Security', tag: 'O', headline: 'AUSTRALIA SANCTIONS 2 OVER IRGC ARSON', deck: 'Pair named for the 2024 synagogue and restaurant fires.', source: 'Reuters', scene: 'stamp' },
  { id: 11, city: 'MADRID', region: 'EUR', field: 'Politics', tag: 'C', headline: 'SPAIN CAMPAIGN ENDS; VOTE SUNDAY', deck: 'Campaign closes Friday; polls open Sun 29 Nov.', source: 'Reuters', scene: 'ballot' },
  { id: 12, city: 'JAKARTA', region: 'ESA', field: 'Crime', tag: 'C', headline: 'JAKARTA: 3 HELD OVER DSSA RIGGING', deck: '5,840 fake trades in under a minute; Rp10tn profit.', source: 'Reuters', scene: 'rigging' },
  { id: 13, city: 'LIMA', region: 'LAM', field: 'Environment', tag: 'C', headline: 'PERU WAVES SHUT ~96 PORTS', deck: 'Swells peak Fri–Sat; sea +51cm off Callao.', source: 'Peruvian Navy', scene: 'wave' },
  { id: 14, city: 'NEW YORK', region: 'NAM', field: 'Markets', tag: 'C', headline: 'GOLD REBOUNDS TO $3,622.91/OZ', deck: 'Gold steadies after the week\u2019s slide.', source: 'Reuters', scene: 'gold' },
  { id: 15, city: 'SINGAPORE', region: 'GLB', field: 'Energy', tag: 'C', headline: 'BRENT NEARS $97 ON GULF JITTERS', deck: 'Brent $97.19, first weekly gain in a month.', source: 'Reuters', scene: 'oil' },
  { id: 16, city: 'SEOUL', region: 'ESA', field: 'Markets', tag: 'C', headline: 'KOSPI +4.34% AS CHIPS REBOUND', deck: 'Samsung +4.6%, SK hynix +5.4% in Seoul rally.', source: 'Korea Exchange', scene: 'chips' },
  { id: 17, city: 'TOKYO', region: 'ESA', field: 'Markets', tag: 'C', headline: 'NIKKEI +2.1% TO 58,711', deck: 'Tokyo joins Asia\u2019s chip-led rebound.', source: 'AP', scene: 'nikkei' },
  { id: 18, city: 'BEIJING', region: 'ESA', field: 'Economy', tag: 'C', headline: 'BEIJING INDUSTRIAL PROFITS +20.1%', deck: 'October factory profits jump year on year.', source: 'NBS', scene: 'factory' },
  { id: 19, city: 'JAKARTA', region: 'ESA', field: 'Courts', tag: 'C', headline: 'PERTAMINA TRIAL OPENS; RP6.1TN', deck: 'Six defendants in Jakarta graft trial.', source: 'ANTARA', scene: 'court' },
  { id: 20, city: 'HAGLEY OVAL', region: 'OCE', field: 'Sport', tag: 'C', headline: 'NZ 246/5, DAY ONE VS INDIA', deck: 'Blundell 53* leads hosts at Hagley Oval.', source: 'Reuters', scene: 'cricket' },
  { id: 21, city: 'NAIROBI', region: 'SSA', field: 'Justice', tag: 'C', headline: 'OBADO JAILED 25 YEARS', deck: 'Ex-governor sentenced for murder in Nairobi.', source: 'Capital FM', scene: 'gavel' },
  { id: 22, city: 'JOHANNESBURG', region: 'SSA', field: 'Transport', tag: 'C', headline: 'OR TAMBO OUTAGE STRANDS FLYERS', deck: 'Power cut halts check-in at Johannesburg hub.', source: 'Moneyweb', scene: 'airport' },
  { id: 23, city: 'OTTAWA', region: 'NAM', field: 'Law', tag: 'C', headline: 'BILL 21 RULING DUE TODAY', deck: 'Top court rules 09:45 ET on Quebec\u2019s secularism law.', source: 'Supreme Court of Canada', scene: 'scales' },
  { id: 24, city: 'YELLOWKNIFE', region: 'NAM', field: 'Politics', tag: 'C', headline: 'CARNEY TO UNVEIL NORTH PLAN TONIGHT', deck: 'PM announces Arctic plan, 20:00 UTC.', source: 'PMO', scene: 'aurora' },
  { id: 25, city: 'BANGKOK', region: 'ESA', field: 'Disaster', tag: 'C', headline: 'BANGKOK MARKET FIRE GUTS 500 STALLS', deck: 'Pre-dawn blaze hits ~100 traders; no injuries.', source: 'Thaiger', scene: 'fire' },
  { id: 26, city: 'QUITO', region: 'LAM', field: 'Politics', tag: 'C', headline: 'QUITO: GANGS, PRISONS, CURFEWS', deck: 'Security crackdown before 29 Nov vote.', source: 'Rio Times', scene: 'curfew' },
  { id: 27, city: 'ZANZIBAR', region: 'SSA', field: 'Sport', tag: 'C', headline: 'ZANZIBAR HOST LIBYA IN CONFED OPENER', deck: 'Azam face Ahli Tripoli in CAF Confederation Cup.', source: 'CAF', scene: 'football' },
  { id: 28, city: 'LONDON', region: 'EUR', field: 'Sport', tag: 'C', headline: 'FOREST HOST CHELSEA TONIGHT', deck: 'Premier League, 20:00 GMT at the City Ground.', source: 'Premier League', scene: 'stadium' },
  { id: 29, city: 'HONG KONG', region: 'ESA', field: 'Markets', tag: 'C', headline: 'HANG SENG +2.1% TO 22,695', deck: 'Hong Kong joins the Asia rally.', source: 'Sharecast', scene: 'hseng' },
  { id: 30, city: 'LAGOS', region: 'SSA', field: 'Courts', tag: 'C', headline: 'LAGOS COURT ORDERS PASTOR ARREST', deck: 'Court orders arrest of Pastor Odukoya.', source: 'Rio Times', scene: 'warrant' },
  { id: 31, city: 'TOKYO', region: 'ESA', field: 'Economy', tag: 'C', headline: 'TOKYO CORE CPI 2.9%, 16-MONTH HIGH', deck: 'Fastest since Jul 2025; December BOJ hike eyed.', source: 'Reuters', scene: 'cpi' },
  { id: 32, city: 'ISLAMABAD', region: 'SAS', field: 'Law', tag: 'C', headline: 'ISLAMABAD COURT SUSPENDS FRIDAY SITTINGS', deck: 'Top court halts Friday hearings.', source: 'The News', scene: 'docket' },
  { id: 33, city: 'LONDON', region: 'EUR', field: 'Transport', tag: 'C', headline: 'TUBE STRIKE, DAY 2', deck: 'Piccadilly suspended; Circle, Waterloo & City halted.', source: 'TfL', scene: 'tube' },
  { id: 34, city: 'BERLIN', region: 'EUR', field: 'Economy', tag: 'C', headline: 'GERMAN JOBLESS +9,000 TO 3.03M', deck: 'Unemployment 6.4%; 646,000 vacancies.', source: 'Reuters', scene: 'queue' },
  { id: 35, city: 'PARIS', region: 'EUR', field: 'Economy', tag: 'C', headline: 'FRANCE GDP −0.2% IN Q3', deck: 'Final data worse than forecast.', source: 'INSEE', scene: 'gdp' },
  { id: 36, city: 'BRUSSELS', region: 'EUR', field: 'Security', tag: 'C', headline: 'RUSSIAN SABOTAGE IN EUROPE +16%', deck: 'Arson doubled; Poland, Germany, Baltics hit most.', source: 'IISS', scene: 'sabotage' },
  { id: 37, city: 'ANKARA', region: 'MEA', field: 'Energy', tag: 'C', headline: 'NOVATEK TURKEY LNG FROM 1 JAN', deck: 'Russia to supply Turkey as EU ban nears.', source: 'Reuters', scene: 'lng' },
  { id: 38, city: 'BUENOS AIRES', region: 'LAM', field: 'Energy', tag: 'C', headline: 'ENI TO DECIDE MON ON $51BN LNG', deck: 'Argentina project decision due 30 Nov.', source: 'Reuters', scene: 'shale' },
  { id: 39, city: 'CAIRO', region: 'NAF', field: 'Diplomacy', tag: 'C', headline: 'CAIRO: SISI, QATAR EMIR TALK GAZA', deck: 'Leaders discuss Gaza ceasefire by phone.', source: 'Africanews', scene: 'call' },
  { id: 40, city: 'MUMBAI', region: 'SAS', field: 'Security', tag: 'C', headline: 'MUMBAI BOMB-THREAT EMAIL, NOTHING FOUND', deck: 'Alert triggers search; nothing found.', source: 'IANS', scene: 'alert' },
];

const REGIONS = ['NAM', 'LAM', 'EUR', 'MEA', 'NAF', 'SSA', 'SAS', 'ESA', 'OCE', 'GLB'];
const REGION_NAMES = { NAM: 'N. America', LAM: 'Latin Am.', EUR: 'Europe', MEA: 'Middle East', NAF: 'N. Africa', SSA: 'Sub-Sah. Africa', SAS: 'S. Asia', ESA: 'East & SE Asia', OCE: 'Oceania', GLB: 'Global' };
const REGION_COLORS = { NAM: '#2563eb', LAM: '#0891b2', EUR: '#7c3aed', MEA: '#b45309', NAF: '#ca8a04', SSA: '#16a34a', SAS: '#dc2626', ESA: '#ea580c', OCE: '#0d9488', GLB: '#64748b' };

const TIMELINE = [
  ['00:15 UTC', 'Rocket Lab 101st Electron lifts off'],
  ['01:46 UTC', 'NZ final count: coalition one short'],
  ['02:47 UTC', 'Gold $3,622.91 an ounce'],
  ['04:44 UTC', 'Seoul repatriation announced'],
  ['06:00 UTC', '155 drones: 110 downed by 08:00 Kyiv'],
  ['07:00 UTC', 'Shanghai closes +3.7%'],
  ['09:25 UTC', 'CPTPP +3 talks agreed'],
  ['14:45 UTC', 'Bill 21 ruling due'],
];

const NUMBERS = [
  ['155', 'drones launched at Ukraine overnight'],
  ['110', 'downed by 08:00 Kyiv time'],
  ['+3.7%', 'Shanghai Composite, best day in 2 years'],
  ['65 / 130', 'NZ coalition seats — one short'],
  ['−989', 'Sensex points at the close'],
  ['$97', 'Brent crude, near a November high'],
];

// ---- assertions: the page must be internally consistent ----
if (STORIES.length !== N) throw new Error(`expected ${N} stories, got ${STORIES.length}`);
STORIES.forEach((s, i) => {
  if (s.id !== i + 1) throw new Error(`story ids must be 1..${N}, got ${s.id} at index ${i}`);
});
const regionCounts = {};
const fieldCounts = {};
for (const s of STORIES) {
  regionCounts[s.region] = (regionCounts[s.region] || 0) + 1;
  fieldCounts[s.field] = (fieldCounts[s.field] || 0) + 1;
}
const sumCounts = (o) => Object.values(o).reduce((a, b) => a + b, 0);
if (sumCounts(regionCounts) !== N) throw new Error('region counts do not sum to N');
if (sumCounts(fieldCounts) !== N) throw new Error('field counts do not sum to N');
for (const r of REGIONS) if (!regionCounts[r]) throw new Error(`region ${r} has no story`);
const FIELD_LIST = Object.keys(fieldCounts).sort();

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TAG_WORD = { O: 'OFFICIAL', C: 'CONFIRMED', R: 'REPORTED', CL: 'CLAIM' };
const TAG_CLASS = { O: 'tg-o', C: 'tg-c', R: 'tg-r', CL: 'tg-cl' };

// ---- drawn scenes: every card gets its own flat illustration (100x60 space) ----
const SCENES = {
  drones: { bg: '#0b1026', svg: `<rect x="0" y="46" width="100" height="14" fill="#1e293b"/><rect x="8" y="38" width="8" height="8" fill="#334155"/><rect x="20" y="32" width="7" height="14" fill="#334155"/><rect x="70" y="36" width="9" height="10" fill="#334155"/><rect x="82" y="40" width="6" height="6" fill="#334155"/><circle cx="18" cy="12" r="1.2" fill="#fff"/><circle cx="42" cy="8" r="1" fill="#fff"/><circle cx="66" cy="14" r="1.2" fill="#fff"/><circle cx="88" cy="9" r="1" fill="#fff"/><g fill="#f97316"><circle cx="52" cy="18" r="3"/><path d="M52 10 L54 16 L60 16 L55 20 L57 26 L52 22 L47 26 L49 20 L44 16 L50 16 Z"/></g><path d="M30 30 L52 18 L74 30" stroke="#fbbf24" stroke-width="1.4" fill="none"/><ellipse cx="30" cy="30" rx="5" ry="2.4" fill="#475569"/><ellipse cx="74" cy="30" rx="5" ry="2.4" fill="#475569"/>` },
  market: { bg: '#14532d', svg: `<rect x="0" y="48" width="100" height="12" fill="#052e16"/><rect x="10" y="34" width="10" height="14" fill="#4ade80"/><rect x="24" y="28" width="10" height="20" fill="#86efac"/><rect x="38" y="22" width="10" height="26" fill="#4ade80"/><rect x="52" y="14" width="10" height="34" fill="#bbf7d0"/><path d="M8 38 L26 28 L40 22 L56 12 L66 8" stroke="#fde047" stroke-width="2.4" fill="none"/><path d="M66 8 l-7 1 M66 8 l-1 7" stroke="#fde047" stroke-width="2"/><rect x="72" y="18" width="20" height="30" fill="#052e16"/><path d="M82 18 L82 6 L86 12 L90 18 Z" fill="#fde047"/><text x="82" y="44" font-size="9" font-weight="bold" fill="#fff" text-anchor="middle">+3.7%</text>` },
  parliament: { bg: '#1e3a5f', svg: `<rect x="0" y="48" width="100" height="12" fill="#0f2440"/><rect x="28" y="16" width="44" height="32" fill="#e8e0cf"/><path d="M28 16 L50 6 L72 16 Z" fill="#c9b896"/><rect x="46" y="28" width="8" height="20" fill="#1e3a5f"/><rect x="34" y="32" width="6" height="16" fill="#1e3a5f"/><rect x="60" y="32" width="6" height="16" fill="#1e3a5f"/><rect x="28" y="16" width="22" height="32" fill="#2563eb" opacity="0.55"/><rect x="50" y="16" width="22" height="32" fill="#dc2626" opacity="0.55"/><rect x="47" y="10" width="6" height="38" fill="#f59e0b"/><text x="50" y="58" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">65 – 65</text>` },
  rocket: { bg: '#0f172a', svg: `<rect x="0" y="48" width="100" height="12" fill="#14532d"/><circle cx="14" cy="10" r="1.2" fill="#fff"/><circle cx="30" cy="6" r="1" fill="#fff"/><circle cx="84" cy="8" r="1.2" fill="#fff"/><circle cx="70" cy="16" r="1" fill="#fff"/><path d="M50 8 L55 30 L50 36 L45 30 Z" fill="#f8fafc"/><path d="M45 30 L41 38 L46 34 Z" fill="#dc2626"/><path d="M55 30 L59 38 L54 34 Z" fill="#dc2626"/><path d="M50 36 L54 46 L50 52 L46 46 Z" fill="#f97316"/><path d="M50 40 L52 46 L50 49 L48 46 Z" fill="#fde047"/><ellipse cx="50" cy="52" rx="14" ry="2.4" fill="#f97316" opacity="0.5"/>` },
  flags: { bg: '#78350f', svg: `<rect x="0" y="44" width="100" height="16" fill="#451a03"/><rect x="8" y="12" width="26" height="18" fill="#fff" stroke="#000" stroke-width="0.6"/><rect x="8" y="12" width="26" height="6" fill="#00732f"/><rect x="8" y="24" width="26" height="6" fill="#000"/><rect x="38" y="12" width="26" height="18" fill="#fff" stroke="#000" stroke-width="0.6"/><rect x="38" y="12" width="26" height="9" fill="#ce1126"/><rect x="68" y="12" width="26" height="18" fill="#fff" stroke="#000" stroke-width="0.6"/><rect x="68" y="12" width="26" height="9" fill="#0038a8"/><circle cx="76" cy="21" r="3" fill="#fcd116"/><text x="50" y="56" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">+ 3 MORE</text>` },
  boat: { bg: '#0c4a6e', svg: `<rect x="0" y="34" width="100" height="26" fill="#0369a1"/><path d="M0 40 Q25 36 50 40 T100 40" stroke="#7dd3fc" stroke-width="1.4" fill="none"/><path d="M50 6 L50 34" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="3 2"/><path d="M28 38 L72 38 L64 48 L36 48 Z" fill="#78350f"/><rect x="46" y="28" width="3" height="12" fill="#451a03"/><path d="M49 28 L62 36 L49 36 Z" fill="#f8fafc"/><circle cx="38" cy="34" r="1.6" fill="#fff"/><circle cx="46" cy="33" r="1.6" fill="#fff"/><circle cx="54" cy="34" r="1.6" fill="#fff"/><circle cx="62" cy="33" r="1.6" fill="#fff"/>` },
  coin: { bg: '#1e3a5f', svg: `<circle cx="50" cy="28" r="20" fill="#f59e0b" stroke="#b45309" stroke-width="2"/><circle cx="50" cy="28" r="14" fill="none" stroke="#b45309" stroke-width="1.2"/><text x="50" y="33" font-size="13" font-weight="bold" fill="#451a03" text-anchor="middle">€45bn</text><rect x="14" y="50" width="34" height="8" fill="#2563eb"/><rect x="52" y="50" width="34" height="8" fill="#dc2626"/><text x="31" y="57" font-size="6" fill="#fff" text-anchor="middle">25 MIL</text><text x="69" y="57" font-size="6" fill="#fff" text-anchor="middle">20 BUDGET</text>` },
  ticker: { bg: '#450a0a', svg: `<rect x="6" y="8" width="88" height="26" fill="#111827" stroke="#374151"/><text x="12" y="20" font-size="8" font-weight="bold" fill="#f87171">SENSEX</text><text x="12" y="31" font-size="10" font-weight="bold" fill="#fff">−989</text><path d="M58 12 L70 22 L78 16 L90 26" stroke="#ef4444" stroke-width="2.4" fill="none"/><path d="M90 26 l-6 0 M90 26 l0 -6" stroke="#ef4444" stroke-width="2"/><rect x="10" y="42" width="12" height="14" fill="#78350f"/><rect x="10" y="42" width="12" height="4" fill="#92400e"/><text x="34" y="54" font-size="9" font-weight="bold" fill="#fbbf24">$97 OIL</text>` },
  queue: { bg: '#7c2d12', svg: `<rect x="0" y="40" width="100" height="20" fill="#451a03"/><rect x="8" y="14" width="84" height="26" fill="#1f2937"/><rect x="14" y="20" width="72" height="10" fill="#f59e0b"/><text x="50" y="28" font-size="7" font-weight="bold" fill="#451a03" text-anchor="middle">BLACK FRIDAY</text><circle cx="22" cy="46" r="4" fill="#f8fafc"/><circle cx="38" cy="46" r="4" fill="#e2e8f0"/><circle cx="54" cy="46" r="4" fill="#f8fafc"/><circle cx="70" cy="46" r="4" fill="#e2e8f0"/><rect x="82" y="40" width="12" height="12" fill="#dc2626"/><text x="88" y="49" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">%</text>` },
  stamp: { bg: '#7f1d1d', svg: `<rect x="0" y="46" width="100" height="14" fill="#450a0a"/><circle cx="50" cy="28" r="20" fill="#991b1b" stroke="#fbbf24" stroke-width="2.4"/><text x="50" y="25" font-size="7" font-weight="bold" fill="#fbbf24" text-anchor="middle">SANCTION</text><text x="50" y="34" font-size="7" font-weight="bold" fill="#fbbf24" text-anchor="middle">STAMP</text><text x="50" y="56" font-size="7" font-weight="bold" fill="#fecaca" text-anchor="middle">2 NAMED OVER ARSON</text>` },
  ballot: { bg: '#1e293b', svg: `<rect x="0" y="46" width="100" height="14" fill="#0f172a"/><rect x="34" y="20" width="32" height="26" fill="#92400e"/><rect x="30" y="16" width="40" height="6" fill="#78350f"/><rect x="46" y="8" width="8" height="10" fill="#f8fafc" transform="rotate(12 50 13)"/><text x="50" y="38" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">29 NOV</text><rect x="8" y="34" width="16" height="12" fill="#2563eb"/><rect x="76" y="34" width="16" height="12" fill="#dc2626"/><rect x="14" y="26" width="4" height="8" fill="#93c5fd"/><rect x="82" y="26" width="4" height="8" fill="#fca5a5"/>` },
  rigging: { bg: '#111827', svg: `<rect x="6" y="8" width="60" height="30" fill="#052e16" stroke="#374151"/><path d="M10 32 L24 26 L36 18 L48 10 L62 6" stroke="#4ade80" stroke-width="2" fill="none"/><text x="12" y="18" font-size="7" font-weight="bold" fill="#fff">29,000 → 90,000</text><circle cx="78" cy="22" r="7" fill="none" stroke="#cbd5e1" stroke-width="2.4"/><circle cx="90" cy="34" r="7" fill="none" stroke="#cbd5e1" stroke-width="2.4"/><path d="M84 26 L86 30" stroke="#cbd5e1" stroke-width="2.4"/><text x="76" y="52" font-size="8" font-weight="bold" fill="#f87171">5,840 FAKE TRADES</text>` },
  wave: { bg: '#0369a1', svg: `<rect x="0" y="46" width="100" height="14" fill="#0c4a6e"/><path d="M0 46 Q18 18 40 30 Q58 40 74 22 Q88 10 100 22 L100 46 Z" fill="#38bdf8"/><path d="M0 46 Q18 24 40 34 Q58 42 74 28 Q88 18 100 26" stroke="#e0f2fe" stroke-width="1.6" fill="none"/><rect x="60" y="30" width="26" height="16" fill="#78350f"/><rect x="60" y="30" width="26" height="4" fill="#dc2626"/><path d="M14 46 L20 30 L26 46 Z" fill="#f8fafc"/><path d="M26 46 L32 34 L38 46 Z" fill="#e2e8f0"/>` },
  gold: { bg: '#451a03', svg: `<rect x="0" y="46" width="100" height="14" fill="#1c0a00"/><rect x="26" y="34" width="20" height="12" fill="#f59e0b"/><rect x="54" y="34" width="20" height="12" fill="#fbbf24"/><rect x="40" y="22" width="20" height="12" fill="#fcd34d"/><text x="50" y="16" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">$3,622.91</text><path d="M8 20 L20 14 L28 18" stroke="#4ade80" stroke-width="2" fill="none"/>` },
  oil: { bg: '#0f172a', svg: `<rect x="0" y="46" width="100" height="14" fill="#1e293b"/><rect x="16" y="20" width="18" height="26" fill="#78350f"/><rect x="16" y="20" width="18" height="5" fill="#92400e"/><path d="M25 20 Q22 10 25 6 Q28 10 25 20" fill="#f97316"/><path d="M25 14 Q23 9 25 6 Q27 9 25 14" fill="#fde047"/><path d="M52 30 L66 20 L76 24 L90 12" stroke="#4ade80" stroke-width="2.4" fill="none"/><text x="70" y="44" font-size="9" font-weight="bold" fill="#fff">$97.19</text>` },
  chips: { bg: '#052e16', svg: `<rect x="30" y="12" width="40" height="36" fill="#14532d" stroke="#4ade80" stroke-width="1.6"/><rect x="40" y="22" width="20" height="16" fill="#22c55e"/><path d="M30 20 L22 20 M30 30 L22 30 M30 40 L22 40 M70 20 L78 20 M70 30 L78 30 M70 40 L78 40" stroke="#4ade80" stroke-width="1.6"/><path d="M10 44 L26 34 L44 28 L58 18" stroke="#fde047" stroke-width="2.2" fill="none"/><text x="80" y="52" font-size="8" font-weight="bold" fill="#fff">+4.34%</text>` },
  nikkei: { bg: '#7f1d1d', svg: `<rect x="0" y="48" width="100" height="12" fill="#450a0a"/><path d="M50 10 L56 48 L44 48 Z" fill="#e8e0cf"/><rect x="46" y="22" width="8" height="4" fill="#dc2626"/><path d="M8 40 L28 32 L46 26 L64 16 L84 10" stroke="#4ade80" stroke-width="2.2" fill="none"/><path d="M84 10 l-7 1 M84 10 l-1 7" stroke="#4ade80" stroke-width="2"/><circle cx="88" cy="12" r="6" fill="#dc2626"/>` },
  factory: { bg: '#334155', svg: `<rect x="0" y="44" width="100" height="16" fill="#1e293b"/><rect x="12" y="26" width="40" height="18" fill="#475569"/><path d="M12 26 L24 18 L36 26 L48 18 L52 26 Z" fill="#64748b"/><rect x="60" y="14" width="7" height="30" fill="#64748b"/><rect x="72" y="20" width="7" height="24" fill="#64748b"/><circle cx="63" cy="10" r="3" fill="#e2e8f0" opacity="0.8"/><circle cx="75" cy="14" r="2.4" fill="#e2e8f0" opacity="0.7"/><text x="88" y="40" font-size="8" font-weight="bold" fill="#4ade80">+20.1%</text>` },
  court: { bg: '#1e3a5f', svg: `<rect x="0" y="46" width="100" height="14" fill="#0f2440"/><path d="M50 8 L86 22 L14 22 Z" fill="#e8e0cf"/><rect x="20" y="24" width="6" height="20" fill="#e8e0cf"/><rect x="40" y="24" width="6" height="20" fill="#e8e0cf"/><rect x="54" y="24" width="6" height="20" fill="#e8e0cf"/><rect x="74" y="24" width="6" height="20" fill="#e8e0cf"/><rect x="16" y="44" width="68" height="3" fill="#e8e0cf"/><rect x="44" y="28" width="12" height="4" fill="#78350f" transform="rotate(-18 50 30)"/>` },
  cricket: { bg: '#14532d', svg: `<rect x="0" y="44" width="100" height="16" fill="#052e16"/><ellipse cx="50" cy="48" rx="34" ry="5" fill="#166534"/><rect x="30" y="20" width="4" height="22" fill="#f59e0b"/><rect x="38" y="20" width="4" height="22" fill="#f59e0b"/><rect x="46" y="20" width="4" height="22" fill="#f59e0b"/><rect x="62" y="26" width="5" height="20" fill="#e8e0cf" transform="rotate(28 64 36)"/><circle cx="78" cy="18" r="4" fill="#dc2626"/><text x="50" y="14" font-size="9" font-weight="bold" fill="#fff">246/5</text>` },
};

Object.assign(SCENES, {
  gavel: { bg: '#78350f', svg: `<rect x="0" y="46" width="100" height="14" fill="#451a03"/><rect x="34" y="40" width="32" height="6" fill="#92400e"/><rect x="40" y="34" width="20" height="6" fill="#b45309"/><rect x="42" y="16" width="26" height="9" fill="#78350f" transform="rotate(-24 55 20)"/><rect x="66" y="22" width="16" height="4" fill="#92400e" transform="rotate(-24 74 24)"/><text x="50" y="12" font-size="9" font-weight="bold" fill="#fff">25 YEARS</text>` },
  airport: { bg: '#0c4a6e', svg: `<rect x="0" y="46" width="100" height="14" fill="#082f49"/><path d="M14 22 L44 22 L50 16 L56 22 L78 22 L72 28 L50 28 L44 28 Z" fill="#f8fafc"/><path d="M50 28 L50 36" stroke="#f8fafc" stroke-width="2"/><rect x="60" y="34" width="26" height="12" fill="#1e293b"/><path d="M64 40 L82 40" stroke="#f87171" stroke-width="2"/><path d="M73 36 L73 44" stroke="#f87171" stroke-width="2"/><circle cx="20" cy="12" r="1" fill="#fff"/><circle cx="86" cy="10" r="1.2" fill="#fff"/>` },
  scales: { bg: '#1e293b', svg: `<rect x="0" y="48" width="100" height="12" fill="#0f172a"/><path d="M50 12 L50 44" stroke="#e8e0cf" stroke-width="2.4"/><path d="M28 16 L72 16" stroke="#e8e0cf" stroke-width="2.4"/><circle cx="50" cy="10" r="3" fill="#f59e0b"/><path d="M28 16 L20 34 M28 16 L36 34" stroke="#cbd5e1" stroke-width="1.4"/><path d="M72 16 L64 34 M72 16 L80 34" stroke="#cbd5e1" stroke-width="1.4"/><path d="M14 34 Q28 42 42 34 Z" fill="#94a3b8"/><path d="M58 34 Q72 42 86 34 Z" fill="#94a3b8"/>` },
  aurora: { bg: '#022c22', svg: `<rect x="0" y="46" width="100" height="14" fill="#052e16"/><path d="M0 18 Q25 6 50 16 T100 12 L100 26 Q75 18 50 26 T0 26 Z" fill="#34d399" opacity="0.75"/><path d="M0 28 Q30 18 60 26 T100 24 L100 34 Q70 28 40 34 T0 34 Z" fill="#6ee7b7" opacity="0.55"/><circle cx="84" cy="8" r="1.2" fill="#fff"/><path d="M18 46 L24 30 L30 46 Z" fill="#14532d"/><path d="M70 46 L76 32 L82 46 Z" fill="#14532d"/>` },
  fire: { bg: '#450a0a', svg: `<rect x="0" y="46" width="100" height="14" fill="#1c0a00"/><path d="M50 8 Q58 22 52 34 Q62 26 60 40 L40 40 Q38 26 48 34 Q42 22 50 8" fill="#f97316"/><path d="M50 24 Q54 32 50 38 Q46 32 50 24" fill="#fde047"/><rect x="10" y="36" width="24" height="10" fill="#78350f"/><rect x="66" y="36" width="24" height="10" fill="#78350f"/><path d="M10 36 L22 30 L34 36 Z" fill="#b45309"/><path d="M66 36 L78 30 L90 36 Z" fill="#b45309"/>` },
  curfew: { bg: '#1e1b4b', svg: `<rect x="0" y="46" width="100" height="14" fill="#0f0a2e"/><circle cx="82" cy="12" r="7" fill="#fde68a"/><rect x="8" y="30" width="84" height="16" fill="#312e81"/><rect x="8" y="30" width="84" height="3" fill="#f59e0b"/><rect x="20" y="36" width="8" height="10" fill="#1e1b4b"/><rect x="46" y="36" width="8" height="10" fill="#1e1b4b"/><rect x="72" y="36" width="8" height="10" fill="#1e1b4b"/><path d="M50 20 L54 28 L46 28 Z" fill="#f87171"/>` },
  football: { bg: '#14532d', svg: `<rect x="0" y="44" width="100" height="16" fill="#052e16"/><ellipse cx="50" cy="48" rx="36" ry="5" fill="#166534"/><path d="M22 16 L22 44 M78 16 L78 44 M22 16 L78 16" stroke="#f8fafc" stroke-width="2.4" fill="none"/><circle cx="50" cy="30" r="10" fill="#f8fafc" stroke="#0f172a" stroke-width="1.4"/><path d="M50 24 L55 28 L53 34 L47 34 L45 28 Z" fill="#0f172a"/><path d="M50 20 L50 24 M55 28 L60 26 M53 34 L56 39 M47 34 L44 39 M45 28 L40 26" stroke="#0f172a" stroke-width="1"/>` },
  stadium: { bg: '#0f172a', svg: `<rect x="0" y="46" width="100" height="14" fill="#1e293b"/><path d="M10 46 Q10 22 50 22 Q90 22 90 46 Z" fill="#334155"/><path d="M10 46 Q10 30 50 30 Q90 30 90 46 Z" fill="#475569"/><rect x="16" y="34" width="68" height="4" fill="#f8fafc" opacity="0.8"/><circle cx="20" cy="10" r="3" fill="#fde047"/><circle cx="80" cy="10" r="3" fill="#fde047"/><path d="M20 13 L30 30 M80 13 L70 30" stroke="#fde047" stroke-width="1" opacity="0.6"/><text x="50" y="42" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">20:00 GMT</text>` },
  hseng: { bg: '#0c4a6e', svg: `<rect x="0" y="48" width="100" height="12" fill="#082f49"/><rect x="12" y="26" width="10" height="22" fill="#164e63"/><rect x="26" y="18" width="10" height="30" fill="#155e75"/><rect x="40" y="30" width="10" height="18" fill="#164e63"/><rect x="54" y="22" width="10" height="26" fill="#155e75"/><path d="M68 36 L80 26 L88 20" stroke="#4ade80" stroke-width="2.4" fill="none"/><path d="M88 20 l-7 1 M88 20 l-1 7" stroke="#4ade80" stroke-width="2"/><text x="50" y="12" font-size="9" font-weight="bold" fill="#fff">+2.1%</text>` },
  warrant: { bg: '#7f1d1d', svg: `<rect x="0" y="46" width="100" height="14" fill="#450a0a"/><rect x="30" y="8" width="40" height="38" fill="#fef3c7"/><rect x="36" y="14" width="28" height="3" fill="#78350f"/><rect x="36" y="21" width="28" height="2" fill="#a8a29e"/><rect x="36" y="26" width="28" height="2" fill="#a8a29e"/><rect x="36" y="31" width="18" height="2" fill="#a8a29e"/><circle cx="62" cy="40" r="6" fill="none" stroke="#dc2626" stroke-width="1.8"/><path d="M58 40 L61 43 L66 37" stroke="#dc2626" stroke-width="1.8" fill="none"/>` },
  cpi: { bg: '#78350f', svg: `<rect x="0" y="46" width="100" height="14" fill="#451a03"/><rect x="14" y="20" width="22" height="14" fill="#fef3c7" transform="rotate(-8 25 27)"/><rect x="60" y="16" width="22" height="14" fill="#fef3c7" transform="rotate(8 71 23)"/><text x="25" y="30" font-size="8" font-weight="bold" fill="#92400e" text-anchor="middle" transform="rotate(-8 25 27)">2.9%</text><text x="71" y="26" font-size="7" font-weight="bold" fill="#92400e" text-anchor="middle" transform="rotate(8 71 23)">CPI</text><path d="M44 40 L56 30 L68 24" stroke="#4ade80" stroke-width="2.2" fill="none"/>` },
  docket: { bg: '#1e3a5f', svg: `<rect x="0" y="46" width="100" height="14" fill="#0f2440"/><rect x="24" y="14" width="52" height="32" fill="#b45309"/><rect x="24" y="14" width="52" height="10" fill="#92400e"/><rect x="30" y="30" width="40" height="3" fill="#fef3c7"/><rect x="30" y="36" width="28" height="3" fill="#fef3c7"/><circle cx="70" cy="40" r="4" fill="#dc2626"/>` },
  tube: { bg: '#1e293b', svg: `<rect x="0" y="46" width="100" height="14" fill="#0f172a"/><circle cx="50" cy="26" r="14" fill="none" stroke="#dc2626" stroke-width="5"/><rect x="30" y="22" width="40" height="8" fill="#2563eb"/><text x="50" y="52" font-size="8" font-weight="bold" fill="#f87171" text-anchor="middle">NO SERVICE</text><circle cx="16" cy="12" r="1.2" fill="#fff"/><circle cx="84" cy="10" r="1.2" fill="#fff"/>` },
  jobs: { bg: '#334155', svg: `<rect x="0" y="46" width="100" height="14" fill="#1e293b"/><circle cx="24" cy="30" r="5" fill="#f8fafc"/><circle cx="40" cy="30" r="5" fill="#e2e8f0"/><circle cx="56" cy="30" r="5" fill="#f8fafc"/><circle cx="72" cy="30" r="5" fill="#e2e8f0"/><rect x="18" y="38" width="12" height="8" fill="#475569"/><rect x="34" y="38" width="12" height="8" fill="#475569"/><rect x="50" y="38" width="12" height="8" fill="#475569"/><rect x="66" y="38" width="12" height="8" fill="#475569"/><text x="50" y="14" font-size="10" font-weight="bold" fill="#fff">3,025,000</text>` },
  gdp: { bg: '#312e81', svg: `<rect x="0" y="48" width="100" height="12" fill="#1e1b4b"/><path d="M50 8 L58 48 L54 48 L50 34 L46 48 L42 48 Z" fill="#e8e0cf"/><path d="M46 34 L54 34" stroke="#312e81" stroke-width="1.6"/><path d="M66 18 L78 30 L84 24" stroke="#ef4444" stroke-width="2.4" fill="none"/><path d="M84 24 l-6 0 M84 24 l0 -6" stroke="#ef4444" stroke-width="2"/><text x="18" y="40" font-size="10" font-weight="bold" fill="#fff">−0.2%</text>` },
  sabotage: { bg: '#450a0a', svg: `<rect x="0" y="46" width="100" height="14" fill="#1c0a00"/><rect x="8" y="10" width="84" height="34" fill="#1e293b" stroke="#475569"/><circle cx="30" cy="22" r="4" fill="#ef4444"/><circle cx="52" cy="30" r="4" fill="#ef4444"/><circle cx="72" cy="20" r="4" fill="#ef4444"/><path d="M20 36 L36 28 L50 36 L66 26 L80 34" stroke="#f97316" stroke-width="1.6" fill="none"/><path d="M52 30 Q50 22 52 18 Q54 22 52 30" fill="#fde047"/><text x="50" y="54" font-size="7" font-weight="bold" fill="#fff">+16%</text>` },
  lng: { bg: '#0c4a6e', svg: `<rect x="0" y="40" width="100" height="20" fill="#082f49"/><path d="M0 44 Q25 40 50 44 T100 44" stroke="#7dd3fc" stroke-width="1.4" fill="none"/><rect x="18" y="28" width="52" height="12" fill="#78350f"/><circle cx="28" cy="28" r="5" fill="#92400e"/><circle cx="44" cy="28" r="5" fill="#92400e"/><circle cx="60" cy="28" r="5" fill="#92400e"/><path d="M78 34 L78 20 Q78 14 82 14 Q86 14 86 20 L86 34" fill="none" stroke="#f97316" stroke-width="2"/><path d="M82 14 Q80 8 82 5 Q84 8 82 14" fill="#fde047"/>` },
  shale: { bg: '#78350f', svg: `<rect x="0" y="46" width="100" height="14" fill="#451a03"/><path d="M30 46 L38 14 L46 46 Z" fill="#1e293b"/><path d="M38 14 L38 46" stroke="#94a3b8" stroke-width="1.4"/><path d="M32 34 L44 34" stroke="#94a3b8" stroke-width="1.4"/><rect x="56" y="16" width="34" height="24" fill="#fef3c7"/><rect x="60" y="21" width="26" height="2" fill="#a8a29e"/><rect x="60" y="27" width="26" height="2" fill="#a8a29e"/><text x="73" y="37" font-size="7" font-weight="bold" fill="#92400e" text-anchor="middle">$51bn</text>` },
  call: { bg: '#1e3a5f', svg: `<rect x="0" y="46" width="100" height="14" fill="#0f2440"/><rect x="16" y="12" width="16" height="30" fill="#0f172a" stroke="#475569"/><rect x="20" y="17" width="8" height="12" fill="#38bdf8"/><rect x="68" y="12" width="16" height="30" fill="#0f172a" stroke="#475569"/><rect x="72" y="17" width="8" height="12" fill="#fbbf24"/><path d="M36 18 Q50 10 64 18" stroke="#e8e0cf" stroke-width="1.6" fill="none"/><circle cx="50" cy="22" r="2" fill="#e8e0cf"/>` },
  alert: { bg: '#7f1d1d', svg: `<rect x="0" y="46" width="100" height="14" fill="#450a0a"/><path d="M50 8 L88 46 L12 46 Z" fill="#f59e0b"/><path d="M50 22 L50 34" stroke="#451a03" stroke-width="3.4"/><circle cx="50" cy="40" r="2.2" fill="#451a03"/><circle cx="82" cy="14" r="7" fill="none" stroke="#f8fafc" stroke-width="1.6"/><path d="M87 19 L92 24" stroke="#f8fafc" stroke-width="1.6"/>` },
});

function sceneSvg(key, w, h) {
  const s = SCENES[key] || SCENES.alert;
  return `<svg width="${w}" height="${h}" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice"><rect width="100" height="60" fill="${s.bg}"/>${s.svg}</svg>`;
}

// ---- light world map with numbered pins (solid land, dark ocean) ----
const LAND = [
  'M15 25 L90 15 L130 30 L120 70 L90 95 L50 85 L20 55 Z',
  'M95 105 L130 100 L140 140 L120 175 L100 150 Z',
  'M165 20 L200 15 L210 40 L190 55 L170 45 Z',
  'M175 70 L215 65 L230 100 L210 145 L185 140 L172 100 Z',
  'M215 15 L350 10 L355 55 L320 85 L280 75 L250 60 L220 45 Z',
  'M300 140 L340 135 L345 160 L315 168 L298 155 Z',
];
const PINS = { 1: [185, 45], 2: [300, 60], 3: [335, 165], 4: [330, 150], 5: [285, 85], 6: [315, 50], 7: [170, 40], 8: [250, 85], 9: [60, 55], 10: [315, 160], 11: [155, 55], 12: [290, 115], 13: [95, 125] };
function mapSvg(w, h) {
  const land = LAND.map((d) => `<path d="${d}" fill="#e9e2d0"/>`).join('');
  const pins = Object.entries(PINS).map(([n, [x, y]]) => {
    const s = STORIES[Number(n) - 1];
    return `<g><circle cx="${x}" cy="${y}" r="7.5" fill="${REGION_COLORS[s.region]}" stroke="#fff" stroke-width="1.6"/><text x="${x}" y="${y + 3}" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">${n}</text></g>`;
  }).join('');
  return `<svg width="${w}" height="${h}" viewBox="0 0 360 190" preserveAspectRatio="xMidYMid slice"><rect width="360" height="190" fill="#0f1e33"/>${land}<text x="60" y="100" font-size="7" fill="#7d8aa5" letter-spacing="2">ATLANTIC</text><text x="255" y="160" font-size="7" fill="#7d8aa5" letter-spacing="2">PACIFIC</text><text x="245" y="125" font-size="7" fill="#7d8aa5" letter-spacing="2">INDIAN</text>${pins}</svg>`;
}

// ---- briefs for ALSO ON (#14–#40), one line each ----
const BRIEFS = {
  14: 'New York — Gold rebounds to $3,622.91/oz', 15: 'Singapore — Brent ~$97.19, first weekly gain in a month',
  16: 'Seoul — Kospi +4.3%, Nikkei +2.1% in Asia rally', 17: 'Tokyo — Nikkei +2.1% to 58,711',
  18: 'Beijing — Oct industrial profits +20.1% y/y', 19: 'Jakarta — Pertamina trial opens; Rp6.1tn',
  20: 'Hagley Oval — NZ 246/5, day one vs India', 21: 'Nairobi — Obado jailed 25 years',
  22: 'Johannesburg — OR Tambo outage strands flyers', 23: 'Ottawa — Top court rules on Bill 21 today',
  24: 'Yellowknife — Carney to unveil northern plan tonight', 25: 'Bangkok — Market fire guts 500 stalls, 100 traders hit',
  26: 'Quito — Gangs, prisons, curfews before 29 Nov vote', 27: 'Zanzibar — Azam host Libya in Confed Cup opener',
  28: 'London — Forest host Chelsea tonight, 20:00 GMT', 29: 'Hong Kong — Hang Seng +2.1% to 22,695',
  30: 'Lagos — Court orders arrest of Pastor Odukoya', 31: 'Tokyo — Core CPI 2.9%, a 16-month high',
  32: 'Islamabad — Top court suspends Friday sittings', 33: 'London — Tube strike, day two',
  34: 'Berlin — Jobless +9,000 to 3.03m', 35: 'Paris — GDP −0.2% in Q3',
  36: 'Brussels — Russian sabotage in Europe +16%', 37: 'Ankara — Novatek Turkey LNG from 1 Jan',
  38: 'Buenos Aires — Eni to decide Mon on $51bn LNG', 39: 'Cairo — Sisi, Qatar emir talk Gaza',
  40: 'Mumbai — Bomb-threat email; nothing found',
};
const BRIEF_SRC = { 14: 'Reuters', 15: 'Reuters', 16: 'AP', 17: 'AP', 18: 'NBS', 19: 'ANTARA', 20: 'Reuters', 21: 'Capital FM', 22: 'Moneyweb', 23: 'Supreme Court', 24: 'PMO', 25: 'Thaiger', 26: 'Rio Times', 27: 'CAF', 28: 'Premier League', 29: 'Sharecast', 30: 'Rio Times', 31: 'Reuters', 32: 'The News', 33: 'TfL', 34: 'Reuters', 35: 'INSEE', 36: 'IISS', 37: 'Reuters', 38: 'Reuters', 39: 'Africanews', 40: 'IANS' };

const heroes = STORIES.slice(0, 3);
const mediums = STORIES.slice(3, 13);
const briefs = STORIES.slice(13);

function badge(s, small) {
  return `<span class="badge ${TAG_CLASS[s.tag]}" ${small ? 'data-s="1"' : ''}>${TAG_WORD[s.tag]}</span>`;
}
function heroCard(s) {
  return `<div class="hero"><div class="hscene">${sceneSvg(s.scene, 236, 104)}</div><div class="hbody"><div class="kick">${badge(s)}<span class="knum">#${s.id} · ${esc(s.city)}</span></div><div class="hhead">${esc(s.headline)}</div><div class="hdeck">${esc(s.deck)}</div><div class="hsrc">${esc(s.source)}</div></div></div>`;
}
function mediumCard(s) {
  return `<div class="med"><div class="mscene">${sceneSvg(s.scene, 194, 60)}</div><div class="mbody"><div class="kick">${badge(s, true)}<span class="knum">#${s.id} · ${esc(s.city)}</span></div><div class="mhead">${esc(s.headline)}</div><div class="mdeck">${esc(s.deck)}</div><div class="msrc">${esc(s.source)}</div></div></div>`;
}
function briefLine(s) {
  return `<div class="brief"><b>${s.id}</b> ${esc(BRIEFS[s.id])} <i>(${esc(BRIEF_SRC[s.id])})</i></div>`;
}

const pills = REGIONS.map((r) => `<span class="pill" style="background:${REGION_COLORS[r]}">${REGION_NAMES[r]} ${regionCounts[r]}</span>`).join('');
const timeline = TIMELINE.map(([t, label]) => `<div class="tl"><div class="tlt">${t}</div><div class="tll">${esc(label)}</div></div>`).join('');
const numbers = NUMBERS.map(([v, label]) => `<div class="num"><div class="numv">${v}</div><div class="numl">${esc(label)}</div></div>`).join('');
const fieldLine = `18 FIELDS: Markets 6 · Politics 5 · Economy 4 · Energy 3 · Security 3 · Sport 3 · Courts 2 · Transport 2 · Law 2 · Diplomacy 2 · Conflict 1 · Space 1 · Trade 1 · Retail 1 · Crime 1 · Environment 1 · Disaster 1 · Justice 1`;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Georgia,'Times New Roman',serif;color:#111;background:#faf8f3}
.page{width:1024px;height:1024px;padding:0 12px;display:flex;flex-direction:column;overflow:hidden;background:#faf8f3}
.topbar{background:#111;color:#f5f0e1;height:24px;display:flex;justify-content:space-between;align-items:center;padding:0 10px;font-size:10px;letter-spacing:2px;font-weight:bold}
.topbar .gold{color:#fbbf24}
.mast{text-align:center;padding:4px 0 2px}
.mast h1{font-size:38px;letter-spacing:1px;line-height:1}
.mast .date{font-size:16px;letter-spacing:5px;margin-top:3px}
.mast .deck{font-size:13.5px;font-style:italic;color:#b91c1c;margin-top:2px}
.pills{display:flex;gap:4px;height:24px;margin-top:4px}
.pill{flex:1;color:#fff;font-size:9.5px;font-weight:bold;text-align:center;line-height:24px;border-radius:10px;white-space:nowrap}
.tlbar{border-top:2px solid #111;border-bottom:1px solid #111;margin-top:5px;padding:3px 0;display:flex;gap:6px}
.tlbar .lbl{font-size:11px;font-weight:bold;letter-spacing:1px;align-self:center;white-space:nowrap}
.tl{flex:1;border-left:1px solid #d6d0c4;padding-left:5px}
.tlt{font-size:10px;font-weight:bold;color:#b91c1c}
.tll{font-size:9px;line-height:1.25}
.heroes{display:flex;gap:8px;margin-top:5px}
.hero{flex:1;border:1px solid #d6d0c4;background:#fff;display:flex;flex-direction:column}
.hscene{height:90px;overflow:hidden}
.hscene svg,.mscene svg{display:block}
.hbody{padding:4px 8px 4px;flex:1}
.kick{display:flex;align-items:center;gap:5px;margin-bottom:3px}
.badge{font-size:8px;font-weight:bold;color:#fff;padding:2px 5px;border-radius:2px;font-family:Arial,sans-serif}
.tg-o{background:#166534}.tg-c{background:#1d4ed8}.tg-r{background:#b45309}.tg-cl{background:#991b1b}
.badge[data-s="1"]{font-size:7px;padding:1px 4px}
.knum{font-size:9px;font-weight:bold;letter-spacing:0.5px;color:#444}
.hhead{font-size:16px;line-height:1.15;font-weight:bold}
.hdeck{font-size:11px;line-height:1.3;margin-top:3px;color:#222}
.hsrc{font-size:9px;font-style:italic;color:#666;margin-top:3px}
.nums{width:264px;background:#0f1e33;color:#fff;padding:9px 12px;display:flex;flex-direction:column}
.nums h3{color:#fbbf24;font-size:12px;letter-spacing:1.5px;border-bottom:1px solid #334155;padding-bottom:5px;margin-bottom:2px}
.num{display:flex;align-items:baseline;gap:8px;padding:5px 0;border-bottom:1px solid #1e293b}
.numv{font-size:21px;font-weight:bold;min-width:78px;color:#fff}
.numl{font-size:9.5px;line-height:1.25;color:#cbd5e1}
.meds{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:6px}
.med{border:1px solid #d6d0c4;background:#fff;display:flex;flex-direction:column;height:120px;overflow:hidden}
.mscene{height:60px;overflow:hidden}
.mbody{padding:3px 6px 4px}
.mhead{font-size:10.5px;line-height:1.15;font-weight:bold}
.mdeck{font-size:9px;line-height:1.3;margin-top:2px;color:#222}
.msrc{font-size:8px;font-style:italic;color:#666;margin-top:2px}
.bottom{display:flex;gap:8px;margin-top:6px}
.also{flex:1.72;border-top:2px solid #111;padding-top:4px}
.also h3{font-size:12px;letter-spacing:0.5px;margin-bottom:3px}
.briefcols{columns:2;column-gap:14px}
.brief{font-size:9px;line-height:1.28;break-inside:avoid}
.brief b{color:#b91c1c}
.brief i{color:#666}
.fields{font-size:8.5px;color:#444;margin-top:3px;border-top:1px solid #d6d0c4;padding-top:3px}
.mapbox{flex:1;border-top:2px solid #111;padding-top:4px}
.mapbox h3{font-size:12px;letter-spacing:0.5px;margin-bottom:3px}
.mapbox .cap{font-size:8.5px;color:#444;margin-top:2px}
.datecheck{border:2px solid #b91c1c;margin-top:5px;padding:4px 10px 5px}
.datecheck .judge{font-size:10.5px;font-weight:bold;text-align:center;margin-bottom:2px}
.dc-cols{display:flex;gap:16px}
.dc-cols div{flex:1;font-size:9px;line-height:1.4}
.dc-cols b{color:#b91c1c}
.footer{margin-top:4px;border-top:1px solid #d6d0c4;padding-top:3px;font-size:8.5px;color:#555;text-align:center;line-height:1.35}
</style></head><body><div class="page">
<div class="topbar"><span>THE WORLD IN ONE DAY</span><span class="gold">40 STORIES · 10 REGIONS · 18 FIELDS · ALL HAPPENED OR FIRST REPORTED FRIDAY 27 NOVEMBER 2026</span></div>
<div class="mast"><h1>THE WORLD IN ONE DAY</h1><div class="date">FRIDAY 27 NOVEMBER 2026</div><div class="deck">Russia fires 155 drones at Ukraine overnight, Chinese stocks surge, and New Zealand is left with a hung parliament.</div></div>
<div class="pills">${pills}</div>
<div class="tlbar"><span class="lbl">THE DAY IN UTC</span>${timeline}</div>
<div class="heroes">${heroes.map(heroCard).join('')}<div class="nums"><h3>THE DAY IN NUMBERS</h3>${numbers}</div></div>
<div class="meds">${mediums.map(mediumCard).join('')}</div>
<div class="bottom"><div class="also"><h3>ALSO ON FRIDAY 27 NOVEMBER — 27 MORE STORIES</h3><div class="briefcols">${briefs.map(briefLine).join('')}</div><div class="fields">${fieldLine}</div></div>
<div class="mapbox"><h3>WHERE IT HAPPENED — STORIES 1–13 PINNED</h3>${mapSvg(352, 186)}<div class="cap">Pins 1–13 coloured by region. Scenes are drawn illustrations, not photographs.</div></div></div>
<div class="datecheck"><div class="judge">Every story on this page happened or was first reported on Friday 27 November 2026, in some time zone on Earth.</div><div class="dc-cols"><div><b>LEFT OUT:</b> Bangkok refinery blast, 9 hurt — Thu 26 Nov · Kuwait drone attack kills 2 Italians — Thu 26 Nov · Gaza: 10 killed — Thu 26 Nov · Thanksgiving storm, 800,000 out — Thu 26 Nov · Musk\u2019s $18bn SpaceX gift — Wed 25 Nov · Gukesh Game 3 draw — Thu 26 Nov · Trump \u2018fake\u2019 GDP probe — Thu 26 Nov</div><div><b>NOT YET DECIDED:</b> Macy\u2019s parade Sat 28 Nov · Spain vote Sun 29 Nov · Gukesh Game 4 Sat 28 Nov · Bill 21 outcome · Carney\u2019s northern plan · Forest–Chelsea result</div></div></div>
<div class="footer">HOW SURE: <b>O</b> OFFICIAL · <b>C</b> CONFIRMED · <b>R</b> REPORTED · <b>CL</b> CLAIM — Sources: Reuters, AP, BBC, Ukraine Air Force, Rocket Lab, Adobe, NBS, ANTARA, Moneycontrol, Capital FM, TfL, INSEE, IISS, CAF, Premier League and wires named on each story. All 40 stories happened or were first reported on Friday 27 November 2026.</div>
</div></body></html>`;

writeFileSync(new URL('./page.html', import.meta.url), html);
console.log('wrote page.html', html.length, 'bytes; stories', STORIES.length, 'regions', Object.keys(regionCounts).length, 'fields', FIELD_LIST.length);
