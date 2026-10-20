/**
 * phonology-data.js
 * Comprehensive Sanskrit Phonological Matrix based on Pāṇinian Sthānas (Vocal Stations)
 * Cross-referenced with UBC Sanskrit audio library (90 high-fidelity MP3 recordings),
 * Devanāgarī, Telugu, and Roman IAST.
 */

const UBC_BASE_URL = "sounds/";
const REMOTE_UBC_BASE_URL = "https://ubcsanskrit.ca/sounds/";

const STHANA_CONFIG = [
  {
    id: "kanthya",
    name: "Kaṇṭhya",
    english: "Velar (Throat / Larynx)",
    stationNumber: 1,
    description: "Sound produced at the deep back of the vocal tract (pharynx & soft palate/velum).",
    color: "#ef4444", // Crimson
    coords: { x: 30, y: 75 } // Anatomical diagram coordinate %
  },
  {
    id: "talavya",
    name: "Tālavya",
    english: "Palatal (Hard Palate)",
    stationNumber: 2,
    description: "Tongue blade arches flat against the hard ceiling of the mouth.",
    color: "#f59e0b", // Amber
    coords: { x: 45, y: 55 }
  },
  {
    id: "murdhanya",
    name: "Mūrdhanya",
    english: "Retroflex (Roof / Alveolar Ridge)",
    stationNumber: 3,
    description: "Tongue tip curls upward and backwards, curling against the roof of the palate.",
    color: "#10b981", // Emerald
    coords: { x: 60, y: 45 }
  },
  {
    id: "dantya",
    name: "Dantya",
    english: "Dental (Teeth)",
    stationNumber: 4,
    description: "Tongue tip touches the back of the upper incisors.",
    color: "#3b82f6", // Sapphire
    coords: { x: 75, y: 50 }
  },
  {
    id: "osthya",
    name: "Oṣṭhya",
    english: "Labial (Lips)",
    stationNumber: 5,
    description: "Sound formed entirely by the meeting or rounding of the upper and lower lips.",
    color: "#8b5cf6", // Amethyst
    coords: { x: 88, y: 60 }
  },
  {
    id: "kantha_talavya",
    name: "Kaṇṭha-Tālavya",
    english: "Palato-Velar (Throat + Palate)",
    stationNumber: "1+2",
    description: "Compound acoustic resonance starting in the throat and gliding along the hard palate (e, ai).",
    color: "#ec4899",
    coords: { x: 38, y: 65 }
  },
  {
    id: "kantha_osthya",
    name: "Kaṇṭhoṣṭhya",
    english: "Labio-Velar (Throat + Lips)",
    stationNumber: "1+5",
    description: "Compound acoustic resonance combining deep throat voicing with forward lip-rounding (o, au).",
    color: "#f43f5e",
    coords: { x: 58, y: 68 }
  }
];

