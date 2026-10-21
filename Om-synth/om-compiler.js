/**
 * om-compiler.js
 * The Deterministic, Non-LLM Multi-Language to ॐ-Script Compiler & Architecture Engine
 * Replicates and extends english_to_om.py & translation_bridge.py for the browser:
 * 1. Offline Lexicon (9,000+ words from DCS & IndoWordNet via om_lexicon.json)
 * 2. Smart English Chunker & Kāraka Role Tagger
 * 3. Classical Sanskrit Normalizer (de-inflector & de-sandhi)
 * 4. Two-Track Breath Weaver (ATHA, him, hūṃऽऽ, OM, ॥)
 * 5. Interactive AST with Real-Time Tag Override Badges
 * 6. Multi-Script Transliteration (IAST, Devanāgarī, Telugu)
 */

class OmCompiler {
  constructor() {
    this.isLoaded = false;
    this.lexicon = {};
    this.overrides = {};
    this.irregulars = {};
    this.classical = {};
    this.currentAST = [];
    this.listeners = [];
  }

  async init(jsonPath = './om_lexicon.json') {
    if (this.isLoaded) return;
    try {
      const response = await fetch(jsonPath);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      this.lexicon = data.lexicon || {};
      this.overrides = data.overrides || {};
      this.irregulars = data.irregulars || {};
      this.classical = data.classical || {};
      this.isLoaded = true;
      console.log(`[OmCompiler] Lexicon initialized successfully with ${Object.keys(this.lexicon).length} words.`);
    } catch (e) {
      console.warn('[OmCompiler] Failed to fetch om_lexicon.json, falling back to embedded core dictionary.', e);
      this._initFallbackLexicon();
      this.isLoaded = true;
    }
  }

  _initFallbackLexicon() {
    this.overrides = {
      'i': { skt: 'mad', pos: 'pron', role: '·ḥ' },
      'me': { skt: 'mad', pos: 'pron', role: '·ṃ' },
      'my': { skt: 'mad', pos: 'pron', role: '·sya' },
      'you': { skt: 'yuṣmad', pos: 'pron', role: '·ḥ' },
      'your': { skt: 'yuṣmad', pos: 'pron', role: '·sya' },
      'he': { skt: 'tad', pos: 'pron', role: '·ḥ' },
      'him': { skt: 'tad', pos: 'pron', role: '·ṃ' },
      'his': { skt: 'tad', pos: 'pron', role: '·sya' },
      'she': { skt: 'tad', pos: 'pron', role: '·ḥ' },
      'her': { skt: 'tad', pos: 'pron', role: '·ṃ' },
      'they': { skt: 'tad', pos: 'pron', role: '·ḥ' },
      'them': { skt: 'tad', pos: 'pron', role: '·ṃ' },
      'their': { skt: 'tad', pos: 'pron', role: '·sya' },
      'it': { skt: 'tad', pos: 'pron', role: '·ḥ' },
      'this': { skt: 'idam', pos: 'pron', role: '·ḥ' },
      'that': { skt: 'tad', pos: 'pron', role: '·ḥ' },
      'king': { skt: 'rājan', pos: 'n' },
      'forest': { skt: 'vana', pos: 'n' },
      'hero': { skt: 'vīra', pos: 'n' },
      'warrior': { skt: 'yodha', pos: 'n' },
      'demon': { skt: 'rākṣasa', pos: 'n' },
      'arrow': { skt: 'bāṇa', pos: 'n' },
      'bow': { skt: 'dhanus', pos: 'n' },
      'horse': { skt: 'aśva', pos: 'n' },
      'chariot': { skt: 'ratha', pos: 'n' },
      'water': { skt: 'jala', pos: 'n' },
      'man': { skt: 'nara', pos: 'n' },
      'god': { skt: 'deva', pos: 'n' },
      'enemy': { skt: 'śatru', pos: 'n' },
      'army': { skt: 'senā', pos: 'n' },
      'protect': { skt: 'rakṣ', pos: 'v' },
      'strike': { skt: 'han', pos: 'v' },
      'kill': { skt: 'han', pos: 'v' },
      'see': { skt: 'paś', pos: 'v' },
      'go': { skt: 'gam', pos: 'v' },
      'come': { skt: 'ā·gam', pos: 'v' },
      'do': { skt: 'kṛ', pos: 'v' },
      'give': { skt: 'dā', pos: 'v' },
      'destroy': { skt: 'naś', pos: 'v' }
    };
    this.irregulars = {
      'struck': { lemma: 'strike', tense: 'past' },
      'killed': { lemma: 'kill', tense: 'past' },
      'went': { lemma: 'go', tense: 'past' },
      'came': { lemma: 'come', tense: 'past' },
      'saw': { lemma: 'see', tense: 'past' },
      'protected': { lemma: 'protect', tense: 'past' },
      'destroyed': { lemma: 'destroy', tense: 'past' }
    };
  }

