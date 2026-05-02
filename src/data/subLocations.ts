import type { SubLocation } from "@/lib/types";

export const subLocations: SubLocation[] = [
  // ── city ──
  { id: "alhamra",        zone: "city", name: "Al Hamra Tower",         ar: "برج الحمراء",       desc: "The 38th floor and the view that goes with it.",          flavor: "luxury",   energyCost: 4 },
  { id: "sif_palace",     zone: "city", name: "Sif Palace Area",         ar: "قصر السيف",          desc: "Quiet streets where decisions are weighed.",                flavor: "power",    energyCost: 6 },
  { id: "gulfroad",       zone: "city", name: "Gulf Road Corniche",      ar: "كورنيش الخليج",     desc: "Walks at sunset. Cars idling. The water remembers.",        flavor: "calm",     energyCost: 3 },
  { id: "sharqmarina",    zone: "city", name: "Sharq Marina",            ar: "مرسى الشرق",         desc: "Yachts, lounges, the visible part of business.",            flavor: "social",   energyCost: 5 },
  { id: "old_exchange",   zone: "city", name: "The Old Stock Exchange",  ar: "السوق القديم",       desc: "Half-shuttered, half-mythic. Things move here that don't move anywhere else.", flavor: "intel", energyCost: 5 },

  // ── diwaniya ──
  { id: "umm_nasser_d",   zone: "diwaniya", name: "Umm Nasser's Diwaniya",  ar: "ديوانية أم نصر",   desc: "The hearth of the favor economy.",                          flavor: "social",  energyCost: 3 },
  { id: "bukhalid_d",     zone: "diwaniya", name: "Bu Khalid's Diwaniya",    ar: "ديوانية بو خالد", desc: "Big rooms, big names, big silences.",                       flavor: "power",   energyCost: 4 },
  { id: "fatma_class",    zone: "diwaniya", name: "Hajja Fatma's Sitting Room", ar: "مجلس الحاجة فاطمة", desc: "Thursday tea and quiet teaching.",                       flavor: "religious", energyCost: 3 },
  { id: "young_lions",    zone: "diwaniya", name: "The Young Lions Diwaniya", ar: "ديوانية الشباب",  desc: "Loud, ambitious, full of borrowed phrases.",                flavor: "social",  energyCost: 4 },
  { id: "memorial",       zone: "diwaniya", name: "The Memorial Hall",        ar: "قاعة العزاء",     desc: "Where condolences are sat. The walls have heard everything.", flavor: "memory", energyCost: 4 },

  // ── souq ──
  { id: "perfume_lane",   zone: "souq", name: "Perfume Lane",           ar: "سكة العطّارين",   desc: "Oud, amber, things only Ghanima knows the names of.",       flavor: "trade",   energyCost: 4 },
  { id: "gold_souq",      zone: "souq", name: "The Gold Souq",          ar: "سوق الذهب",        desc: "The dowry economy in three meters of glass.",               flavor: "trade",   energyCost: 5 },
  { id: "spice_corner",   zone: "souq", name: "Spice Corner",            ar: "زاوية البهارات",   desc: "The smell hits you a block away. So does the bargaining.", flavor: "casual",  energyCost: 3 },
  { id: "old_coffee",     zone: "souq", name: "The Old Coffee House",    ar: "القهوة العود",     desc: "Where Mubarak holds court. Bring patience and a small cup.", flavor: "social", energyCost: 3 },
  { id: "tailor_alley",   zone: "souq", name: "Tailor Alley",            ar: "ممر الخياطين",     desc: "Bishts measured and re-measured. Whispers stitched in.",     flavor: "trade",  energyCost: 4 },

  // ── avenues ──
  { id: "phase4",         zone: "avenues", name: "Phase 4",              ar: "الفايز الرابع",    desc: "Where the new generation is seen — and posts about it.",     flavor: "social",  energyCost: 4 },
  { id: "lulwa_studio",   zone: "avenues", name: "Lulwa's Studio",       ar: "ستوديو لولوة",     desc: "Linen, terrazzo, very intentional silence.",                 flavor: "luxury",  energyCost: 5 },
  { id: "cafe_court",     zone: "avenues", name: "The Café Court",       ar: "قاعة المقاهي",     desc: "Eight cafés. Only one matters at any given moment.",         flavor: "casual",  energyCost: 3 },
  { id: "media_kitchen",  zone: "avenues", name: "The Media Kitchen",     ar: "مطبخ السوشيال",    desc: "Snap reels filmed against a single, well-lit wall.",         flavor: "intel",   energyCost: 4 },

  // ── desert ──
  { id: "qallaf_camp",    zone: "desert", name: "Al-Qallaf Camp",         ar: "مخيم القلاف",      desc: "The fire is lit by 5pm. The bird is hooded by 6.",          flavor: "family",  energyCost: 8 },
  { id: "dunes",          zone: "desert", name: "The High Dunes",         ar: "النقاء العالية",   desc: "Wind, silence, the sky enormous.",                          flavor: "calm",    energyCost: 10 },
  { id: "tribal_council", zone: "desert", name: "The Tribal Council Tent", ar: "خيمة المجلس",      desc: "Where the elders sit. Sand, gahwa, decisions decades old.", flavor: "power",   energyCost: 8 },
  { id: "old_well",       zone: "desert", name: "The Old Well",            ar: "البير القديم",     desc: "Dry now. Still pointed to when stories begin.",             flavor: "memory",  energyCost: 6 },
  { id: "bumishari_camp", zone: "desert", name: "Bu Mishari's Camp",       ar: "مخيم بو مشاري",    desc: "Cards, smoke, hospitality calibrated to the hour.",         flavor: "social",  energyCost: 7 },

  // ── govzone ──
  { id: "ministry_main",  zone: "govzone", name: "The Main Ministry",     ar: "الوزارة الرئيسية", desc: "Stamps. Queues. Plate of biscuits at the secretary's desk.", flavor: "power",  energyCost: 5 },
  { id: "yousef_office",  zone: "govzone", name: "Bu Yousef's Office",    ar: "مكتب بو يوسف",     desc: "The corner office. The window faces the wrong way.",         flavor: "intel",  energyCost: 4 },
  { id: "abdullah_mosque", zone: "govzone", name: "Sheikh Abdullah's Mosque", ar: "مسجد الشيخ عبدالله", desc: "Old carpets, the smell of old books, the calm of long prayer.", flavor: "religious", energyCost: 4 },
  { id: "notary",         zone: "govzone", name: "Yaqoub's Notary",        ar: "كتب العدل",        desc: "Where signatures become weight.",                            flavor: "trade",   energyCost: 4 },

  // ── salmiya ──
  { id: "marina_walk",    zone: "salmiya", name: "Marina Walk",            ar: "ممشى المارينا",   desc: "Joggers at dawn, café-sitters all afternoon.",              flavor: "casual",  energyCost: 4 },
  { id: "salmiya_seafront", zone: "salmiya", name: "Salmiya Seafront",     ar: "كورنيش السالمية", desc: "Where families sit on Fridays and the sea agrees to be quiet.", flavor: "calm",  energyCost: 4 },
  { id: "old_salmiya",    zone: "salmiya", name: "Old Salmiya",            ar: "السالمية القديمة", desc: "Lower buildings, older neighbours, second-hand bookshops.",  flavor: "memory",  energyCost: 5 },
  { id: "scientific_center", zone: "salmiya", name: "Scientific Center",   ar: "المركز العلمي",    desc: "Tourists, school trips, tank glass.",                       flavor: "casual",  energyCost: 5 },

  // ── jahra ──
  { id: "old_jahra",      zone: "jahra", name: "Old Jahra",                ar: "جهراء القديمة",   desc: "Dust roads, deep family histories, men who knew your grandfather.", flavor: "family", energyCost: 6 },
  { id: "jahra_market",   zone: "jahra", name: "Jahra Market",             ar: "سوق الجهراء",     desc: "Lambs at dawn. Bargaining at a different pace.",            flavor: "trade",  energyCost: 5 },
  { id: "northern_road",  zone: "jahra", name: "The Northern Road",        ar: "الطريق الشمالي",  desc: "Where the city breaks and the country starts.",             flavor: "rough",  energyCost: 7 },
  { id: "majlis_jahra",   zone: "jahra", name: "Jahra Majlis",             ar: "مجلس الجهراء",    desc: "Slower diwaniya, longer silences.",                         flavor: "social", energyCost: 5 },

  // ── hawally ──
  { id: "tunis_st",       zone: "hawally", name: "Tunis Street",           ar: "شارع تونس",        desc: "Restaurants, dense traffic, the second-generation hum.",    flavor: "casual",  energyCost: 4 },
  { id: "hawally_souq",   zone: "hawally", name: "Hawally Souq",           ar: "سوق حولي",         desc: "Phones, watches, sellers with stories.",                    flavor: "trade",   energyCost: 4 },
  { id: "underground",    zone: "hawally", name: "The Back Lots",           ar: "الزواريب",         desc: "Garages, late shawarma, deals you don't see in daylight.",   flavor: "rough",   energyCost: 5 },
  { id: "ibn_khaldoon",   zone: "hawally", name: "Ibn Khaldoon Bookshop",  ar: "مكتبة ابن خلدون", desc: "Stacked floor to ceiling. The owner remembers you.",         flavor: "memory",  energyCost: 4 },

  // ── failaka ──
  { id: "ferry_dock",     zone: "failaka", name: "The Ferry Dock",         ar: "ميناء العبارة",   desc: "Sea air, the boat shifting at the rope.",                    flavor: "calm",    energyCost: 6 },
  { id: "failaka_ruins",  zone: "failaka", name: "The Hellenistic Ruins",   ar: "آثار فيلكا",       desc: "Stones older than the country. Wind through the gaps.",      flavor: "memory",  energyCost: 8 },
  { id: "failaka_village", zone: "failaka", name: "The Old Village",       ar: "القرية القديمة",   desc: "Doors that haven't opened since '90.",                       flavor: "memory",  energyCost: 7 },
  { id: "failaka_beach",  zone: "failaka", name: "The Northern Beach",     ar: "الشاطئ الشمالي",   desc: "Quiet. Birds. The horizon does not move.",                  flavor: "calm",    energyCost: 6 },
];