const VOWELS_DATA = [
  {
    sthana: "kanthya",
    short: { iast: "a", deva: "अ", telugu: "అ", audio: "as-a.mp3", example: "aśvaḥ", exampleDeva: "अश्वः", exampleHindi: "घोड़ा (ghoṛā)", exampleMeaning: "Horse", exampleAudio: "as-aśvaḥ.mp3" },
    long:  { iast: "ā", deva: "आ", telugu: "ఆ", audio: "as-ā.mp3", example: "āmraḥ", exampleDeva: "आम्रः", exampleHindi: "आम (ām)", exampleMeaning: "Mango", exampleAudio: "as-āmraḥ.mp3" }
  },
  {
    sthana: "talavya",
    short: { iast: "i", deva: "इ", telugu: "ఇ", audio: "as-i.mp3", example: "ikṣuḥ", exampleDeva: "इक्षुः", exampleHindi: "ईख / गन्ना", exampleMeaning: "Sugarcane", exampleAudio: "as-ikṣuḥ.mp3" },
    long:  { iast: "ī", deva: "ई", telugu: "ఈ", audio: "as-ī.mp3", example: "īśaḥ", exampleDeva: "ईशः", exampleHindi: "ईश्वर / स्वामी", exampleMeaning: "Lord / Master", exampleAudio: "as-īśaḥ.mp3" }
  },
  {
    sthana: "murdhanya",
    short: { iast: "ṛ", deva: "ऋ", telugu: "ఋ", audio: "as-ṛ.mp3", example: "ṛṣiḥ", exampleDeva: "ऋषिः", exampleHindi: "ऋषि / मुनि", exampleMeaning: "Sage / Seer", exampleAudio: "as-ṛṣiḥ.mp3" },
    long:  { iast: "ṝ", deva: "ॠ", telugu: "ౠ", audio: "as-ṝ.mp3", example: null, exampleDeva: null, exampleHindi: null, exampleMeaning: null, exampleAudio: null }
  },
  {
    sthana: "dantya",
    short: { iast: "ḷ", deva: "ऌ", telugu: "ఌ", audio: "as-ḷ.mp3", example: null, exampleDeva: null, exampleHindi: null, exampleMeaning: null, exampleAudio: null },
    long:  null
  },
  {
    sthana: "osthya",
    short: { iast: "u", deva: "उ", telugu: "ఉ", audio: "as-u.mp3", example: "udaram", exampleDeva: "उदरम्", exampleHindi: "पेट / उदर", exampleMeaning: "Belly", exampleAudio: "as-udaram.mp3" },
    long:  { iast: "ū", deva: "ऊ", telugu: "ఊ", audio: "as-ū.mp3", example: "ūruḥ", exampleDeva: "ऊरुः", exampleHindi: "जांघ (jāngh)", exampleMeaning: "Thigh", exampleAudio: "as-ūruḥ.mp3" }
  },
  {
    sthana: "kantha_talavya",
    short: { iast: "e", deva: "ए", telugu: "ఏ", audio: "as-e.mp3", example: "ekaḥ", exampleDeva: "एकः", exampleHindi: "एक (ek)", exampleMeaning: "One", exampleAudio: "as-ekaḥ.mp3" },
    long:  { iast: "ai", deva: "ऐ", telugu: "ఐ", audio: "as-ai.mp3", example: "airāvataḥ", exampleDeva: "ऐरावतः", exampleHindi: "ऐरावत हाथी", exampleMeaning: "Celestial Elephant", exampleAudio: "as-airāvataḥ.mp3" }
  },
  {
    sthana: "kantha_osthya",
    short: { iast: "o", deva: "ओ", telugu: "ఓ", audio: "as-o.mp3", example: "oṣṭhaḥ", exampleDeva: "ओष्ठः", exampleHindi: "ओठ / होंठ", exampleMeaning: "Lip", exampleAudio: "as-oṣṭhaḥ.mp3" },
    long:  { iast: "au", deva: "औ", telugu: "ఔ", audio: "as-au.mp3", example: "auṣadhiḥ", exampleDeva: "औषधिः", exampleHindi: "दवा / औषधि", exampleMeaning: "Medicine / Herb", exampleAudio: "as-auṣadhiḥ.mp3" }
  }
];

