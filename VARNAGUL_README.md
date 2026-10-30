# Varṇagul Script (Mode 2 — ॐ-Script)
### Sovereign Syllabic Block Architecture & Design Manifesto

**Status:** Autonomous Companion Track  
**Engine Version:** Varṇagul 3.1 (Normative)  
**Parent Project:** ॐ-Script / Sanskrit Zero  
**Scope Note:** This directory houses the complete specification, 7-day curriculum, interactive web tools, and Python compilers for the **Varṇagul Scripting Language**. As designated by project architecture, this curriculum is preserved as an independent track for a future standalone volume and is deliberately excluded from the Book 1 and Book 2 Amazon KDP print compilation (`convert_to_kdp.py`).

---

## 0. The Design Manifesto: Visual Sovereignty vs. The Korean Resemblance

> **Prompt:**  
> *"As an advantage you stated: Unmistakable Visual Sovereignty — but won't it be mistaken for Korean?"*

### The Core Aesthetic & Branding Reality

If a casual reader opens a book, looks at a website, or sees a poster with:

$$\text{나라ঃ 훔 파람 훔 ॐ 카다티 【솨하】 ॥}$$

their immediate, instinctive reaction will **not** be: *"Ah, an ancient architectural rebirth of Sanskrit!"*  
Their reaction will be: **"Why is Sanskrit written in Korean?"**

If that perception sticks, it doesn't feel like "visual sovereignty"—it risks feeling like a borrowed novelty or a cultural mismatch.

Here is an honest breakdown of why this happens, the historical irony behind it, and how to address it.

---

### 1. Why It Uses Hangul Blocks in the First Place (The "Trojan Horse")

To create a brand-new, sovereign 2D block writing system from scratch, you face the **Unicode Trap**:
- Getting new script glyphs approved by the Unicode Consortium takes **5 to 10 years**.
- If you invent private font glyphs, the text cannot be copy-pasted, cannot be searched on Google, cannot be sent in a WhatsApp message, and turns into blank boxes (`□□□`) on anyone else's phone unless they download a custom `.ttf` file.

**Varṇagul’s engineering trick was a Trojan horse:**  
By mapping Sanskrit's 5×5 Pāṇinian mouth stations onto modern Korean Hangul Unicode blocks, **Varṇagul instantly works on all 6 billion smartphones on Earth today** without installing any font.

*The engineering advantage was universal portability; the branding cost was visual association with Korea.*

---

### 2. The Historical Connection: Pāṇini via 'Phags-pa

There is a fascinating historical dimension worth knowing: **Hangul itself was historically influenced by Sanskrit phonetics.**

When King Sejong invented Hangul in 1446, his scholars were heavily influenced by the **'Phags-pa script** (the square script developed for the Mongol Empire by the Tibetan monk Drogön Chögyal Phagpa). The 'Phags-pa script was directly derived from **Tibetan**, which was directly derived from **Indian Brāhmī / Sanskrit Siddham**. 

The 5-place articulatory table (*Guttural, Palatal, Retroflex, Dental, Labial*) that Sejong used was inherited from Indian Buddhist phonological treatises that traveled along the Silk Road. 

So when Varṇagul maps Sanskrit to Hangul blocks, it is, in a very real historical sense, **bringing Sanskrit back to an East Asian architectural descendant of Brāhmī.**

---

### 3. How to Overcome the "It Looks Like Korean" Problem

If you want to make Varṇagul the primary script without it being dismissed as "just Korean," there are two clear paths forward:

#### Path A: The Typeface Transformation (Layer 2 & 3 in the Engine)
Hangul looks like Korean largely because of the standard digital Korean fonts (like *Malgun Gothic*, *Nanum Gothic*, or *Apple SD Gothic Neo*) that ship with modern operating systems.

