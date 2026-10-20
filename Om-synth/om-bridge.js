/**
 * om-bridge.js
 * Browser-side Transliteration, Parsing & Translation Engine for ॐ-Script
 * Replicates the deterministic pipeline of translation_bridge.py:
 * IAST <-> Devanāgarī <-> Telugu, Morpheme Segmentation,
 * Syntactic Parsing, English Bridge & Modern Hindi Synthesis.
 */

class OmBridge {
  constructor() {
    this.initTransliterationMaps();
    this.initLexicon();
  }

  initTransliterationMaps() {
    this.IAST_TO_DEVA_VOWELS = {
      'a': 'अ', 'ā': 'आ', 'i': 'इ', 'ī': 'ई', 'u': 'उ', 'ū': 'ऊ',
      'ṛ': 'ऋ', 'ṝ': 'ॠ', 'ḷ': 'ऌ', 'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ'
    };

    this.IAST_TO_DEVA_MATRAS = {
      'a': '', 'ā': 'ा', 'i': 'ि', 'ī': 'ी', 'u': 'ु', 'ū': 'ू',
      'ṛ': 'ृ', 'ṝ': 'ॄ', 'ḷ': 'ॢ', 'e': 'े', 'ai': 'ै', 'o': 'ो', 'au': 'ौ'
    };

    this.IAST_TO_TELUGU_VOWELS = {
      'a': 'అ', 'ā': 'ఆ', 'i': 'ఇ', 'ī': 'ఈ', 'u': 'ఉ', 'ū': 'ఊ',
      'ṛ': 'ఋ', 'ṝ': 'ౠ', 'ḷ': 'ఌ', 'e': 'ఏ', 'ai': 'ఐ', 'o': 'ఓ', 'au': 'ఔ'
    };

    this.IAST_TO_TELUGU_MATRAS = {
      'a': '', 'ā': 'ా', 'i': 'ి', 'ī': 'ీ', 'u': 'ు', 'ū': 'ూ',
      'ṛ': 'ృ', 'ṝ': 'ౄ', 'ḷ': '', 'e': 'ే', 'ai': 'ై', 'o': 'ో', 'au': 'ౌ'
    };

    this.CONSONANTS = [
      { iast: 'kh', deva: 'ख', telugu: 'ఖ' },
      { iast: 'gh', deva: 'घ', telugu: 'ఘ' },
      { iast: 'ch', deva: 'छ', telugu: 'ఛ' },
      { iast: 'jh', deva: 'झ', telugu: 'ఝ' },
      { iast: 'ṭh', deva: 'ठ', telugu: 'ఠ' },
      { iast: 'ḍh', deva: 'ढ', telugu: 'ఢ' },
      { iast: 'th', deva: 'थ', telugu: 'థ' },
      { iast: 'dh', deva: 'ध', telugu: 'ధ' },
      { iast: 'ph', deva: 'फ', telugu: 'ఫ' },
      { iast: 'bh', deva: 'भ', telugu: 'భ' },
      { iast: 'k', deva: 'क', telugu: 'క' },
      { iast: 'g', deva: 'ग', telugu: 'గ' },
      { iast: 'ṅ', deva: 'ङ', telugu: 'ఙ' },
      { iast: 'c', deva: 'च', telugu: 'చ' },
      { iast: 'j', deva: 'ज', telugu: 'జ' },
      { iast: 'ñ', deva: 'ञ', telugu: 'ఞ' },
      { iast: 'ṭ', deva: 'ट', telugu: 'ట' },
      { iast: 'ḍ', deva: 'ड', telugu: 'డ' },
      { iast: 'ṇ', deva: 'ण', telugu: 'ణ' },
      { iast: 't', deva: 'त', telugu: 'త' },
      { iast: 'd', deva: 'द', telugu: 'ద' },
      { iast: 'n', deva: 'न', telugu: 'న' },
      { iast: 'p', deva: 'प', telugu: 'ప' },
      { iast: 'b', deva: 'ब', telugu: 'బ' },
      { iast: 'm', deva: 'म', telugu: 'మ' },
      { iast: 'y', deva: 'य', telugu: 'య' },
      { iast: 'r', deva: 'र', telugu: 'ర' },
      { iast: 'l', deva: 'ल', telugu: 'ల' },
      { iast: 'v', deva: 'व', telugu: 'వ' },
      { iast: 'ś', deva: 'श', telugu: 'శ' },
      { iast: 'ṣ', deva: 'ष', telugu: 'ష' },
      { iast: 's', deva: 'स', telugu: 'స' },
      { iast: 'h', deva: 'ह', telugu: 'హ' }
    ];
  }