const CONSONANTS_DATA = [
  {
    sthana: "kanthya",
    stops: [
      { iast: "ka", deva: "क", telugu: "క", type: "Unvoiced Unaspirated", audio: "as-ka.mp3", example: "kamalam", exampleDeva: "कमलम्", exampleHindi: "कमल (kamal)", exampleMeaning: "Lotus", exampleAudio: "as-kamalam.mp3" },
      { iast: "kha", deva: "ख", telugu: "ఖ", type: "Unvoiced Aspirated", audio: "as-kha.mp3", example: "kharaḥ", exampleDeva: "खरः", exampleHindi: "गधा (gadhā)", exampleMeaning: "Donkey", exampleAudio: "as-kharaḥ.mp3" },
      { iast: "ga", deva: "ग", telugu: "గ", type: "Voiced Unaspirated", audio: "as-ga.mp3", example: "gajaḥ", exampleDeva: "गजः", exampleHindi: "हाथी (hāthī) / गज", exampleMeaning: "Elephant", exampleAudio: "as-gajaḥ.mp3" },
      { iast: "gha", deva: "घ", telugu: "ఘ", type: "Voiced Aspirated", audio: "as-gha.mp3", example: "ghaṭaḥ", exampleDeva: "घटः", exampleHindi: "घड़ा (ghaṛā)", exampleMeaning: "Clay Pot", exampleAudio: "as-ghaṭaḥ.mp3" },
      { iast: "ṅa", deva: "ङ", telugu: "ఙ", type: "Nasal (Anunāsika)", audio: "as-ṅa.mp3", example: null, exampleDeva: null, exampleHindi: null, exampleMeaning: null, exampleAudio: null }
    ],
    semivowel: null,
    sibilant: { iast: "ha", deva: "ह", telugu: "హ", type: "Voiced Aspirate", audio: "as-ha.mp3", example: "hastaḥ", exampleDeva: "हस्तः", exampleHindi: "हाथ (hāth)", exampleMeaning: "Hand", exampleAudio: "as-hastaḥ.mp3" }
  },
  {
    sthana: "talavya",
    stops: [
      { iast: "ca", deva: "च", telugu: "చ", type: "Unvoiced Unaspirated", audio: "as-ca.mp3", example: "candraḥ", exampleDeva: "चन्द्रः", exampleHindi: "चाँद (cā̃nd) / चंद्र", exampleMeaning: "Moon", exampleAudio: "as-candraḥ.mp3" },
      { iast: "cha", deva: "छ", telugu: "ఛ", type: "Unvoiced Aspirated", audio: "as-cha.mp3", example: "chātraḥ", exampleDeva: "छात्रः", exampleHindi: "विद्यार्थी / छात्र", exampleMeaning: "Student", exampleAudio: "as-chātraḥ.mp3" },
      { iast: "ja", deva: "ज", telugu: "జ", type: "Voiced Unaspirated", audio: "as-ja.mp3", example: "jala", exampleDeva: "जलम्", exampleHindi: "पानी (pānī) / जल", exampleMeaning: "Water", exampleAudio: "as-jala.mp3" },
      { iast: "jha", deva: "झ", telugu: "ఝ", type: "Voiced Aspirated", audio: "as-jha.mp3", example: "jhasaḥ", exampleDeva: "झषः", exampleHindi: "मछली (machlī)", exampleMeaning: "Fish", exampleAudio: "as-jhasaḥ.mp3" },
      { iast: "ña", deva: "ञ", telugu: "ఞ", type: "Nasal (Anunāsika)", audio: "as-ña.mp3", example: "cañcū", exampleDeva: "चञ्चू", exampleHindi: "चोंच (conch)", exampleMeaning: "Beak", exampleAudio: "as-cañcū.mp3" }
    ],
    semivowel: { iast: "ya", deva: "य", telugu: "య", type: "Semivowel (Palatal)", audio: "as-ya.mp3", example: "yajñaḥ", exampleDeva: "यज्ञः", exampleHindi: "यज्ञ / हवन", exampleMeaning: "Ritual Fire", exampleAudio: "as-yajñaḥ.mp3" },
    sibilant: { iast: "śa", deva: "श", telugu: "శ", type: "Palatal Sibilant", audio: "as-śa.mp3", example: "śaśaḥ", exampleDeva: "शशः", exampleHindi: "खरगोश", exampleMeaning: "Hare", exampleAudio: "as-śaśaḥ.mp3" }
  },
  {
    sthana: "murdhanya",
    stops: [
      { iast: "ṭa", deva: "ट", telugu: "ట", type: "Unvoiced Unaspirated", audio: "as-ṭa.mp3", example: "ṭaṅkaḥ", exampleDeva: "टङ्कः", exampleHindi: "सिक्का / छेनी", exampleMeaning: "Coin", exampleAudio: "as-ṭaṅkaḥ.mp3" },
      { iast: "ṭha", deva: "ठ", telugu: "ఠ", type: "Unvoiced Aspirated", audio: "as-ṭha.mp3", example: null, exampleDeva: null, exampleHindi: null, exampleMeaning: null, exampleAudio: null },
      { iast: "ḍa", deva: "ड", telugu: "డ", type: "Voiced Unaspirated", audio: "as-ḍa.mp3", example: "ḍamaruḥ", exampleDeva: "डमरुः", exampleHindi: "डमरू", exampleMeaning: "Small Drum", exampleAudio: "as-ḍamaruḥ.mp3" },
      { iast: "ḍha", deva: "ढ", telugu: "ఢ", type: "Voiced Aspirated", audio: "as-ḍha.mp3", example: "ḍhakkā", exampleDeva: "ढक्का", exampleHindi: "ढोल / बड़ा नगाड़ा", exampleMeaning: "Large War Drum", exampleAudio: "as-ḍhakkā.mp3" },
      { iast: "ṇa", deva: "ण", telugu: "ణ", type: "Nasal (Anunāsika)", audio: "as-ṇa.mp3", example: "bāṇaḥ", exampleDeva: "बाणः", exampleHindi: "तीर / बाण", exampleMeaning: "Arrow", exampleAudio: "as-bāṇaḥ.mp3" }
    ],
    semivowel: { iast: "ra", deva: "र", telugu: "ర", type: "Semivowel (Retroflex)", audio: "as-ra.mp3", example: "rathaḥ", exampleDeva: "रथः", exampleHindi: "रथ (rath)", exampleMeaning: "Chariot", exampleAudio: "as-rathaḥ.mp3" },
    sibilant: { iast: "ṣa", deva: "ष", telugu: "ష", type: "Retroflex Sibilant", audio: "as-ṣa.mp3", example: "ṣaṇmukhaḥ", exampleDeva: "षण्मुखः", exampleHindi: "छह मुख वाला (कार्तिकेय)", exampleMeaning: "Six-Faced", exampleAudio: "as-ṣaṇmukhaḥ.mp3" }
  },
  {
    sthana: "dantya",
    stops: [
      { iast: "ta", deva: "त", telugu: "త", type: "Unvoiced Unaspirated", audio: "as-ta.mp3", example: "taruḥ", exampleDeva: "तरुः", exampleHindi: "पेड़ / वृक्ष", exampleMeaning: "Tree", exampleAudio: "as-taruḥ.mp3" },
      { iast: "tha", deva: "थ", telugu: "థ", type: "Unvoiced Aspirated", audio: "as-tha.mp3", example: null, exampleDeva: null, exampleHindi: null, exampleMeaning: null, exampleAudio: null },
      { iast: "da", deva: "द", telugu: "ద", type: "Voiced Unaspirated", audio: "as-da.mp3", example: "dantaḥ", exampleDeva: "दन्तः", exampleHindi: "दाँत (dā̃t)", exampleMeaning: "Tooth", exampleAudio: "as-dantaḥ.mp3" },
      { iast: "dha", deva: "ध", telugu: "ధ", type: "Voiced Aspirated", audio: "as-dha.mp3", example: "dhenuḥ", exampleDeva: "धेनुः", exampleHindi: "गाय (gāy)", exampleMeaning: "Milch Cow", exampleAudio: "as-dhenuḥ.mp3" },
      { iast: "na", deva: "न", telugu: "న", type: "Nasal (Anunāsika)", audio: "as-na.mp3", example: "nayana", exampleDeva: "नयनम्", exampleHindi: "आँख / नयन", exampleMeaning: "Eye", exampleAudio: "as-nayana.mp3" }
    ],
    semivowel: { iast: "la", deva: "ल", telugu: "ల", type: "Semivowel (Dental)", audio: "as-la.mp3", example: "latā", exampleDeva: "लता", exampleHindi: "बेल / लता", exampleMeaning: "Creeper / Vine", exampleAudio: "as-latā.mp3" },
    sibilant: { iast: "sa", deva: "स", telugu: "స", type: "Dental Sibilant", audio: "as-sa.mp3", example: "sarpaḥ", exampleDeva: "सर्पः", exampleHindi: "साँप (sā̃p)", exampleMeaning: "Serpent / Snake", exampleAudio: "as-sarpaḥ.mp3" }
  },
  {
    sthana: "osthya",
    stops: [
      { iast: "pa", deva: "प", telugu: "ప", type: "Unvoiced Unaspirated", audio: "as-pa.mp3", example: "padmam", exampleDeva: "पद्मम्", exampleHindi: "कमल (kamal)", exampleMeaning: "Lotus", exampleAudio: "as-padmam.mp3" },
      { iast: "pha", deva: "फ", telugu: "ఫ", type: "Unvoiced Aspirated", audio: "as-pha.mp3", example: "phalam", exampleDeva: "फलम्", exampleHindi: "फल (phal)", exampleMeaning: "Fruit", exampleAudio: "as-phalam.mp3" },
      { iast: "ba", deva: "ब", telugu: "బ", type: "Voiced Unaspirated", audio: "as-ba.mp3", example: "bakaḥ", exampleDeva: "बकः", exampleHindi: "बगुला (bagulā)", exampleMeaning: "Heron / Crane", exampleAudio: "as-bakaḥ.mp3" },
      { iast: "bha", deva: "भ", telugu: "భ", type: "Voiced Aspirated", audio: "as-bha.mp3", example: "bhallūkaḥ", exampleDeva: "भल्लूकः", exampleHindi: "भालू (bhālū)", exampleMeaning: "Bear", exampleAudio: "as-bhallūkaḥ.mp3" },
      { iast: "ma", deva: "म", telugu: "మ", type: "Nasal (Anunāsika)", audio: "as-ma.mp3", example: "makaraḥ", exampleDeva: "मकरः", exampleHindi: "मगरमच्छ", exampleMeaning: "Crocodile", exampleAudio: "as-makaraḥ.mp3" }
    ],
    semivowel: { iast: "va", deva: "व", telugu: "వ", type: "Semivowel (Labio-Dental)", audio: "as-va.mp3", example: "vṛkṣaḥ", exampleDeva: "वृक्षः", exampleHindi: "पेड़ (peṛ) / वृक्ष", exampleMeaning: "Tree", exampleAudio: "as-vṛkṣaḥ.mp3" },
    sibilant: null
  }
];


