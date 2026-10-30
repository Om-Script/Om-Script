# Varṇagul 3.1: The Definitive Script Specification & 8-Day Bootcamp

**Document Class:** Technical Specification & Pedagogical Manual  
**Version:** 3.1 (Normative)  
**Language Track:** ॐ-Script Mode 2 (Human Interface & Syllabic Composition)  
**Target Audience:** Readers, Typists, Font Engineers, and Computational Linguists  
**Scope Note:** This volume serves as the dedicated curriculum for the standalone *Varṇagul Script* volume (Companion Track).

---

# Part I: The Varṇagul 3.1 Script Specification

## 1. Core Philosophy

Varṇagul is the **visual and compositional interface (Mode 2)** for the ॐ-Script engine.

1. **Articulatory Transparency:** Every glyph is derived from anatomical mouth positions (Place × Effort). Nothing is memorized arbitrarily.
2. **The Block is the Morpheme:** Syllabic blocks visually encapsulate morphemic boundaries. The 2D bounding box acts as the API boundary, eliminating the need for destructive *Sandhi* contractions.
3. **Unicode Native:** Varṇagul maps strictly to standard Unicode Korean Hangul Jamo combined with standard diacritics (`U+0323` dot below, `U+0307` dot above). It renders cleanly on any modern mobile device, browser, or terminal without requiring proprietary fonts.
4. **Graceful Precision Scaling:**
   - **Layer 0 (Canonical):** Modern Jamo + standard Unicode combining marks.
   - **Layer 1 (Portable):** Clean, composed Hangul syllabic blocks.
   - **Layer 2 (Styled):** OpenType layout deploying the 100/75 typographic hierarchy via Variation Selector-1 (`U+FE00`).

---

## 2. The 3-Zone Syllabic Docking Architecture

Unlike linear alphabets (like Latin or English) where letters are strung out flat along a single 1D wire, Varṇagul structures sounds into a **2D architectural frame** consisting of three distinct functional zones:

```text
+-------------------------------------------------------------------------+
|  ZONE 1: CONSONANT ONSET (The Place of Articulation)                    |
|          Velar (ㄱ), Palatal (ㅈ), Retroflex (ㄷ̣), Dental (ㄷ), Labial (ㅂ) |
+-------------------------------------------------------------------------+
|  ZONE 2: VOWEL RAIL (The Vector of Breath Flow)                         |
|          Horizontal Axis (ㅡ, ㅗ, ㅜ, ㅛ, ㅠ) or Vertical Axis (ㅏ, ㅓ, ㅣ, ㅐ)     |
+-------------------------------------------------------------------------+
|  ZONE 3: CODA FLOOR (Batchim — Dead Consonants & Resonances)           |
|          Object Tag (-ㅁ), Stem Stop (-ㄷ, -ㄱ), or Nasal Coda (-ㅇ)          |
+-------------------------------------------------------------------------+
```

### The Essential Consonant Docking Rule

A common beginner confusion occurs when looking at isolated vowel tables. In Korean Hangul architecture:
- **A vowel cannot float alone in empty space.** It *must* dock onto an initial consonant onset.
- When an alphabet chart shows **`규`**, that is **not** the isolated vowel *ū*; that is the consonant **`k` (`ㄱ`)** combined with the vowel **`ū` (`ㅠ`)**:
  `ㄱ (k) + ㅠ (ū) = 규 (kū)`

When you change the initial consonant, the vowel rail remains identical while the onset shifts:

```text
Consonant Onset        Vowel Rail          Composed Syllable Block       IAST Meaning
-------------------    ----------------    -----------------------       ------------
Velar 'k' (ㄱ)         + Long 'ū' (ㅠ)  =  규                            kū
Palatal/Sibilant (ㅅ)  + Long 'ū' (ㅠ)  =  슈                            śū (or sū)
Dental 't' (ㄷ)        + Long 'ū' (ㅠ)  =  듀                            tū
Labial 'p' (ㅂ)        + Long 'ū' (ㅠ)  =  뷰                            pū
Silent Carrier (ㅇ)    + Long 'ū' (ㅠ)  =  유                            ū (Word-initial)
```

### Why Varṇagul Has Zero Apostrophes (`'`) or Floating Accents

In early drafts, theorists experimented with combining accents (like `ㅅ́`) to distinguish the palatal sibilant `ś` (श) from the dental `s` (स). In Varṇagul 3.1, **all floating apostrophes and accents are abolished**:
- In Korean phonology, the sibilant **`ㅅ`** is **naturally and automatically palatalized** into `[ɕ]` (the exact sound of Sanskrit `ś`) whenever it meets a palatal vowel (`ㅑ, ㅕ, ㅛ, ㅠ, ㅣ`).
- Therefore:
  - *śūra* (hero) is written as **슈라** (clean, unaccented block).
  - *viśāla* (vast) is written as **위샬라**.
  - *aśva* (horse) is written as **아솨**.
  - *śatru* (enemy) is written as **샤트루**.