  initLexicon() {
    this.STEM_DICT = {
      'nar': { en: 'man', hi: 'आदमी', hi_obj: 'आदमी को', gender: 'm' },
      'aśv': { en: 'horse', hi: 'घोड़ा', hi_obj: 'घोड़े को', gender: 'm' },
      'van': { en: 'forest', hi: 'जंगल', hi_obj: 'जंगल', gender: 'n' },
      'vana': { en: 'forest', hi: 'जंगल', hi_obj: 'जंगल', gender: 'n' },
      'jal': { en: 'water', hi: 'पानी', hi_obj: 'पानी', gender: 'n' },
      'jala': { en: 'water', hi: 'पानी', hi_obj: 'पानी', gender: 'n' },
      'śastr': { en: 'weapon', hi: 'हथियार', hi_obj: 'हथियार को', gender: 'n' },
      'śatr': { en: 'enemy', hi: 'शत्रु', hi_obj: 'शत्रुओं को', gender: 'm' },
      'sūry': { en: 'sun', hi: 'सूर्य', hi_obj: 'सूर्य को', gender: 'm' },
      'gagan': { en: 'sky', hi: 'आकाश', hi_obj: 'आकाश में', gender: 'n' },
      'gagane': { en: 'sky', hi: 'आकाश में', hi_obj: 'आकाश में', role: 'in the sky' },
      'bāl': { en: 'boy', hi: 'लड़का', hi_obj: 'लड़के को', gender: 'm' },
      'pustak': { en: 'book', hi: 'किताब', hi_obj: 'किताब', gender: 'n' },
      'kṛṣṇ': { en: 'Krishna', hi: 'कृष्ण', hi_obj: 'कृष्ण को', gender: 'm' },
      'gā': { en: 'cow', hi: 'गाय', hi_obj: 'गायों को', gender: 'f' },
      'rath': { en: 'chariot', hi: 'रथ', hi_obj: 'रथ में', gender: 'm' },
      'ratha': { en: 'chariot', hi: 'रथ', hi_obj: 'रथ में', gender: 'm' },
      'sthit': { en: 'standing', hi: 'खड़ा हुआ', role: 'standing' },
      'arjun': { en: 'Arjuna', hi: 'अर्जुन', hi_obj: 'अर्जुन को', gender: 'm' },
      'dhanu': { en: 'bow', hi: 'धनुष', hi_obj: 'धनुष', gender: 'n' },
      'rāj·an': { en: 'king', hi: 'राजा', hi_obj: 'राजा को', gender: 'm' },
      'rājan': { en: 'king', hi: 'राजा', hi_obj: 'राजा को', gender: 'm' }
    };

    this.VERB_DICT = {
      'gam·ti': { classical: 'gacchati', deva: 'गच्छति', telugu: 'గచ్ఛతి', en: 'goes', hi: 'जाता है' },
      'pā·ti': { classical: 'pibati', deva: 'पिबति', telugu: 'పిబతి', en: 'drinks', hi: 'पीता है' },
      'han·ti': { classical: 'hanti', deva: 'हन्ति', telugu: 'హన్తి', en: 'strikes', hi: 'मारता है' },
      'bhā·ti': { classical: 'bhāti', deva: 'भाति', telugu: 'భాతి', en: 'shines', hi: 'चमकता है' },
      'paśy·ti': { classical: 'paśyati', deva: 'पश्यति', telugu: 'పశ్యతి', en: 'sees', hi: 'देखता है' },
      'rakṣ·ti': { classical: 'rakṣati', deva: 'रक्षति', telugu: 'రక్షతి', en: 'protects', hi: 'रक्षा करता है' },
      'ā·dā·ti': { classical: 'ādāte', deva: 'आदत्ते', telugu: 'ఆదత్తే', en: 'takes up', hi: 'उठाता है' }
    };
  }

  // Pure IAST to Devanagari transliterator
  iastToDevanagari(text) {
    if (!text) return "";
    let clean = text.replace(/·/g, "");
    if (clean === "him" || clean === "hūṃ" || clean === "OM") return clean;
    if (clean === "॥") return "॥";

    // Direct special cases
    let tokens = clean.split(/(\s+|॥|।)/);
    return tokens.map(token => {
      if (token.trim() === "॥" || token.trim() === "।") return token;
      return this._wordToDevanagari(token);
    }).join("");
  }

