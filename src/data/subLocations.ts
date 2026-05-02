// src/data/subLocations.ts
// Named places within each zone. ~50 sub-locations across all zones.
// Some are gated by player traits or worldFlags.

import type { SubLocation } from "@/lib/types";
import { hasTrait } from "@/engine/traits";

export const subLocations: SubLocation[] = [
  // ─── Kuwait City ───
  { id: "city_alhamra",    zone: "city", name: "Al Hamra Tower",        ar: "برج الحمراء",        desc: "The 38th-floor view is the country.", flavor: "luxury",  energyCost: 4 },
  { id: "city_sif",        zone: "city", name: "Sif Palace area",        ar: "حي قصر السيف",       desc: "Where decisions are made quietly.",   flavor: "power",   energyCost: 5 },
  { id: "city_corniche",   zone: "city", name: "Gulf Road Corniche",     ar: "كورنيش الخليج",       desc: "The sea wind. The towers behind.",     flavor: "calm",    energyCost: 2 },
  { id: "city_marina",     zone: "city", name: "Sharq Marina",            ar: "مارينا الشرق",       desc: "Boats, restaurants, late-evening talk.", flavor: "social",  energyCost: 4 },
  { id: "city_oldstock",   zone: "city", name: "The Old Stock Exchange", ar: "البورصة القديمة",    desc: "Where men still trade on a handshake.", flavor: "intel",   energyCost: 3,
    unlockCond: (s) => s.stats.wasta >= 30 },

  // ─── Diwaniya District ───
  { id: "div_umm_nasser",  zone: "diwaniya", name: "Umm Nasser's Diwaniya", ar: "ديوانية أم نصر",  desc: "The room where reputations are made.", flavor: "social",  energyCost: 3 },
  { id: "div_abdullah",    zone: "diwaniya", name: "Sheikh Abdullah's Mosque", ar: "مسجد الشيخ عبدالله", desc: "Friday classes, quiet wisdom.",   flavor: "religious", energyCost: 3 },
  { id: "div_oldcafe",     zone: "diwaniya", name: "The Old Karak Café",     ar: "مقهى الكرك",       desc: "Plastic chairs, real conversation.",   flavor: "casual",  energyCost: 2 },
  { id: "div_majlis",      zone: "diwaniya", name: "The Thursday Majlis",     ar: "مجلس الخميس",      desc: "Open every Thursday — invitation never asked.", flavor: "family", energyCost: 3 },
  { id: "div_back",        zone: "diwaniya", name: "Umm Nasser's Back Room",  ar: "غرفة أم نصر الخلفية", desc: "The unwritten ledger lives here.",  flavor: "intel", energyCost: 4,
    unlockCond: (s) => s.worldFlags.umm_nasser_inner_circle === true },

  // ─── Souq Mubarakiya ───
  { id: "souq_perfume",    zone: "souq", name: "The Perfume Lane",        ar: "ممر العود",         desc: "Oud, amber, bakhoor.",                flavor: "trade",   energyCost: 3 },
  { id: "souq_gold",       zone: "souq", name: "Gold Souq",                ar: "سوق الذهب",         desc: "Where families convert savings into weight.", flavor: "trade", energyCost: 4 },
  { id: "souq_mubarak",    zone: "souq", name: "Mubarak's Three Stalls",   ar: "بسطات مبارك",       desc: "From one to three. Soon, four.",      flavor: "trade",   energyCost: 3 },
  { id: "souq_tea",        zone: "souq", name: "The Old Tea Stand",         ar: "مقهى الشاي القديم", desc: "Six dirhams, no menu, the same since 1968.", flavor: "memory", energyCost: 2 },
  { id: "souq_alley",      zone: "souq", name: "The Back Alley",            ar: "الزقاق الخلفي",     desc: "Where things change hands quietly.",   flavor: "rough",   energyCost: 3 },

  // ─── The Avenues ───
  { id: "av_grand",        zone: "avenues", name: "The Grand Avenue",      ar: "الجراند أفنيو",     desc: "Marble, glass, expensive perfume.",    flavor: "luxury",  energyCost: 4 },
  { id: "av_food",         zone: "avenues", name: "Food District",          ar: "حي المطاعم",        desc: "Twelve cuisines, three you'd recommend.", flavor: "social", energyCost: 3 },
  { id: "av_skyzone",      zone: "avenues", name: "Sky Zone Roof Café",     ar: "كافيه السطح",       desc: "Influencers and almond lattes.",       flavor: "casual",  energyCost: 3 },
  { id: "av_lulwa",        zone: "avenues", name: "Lulwa's Showroom",       ar: "صالة لؤلؤة",        desc: "Interior design with quiet confidence.", flavor: "trade", energyCost: 4 },

  // ─── Desert Camp ───
  { id: "des_main_fire",   zone: "desert", name: "The Main Fire",           ar: "النار الكبيرة",     desc: "Where the night is told.",            flavor: "family",  energyCost: 5 },
  { id: "des_falcon",      zone: "desert", name: "The Falconry Yard",       ar: "ساحة الصقور",       desc: "Hooded birds. Patient men.",           flavor: "casual",  energyCost: 6 },
  { id: "des_dunes",       zone: "desert", name: "The High Dunes",           ar: "الكثبان العالية",   desc: "Dawn here is a kind of prayer.",       flavor: "calm",    energyCost: 7 },
  { id: "des_hidden",      zone: "desert", name: "Bu Mishari's Private Camp", ar: "مخيم بو مشاري",   desc: "Few are invited. Fewer return changed.", flavor: "power", energyCost: 8,
    unlockCond: (s) => (s.relationships["Bu Mishari"] || 0) >= 80 },

  // ─── Ministry District ───
  { id: "gov_main",        zone: "govzone", name: "The Main Ministry Hall", ar: "قاعة الوزارة",      desc: "Forms, queues, fluorescent light.",   flavor: "casual",  energyCost: 4 },
  { id: "gov_yousef",      zone: "govzone", name: "Bu Yousef's Office",      ar: "مكتب بو يوسف",      desc: "Closed door. Open kettle.",            flavor: "intel",   energyCost: 3 },
  { id: "gov_minister",    zone: "govzone", name: "The Minister's Wing",     ar: "جناح الوزير",       desc: "Carpet softer than the chairs.",       flavor: "power",   energyCost: 5,
    unlockCond: (s) => s.factions.government >= 20 },
  { id: "gov_courtyard",   zone: "govzone", name: "The Courtyard",            ar: "الباحة",            desc: "Where unofficial deals close.",         flavor: "intel",   energyCost: 3 },

  // ─── Salmiya ───
  { id: "sal_corniche",    zone: "salmiya", name: "Salmiya Corniche",       ar: "كورنيش السالمية",   desc: "Joggers at dusk, families at sunset.", flavor: "calm",    energyCost: 3 },
  { id: "sal_marina_mall", zone: "salmiya", name: "Marina Mall",              ar: "مارينا مول",        desc: "Boys with brand names. Girls with cameras.", flavor: "social", energyCost: 4 },
  { id: "sal_seaside",     zone: "salmiya", name: "Seaside Cafés",            ar: "مقاهي الواجهة",     desc: "Iced karak, lemon-mint, long phone calls.", flavor: "casual", energyCost: 3 },
  { id: "sal_oldhouse",    zone: "salmiya", name: "The Old Pearl-Diver's House", ar: "بيت النوخذة",  desc: "Now a museum. Once a household.",       flavor: "memory",  energyCost: 4 },

  // ─── Jahra ───
  { id: "jah_redfort",     zone: "jahra", name: "The Red Fort",              ar: "القصر الأحمر",      desc: "1920. The wall still bears the mark.", flavor: "memory",  energyCost: 5 },
  { id: "jah_market",      zone: "jahra", name: "The Friday Market",          ar: "سوق الجمعة",        desc: "Goats, falcons, used cars, antiques.", flavor: "trade",   energyCost: 4 },
  { id: "jah_majlis",      zone: "jahra", name: "Sheikh's Majlis",            ar: "مجلس الشيخ",        desc: "Where the older families still gather.", flavor: "family", energyCost: 5 },
  { id: "jah_road",        zone: "jahra", name: "The Old Iraq Road",          ar: "طريق العراق القديم", desc: "The desert opens here.",               flavor: "rough",   energyCost: 6 },

  // ─── Hawally ───
  { id: "haw_tunisia",     zone: "hawally", name: "Tunisia Street",          ar: "شارع تونس",         desc: "Restaurants from a dozen countries.",  flavor: "social",  energyCost: 3 },
  { id: "haw_old_school",  zone: "hawally", name: "The Old Public School",    ar: "المدرسة القديمة",   desc: "Fathers walked this hallway.",         flavor: "memory",  energyCost: 3 },
  { id: "haw_corner",      zone: "hawally", name: "The Corner Diwaniya",      ar: "ديوانية الزاوية",   desc: "Smaller, younger, different rules.",   flavor: "casual",  energyCost: 3 },
  { id: "haw_back",        zone: "hawally", name: "The Back Streets",         ar: "الشوارع الخلفية",   desc: "Where the city's noise gets honest.",  flavor: "rough",   energyCost: 4,
    unlockCond: (s) => hasTrait(s, "confrontational") || hasTrait(s, "ruthless") },

  // ─── Failaka Island ───
  { id: "fai_ruins",       zone: "failaka", name: "The Ancient Ruins",       ar: "الآثار القديمة",   desc: "Greek stones in Arab sand.",            flavor: "memory",  energyCost: 6 },
  { id: "fai_fort",        zone: "failaka", name: "The Abandoned Fort",       ar: "القلعة المهجورة",   desc: "1990. The walls remember.",            flavor: "memory",  energyCost: 7 },
  { id: "fai_sea",         zone: "failaka", name: "The Empty Beach",          ar: "الشاطئ الفارغ",     desc: "Wind. Salt. Nothing else.",             flavor: "calm",    energyCost: 5 },
  { id: "fai_old_village", zone: "failaka", name: "The Old Village",          ar: "القرية القديمة",    desc: "Houses left behind. Doors still hanging.", flavor: "memory", energyCost: 6 },
];

export function subLocationsForZone(zoneId: string) {
  return subLocations.filter((sl) => sl.zone === zoneId);
}