---

## 3. The Master Praṇava ⟷ Varṇagul Rosetta Stone

If ॐ-Script is the geometry of *meaning*, **Praṇava Script** (*Appendix F*) is the physical geometry of *sound*, and **Varṇagul 3.1** is the digital *implementation*. The following matrices provide the unified Rosetta Stone linking Pāṇini’s articulatory physics directly to Varṇagul’s typable Unicode blocks.

> **Important Architectural Note: The Dual-Register System**  
> To balance universal mobile keyboard typability with computational precision, Varṇagul operates in two complementary registers:  
> 1. **The Everyday Mode (27-Phoneme Subset):** Uses standard modern Korean phone keyboards with **zero combining diacritics**. Retroflexes collapse to dentals (`ㄷ, ㅌ, ㄸ, ㄴ`), voiced aspirates collapse to aspirated stops (`ㅋ, ㅊ, ㅌ, ㅍ`), and both `a` and `ā` use `ㅏ`. Designed for rapid typing, mobile messaging, and intuitive learning.  
> 2. **The Lossless Extended Mode (50-Phoneme Scholarly Set):** Adds systematic Unicode diacritics (`U+0323` dot-below for retroflexes `ㄷ̣`, `U+0307` dot-above for voiced aspirates `ㅋ̇`, and `ㅓ` for `ā`). Designed for exact Pāṇinian phonological reconstruction, NLP parsers, and lossless decompilation back to Devanāgarī.

### 3.1 The 5×5 Consonant Matrix (*Sparśa*)

```text
========================================================================================================================
Place / Varga        Mouth Station       1. Plain (Unvoiced)   2. Aspirated     3. Voiced        4. Voiced Asp.   5. Nasal
========================================================================================================================
1. VELAR (Throat)    Soft Palate & Cavity
   - IAST:                               k                     kh               g                gh               ṅ
   - Praṇava (Vector):                   □                     □'               □•               □•'              □~
   - Everyday Typable (27-Set):          ㄱ                    ㅋ               ㄲ               ㅋ               ㅇ
   - Lossless Extended (50-Set):         ㄱ                    ㅋ               ㄲ               ㅋ̇                ㅇ

2. PALATAL (Palate)  Tongue Arch on Roof
   - IAST:                               c                     ch               j                jh               ñ
   - Praṇava (Vector):                   △                     △'               △•               △•'              △~
   - Everyday Typable (27-Set):          ㅈ                    ㅊ               ㅉ               ㅊ               ㄴ
   - Lossless Extended (50-Set):         ㅈ                    ㅊ               ㅉ               ㅊ̇                ㄴ̃

3. RETROFLEX (Roof)  Curled Tongue at Dome
   - IAST:                               ṭ                     ṭh               ḍ                ḍh               ṇ
   - Praṇava (Vector):                   ⌒                     ⌒'               ⌒•               ⌒•'              ⌒~
   - Everyday Typable (27-Set):          ㄷ                    ㅌ               ㄸ               ㅌ               ㄴ
   - Lossless Extended (50-Set):         ㄷ̣                    ㅌ̣               ㄸ̣               ㅌ̣̇               ㄴ̣

4. DENTAL (Teeth)    Tongue Flat on Teeth
   - IAST:                               t                     th               d                dh               n
   - Praṇava (Vector):                   |                     |'               |•               |•'              |~
   - Everyday Typable (27-Set):          ㄷ                    ㅌ               ㄸ               ㅌ               ㄴ
   - Lossless Extended (50-Set):         ㄷ                    ㅌ               ㄸ               ㅌ̇                ㄴ

5. LABIAL (Lips)     Forward Lip Barrier
   - IAST:                               p                     ph               b                bh               m
   - Praṇava (Vector):                   ○                     ○'               ○•               ○•'              ○~
   - Everyday Typable (27-Set):          ㅂ                    ㅍ               ㅃ               ㅍ               ㅁ
   - Lossless Extended (50-Set):         ㅂ                    ㅍ               ㅃ               ㅍ̇                ㅁ
========================================================================================================================
```

### 3.2 Semivowels (*Antastha*), Sibilants (*Ūṣman*) & Glottals