// Special Modifiers (Ayogavāhas)
const MODIFIERS_DATA = [
  { iast: "ṃ", deva: "ं", telugu: "ం", name: "Anusvāra", type: "Nasal Resonance", audio: "as-ṃ.mp3" },
  { iast: "ḥ", deva: "ः", telugu: "ః", name: "Visarga", type: "Unvoiced Breathing", audio: "as-ḥ.mp3" }
];

// Canonical ॐ-Script Sentences for Quick Testing
const PRESET_SENTENCES = [
  {
    title: "Chapter 1: The Core Spine",
    om: "him nar·aḥ hūṃ van·am OM gam·ti ॥",
    meaning: "The man goes to the forest."
  },
  {
    title: "Chapter 2: The Thirst of the Steed",
    om: "him aśv·aḥ hūṃ jal·am OM pā·ti ॥",
    meaning: "The horse drinks water."
  },
  {
    title: "Chapter 3: The Sovereign's Weapon",
    om: "him rāj·an·aḥ śastr·ena śatr·ūn OM han·ti ॥",
    meaning: "The king strikes enemies with a weapon."
  },
  {
    title: "Chapter 4: The Solar Radiance",
    om: "him sūry·aḥ gagane bhā·ti ॥",
    meaning: "The sun shines in the sky."
  },
  {
    title: "Chapter 5: The Innocent Scholar",
    om: "him bāl·aḥ pustak·am OM paśy·ti ॥",
    meaning: "The boy sees the book."
  },
  {
    title: "Chapter 6: The Forest Guardian",
    om: "him kṛṣṇ·aḥ vana·m gam·ti hūṃ gā·ḥ rakṣ·ti ॥",
    meaning: "Krishna goes to the forest and protects the cows."
  },
  {
    title: "Chapter 7: The Master of the Chariot",
    om: "him ratha·e sthit·aḥ arjun·aḥ dhanu·ḥ ā·dā·ti ॥",
    meaning: "Standing on the chariot, Arjuna takes up the bow."
  }
];

window.PhonologyData = {
  UBC_BASE_URL,
  STHANA_CONFIG,
  VOWELS_DATA,
  CONSONANTS_DATA,
  MODIFIERS_DATA,
  PRESET_SENTENCES
};