  _wordToDevanagari(word) {
    if (!word) return "";
    let res = "";
    let i = 0;
    let n = word.length;
    let isStart = true;

    while (i < n) {
      // Check anusvara and visarga
      if (word[i] === 'ṃ') { res += 'ं'; i++; isStart = false; continue; }
      if (word[i] === 'ḥ') { res += 'ः'; i++; isStart = false; continue; }

      // Check consonants
      let matchedC = null;
      for (let c of this.CONSONANTS) {
        if (word.startsWith(c.iast, i)) {
          matchedC = c;
          break;
        }
      }

      if (matchedC) {
        i += matchedC.iast.length;
        // Check following vowel
        let matchedV = null;
        let vowelKeys = ['au', 'ai', 'ā', 'ī', 'ū', 'ṝ', 'a', 'i', 'u', 'ṛ', 'ḷ', 'e', 'o'];
        for (let vk of vowelKeys) {
          if (word.startsWith(vk, i)) {
            matchedV = vk;
            break;
          }
        }

        if (matchedV) {
          res += matchedC.deva + this.IAST_TO_DEVA_MATRAS[matchedV];
          i += matchedV.length;
        } else {
          // Virama consonant
          res += matchedC.deva + '्';
        }
        isStart = false;
        continue;
      }

      // Check independent vowel
      let matchedIndV = null;
      let indVKeys = ['au', 'ai', 'ā', 'ī', 'ū', 'ṝ', 'a', 'i', 'u', 'ṛ', 'ḷ', 'e', 'o'];
      for (let vk of indVKeys) {
        if (word.startsWith(vk, i)) {
          matchedIndV = vk;
          break;
        }
      }

      if (matchedIndV) {
        if (isStart) {
          res += this.IAST_TO_DEVA_VOWELS[matchedIndV];
        } else {
          res += this.IAST_TO_DEVA_MATRAS[matchedIndV];
        }
        i += matchedIndV.length;
        isStart = false;
        continue;
      }

      res += word[i];
      i++;
    }
    return res;
  }

  // Pure IAST to Telugu transliterator
  iastToTelugu(text) {
    if (!text) return "";
    let clean = text.replace(/·/g, "");
    if (clean === "him" || clean === "hūṃ" || clean === "OM") return clean;
    if (clean === "॥") return "॥";

    let tokens = clean.split(/(\s+|॥|।)/);
    return tokens.map(token => {
      if (token.trim() === "॥" || token.trim() === "।") return token;
      return this._wordToTelugu(token);
    }).join("");
  }

  _wordToTelugu(word) {
    if (!word) return "";
    let res = "";
    let i = 0;
    let n = word.length;
    let isStart = true;

    while (i < n) {
      if (word[i] === 'ṃ') { res += 'ం'; i++; isStart = false; continue; }
      if (word[i] === 'ḥ') { res += 'ః'; i++; isStart = false; continue; }

      let matchedC = null;
      for (let c of this.CONSONANTS) {
        if (word.startsWith(c.iast, i)) {
          matchedC = c;
          break;
        }
      }

      if (matchedC) {
        i += matchedC.iast.length;
        let matchedV = null;
        let vowelKeys = ['au', 'ai', 'ā', 'ī', 'ū', 'ṝ', 'a', 'i', 'u', 'ṛ', 'ḷ', 'e', 'o'];
        for (let vk of vowelKeys) {
          if (word.startsWith(vk, i)) {
            matchedV = vk;
            break;
          }
        }

        if (matchedV) {
          res += matchedC.telugu + this.IAST_TO_TELUGU_MATRAS[matchedV];
          i += matchedV.length;
        } else {
          res += matchedC.telugu + '్';
        }
        isStart = false;
        continue;
      }

      let matchedIndV = null;
      let indVKeys = ['au', 'ai', 'ā', 'ī', 'ū', 'ṝ', 'a', 'i', 'u', 'ṛ', 'ḷ', 'e', 'o'];
      for (let vk of indVKeys) {
        if (word.startsWith(vk, i)) {
          matchedIndV = vk;
          break;
        }
      }

      if (matchedIndV) {
        if (isStart) {
          res += this.IAST_TO_TELUGU_VOWELS[matchedIndV];
        } else {
          res += this.IAST_TO_TELUGU_MATRAS[matchedIndV];
        }
        i += matchedIndV.length;
        isStart = false;
        continue;
      }

      res += word[i];
      i++;
    }
    return res;
  }