  // Predefined role metadata with human labels and CSS classnames
  static get ROLES() {
    return [
      { tag: '·ḥ', label: 'Subject (·ḥ)', desc: 'The initiator / Actor', group: 'noun' },
      { tag: '·ṃ', label: 'Direct Object (·ṃ)', desc: 'The target of the action', group: 'noun' },
      { tag: '·ena', label: 'Instrument (·ena)', desc: 'With / By means of tool', group: 'noun' },
      { tag: '·bhiḥ', label: 'Instrument (·bhiḥ)', desc: 'With / By means of tools', group: 'noun' },
      { tag: '·ya', label: 'Receiver (·ya)', desc: 'To / For the benefit of', group: 'noun' },
      { tag: '·bhyam', label: 'Receiver (·bhyam)', desc: 'To / For the recipient', group: 'noun' },
      { tag: '·āt', label: 'Source (·āt)', desc: 'From / Origin point', group: 'noun' },
      { tag: '·taḥ', label: 'Source (·taḥ)', desc: 'From / Origin direction', group: 'noun' },
      { tag: '·sya', label: 'Possessor (·sya)', desc: 'Of / Belongs to', group: 'noun' },
      { tag: '·e', label: 'Location (·e)', desc: 'In / On / At spatial station', group: 'noun' },
      { tag: '·su', label: 'Environment (·su)', desc: 'In the surrounding sphere', group: 'noun' },
      { tag: '', label: 'Bare Modifier (him)', desc: 'Adjective / Pre-modifier bound with him', group: 'modifier' },
      { tag: '·ti', label: 'Present Verb (·ti)', desc: 'Action in the present (3rd Person)', group: 'verb' },
      { tag: '·mi', label: 'Present Verb (·mi)', desc: 'Action in the present (1st Person: I)', group: 'verb' },
      { tag: '·si', label: 'Present Verb (·si)', desc: 'Action in the present (2nd Person: You)', group: 'verb' },
      { tag: '·syati', label: 'Future Verb (·syati)', desc: 'Action in the future (3rd Person)', group: 'verb' },
      { tag: '·syāmi', label: 'Future Verb (·syāmi)', desc: 'Action in the future (1st Person: I)', group: 'verb' },
      { tag: '·syasi', label: 'Future Verb (·syasi)', desc: 'Action in the future (2nd Person: You)', group: 'verb' },
      { tag: 'a·...·t', label: 'Past Verb (a·...·t)', desc: 'Completed past action (3rd Person)', group: 'verb' },
      { tag: 'a·...·m', label: 'Past Verb (a·...·m)', desc: 'Completed past action (1st Person: I)', group: 'verb' },
      { tag: 'a·...·s', label: 'Past Verb (a·...·s)', desc: 'Completed past action (2nd Person: You)', group: 'verb' },
      { tag: '·ant', label: 'Participle (·ant)', desc: 'Ongoing continuous flow (-ing)', group: 'opcode' },
      { tag: '·ta', label: 'Completed State (·ta)', desc: 'Frozen completed state (done)', group: 'opcode' },
      { tag: '·tvā', label: 'Trigger (·tvā)', desc: 'Prerequisite trigger (having done)', group: 'opcode' },
      { tag: '·tum', label: 'Infinitive Intent (·tum)', desc: 'In order to / Purpose', group: 'opcode' }
    ];
  }

