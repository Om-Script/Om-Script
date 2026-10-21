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
      'gam·ti': { classical: 'gacchati', deva: 'गम्-ति', constructorDeva: 'गम्-ति', telugu: 'గమ్-తి', spoken: 'गम्-ति', en: 'goes', hi: 'जाता है' },
      'gam·a·ti': { classical: 'gacchati', deva: 'गमति', constructorDeva: 'गमति', telugu: 'గమతి', spoken: 'गमति', en: 'goes', hi: 'जाता है' },
      'pā·ti': { classical: 'pibati', deva: 'पा-ति', constructorDeva: 'पा-ति', telugu: 'పా-తి', spoken: 'पा-ति', en: 'drinks', hi: 'पीता है' },
      'pā·a·ti': { classical: 'pibati', deva: 'पाति', constructorDeva: 'पाति', telugu: 'పాతి', spoken: 'पाति', en: 'drinks', hi: 'पीता है' },
      'han·ti': { classical: 'hanti', deva: 'हन्-ति', constructorDeva: 'हन्-ति', telugu: 'హన్-తి', spoken: 'हन्-ति', en: 'strikes', hi: 'मारता है' },
      'bhā·ti': { classical: 'bhāti', deva: 'भा-ति', constructorDeva: 'भा-ति', telugu: 'భా-తి', spoken: 'भा-ति', en: 'shines', hi: 'चमकता है' },
      'paśy·ti': { classical: 'paśyati', deva: 'पश्य्-ति', constructorDeva: 'पश्य्-ति', telugu: 'పశ్య్-తి', spoken: 'पश्य्-ति', en: 'sees', hi: 'देखता है' },
      'dṛś·ti': { classical: 'paśyati', deva: 'दृश्-ति', constructorDeva: 'दृश्-ति', telugu: 'దృశ్-తి', spoken: 'दृश्-ति', en: 'sees', hi: 'देखता है' },
      'rakṣ·ti': { classical: 'rakṣati', deva: 'रक्ष्-ति', constructorDeva: 'रक्ष्-ति', telugu: 'రక్ష్-తి', spoken: 'रक्ष्-ति', en: 'protects', hi: 'रक्षा करता है' },
      'rakṣ·a·ti': { classical: 'rakṣati', deva: 'रक्षति', constructorDeva: 'रक्षति', telugu: 'రక్షతి', spoken: 'रक्षति', en: 'protects', hi: 'रक्षा करता है' },
      'ā·dā·ti': { classical: 'ādāte', deva: 'आ-दा-ति', constructorDeva: 'आ-दा-ति', telugu: 'ఆ-దా-తి', spoken: 'आ-दा-ति', en: 'takes up', hi: 'उठाता है' }
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
      if (word[i] === '-') { res += '-'; i++; isStart = true; continue; }
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
      if (word[i] === '-') { res += '-'; i++; isStart = true; continue; }
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
      const bijaMatch = raw.match(/^(ATHA|atha|अथ|అథ|him|hum|hūṃ|hīṃ|OM|om|हिम्|हुम्|हूँ|हीं|ॐ|॥|।)([\.ऽ~-]+)?$/i);
      let isBija = !!bijaMatch;
      let bijaBase = null;
      let bijaMod = "";
      let durationMultiplier = 1.0;
      let durationLabel = "";

      if (bijaMatch) {
        bijaBase = bijaMatch[1];
        bijaMod = bijaMatch[2] || "";
        
        // Normalize base
        const bLower = bijaBase.toLowerCase();
        if (bLower === "atha" || bijaBase === "अथ" || bijaBase === "అథ") {
          bijaBase = "ATHA";
        } else if (bLower === "him" || bLower === "hum" || bijaBase === "हिम्" || bijaBase === "हुम्") {
          bijaBase = "him";
        } else if (bLower === "hūṃ" || bLower === "hīṃ" || bijaBase === "हूँ" || bijaBase === "हीं") {
          bijaBase = "hūṃ";
        } else if (bLower === "om" || bijaBase === "ॐ") {
          bijaBase = "OM";
        } else if (bijaBase === "॥" || bijaBase === "।") {
          bijaBase = "॥";
        }

        // Method 2 (Dashes, Tildes, Dots) & Method 3 (Avagraha ऽ)
        if (bijaMod.includes(".")) {
          durationMultiplier = 0.5;
          durationLabel = "Staccato Flick (½ Mātrā)";
        } else if (bijaMod.includes("ऽ")) {
          const avCount = (bijaMod.match(/ऽ/g) || []).length;
          durationMultiplier = 1.0 + avCount;
          durationLabel = `Avagraha Wave (${durationMultiplier} Mātrās)`;
        } else if (bijaMod.includes("-") || bijaMod.includes("~")) {
          const dCount = bijaMod.length;
          durationMultiplier = dCount === 1 ? 1.6 : (dCount === 2 ? 2.5 : 3.5);
          durationLabel = dCount === 1 ? "Sustained Breath (1.6x)" : (dCount === 2 ? "Extended Hold (2.5x)" : "Deep Fermata (3.5x)");
        }
      }

      let item = {
        raw: raw,
        isBija: isBija,
        bijaType: isBija ? bijaBase : null,
        bijaBase: bijaBase,
        bijaMod: bijaMod,
        durationMultiplier: durationMultiplier,
        durationLabel: durationLabel,
        deva: "",
        telugu: "",
        iast: "",
        role: "",
        englishWord: "",
        hindiWord: ""
      };

      if (isBija) {
        if (bijaBase === "ATHA") {
          item.deva = "अथ" + (bijaMod.replace(/-/g, "ऽ").replace(/~/g, "ऽ"));
          item.telugu = "అథ" + bijaMod;
          item.iast = "ATHA" + bijaMod;
          item.role = durationLabel ? `Carrier Boot [${durationLabel}]` : "Carrier Boot [Initial Flow]";
          item.englishWord = "";
          item.hindiWord = "";
        } else if (bijaBase === "him") {
          item.deva = "हिम्" + (bijaMod.replace(/-/g, "ऽ").replace(/~/g, "ऽ"));
          item.telugu = "హిమ్" + bijaMod;
          item.iast = "him" + bijaMod;
          item.role = durationLabel ? `Carrier Breath [${durationLabel}]` : "Carrier Breath [Reset]";
          item.englishWord = "(breath)";
          item.hindiWord = "";
        } else if (bijaBase === "hūṃ") {
          item.deva = "हूँ" + (bijaMod.replace(/-/g, "ऽ").replace(/~/g, "ऽ"));
          item.telugu = "హూం" + bijaMod;
          item.iast = "hūṃ" + bijaMod;
          item.role = durationLabel ? `Acoustic Hum [${durationLabel}]` : "Acoustic Hum [Clause]";
          item.englishWord = ",";
          item.hindiWord = "";
        } else if (bijaBase === "OM") {
          item.deva = "ॐ" + (bijaMod.replace(/-/g, "ऽ").replace(/~/g, "ऽ"));
          item.telugu = "ఓం" + bijaMod;
          item.iast = "OM" + bijaMod;
          item.role = durationLabel ? `Tonic Lock [${durationLabel}]` : "Tonic Lock [Verb]";
          item.englishWord = "";
          item.hindiWord = "";
        } else if (bijaBase === "॥") {
          item.deva = "॥" + bijaMod;
          item.telugu = "॥" + bijaMod;
          item.iast = "॥" + bijaMod;
          item.role = durationLabel ? `Terminal Halt [${durationLabel}]` : "Terminal Halt";
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
          item.iast = raw; // Pure ॐ-Script constructor form: gam·ti
          item.deva = v.constructorDeva || v.deva; // Pure constructor Devanāgarī: गम्-ति
          item.telugu = v.telugu;
          item.spoken = v.spoken || v.constructorDeva || v.deva; // Spoken pure constructor form (gam-ti)
          item.classical = v.classical; // Preserved for comparative linguistic metadata
          item.role = "Verb [Active]";
          item.englishWord = v.en;
          item.hindiWord = v.hi;
        } else {
          // Resolve noun / case
          let lookupKey = parts.slice(0, -1).join("·") || stem;
          let entry = this.STEM_DICT[lookupKey] || this.STEM_DICT[stem] || { en: stem, hi: stem, gender: 'm' };

          // Build Pure ॐ-Script Constructor forms
          let surfaceIast = raw.replace(/·/g, "");
          item.iast = raw;
          item.deva = this.iastToDevanagari(surfaceIast);
          item.telugu = this.iastToTelugu(surfaceIast);
          item.spoken = item.deva; // Spoken full Sanskrit form (e.g. vanam -> वनम्, naraḥ -> नरः)

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
    let devaLine = tokenItems.filter(t => !["him", "hūṃ", "OM"].includes(t.bijaBase)).map(t => t.deva).join(" ");
    let teluguLine = tokenItems.filter(t => !["him", "hūṃ", "OM"].includes(t.bijaBase)).map(t => t.telugu).join(" ");
    let iastLine = tokenItems.filter(t => !["him", "hūṃ", "OM"].includes(t.bijaBase)).map(t => t.iast).join(" ");

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

  // Devanagari detection & reverse transliteration
  isDevanagari(text) {
    if (!text) return false;
    return /[\u0900-\u097F]/.test(text);
  }

  devanagariToIAST(text) {
    if (!text) return "";
    const IND_VOWELS = {
      'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū',
      'ऋ': 'ṛ', 'ॠ': 'ṝ', 'ऌ': 'ḷ', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au'
    };
    const MATRAS = {
      'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū',
      'ृ': 'ṛ', 'ॄ': 'ṝ', 'ॢ': 'ḷ', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au'
    };
    const CONSONANTS = {
      'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ṅ',
      'च': 'c', 'छ': 'ch', 'ज': 'j', 'झ': 'jh', 'ञ': 'ñ',
      'ट': 'ṭ', 'ठ': 'ṭh', 'ड': 'ḍ', 'ढ': 'ḍh', 'ण': 'ṇ',
      'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
      'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
      'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
      'श': 'ś', 'ष': 'ṣ', 'स': 's', 'ह': 'h'
    };

    let res = "";
    let i = 0;
    const n = text.length;

    while (i < n) {
      const ch = text[i];
      if (ch === 'ॐ') {
        res += 'OM';
        i++;
      } else if (ch === 'ं' || ch === 'ँ') {
        res += 'ṃ';
        i++;
      } else if (ch === 'ः') {
        res += 'ḥ';
        i++;
      } else if (IND_VOWELS[ch]) {
        res += IND_VOWELS[ch];
        i++;
      } else if (CONSONANTS[ch]) {
        const c = CONSONANTS[ch];
        const nextCh = i + 1 < n ? text[i + 1] : null;
        if (nextCh === '्') {
          res += c;
          i += 2;
        } else if (nextCh && MATRAS[nextCh]) {
          res += c + MATRAS[nextCh];
          i += 2;
        } else {
          res += c + 'a';
          i += 1;
        }
      } else if (MATRAS[ch]) {
        res += MATRAS[ch];
        i++;
      } else {
        res += ch;
        i++;
      }
    }
    return res;
  }

  toIAST(text) {
    if (this.isDevanagari(text)) {
      return this.devanagariToIAST(text);
    }
    return text;
  }
}

window.OmBridge = new OmBridge();
window.omBridge = window.OmBridge;