```text
========================================================================================================================
Class / Sound        Station             IAST     Praṇava (Vector)    Everyday Mode       Lossless Set     Notes
========================================================================================================================
SEMIVOWELS (Flow)
- Palatal Glide      Hard Palate         y        △≈ (Palate Flow)    ㅑ, ㅕ, ㅛ, ㅠ      ㅑ-glide         Intrinsic glide on vowels
- Retroflex Liquid   Roof Dome           r        ⌒≈ (Dome Flow)      ㄹ                 ㄹ               Standard liquid onset / coda
- Dental Lateral     Teeth Barrier       l        |≈ (Teeth Flow)     ㄹ (double ㄹ)     ㄹ               Clean Hangul: 파라, 알파, 위샬라
- Labial Glide       Lips                v        ○≈ (Lip Flow)       ㅘ, ㅝ, ㅟ          ㅘ, ㅝ, ㅟ        Native labial glides: 와나, 아솨

SIBILANTS & GLOTTAL (Friction)
- Palatal Sibilant   Hard Palate         ś        △/ (Palate Slash)   ㅅ (with palatal)   ㅅ (with palatal) Clean Hangul: 슈 (śū), 샤 (śa)
- Retroflex Sibilant Roof Dome           ṣ        ⌒/ (Dome Slash)     ㅆ                 ㅆ               Tense retroflex fricative
- Dental Sibilant    Teeth Barrier       s        |/ (Teeth Slash)    ㅅ                 ㅅ               Standard dental fricative
- Glottal / Throat   Deep Throat         h        □/ (Throat Slash)   ㅎ                 ㅎ               Unvoiced breath friction
========================================================================================================================
```

### 3.3 The Vowel & Sandhi Matrix (*Svara*)

> **Vowel Register Architecture:**  
> - **Everyday Mode (27-Set):** Both short `a` and long `ā` collapse into **`ㅏ`** (`가, 사, 아`). This avoids the non-Sanskrit Korean `ㅓ` ("uh") pronunciation and mirrors natural speech where context clarifies length.  
> - **Lossless Extended Set (50-Set):** `ā` is assigned **`ㅓ`** (`거, 서, 어`) specifically for computational decompilers, NLP tokenizers, and scholarly texts requiring exact round-trip conversion to Devanāgarī.

```text
===========================================================================================================================================
Vowel Category       IAST   Praṇava Vector Dynamics           Everyday Mode      Lossless Set       k-series (ㄱ)     s/ś-series (ㅅ)   Standalone (ㅇ)
===========================================================================================================================================
BASIC VOWELS
- Short Neutral      a      →   (Horizontal forward flow)     ㅏ                 ㅏ                 가 (ka)           사 (sa)           아 (a)
- Long Neutral       ā      ↠   (Double-length forward flow)  ㅏ (collapses)     ㅓ (distinct ā)    가 / 거 (kā)      사 / 서 (sā)      아 / 어 (ā)
- Short High Palate  i      ↑   (Vertical upward ascent)      ㅣ                 ㅣ                 기 (ki)           시 (śi)           이 (i)
- Long High Palate   ī      ⇈   (Double vertical ascent)      ㅐ                 ㅐ                 개 (kī)           새 (śī)           애 (ī)
- Short Low Labial   u      ↓   (Forward downward descent)    ㅜ                 ㅜ                 구 (ku)           수 (su)           우 (u)
- Long Low Labial    ū      ⇊   (Double downward descent)     ㅠ                 ㅠ                 규 (kū)           슈 (śū)           유 (ū)

VOCALIC LIQUIDS
- Retroflex Liquid   ṛ      ↺   (Retroflex spin/loop)         ㅡ                 ㅡ                 그 (kṛ)           스 (sṛ)           으 (ṛ)
- Long Retroflex     ṝ      ⇋   (Double retroflex loop)       ㅢ                 ㅢ                 긔 (kṝ)           스이 (sṝ)         의 (ṝ)
- Dental Liquid      ḷ      ↻   (Dental forward spin)         ㅡ + -ㄹ (coda)    ㅡ + -ㄹ (coda)    글 (kḷ)           슬 (sḷ)           을 (ḷ)
- Long Dental        ḹ      ⇋   (Double dental loop)          ㅢ + -ㄹ (coda)    ㅢ + -ㄹ (coda)    긜 (kḹ)           스일 (sḹ)         읠 (ḹ)

FUSION VOWELS (Sandhi Vectors)
- Light Palatal      e      ↗   (Vector sum: → + ↑ = ↗)       ㅔ                 ㅔ                 게 (ke)           세 (śe)           에 (e)
- Heavy Palatal      ai     ⇗   (Heavy upward charge: ↠ + ↑)  ㅖ                 ㅖ                 계 (kai)          셰 (śai)          예 (ai)
- Light Labial       o      ↘   (Vector sum: → + ↓ = ↘)       ㅗ                 ㅗ                 고 (ko)           소 (so)           오 (o)
- Heavy Labial       au     ⇘   (Heavy downward charge: ↠ + ↓)ㅛ                 ㅛ                 교 (kau)          쇼 (śau)          요 (au)
===========================================================================================================================================
```

