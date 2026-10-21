# ॐ-SYNTH (Om-Synth)
### The Sanskrit Acoustic Synthesizer & Multi-Script Phonology Studio

[![Live Web Studio](https://img.shields.io/badge/Live%20Studio-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://om-script.github.io/Om-Script/)
[![Pāṇinian Architecture](https://img.shields.io/badge/Phonetics-Pāṇinian%205--Sthānas-amber?style=for-the-badge)]()
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Vanilla%20JS)-blue?style=for-the-badge)]()
[![License: Custom](https://img.shields.io/badge/License-Custom%20(Non--Commercial)-red?style=for-the-badge)](LICENSE)

**ॐ-SYNTH** is an interactive, browser-based phonology matrix and real-time speech synthesis engine engineered specifically for **ॐ-Script** and Pāṇinian Sanskrit acoustics.

It bridges ancient vocal-tract physiology with modern Web Audio DSP, multi-script transliteration, and the **Rule 8 (Sandhi-Free) Acoustic Protocol** established in *Sanskrit by Architecture*.

---

### 🌐 Instant Access
- **Live Web Application:** [https://om-script.github.io/Om-Script/](https://om-script.github.io/Om-Script/)
- **Official Repository:** [https://github.com/om-script/Om-Script](https://github.com/om-script/Om-Script)

<div align="center">
  <br>
  <img src="qr_om_synth_300dpi.png" width="220" alt="Scan QR Code to open ॐ-SYNTH on Mobile or Browser" />
  <p><em>Scan with your smartphone to launch the studio instantly on iOS or Android</em></p>
  <br>
</div>

---

## 🌟 Key Features

### Mode 1: The Pāṇinian Vocal Tract Matrix (The 5 Sthānas)
* **Anatomical Phonology Grid:** Organized strictly across the 5 vocal stations (*sthāna*: Kaṇṭhya → Tālavya → Mūrdhanya → Dantya → Oṣṭhya) plus compound throat-palatal and throat-lip stations.
* **Dynamic Script Toggle:** Easily toggle **Telugu (South Indic)** on/off with a single click. When turned off, **Devanāgarī** and **IAST** are prominently enlarged for focused Sanskrit and Modern Hindi vocabulary study.
* **Studio Audio Library:** 76 high-fidelity studio phoneme and vocabulary recordings bundled locally in `sounds/` for zero-latency playback.
* **DSP Auto-Silence Trimmer:** Real-time Web Audio API PCM amplitude gating strips encoder dead air down to exact vocal onset (<12ms latency).
* **Selected Phoneme Inspector HUD:**
  * Active glyphs in Devanāgarī, Telugu, and Roman IAST.
  * Sthāna classification, effort (*prayatna*), and color-coded anatomical cues.
  * Authentic Sanskrit example word with instant audio playback.
  * **Modern Hindi Cognate & English Meaning** showing direct linguistic evolution (e.g., क: *कमल / Lotus*, प: *फल / Fruit*, ह: *हाथ / Hand*).
* **Interactive Anatomical Vocal Tract SVG:** Clicking any phoneme highlights the tongue and resonance position on the anatomical cross-section.

### Mode 2: ॐ-Script Read-Aloud Studio (Karaoke Synthesizer)
* **Continuous ॐ-Script Speech Engine:** Parses any ॐ-Script sentence and recites it with natural, rhythmic cadence.
* **Dual Audio Flow Modes:**
  * **Buffered Stream (Continuous):** Pre-buffers and stitches morphemes for ultra-smooth recitation with sub-millisecond karaoke alignment.
  * **Step-by-Step Pacing:** Discrete word-by-word analysis with adjustable pause intervals.
* **Procedural Web Audio Breath Oscillators & Tibetan Bowls:**
  * `him`: 150ms respiratory breath intake / rhythmic reset.
  * `hūṃ`: 108Hz harmonic chest drone / clause boundary resonator.
  * `OM`: 432Hz / 136.1Hz Tibetan singing bowl physical modeling drone.
  * `॥`: 528Hz singing-bowl bell resolution.
* **Synchronous Multi-Script Karaoke HUD:** Highlights the active word in real time across 5 parallel visual ribbons:
  1. **ॐ-Script Blueprint** (Morpheme segmentation)
  2. **Devanāgarī Script** (Classical Sanskrit surface form)
  3. **Telugu Script** (South Indic unstacked form without *vattulu*)
  4. **Roman IAST** (Phonetic alignment)
  5. **Syntactic Kāraka Spine** (Subject [1.1], Object [2.1], Instrument [3.1], Verb chips)
  6. **Fluent English Bridge** (SVO natural sentence)
  7. **Modern Hindi Synthesis** (SOV natural sentence)
* **Pre-Loaded Canonical Presets:** Instant testing of sentences from Chapters 1 through 7 of *Sanskrit by Architecture*.

### Mode 3: ⚡ ॐ-Script Architecture Studio (Offline Translator & Compiler Workbench)
* **Zero-LLM Offline Translation Pipeline:** Directly converts English natural language and Classical Sanskrit (IAST or Devanāgarī) into canonical Two-Track ॐ-Script in the browser with zero external API calls or server fees.
* **9,444+ Root Offline Lexicon (`om_lexicon.json`):** Pure static 520 KB dictionary combining lemmas from the Digital Corpus of Sanskrit (DCS) and IndoWordNet with core pronoun overrides (`mad`, `tad`, `yuṣmad`) and classical normalizers.
* **Pāṇinian Kāraka SVO → SOV Chunker:** Automatically reorders English Subject-Verb-Object clauses into classical Sanskrit *Kartā → Karaṇa → Karma → Kriyā* sequences.
* **Interactive AST Workbench (Chip Board):**
  * Displays every parsed token as an interactive visual card showing original word, Part-of-Speech, and Sanskrit root.
  * **Root Stem Editor:** Edit Sanskrit root stems in real-time.
  * **Universal Role Tag Dropdown (20 Tags):** Live override of grammatical functions (`·ḥ`, `·ṃ`, `·ena`, `·bhiḥ`, `·ya`, `·bhyam`, `·āt`, `·taḥ`, `·sya`, `·e`, `·su`, verb tenses, and kinetic opcodes `·ant`, `·ta`, `·tvā`, `·tum`).
* **Two-Track Breath Envelope Weaver (Rule 8):** Auto-injects acoustic mortar (`ATHA` boot carrier, `him` staccato modifier link, `hūṃऽऽ` subject anchor, `hūṃ` clause bridge, and `OM ... ॥` tonic verb lock).
* **Multi-Script Switchers:** Instant one-click toggle between **IAST**, **Devanāgarī**, and **Telugu** scripts.
* **Live Web Audio Chanting:** Voice synthesis with 136.1 Hz singing bowl drones and real-time card glowing synchronization.
* **English & Hindi Reverse Verification Bridges:** Dual back-translation panels proving semantic fidelity in real time.

---

## ⚡ Quick Demo: The Rule 8 Acoustic Protocol

In ॐ-Script, classical sandhi (phonetic fusion) is banned to keep root data mathematically uncorrupted. Continuous speech flow is maintained through rhythmic breath carriers:

```text
Input:    him nar·aḥ hūṃ van·am OM gam·ti ॥
IAST:     narah vanam gacchati
Deva:     नरः वनम् गच्छति
Telugu:   నరః వనమ్ గచ్ఛతి
English:  "The man goes to the forest."
Hindi:    "मनुष्य वन जाता है।"
```

---

## 🚀 How to Run

### 1. Instant Web & Mobile Access
Visit: **[https://om-script.github.io/Om-Script/](https://om-script.github.io/Om-Script/)**  
Works out of the box in all modern browsers (Chrome, Edge, Safari, Firefox) on desktop and mobile.

### 2. Standalone Native Desktop App (Zero-Config)
To run locally on Windows/macOS/Linux without opening a browser tab:
```bash
python desktop_app.py
```
*Launches as a dedicated borderless desktop application via Microsoft Edge Native App Mode or PyWebView.*

### 3. Local Web Server (Offline Mode)
```bash
python serve.py
```
Then visit `http://localhost:8080/index.html`.

### 4. Install as a Desktop PWA
Open the URL in Microsoft Edge or Google Chrome, and click the **"Install ॐ-SYNTH"** icon in the URL bar to pin it to your Windows Taskbar/Start Menu as an offline progressive web app.

---

## 📁 Repository Structure

```text
Om-synth/
├── .nojekyll                 # Bypasses Jekyll on GitHub Pages for raw asset delivery
├── index.html                # Semantic HTML5 three-mode application shell
├── style.css                 # Vanilla CSS design system with glassmorphism & dark theme
├── app.js                    # Multi-mode controller, DOM binding, and studio manager
├── om-compiler.js            # Pāṇinian Kāraka SVO → SOV chunker & Two-Track breath weaver
├── om-bridge.js              # Multi-script matrix (IAST ↔ Deva ↔ Telugu) & reverse bridges
├── om-audio.js               # Web Audio API engine, 136.1Hz Tibetan drone, & speech streamer
├── om_lexicon.json           # 520 KB offline lexicon (9,444+ words, pronoun overrides & normalizers)
├── phonology-data.js         # Pāṇinian phonological dataset, Hindi cognates & meanings
├── desktop_app.py            # Zero-dependency borderless desktop app launcher
├── serve.py                  # Local multi-threaded UTF-8 HTTP development daemon
├── manifest.json             # Progressive Web App (PWA) manifest
├── qr_om_synth_300dpi.png    # 300 DPI print-ready QR code for physical book editions
├── LICENSE                   # Custom non-commercial educational license
└── sounds/                   # 76 studio phoneme and vocabulary MP3 recordings
```

---

## ⚖️ License

Copyright &copy; 2026 Timothy A. George. All Rights Reserved.

Free for personal, non-commercial, educational, and research study as an interactive companion to *Sanskrit Reborn*. Commercial sale, redistribution, or derivative monetization is strictly prohibited under the terms of the included [`LICENSE`](LICENSE) file.

---

## 📜 Academic Reference & Citation

This companion application implements the formal linguistic specification and acoustic protocol defined in:

> **George, Timothy A. (2026).**  
> *Sanskrit Reborn: The Blueprint for a Universal Second Language — Sanskrit by Architecture.*  
> First Edition.