  /**
   * Translates an English sentence into an interactive ॐ-Script AST.
   */
  compileEnglish(sentence) {
    if (!sentence || !sentence.trim()) return null;

    // Normalize and clean sentence
    let cleanSentence = sentence.trim();
    // Handle punctuation
    const endsWithPunct = /[.!?]$/.test(cleanSentence);
    cleanSentence = cleanSentence.replace(/[.!?]+$/, '');

    // Tokenize into clean words
    const rawTokens = cleanSentence.split(/\s+/);
    const parsedTokens = [];

    // Pre-pass: Identify Prepositions, Verb candidates, Subject candidate
    let subjectFound = false;
    let verbFound = false;
    let activePreposition = null;
    let isFuture = false;
    let isPast = false;
    let isFirstPerson = false;

    // Check for auxiliary indicators across tokens
    for (let i = 0; i < rawTokens.length; i++) {
      const lower = rawTokens[i].toLowerCase().replace(/[^a-z']/g, '');
      if (lower === 'i' || lower === 'we') isFirstPerson = true;
      if (lower === 'will' || lower === 'shall') isFuture = true;
      if (lower === 'did' || lower === 'was' || lower === 'were') isPast = true;
    }

    // Step-by-step structural chunker
    for (let i = 0; i < rawTokens.length; i++) {
      const orig = rawTokens[i];
      let lower = orig.toLowerCase().replace(/[^a-z'-]/g, '');

      // Skip articles
      if (lower === 'the' || lower === 'a' || lower === 'an') {
        continue;
      }

      // Check future aux
      if (lower === 'will' || lower === 'shall') {
        isFuture = true;
        continue;
      }

      // Check prepositions
      if (['in', 'on', 'at', 'into', 'inside'].includes(lower)) {
        activePreposition = '·e';
        continue;
      }
      if (['with', 'by'].includes(lower)) {
        activePreposition = '·ena';
        continue;
      }
      if (['from', 'out'].includes(lower)) {
        activePreposition = '·āt';
        continue;
      }
      if (['of'].includes(lower)) {
        activePreposition = '·sya';
        continue;
      }
      if (['to', 'for'].includes(lower)) {
        activePreposition = '·ya';
        continue;
      }

      // Check possessive noun: e.g. "king's" -> "king" with ·sya tag
      let isPossessive = false;
      if (lower.endsWith("'s") || lower.endsWith("’s")) {
        lower = lower.replace(/['’]s$/, '');
        isPossessive = true;
      }

      // Look up lemma & dictionary info
      let lemma = lower;
      let tenseHint = null;
      if (this.irregulars[lower]) {
        lemma = this.irregulars[lower].lemma;
        tenseHint = this.irregulars[lower].tense;
      } else if (lower.endsWith('ed') && lower.length > 4) {
        lemma = lower.slice(0, -2);
        tenseHint = 'past';
      } else if (lower.endsWith('ing') && lower.length > 5) {
        lemma = lower.slice(0, -3);
        tenseHint = 'participle';
      } else if (lower.endsWith('s') && !lower.endsWith('ss') && lower.length > 3) {
        // check singular verb
        const stemCand = lower.slice(0, -1);
        if (this._isVerbInLexicon(stemCand)) {
          lemma = stemCand;
        }
      }

      // Root resolution
      let sktRoot = '';
      let pos = 'n';
      let defaultRole = '·ṃ';

      if (this.overrides[lower]) {
        sktRoot = this.overrides[lower].skt;
        pos = this.overrides[lower].pos;
        if (this.overrides[lower].role) defaultRole = this.overrides[lower].role;
      } else if (this.overrides[lemma]) {
        sktRoot = this.overrides[lemma].skt;
        pos = this.overrides[lemma].pos;
        if (this.overrides[lemma].role) defaultRole = this.overrides[lemma].role;
      } else if (this.lexicon[lower]) {
        sktRoot = this.lexicon[lower].skt;
        pos = this.lexicon[lower].pos || 'n';
      } else if (this.lexicon[lemma]) {
        sktRoot = this.lexicon[lemma].skt;
        pos = this.lexicon[lemma].pos || 'n';
      } else {
        sktRoot = lemma; // fallback
      }

      // Syntactic role determination
      let assignedTag = '';
      let roleLabel = '';

      if (isPossessive) {
        assignedTag = '·sya';
        roleLabel = 'Possessor (·sya)';
      } else if (activePreposition) {
        assignedTag = activePreposition;
        roleLabel = OmCompiler.ROLES.find(r => r.tag === activePreposition)?.label || 'Prepositional';
        activePreposition = null; // consume preposition
      } else if (pos === 'v' || tenseHint || (!verbFound && this._isLikelyVerb(lemma, i, rawTokens.length))) {
        // Verb role
        verbFound = true;
        const effectivePast = tenseHint === 'past' || isPast;
        const effectiveFuture = isFuture;

        if (effectivePast) {
          assignedTag = isFirstPerson ? 'a·...·m' : 'a·...·t';
          roleLabel = isFirstPerson ? 'Past Verb (a·...·m)' : 'Past Verb (a·...·t)';
        } else if (effectiveFuture) {
          assignedTag = isFirstPerson ? '·syāmi' : '·syati';
          roleLabel = isFirstPerson ? 'Future Verb (·syāmi)' : 'Future Verb (·syati)';
        } else if (tenseHint === 'participle') {
          assignedTag = '·ant';
          roleLabel = 'Participle (·ant)';
        } else {
          assignedTag = isFirstPerson ? '·mi' : '·ti';
          roleLabel = isFirstPerson ? 'Present Verb (·mi)' : 'Present Verb (·ti)';
        }
      } else if (!subjectFound && !verbFound) {
        // Noun before verb is Subject
        // Check if next token is also a noun (in which case current is a modifier)
        const nextWord = i + 1 < rawTokens.length ? rawTokens[i + 1].toLowerCase().replace(/[^a-z]/g, '') : null;
        if (nextWord && !['will', 'is', 'was', 'did', 'to', 'in', 'on', 'with', 'from', 'of'].includes(nextWord) && this._isNounOrPronoun(nextWord)) {
          assignedTag = '';
          roleLabel = 'Bare Modifier (him)';
        } else {
          assignedTag = '·ḥ';
          roleLabel = 'Subject (·ḥ)';
          subjectFound = true;
        }
      } else if (verbFound) {
        // Noun after verb is Object or modifier
        const nextWord = i + 1 < rawTokens.length ? rawTokens[i + 1].toLowerCase().replace(/[^a-z]/g, '') : null;
        if (nextWord && this._isNounOrPronoun(nextWord)) {
          assignedTag = '';
          roleLabel = 'Bare Modifier (him)';
        } else {
          assignedTag = '·ṃ';
          roleLabel = 'Direct Object (·ṃ)';
        }
      } else {
        // Bare Modifier / Adjective
        assignedTag = '';
        roleLabel = 'Bare Modifier (him)';
      }

      parsedTokens.push({
        id: parsedTokens.length,
        origWord: orig,
        lemma: lemma,
        sktRoot: sktRoot,
        tag: assignedTag,
        roleLabel: roleLabel,
        pos: pos,
        tagOptions: OmCompiler.ROLES
      });
    }

    // Reorder candidate tokens into canonical Pāṇinian Kāraka order (Kartā -> Karaṇa -> Karma -> Kriyā)
    parsedTokens = this._reorderPaninian(parsedTokens);
    for (let idx = 0; idx < parsedTokens.length; idx++) {
      parsedTokens[idx].id = idx;
    }

    this.currentAST = parsedTokens;
    return this.assembleOmOutput(parsedTokens);
  }

  _reorderPaninian(tokens) {
    const isFiniteVerb = (t) => {
      const tag = t.tag || '';
      return tag === '·ti' || tag === '·mi' || tag === '·si' ||
             tag === '·syati' || tag === '·syāmi' || tag === '·syasi' ||
             tag.startsWith('a·...·') || tag.includes('·ti') || tag.includes('·mi');
    };

    const getPriority = (t, idx, allTokens) => {
      const tag = t.tag;
      if (tag === '') {
        // If bare modifier right before subject, group with subject
        if (idx + 1 < allTokens.length && allTokens[idx + 1].tag === '·ḥ') return 0;
        return 3;
      }
      if (tag === '·ḥ') return 1; // Kartā (Subject)
      if (['·ena', '·bhiḥ', '·ya', '·bhyam', '·āt', '·taḥ', '·sya', '·e', '·su'].includes(tag)) return 2; // Karaṇa & Obliques
      if (tag === '·ṃ') return 3; // Karma (Target / Object)
      if (['·ant', '·ta', '·tvā', '·tum'].includes(tag)) return 4; // Kinetic Opcodes
      if (isFiniteVerb(t)) return 5; // Kriyā (Finite Verb)
      return 3;
    };

    const decorated = tokens.map((t, origIdx) => ({
      prio: getPriority(t, origIdx, tokens),
      origIdx,
      token: t
    }));

    decorated.sort((a, b) => {
      if (a.prio !== b.prio) return a.prio - b.prio;
      return a.origIdx - b.origIdx;
    });

    return decorated.map(d => d.token);
  }

  /**
   * Normalizes Classical Sanskrit / IAST into ॐ-Script blueprint format.
   */
  compileClassical(classicalText) {
    if (!classicalText || !classicalText.trim()) return null;
    let clean = classicalText.trim().replace(/[॥।]+/g, '').trim();

    // Convert Devanagari to IAST if needed
    if (window.omBridge && window.omBridge.isDevanagari && window.omBridge.isDevanagari(clean)) {
      clean = window.omBridge.toIAST(clean);
    }

    const words = clean.split(/\s+/);
    const parsedTokens = [];

    for (let i = 0; i < words.length; i++) {
      let w = words[i].toLowerCase();
      let sktRoot = w;
      let tag = '';

      // 1. Check known classical normalizations
      if (this.classical[w]) {
        const mapped = this.classical[w];
        if (mapped.includes('·')) {
          if (mapped.endsWith('·a·ti') || mapped.endsWith('·ti')) {
            sktRoot = mapped.replace(/·(a·)?ti$/, '');
            tag = '·ti';
          } else if (mapped.endsWith('·a·mi') || mapped.endsWith('·mi')) {
            sktRoot = mapped.replace(/·(a·)?mi$/, '');
            tag = '·mi';
          } else if (mapped.endsWith('·a·si') || mapped.endsWith('·si')) {
            sktRoot = mapped.replace(/·(a·)?si$/, '');
            tag = '·si';
          } else if (mapped.endsWith('·a·anti') || mapped.endsWith('·anti')) {
            sktRoot = mapped.replace(/·(a·)?anti$/, '');
            tag = '·ant';
          } else if (mapped.endsWith('·ḥ')) {
            sktRoot = mapped.slice(0, -2);
            tag = '·ḥ';
          } else if (mapped.endsWith('·ṃ')) {
            sktRoot = mapped.slice(0, -2);
            tag = '·ṃ';
          } else if (mapped.endsWith('·ena')) {
            sktRoot = mapped.slice(0, -4);
            tag = '·ena';
          } else {
            const parts = mapped.split('·');
            sktRoot = parts[0];
            tag = '·' + parts.slice(1).join('·');
          }
        } else {
          sktRoot = mapped;
          tag = '';
        }
      } else if (w.endsWith('aḥ') || w.endsWith('ah')) {
        sktRoot = w.slice(0, -2) + 'a';
        tag = '·ḥ';
      } else if (w.endsWith('am') || w.endsWith('aṃ')) {
        sktRoot = w.slice(0, -2) + 'a';
        tag = '·ṃ';
      } else if (w.endsWith('ena') || w.endsWith('eṇa')) {
        sktRoot = w.slice(0, -3) + 'a';
        tag = '·ena';
      } else if (w.endsWith('āt') || w.endsWith('at')) {
        sktRoot = w.slice(0, -2) + 'a';
        tag = '·āt';
      } else if (w.endsWith('asya')) {
        sktRoot = w.slice(0, -4) + 'a';
        tag = '·sya';
      } else if (w.endsWith('āya') || w.endsWith('aya')) {
        sktRoot = w.slice(0, -3) + 'a';
        tag = '·ya';
      } else if (w.endsWith('e') && w.length > 3) {
        sktRoot = w.slice(0, -1) + 'a';
        tag = '·su';
      } else if (w.endsWith('ati')) {
        sktRoot = w.slice(0, -3);
        tag = '·ti';
      } else if (w.endsWith('āmi') || w.endsWith('ami')) {
        sktRoot = w.slice(0, -3);
        tag = '·mi';
      } else if (w.endsWith('asi')) {
        sktRoot = w.slice(0, -3);
        tag = '·si';
      } else {
        sktRoot = w;
        tag = '';
      }

      const roleMatch = OmCompiler.ROLES.find(r => r.tag === tag);

      parsedTokens.push({
        id: parsedTokens.length,
        origWord: words[i],
        lemma: sktRoot,
        sktRoot: sktRoot,
        tag: tag,
        roleLabel: roleMatch ? roleMatch.label : (tag ? tag : 'Stem'),
        pos: tag.includes('ti') || tag.includes('mi') || tag.includes('si') ? 'v' : 'n',
        tagOptions: OmCompiler.ROLES
      });
    }

    this.currentAST = parsedTokens;
    return this.assembleOmOutput(parsedTokens);
  }

  /**
   * Updates an individual token's tag from the interactive user dropdown.
   */
  updateTokenTag(tokenId, newTag) {
    if (!this.currentAST || !this.currentAST[tokenId]) return null;
    this.currentAST[tokenId].tag = newTag;
    const match = OmCompiler.ROLES.find(r => r.tag === newTag);
    this.currentAST[tokenId].roleLabel = match ? match.label : 'Custom';
    return this.assembleOmOutput(this.currentAST);
  }

  /**
   * Updates an individual token's Sanskrit root from user text edit.
   */
  updateTokenRoot(tokenId, newRoot) {
    if (!this.currentAST || !this.currentAST[tokenId]) return null;
    this.currentAST[tokenId].sktRoot = newRoot.trim();
    return this.assembleOmOutput(this.currentAST);
  }

  /**
   * Assembles the complete ॐ-Script Two-Track output from the token AST.
   */
  assembleOmOutput(tokens) {
    if (!tokens || tokens.length === 0) return null;

    const omWords = [];
    omWords.push('ATHA');

    const isFiniteVerb = (t) => {
      const tag = t.tag || '';
      return tag === '·ti' || tag === '·mi' || tag === '·si' ||
             tag === '·syati' || tag === '·syāmi' || tag === '·syasi' ||
             tag.startsWith('a·...·') || tag.includes('·ti') || tag.includes('·mi');
    };

    const nonVerbs = tokens.filter(t => !isFiniteVerb(t));
    const verbs = tokens.filter(t => isFiniteVerb(t));

    // 1. Process non-verb tokens (Kartā, Karaṇa, Karma, Modifiers, Participles)
    for (let i = 0; i < nonVerbs.length; i++) {
      const t = nonVerbs[i];
      let formattedWord = t.sktRoot;
      if (t.tag && t.tag.startsWith('·')) {
        formattedWord = `${t.sktRoot}${t.tag}`;
      }
      t.formattedWord = formattedWord;
      omWords.push(formattedWord);

      if (t.tag === '') {
        // Bare modifier -> bind with staccato him
        omWords.push('him');
      } else if (t.tag === '·ḥ') {
        // Subject -> hold with hūṃऽऽ
        omWords.push('hūṃऽऽ');
      } else if (t.tag === '·ena' || t.tag === '·bhiḥ') {
        // Instrument -> link with staccato him
        omWords.push('him');
      } else {
        // Oblique / Object -> bridge with hūṃ if another non-verb follows
        if (i < nonVerbs.length - 1) {
          omWords.push('hūṃ');
        }
      }
    }

    // 2. Process finite verb tokens (Kriyā preceded by tonic lock OM)
    for (let i = 0; i < verbs.length; i++) {
      const t = verbs[i];
      let formattedWord = '';

      if (t.tag === 'a·...·t' || t.tag === 'a·...·m' || t.tag === 'a·...·s') {
        const term = t.tag.endsWith('m') ? 'm' : (t.tag.endsWith('s') ? 's' : 't');
        const lastChar = t.sktRoot.slice(-1);
        const buffer = 'aāiīuūṛeo'.includes(lastChar) ? '' : '·a';
        formattedWord = `a·${t.sktRoot}${buffer}·${term}`;
      } else if (t.tag.startsWith('·')) {
        const lastChar = t.sktRoot.slice(-1);
        const buffer = 'aāiīuūṛeo'.includes(lastChar) ? '' : '·a';
        formattedWord = `${t.sktRoot}${buffer}${t.tag}`;
      } else {
        formattedWord = t.sktRoot;
      }

      t.formattedWord = formattedWord;
      omWords.push('OM');
      omWords.push(formattedWord);
    }

    // 3. Final execution halt
    omWords.push('॥');

    // Clean up duplicate spaces
    let compiledString = omWords.join(' ').replace(/\s+/g, ' ').trim();
    compiledString = compiledString.replace(/\s+॥$/, ' ॥');

    // Transliterate into Devanāgarī and Telugu via OmBridge
    let devaOutput = '';
    let teluguOutput = '';
    if (window.omBridge) {
      devaOutput = window.omBridge.iastToDevanagari(compiledString);
      teluguOutput = window.omBridge.iastToTelugu(compiledString);
    }

    return {
      ast: tokens,
      iast: compiledString,
      devanagari: devaOutput,
      telugu: teluguOutput,
      rawTokens: omWords
    };
  }

  // Internal helpers
  _isVerbInLexicon(stem) {
    if (this.overrides[stem] && this.overrides[stem].pos === 'v') return true;
    if (this.lexicon[stem] && (this.lexicon[stem].pos === 'v' || this.lexicon[stem].v)) return true;
    return false;
  }

  _isNounOrPronoun(word) {
    if (this.overrides[word] && ['n', 'pron'].includes(this.overrides[word].pos)) return true;
    if (this.lexicon[word] && this.lexicon[word].pos === 'n') return true;
    return false;
  }

  _isLikelyVerb(word, index, totalLength) {
    const commonVerbs = ['see', 'saw', 'strike', 'struck', 'kill', 'killed', 'protect', 'protected', 'destroy', 'destroyed', 'go', 'went', 'come', 'came', 'do', 'did', 'make', 'give', 'take', 'drink', 'eat', 'say', 'speak', 'tell', 'hear', 'listen', 'live', 'die', 'stand', 'sit', 'fall', 'conquer'];
    if (commonVerbs.includes(word)) return true;
    if (index > 0 && index === totalLength - 2) return true; // second-to-last word in SOV
    return false;
  }
}

// Attach to window for global access
window.omCompiler = new OmCompiler();