---

## 4. Syllabic Block Architecture & Cluster Rules

1. **The Coda Lock (*Batchim*):** Syllable-final consonants dock directly into the bottom coda slot of the block.
   - `gam` → **감** (*k* + *a* + *m*)
   - `phalam` → **파람** (*ph* + *a* + *l* + *a* + *m*)
   - `jagat` → **자갇** (or **자갓**)
2. **The Neutral Carrier `ㅡ` (Eliminating All Kill-Switch Hacks):**
   - ASCII apostrophes (`'`) and virāmas are abolished.
   - When consonants cluster without an intervening vowel, the neutral carrier **`ㅡ`** provides the structural carrier:
     - `pra` → **프라**
     - `strī` → **슽래** (or `스트래`)
     - `kṣa` → **그싸**
     - `rakṣ` → **랔스**
3. **Morpheme-Level Isolation:** Stems and tags maintain visual autonomy. The right boundary of the block marks the morphological boundary.

---

## 5. Grammatical Modules & Role Tags

```text
========================================================================================================================
Grammatical Role            IAST Tag    Varṇagul Block / Mark    Example Word        Varṇagul Output
========================================================================================================================
Subject (Actor)             ·ḥ          ঃ (Visarga)              nara·ḥ              나라ঃ
Object (Target)             ·ṃ          -ㅁ (Coda) / °           phala·ṃ             파람
Tool (Instrumental)         ·bhiḥ       비ঃ                      śara·bhiḥ           사라비ঃ
Receiver (Dative)           ·bhyam      뱜                      muni·bhyam          무니뱜
Origin (Ablative)           ·taḥ        타ঃ                      giri·taḥ            기리타ঃ
Possessor (Genitive)        ·sya        샤                      rāja·sya            라자샤
Environment (Locative)      ·su         수                      vana·su             와나수
Plural Injector             ·nām·       냠 / 남                 nara·nām·sya        나라냠샤
Vowel Buffer                ·a·         아                      gam·a·ti            감아디
========================================================================================================================
```

---

## 6. The Seven Universal Stem Converters

To turn verbal roots into nouns and derive secondary abstract concepts without rote memorization, Varṇagul deploys seven modular converters across two tiers:

```text
========================================================================================================================
Converter   Structural Tier              Semantic Role                  Varṇagul   Example Derivation
========================================================================================================================
·tṛ         Tier 1 (Root — Kṛt)          The Actor / Agent (Doer)       트리       rakṣ·a·tṛ → 랔아트리 (Protector)
·na         Tier 1 (Root — Kṛt)          The Act / Concept / System     나         rakṣ·a·na → 랔아나 (Defense System)
·ta         Tier 1 (Root — Kṛt)          The Artifact / Completed State 타         rakṣ·a·ta → 랔아타 (Protected Ward)
·ka         Tier 2 (Stem — Taddhita)     Diminutive / Resemblance       가         aśva·ka → 아솨가 (Pony / Little Horse)
·tva        Tier 2 (Stem — Taddhita)     Abstract State (-ness)         돠         śubha·tva → 수파돠 (Goodness / Purity)
·tā         Tier 2 (Stem — Taddhita)     Abstract Quality (-ity)        터         mahā·tā → 마하터 (Greatness / Magnanimity)
·in         Tier 2 (Stem — Taddhita)     Possessor / Endowed Entity     인         guṇa·in → 구나인 (Virtuous Person)
========================================================================================================================
```

---

## 7. Breath Track & Bīja Sigils

| Bīja Macro | Function | Varṇagul Glyphs |
| :--- | :--- | :---: |
| **ATHA** | System Boot / Clause Open | **〔아타〕** (or **❖**) |
| **OM** | Action Execution Threshold | **ॐ** |
| **SVĀHĀ** | Memory Flush / Finality | **【솨하】** |
| **hīṃ** | High-Frequency Modifier Bridge | **₍햄°₎** (or **햄**) |
| **hūṃ** | Low-Frequency Grounding Anchor | **₍흄°₎** (or **훔**) |
| **him / hum** | 16th-Note Staccato Bridge | **힘** / **훔** |
| **hūṃऽऽ** | Quarter-Note Mid-Cadence | **₍흄–₎** |
| **hūṃ३** | Half-Note Pre-Verbal Fermata | **₍흄≡₎** |
| **॥ / ।** | Verse / Clause Terminators | **॥** / **।** |

---

# Part II: The 8-Day Varṇagul Bootcamp

### Learning ॐ-Script in One Week Through Dual Notation