In `Varnagul_Foundry.html` and the normative specification, the script is designed for **Layer 2 (Styled Render)**:
- **Chiseled Architectural Terminals:** Replacing smooth Korean brush or sans-serif strokes with 90° geometric lines, stone-chisel terminals, and subtle top-shelf alignments reminiscent of ancient epigraphy (like Brāhmī or square Kufic).
- **Integrated Indic Elements:** The retroflex loop (curled under the stroke like Brāhmī `𑀝`) instead of a plain dot, and the Indian Visarga (`ঃ`) and Daṇḍa (`॥`).
- **The 100/75 Scale:** The visual alternation between big root blocks and compact 75% case-markers breaks up the monotonous square grid of typical Korean text.

When rendered in a dedicated custom font, people no longer think "Korean"; they perceive a **monumental, futuristic, Pan-Asian geometric script**.

#### Path B: Own the Narrative ("The Pāṇini-Sejong Synthesis")
If you address it head-on in your introduction, you turn a potential criticism into your biggest intellectual selling point:

> *"Sanskrit has the most scientific sound system in the ancient world (Pāṇini, 500 BCE).  
> Korea has the most scientific syllabic block architecture in the modern world (King Sejong, 1446 CE).  
> **Varṇagul is their deliberate, architectural synthesis.**"*

When framed this way, it stops looking like an accident and starts looking like an intentional masterpiece of comparative linguistics.

---

### 4. Audience Strategy: What Should Be "Primary"?

If your primary audience for **Books 1 and 2** is:
1. **Traditional Sanskrit students, Indologists, or Indian diaspora readers:**  
   Making raw Hangul the *primary* script right now could cause cultural hesitation or confusion. For them, **Canonical IAST (with clear architectural dots)** and **clean Devanāgarī** should remain front and center.
2. **Computational linguists, tech-forward learners, and new generations:**  
   Introduce **Varṇagul** in its dedicated volume (Book 3 / the Bootcamp) as the **Sovereign Writing System of the AI Age**, showcasing the interactive web studio, the custom foundry font, and the Pāṇini-Sejong synthesis.

This protects the credibility of Books 1 & 2 while giving Varṇagul the room to build its own distinct visual prestige.

---

## 5. Architectural Fundamentals of Varṇagul

While **Canonical IAST (Mode 1)** provides the machine-parseable, dot-separated API for algorithms and parsers, **Varṇagul (Mode 2)** is the human visual, writing, and typing interface.

### The Core Breakthroughs
1. **The Block is the Morpheme:** Syllabic 2D blocks visually encapsulate linguistic boundaries. Root, buffer, stem converter, and role tag are clearly distinguished without destructive *Sandhi* phonetic fusion.
2. **5×5 Pāṇinian Phonology:** Maps Sanskrit's anatomical stop consonants (*Sparśa*) to base Korean Hangul Jamo augmented with standard Unicode combining diacritics (`U+0323` dot below for retroflexes, `U+0307` dot above for voiced aspirates).
3. **No Apostrophe Hacks:** Unlike legacy drafts that used ASCII apostrophes (`'`), Varṇagul 3.1 deploys native *Batchim* codas (`감`, `파람`) and the neutral carrier `ㅡ` (`슽래`, `랔스`, `그싸`).
4. **The 100/75 Typographic Hierarchy:** Via Unicode Variation Selector-1 (`U+FE00`), content roots render at 100% EM scale, while functional morphemes (role tags, time modules, stem converters) render at 75% EM scale.

---

## 6. Directory Contents & Tool Inventory

```
Varnagul Script/
├── README.md                          # This Design Manifesto, Architecture & Operational Guide
├── Varnagul Bootcamp.md               # Upgraded 7-Day Curriculum (Varṇagul 3.1 & 7 Converters)
├── Varnagul_Bootcamp_Web.html         # Interactive Web Bootcamp with Live Keyboard & Exercises
├── Varnagul_Master_Engine.html        # Master Engine with 1000x1000 UPEM Anatomical Inspector
├── Varnagul_Foundry.html              # Interactive Font Foundry & Vector Canvas
├── Om-Script Varnagul-V2-Normative-Spec.md  # Definitive Technical Specification (v3.1)
├── Om-Script Varnagul-V1-Archived.md        # Historical Version 1.0 Specification (Archival)
├── varnagul_compiler.py               # Standalone Python Compiler Engine (Layers 1 & 2)
└── test_varnagul_compiler.py          # Automated Test Suite for Phonology & Converters
```