  // Parse an entire ॐ-Script input line into tokens with synchronized multi-target output
  parseSentence(input) {
    if (!input || !input.trim()) return null;

    let rawTokens = input.trim().split(/\s+/);
    let tokenItems = [];

    for (let raw of rawTokens) {
      let isBija = ["him", "hūṃ", "OM", "॥", "।"].includes(raw);
      let item = {
        raw: raw,
        isBija: isBija,
        bijaType: isBija ? raw : null,
        deva: "",
        telugu: "",
        iast: "",
        role: "",
        englishWord: "",
        hindiWord: ""
      };

      if (isBija) {
        item.deva = raw;
        item.telugu = raw;
        item.iast = raw;
        if (raw === "him") {
          item.role = "Carrier Breath [Reset]";
          item.englishWord = "(breath)";
          item.hindiWord = "";
        } else if (raw === "hūṃ") {
          item.role = "Acoustic Hum [Clause]";
          item.englishWord = ",";
          item.hindiWord = "";
        } else if (raw === "OM") {
          item.role = "Tonic Lock [Verb]";
          item.englishWord = "";
          item.hindiWord = "";
        } else if (raw === "॥") {
          item.role = "Terminal Halt";
          item.englishWord = ".";
          item.hindiWord = "।";
        }
      } else {
        // Parse root/suffix
        let parts = raw.split("·");
        let stem = parts[0];
        let suffix = parts.length > 1 ? parts[parts.length - 1] : "";

        // Check if verb
        if (this.VERB_DICT[raw]) {
          let v = this.VERB_DICT[raw];
          item.deva = v.deva;
          item.telugu = v.telugu;
          item.iast = v.classical;
          item.role = "Verb [Active]";
          item.englishWord = v.en;
          item.hindiWord = v.hi;
        } else {
          // Resolve noun / case
          let lookupKey = parts.slice(0, -1).join("·") || stem;
          let entry = this.STEM_DICT[lookupKey] || this.STEM_DICT[stem] || { en: stem, hi: stem, gender: 'm' };

          // Build Classical Sanskrit surface form
          let surfaceIast = raw.replace(/·/g, "");
          item.iast = surfaceIast;
          item.deva = this.iastToDevanagari(surfaceIast);
          item.telugu = this.iastToTelugu(surfaceIast);

          // Role determination
          if (suffix === "aḥ" || suffix === "ḥ" || suffix === "ā") {
            item.role = "Subject [1.1 Nom]";
            item.englishWord = entry.en;
            item.hindiWord = entry.hi;
          } else if (suffix === "am" || suffix === "m" || suffix === "ūn") {
            item.role = "Object [2.1 Acc]";
            item.englishWord = entry.en;
            item.hindiWord = entry.hi_obj || entry.hi;
          } else if (suffix === "ena" || suffix === "bhiḥ") {
            item.role = "Instrumental [3.1 Inst]";
            item.englishWord = `with ${entry.en}`;
            item.hindiWord = `${entry.hi} से`;
          } else if (suffix === "e") {
            item.role = "Locative [7.1 Loc]";
            item.englishWord = `in ${entry.en}`;
            item.hindiWord = `${entry.hi} में`;
          } else {
            item.role = entry.role || "Modifier";
            item.englishWord = entry.en;
            item.hindiWord = entry.hi;
          }
        }
      }
      tokenItems.push(item);
    }

    // Assemble fluent translations
    let fluentEnglish = this.buildFluentEnglish(tokenItems);
    let fluentHindi = this.buildFluentHindi(tokenItems);
    let devaLine = tokenItems.filter(t => !["him", "hūṃ", "OM"].includes(t.raw)).map(t => t.deva).join(" ");
    let teluguLine = tokenItems.filter(t => !["him", "hūṃ", "OM"].includes(t.raw)).map(t => t.telugu).join(" ");
    let iastLine = tokenItems.filter(t => !["him", "hūṃ", "OM"].includes(t.raw)).map(t => t.iast).join(" ");

    return {
      tokens: tokenItems,
      devaLine,
      teluguLine,
      iastLine,
      fluentEnglish,
      fluentHindi
    };
  }

  buildFluentEnglish(tokens) {
    let subjects = [];
    let verbs = [];
    let objects = [];
    let others = [];

    for (let t of tokens) {
      if (t.isBija) continue;
      if (t.role.includes("Subject")) {
        subjects.push("The " + t.englishWord);
      } else if (t.role.includes("Verb")) {
        verbs.push(t.englishWord);
      } else if (t.role.includes("Object")) {
        objects.push("the " + t.englishWord);
      } else {
        others.push(t.englishWord);
      }
    }

    let parts = [];
    if (subjects.length) parts.push(subjects.join(" and "));
    if (verbs.length) parts.push(verbs.join(" and "));
    if (objects.length) {
      // Add preposition if motion verb like goes
      let vStr = verbs.join(" ");
      if (vStr.includes("goes")) {
        parts.push("to " + objects.join(", "));
      } else {
        parts.push(objects.join(", "));
      }
    }
    if (others.length) parts.push(others.join(" "));

    let res = parts.join(" ").trim();
    if (!res.endsWith(".")) res += ".";
    return res.charAt(0).toUpperCase() + res.slice(1);
  }

  buildFluentHindi(tokens) {
    let words = [];
    for (let t of tokens) {
      if (t.isBija) continue;
      if (t.hindiWord) words.push(t.hindiWord);
    }
    let res = words.join(" ").trim();
    if (!res.endsWith("।")) res += " ।";
    return res;
  }
}

window.OmBridge = new OmBridge();