The ॐ-Script architecture eliminates 63-slot declension grids, irregular conjugation classes, and destructive sandhi mutations. This bootcamp teaches you two synchronized modes:
1. **Mode 1 (Canonical IAST):** The machine mode using middle dots (`·`) for deterministic parsing.
2. **Mode 2 (Varṇagul 3.1):** The human visual mode using 2D syllabic blocks for intuitive writing and typing.

---

### Day 0: The Acoustic Blueprint & Syllabic Docking Architecture

**Goal:** Understand how sounds physically assemble into 2D syllabic blocks before building vocabulary.

#### 1. The Anatomy of a Block
Every Varṇagul syllable is an architectural triad:
- **Top / Left:** Consonant Onset (Where in the mouth the air is shaped)
- **Middle / Right:** Vowel Rail (How the breath vector expands)
- **Bottom Floor:** Coda / *Batchim* (Where the syllable closes)

#### 2. Mastering the Onset Shift
Watch what happens when we attach the exact same vowel **`ū` (`ㅠ`)** to different consonants:
- `k` (ㄱ) + `ū` (ㅠ) = **규** (`kū`)
- `ś` (ㅅ) + `ū` (ㅠ) = **슈** (`śū`)
- `t` (ㄷ) + `ū` (ㅠ) = **듀** (`tū`)
- `p` (ㅂ) + `ū` (ㅠ) = **뷰** (`pū`)
- `∅` (ㅇ) + `ū` (ㅠ) = **유** (`ū` standalone)

#### 3. Closing the Syllable (Batchim Floor)
To close a syllable with a dead consonant, simply place it at the bottom:
- `k` + `a` + `m` = **감** (`kam`)
- `p` + `a` + `t` = **받** (`pat`)
- `r` + `a` + `k` = **랔** (`rak`)

#### Exercises
1. Assemble the block for `k` + `i`: `ㄱ` + `ㅣ` = ? *(Answer: **기**)*
2. Assemble the block for `ś` + `ū` + `r` + `a`: `ㅅ`+`ㅠ` followed by `ㄹ`+`ㅏ` = ? *(Answer: **슈라**)*
3. Close the block for `n` + `a` + `m`: `ㄴ` + `ㅏ` + `ㅁ` = ? *(Answer: **남**)*

---

### Day 1: The Architecture of Action

**Yesterday’s Review:**  
1. How does `kū` assemble? *Answer: **규** (`ㄱ` + `ㅠ`)*  
2. How does `śū` assemble? *Answer: **슈** (`ㅅ` + `ㅠ`)*  
3. Where does a final dead consonant dock? *Answer: At the bottom floor (Batchim).*

#### The Lesson
In ॐ-Script, roots are immutable data blocks. They never mutate.

| Root | Meaning | Type | Canonical IAST | Varṇagul 3.1 |
| :--- | :--- | :--- | :---: | :---: |
| **nara** | Man | Noun Stem | `nara` | **나라** |
| **aśva** | Horse | Noun Stem | `aśva` | **아솨** |
| **phala** | Fruit | Noun Stem | `phala` | **파라** |
| **√khād** | To eat | Action Root | `khād` | **카다** (or **칻**) |
| **√dṛś** | To see | Action Root | `dṛś` | **드르스** |

#### Assigning Roles to Nouns
- **Subject (The Actor):** Snap on **·ḥ** (IAST) / **ঃ** (Varṇagul Visarga).
  - *nara·ḥ* → **나라ঃ** (The man acts)
  - *aśva·ḥ* → **아솨ঃ** (The horse acts)
- **Object (The Target):** Snap on **·ṃ** (IAST) / **-ㅁ** coda (Varṇagul Anusvāra).
  - *phala·ṃ* → **파람** (The fruit is targeted)
  - *aśva·ṃ* → **아솸** (The horse is targeted)

#### Assembling the Action Verb
Verbs snap on the 3rd-person present terminator **·ti** (**디** / **티**). When the root ends in a consonant, the neutral **-a-** buffer (**아**) deploys automatically:
- *khād* + *a* + *ti* → **khād·a·ti** / **카다티** (Eats)
- *dṛś* + *a* + *ti* → **dṛś·a·ti** / **드르샤티** (Sees)

#### The Complete Sentence
> **IAST:** `ATHA nara·ḥ hūṃ phala·ṃ hūṃ OM khād·a·ti SVĀHĀ ॥`  
> **Varṇagul:** 〔아타〕 **나라ঃ** 훔 **파람** 훔 ॐ **카다티** 【솨하】 ॥  
> *(The man eats the fruit.)*

#### Exercises
1. Write in IAST: The horse (aśva·ḥ) sees (dṛś·a·ti) the man (nara·ṃ).
2. Write in Varṇagul: The man (nara·ḥ) sees the fruit (phala·ṃ).

*Answer Key:*
1. `aśva·ḥ nara·ṃ dṛś·a·ti`
2. `나라ঃ 파람 드르샤티`