---

## 7. Quickstart & Usage

### A. Interactive Web Bootcamp & Studio
Double-click or open in any web browser:
- **`Varnagul_Bootcamp_Web.html`**:
  - Step through Day 1 to Day 7 with day-by-day tabs.
  - Practice typing using the on-screen **Pāṇinian Articulatory Virtual Keyboard** (organized by Velar, Palatal, Retroflex, Dental, Labial stations).
  - Solve exercises with real-time feedback and validation.
  - Experiment in the **Live Compiler Sandbox**.
- **`Varnagul_Master_Engine.html`**:
  - Live UPEM (Units Per Em) Anatomical Inspector showing Onset Zone, Vowel Rail, and Coda Floor.
- **`Varnagul_Foundry.html`**:
  - Vector canvas glyph foundry tool for designing custom architectural chisel strokes.

### B. Python Compiler Engine
Run the compiler from the terminal:

```bash
# Compile a sample sentence into Layer 1 (Plain) and Layer 2 (U+FE00 Styled):
python "Varnagul Script/varnagul_compiler.py" "ATHA nara·ḥ phala·ṃ khād·a·ti ॥"

# Run the automated verification test suite:
python "Varnagul Script/test_varnagul_compiler.py"
```

---

## 8. The 8-Day Curriculum Summary

| Day | Topic | Key Modules Learned | Canonical Worked Sentence |
| :---: | :--- | :--- | :--- |
| **Day 0** | Acoustic Blueprint | 3-Zone Hangul Docking, Praṇava Vectors, Consonant Onset Shift (`규` vs `슈`) | `ㄱ + ㅠ = 규` (kū) \| `ㅅ + ㅠ = 슈` (śū) \| `슈라` (śūra) |
| **Day 1** | Action Architecture | Noun Stems, Subject (`ঃ`), Object (`-ㅁ`), Present Verb (`카다티`) | `〔아타〕 나라ঃ 훔 파람 훔 ॐ 카다티 【솨하】 ॥` |
| **Day 2** | Modifiers & Direction | Bare Adjectives, Bridge `hīṃ` (`햄`), Prefixes `pra-` (`프라`), `ud-` (`웉`) | `슈라 햄 위샬라 햄 아솨ঃ 훔–` |
| **Day 3** | Time Engine | Past `·tava·` (`타와`), Future `·sya·` (`샤`), Imperative `·tavya·` (`타뱌`) | `〔아타〕 크루라 라자ঃ 위 나샤샤티 【솨하】 ॥` |
| **Day 4** | The 7 Roles | Tool (`비ঃ`), Receiver (`뱜`), Origin (`타ঃ`), Possessor (`샤`), Locative (`수`) | `기리타ঃ 와나수 크루라 라자ঃ 사라비ঃ 프라 하라타와티` |
| **Day 5** | Bīja Tempos | 16th staccato (`힘`), 8th cadence (`햄`), quarter rest (`훔–`), half fermata (`훔≡`)| `크루라 힘 라자ঃ 훔– 위샬라 훔 세남 훔≡ ॐ 위 나샤타와티` |
| **Day 6** | 7 Stem Converters | **Tier 1:** `·tṛ` (트리), `·na` (나), `·ta` (타)<br>**Tier 2:** `·ka` (가), `·tva` (돠), `·tā` (터), `·in` (인) | `슈라 유다트리ঃ 훔– 위샬라 랔아남 훔≡ ॐ 파리 드르샤타와티` |
| **Day 7** | Epic Narrative | Vālmīki 3-Sentence Battle Scene (Observation, Strike, Prophecy) | Complete narrative execution in dual IAST & Varṇagul 3.1 |

---

## 9. Architectural Integrity & Publication Safety

- **Book 1 & Book 2 Independence:** The files in this subfolder do **not** impact `Book1.pdf` (160 pages) or `Book2.pdf` (362 pages). The master build script `code/convert_to_kdp.py` remains focused on Books 1 & 2.
- **Portability:** All web applications and Python scripts in this folder run 100% offline with zero external network or package dependencies.