---

### Day 2: Expanding the World (Modifiers & Direction)

**Yesterday’s Review:**  
1. What tag marks the Actor/Subject? *Answer: **·ḥ** / **ঃ***  
2. What is the 3rd-person present verb ending? *Answer: **·ti** / **티***

#### The Lesson
Modifiers (adjectives) carry no case endings. They sit bare to the left of the noun and pass their descriptors forward.

| Modifier | Meaning | Varṇagul Block | Example Compound |
| :--- | :--- | :---: | :--- |
| **śūra** | Brave | **슈라** | *śūra nara·ḥ* → **슈라 나라ঃ** (The brave man) |
| **viśāla** | Vast / Giant | **위샬라** | *viśāla aśva·ḥ* → **위샬라 아솨ঃ** (The giant horse) |
| **kṛṣṇa** | Dark / Black | **크르스나** | *kṛṣṇa phala·ṃ* → **크르스나 파람** (The dark fruit) |

#### The High-Frequency Bridge (*hīṃ*)
Use the light, high-frequency bridge *hīṃ* (**햄**) to chain adjectives rapidly:
> **IAST:** `śūra hīṃ viśāla hīṃ aśva·ḥ hūṃऽऽ`  
> **Varṇagul:** **슈라** 햄 **위샬라** 햄 **아솨ঃ** 훔–  
> *(The brave, vast horse...)*

#### Spatial Prefixes (*Upasargas*)
Prefixes stack cleanly to the left of the verb root without altering its vowels:
- **pra-** (forward / intense): *pra dṛś·a·ti* / **프라 드르샤티** (Foresees)
- **ud-** (upward): *ud dṛś·a·ti* / **웉 드르샤티** (Looks up)

#### Exercises
1. Write in IAST: The brave horse looks up at the vast dark mountain (giri·ṃ).
2. Write in Varṇagul: The vast horse eats the small (alpa) fruit.

*Answer Key:*
1. `śūra aśva·ḥ viśāla kṛṣṇa giri·ṃ ud dṛś·a·ti`
2. `위샬라 아솨ঃ 알파 파람 카다티`

---

### Day 3: Time and the Verb Engine

**Yesterday’s Review:**  
1. What bridge chains bare modifiers? *Answer: **hīṃ** / **햄***  
2. Name the prefix for forward/advanced direction. *Answer: **pra-** / **프라***

#### The Lesson
In ॐ-Script, the root never changes across tenses. Time is an independent module that docks between the root and the person terminator:

| Time State | Module | Canonical Formula (*√gam*) | Varṇagul Block | English Meaning |
| :--- | :---: | :--- | :---: | :--- |
| **Present** | *(none)* | *gam·a·ti* | **감아티** | goes |
| **Past** | **·tava·** | *gam·a·tava·ti* | **감아타와티** | went |
| **Future** | **·sya·** | *gam·a·sya·ti* | **감아샤티** | will go |
| **Imperative**| **·tavya·**| *gam·a·tavya·ti* | **감아타뱌티** | must go / should go |

Notice how the root `gam` remains frozen in the block **감** throughout all four time states.

#### Exercises
1. Write in IAST: The cruel (krūra) king (rāja·ḥ) will destroy (vi naś·a·sya·ti) the mountain (giri·ṃ).
2. Write in Varṇagul: The man went (gam·a·tava·ti).

*Answer Key:*
1. `krūra rāja·ḥ giri·ṃ vi naś·a·sya·ti`
2. `나라ঃ 감아타와티`

---

### Day 4: The Peripheral Roles (The 7 Cases)

**Yesterday’s Review:**  
1. What module marks the past completed action? *Answer: **·tava·** / **타와***  
2. What module marks the future action? *Answer: **·sya·** / **샤***

#### The Lesson
Beyond Subject (**·ḥ** / **ঃ**) and Object (**·ṃ** / **-ㅁ**), five universal role tags handle all spatial, causal, and relational functions. They snap cleanly onto any noun stem:

| Role | Meaning | IAST Tag | Varṇagul Block | Canonical Example |
| :--- | :--- | :---: | :---: | :--- |
| **Tool** | By means of / With | **·bhiḥ** | **비ঃ** | *śara·bhiḥ* → **사라비ঃ** (With arrows) |
| **Receiver** | To / For | **·bhyam** | **뱜** | *muni·bhyam* → **무니뱜** (For the sage) |
| **Origin** | From / Out of | **·taḥ** | **타ঃ** | *giri·taḥ* → **기리타ঃ** (From the mountain) |
| **Possessor** | Of / Belonging to | **·sya** | **샤** | *rāja·sya* → **라자샤** (Of the king) |
| **Environment** | In / At / On | **·su** | **수** | *vana·su* → **와나수** (In the forest) |

#### The Grand Tapestry Worked Sentence
> **IAST:** `ATHA giri·taḥ hūṃ vana·su hūṃ krūra hīṃ rāja·ḥ hūṃऽऽ śara·bhiḥ hum śūra hīṃ yodha·ṃ hūṃ३ OM pra har·a·tava·ti SVĀHĀ ॥`  
> **Varṇagul:** 〔아타〕 **기리타ঃ** 훔 **와나수** 훔 **크루라** 햄 **라자ঃ** 훔– **사라비ঃ** 힘 **슈라** 햄 **요담** 훔≡ ॐ **프라 하라타와티** 【솨하】 ॥  
> *(From the mountain, in the forest, the cruel king struck the brave warrior with an arrow.)*

#### Exercises
1. Write in IAST: In the forest (vana·su), the man (nara·ḥ) sees (dṛś·a·ti) the horse (aśva·ṃ).
2. Write in Varṇagul: The king gives (dā·a·ti) the fruit to the sage.

*Answer Key:*
1. `vana·su nara·ḥ aśva·ṃ dṛś·a·ti`
2. `라자ঃ 파람 무니뱜 다아티`

---

### Day 5: The Bīja Acoustic Protocol

**Yesterday’s Review:**  
1. What tag marks the Environment (in/at)? *Answer: **·su** / **수***  
2. What tag marks the Tool (with/by)? *Answer: **·bhiḥ** / **비ঃ***

#### The Lesson
Without Sandhi to glue words together, ॐ-Script deploys the **Bīja Acoustic Protocol** to provide rhythm, breath control, and emotional cadence.

| Musical Value | IAST Notation | Varṇagul Glyph | Functional Purpose |
| :--- | :--- | :---: | :--- |
| **16th Note** | *him* / *hum* | **힘** / **훔** | Rapid staccato modifier chaining. |
| **8th Note** | *hīṃ* / *hūṃ* | **햄** / **훔** | Standard narrative grounding. |
| **Quarter Note** | *hūṃऽऽ* | **훔–** | Clause closure and rhythmic rest. |
| **Half Note** | *hūṃ३* | **훔≡** | Maximum tension immediately before the verb. |

#### Chanting Comparison
- **Monotonic (No Bījas):** *krūra rāja·ḥ viśāla kṛṣṇa senā·ṃ vi naś·a·tava·ti.* (Robotic)
- **Epic Acoustic Chant:**  
  > **IAST:** `krūra him rāja·ḥ hūṃऽऽ viśāla hum kṛṣṇa him senā·ṃ hūṃ३ OM vi naś·a·tava·ti SVĀHĀ ॥`  
  > **Varṇagul:** **크루라** 힘 **라자ঃ** 훔– **위샬라** 훔 **크르스나** 힘 **세남** 훔≡ ॐ **위 나샤타와티** 【솨하】 ॥

---

### Day 6: Nominalization & The Seven Universal Stem Converters

**Yesterday’s Review:**  
Which tempo marks maximum tension immediately before the verb threshold? *Answer: **hūṃ३** / **훔≡***.

#### The Lesson
Instead of memorizing hundreds of thousands of independent nouns, you generate nouns dynamically using **Seven Universal Stem Converters** operating across two tiers:

#### Tier 1: Root Converters (Primary Derivation — *Kṛt*)
Applied to verbal roots with an optional neutral `-a-` buffer:
1. **The Actor Module (·tṛ / 트리):**  
   *rakṣ* + *a* + *tṛ* → **rakṣatṛ** / **랔아트리** (Protector / Defender)
2. **The Act Module (·na / 나):**  
   *rakṣ* + *a* + *na* → **rakṣana** / **랔아나** (Protection / Defense System)
3. **The Artifact Module (·ta / 타):**  
   *rakṣ* + *a* + *ta* → **rakṣata** / **랔아타** (Protected Thing / Ward)

#### Tier 2: Stem Converters (Secondary Derivation — *Taddhita*)
Applied to existing noun and adjective stems:
4. **The Diminutive Module (·ka / 가):**  
   *aśva* (horse) + *ka* → **aśvaka** / **아솨가** (Little horse / Pony)
5. **The Abstract State Module (·tva / 돠):**  
   *śubha* (good) + *tva* → **śubhatva** / **수파돠** (Goodness / State of purity)
6. **The Abstract Quality Module (·tā / 터):**  
   *mahā* (great) + *tā* → **mahātā** / **마하터** (Greatness / Magnanimity)
7. **The Possessor Entity Module (·in / 인):**  
   *guṇa* (virtue) + *in* → **guṇain** / **구나인** (Virtuous person)

#### A Worked Sentence
> **IAST:** `ATHA śūra yudh·a·tṛ·ḥ hūṃऽऽ viśāla rakṣ·a·na·ṃ hūṃ३ OM pari dṛś·a·tava·ti SVĀHĀ ॥`  
> **Varṇagul:** 〔아타〕 **슈라 유다트리ঃ** 훔– **위샬라 랔아남** 훔≡ ॐ **파리 드르샤타와티** 【솨하】 ॥  
> *(The brave fighter fully observed the vast fortress.)*

#### Exercises
1. Write in Varṇagul: The protector (rakṣ·a·tṛ·ḥ) sees (dṛś·a·ti) the reading (paṭh·a·na·ṃ).
2. Write in Varṇagul: The little horse (aśva·ka·ḥ) sees goodness (śubha·tva·ṃ).

*Answer Key:*
1. `랔아트리ঃ 파타남 드르샤티`
2. `아솨가ঃ 수파돰 드르샤티`

---

### Day 7: Full Narrative Execution

**Yesterday’s Review:**  
1. Name the four Tier 2 Stem Converters. *Answer: **·ka** (가), **·tva** (돠), **·tā** (터), **·in** (인)*  
2. What does ·tva create? *Answer: Abstract state (-ness / -hood)*

#### The Lesson
Today you graduate. You will execute a complete three-sentence epic narrative using the full ॐ-Script and Varṇagul 3.1 architecture.

#### The Epic Narrative
> *“From the dark mountain, the brave female fighter observed the vast fortress of the cruel king. With a swift arrow, she utterly destroyed the wooden gate. The tyrant will fall.”*

#### Step-by-Step Lexical Assembly

**Sentence 1: The Observation**
- Origin: *kṛṣṇa giri·taḥ* → **크르스나 기리타ঃ**
- Subject: *śūra strī yudh·a·tṛ·ḥ* → **슈라 스트래 유다트리ঃ**
- Possessor: *krūra rāja·sya* → **크루라 라자샤**
- Object: *viśāla rakṣ·a·na·ṃ* → **위샬라 랔아남**
- Verb (Past): *pari dṛś·a·tava·ti* → **파리 드르샤타와티**

> **IAST:** `ATHA kṛṣṇa giri·taḥ hūṃ śūra strī yudh·a·tṛ·ḥ hūṃऽऽ krūra rāja·sya hūṃ viśāla rakṣ·a·na·ṃ hūṃ३ OM pari dṛś·a·tava·ti SVĀHĀ ॥`  
> **Varṇagul:** 〔아타〕 **크르스나 기리타ঃ** 훔 **슈라 스트래 유다트리ঃ** 훔– **크루라 라자샤** 훔 **위샬라 랔아남** 훔≡ ॐ **파리 드르샤타와티** 【솨하】 ॥

**Sentence 2: The Strike**
- Tool: *śīghra śara·bhiḥ* → **시그라 사라비ঃ**
- Object: *kāṣṭha dvāra·ṃ* → **카스타 드와람**
- Verb (Past): *vi naś·a·tava·ti* → **위 나샤타와티**

> **IAST:** `ATHA śīghra śara·bhiḥ hūṃऽऽ kāṣṭha dvāra·ṃ hūṃ३ OM vi naś·a·tava·ti SVĀHĀ ॥`  
> **Varṇagul:** 〔아타〕 **시그라 사라비ঃ** 훔– **카스타 드와람** 훔≡ ॐ **위 나샤타와티** 【솨하】 ॥

**Sentence 3: The Prophecy**
- Subject: *krūra śās·a·tṛ·ḥ* → **크루라 샤사트리ঃ**
- Verb (Future): *ava pat·a·sya·ti* → **아와 파타샤티**

> **IAST:** `ATHA krūra śās·a·tṛ·ḥ hūṃऽऽ OM ava pat·a·sya·ti SVĀHĀ ॥`  
> **Varṇagul:** 〔아타〕 **크루라 샤사트리ঃ** 훔– ॐ **아와 파타샤티** 【솨하】 ॥

---

## Graduation & Master Cheat Sheet

You have mastered the complete dual-track engine:
- **7 Role Tags:** `·ḥ` (ঃ), `·ṃ` (-ㅁ), `·bhiḥ` (비ঃ), `·bhyam` (뱜), `·taḥ` (타ঃ), `·sya` (샤), `·su` (수)
- **4 Time Modules:** Present (plain), Past (`·tava·`), Future (`·sya·`), Imperative (`·tavya·`)
- **7 Universal Stem Converters:** `·tṛ`, `·na`, `·ta`, `·ka`, `·tva`, `·tā`, `·in`
- **Bīja Acoustic Control:** Continuous rhythm without Sandhi degradation.

*ATHA. The memory is clear. OM. The engine is yours. SVĀHĀ.* ॥
