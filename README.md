# ॐ-SYNTH (Om-Synth)
### The Sanskrit Acoustic Synthesizer & Multi-Script Phonology Studio

**ॐ-SYNTH** is an interactive, browser-based speech synthesis and phonological architecture application designed specifically for **ॐ-Script**.

It bridges ancient Pāṇinian acoustic phonology with modern browser audio synthesis, real-time multi-script transliteration, and the **Rule 8 (Sandhi-Free) Acoustic Protocol** established in *Sanskrit by Architecture*.

---

## Key Features

### Mode 1: The Pāṇinian Vocal Tract Matrix (The 5 Sthānas)
- **Interactive Phonology Grid:** Organized strictly across the 5 vocal stations (*sthāna*: Kaṇṭhya $\to$ Tālavya $\to$ Mūrdhanya $\to$ Dantya $\to$ Oṣṭhya) + compound stations.
- **Dynamic Script Toggle:** Easily toggle **Telugu (South Indic)** on/off with a single click. When turned off, **Devanāgarī** and **IAST** are prominently enlarged for focused Sanskrit/Hindi vocabulary study.
- **Offline Studio Audio Assets:** Bundles 76 studio phoneme and vocabulary MP3 files locally in `sounds/` for zero-latency, offline playback.
- **DSP Auto-Silence Trimmer:** Real-time Web Audio API PCM amplitude gating strips encoder dead air and trailing room tone down to exact vocal onset.
- **Selected Phoneme Inspector HUD:**
  - Active phoneme glyphs in Devanāgarī, Telugu, and Roman IAST.
  - Sthāna classification, effort (*prayatna*), and color-coded anatomical cues.
  - Authentic Sanskrit example word with instant audio playback.
  - **Modern Hindi Cognate & English Meaning** showing direct linguistic evolution (e.g., क: *कमल / Lotus*, प: *फल / Fruit*, ह: *हाथ / Hand*).
- **Interactive Anatomical Vocal Tract SVG:** Clicking any phoneme highlights the tongue and resonance position on the anatomical cross-section.

### Mode 2: ॐ-Script Read-Aloud Studio (Karaoke Synthesizer)
- **Continuous ॐ-Script Speech Engine:** Parses any ॐ-Script sentence and reads it out loud with rhythmic cadence.
- **Dual Streaming Modes:**
  - **Buffered Stream (Continuous):** Pre-buffers and stitches morphemes for ultra-smooth, continuous recitation with sub-millisecond karaoke alignment.
  - **Step-by-Step Pacing:** Discrete word-by-word analysis with adjustable pause intervals.
- **Procedural Web Audio Breath Oscillators & Tibetan Bowls:**
  - `him`: 150ms respiratory breath intake / rhythmic reset.
  - `hūṃ`: 108Hz harmonic chest drone / clause boundary resonator.
  - `OM`: 432Hz / 136.1Hz Tibetan singing bowl physical modeling drone.
  - `॥`: 528Hz singing-bowl bell resolution.
- **Synchronous Multi-Script Karaoke HUD:** Highlights the active word in real time across 5 parallel visual ribbons:
  1. **ॐ-Script Blueprint** (Morpheme segmentation)
  2. **Devanāgarī Script** (Classical Sanskrit surface form)
  3. **Telugu Script** (South Indic unstacked form without *vattulu*)
  4. **Roman IAST** (Phonetic alignment)
  5. **Syntactic Kāraka Spine** (Subject [1.1], Object [2.1], Instrument [3.1], Verb chips)
  6. **Fluent English Bridge** (SVO natural sentence)
  7. **Modern Hindi Synthesis** (SOV natural sentence)
- **Pre-Loaded Canonical Presets:** Instant testing of sentences from Chapters 1 through 7 of *Sanskrit by Architecture*.

---

## How to Run

### Option A: Standalone Native Desktop App (Zero-Config)
Double-click or run from terminal:
```bash
python c:\Users\TAG-SB\Desktop\Sanskrit_Zero\Om-synth\desktop_app.py
```
*Launches as a dedicated borderless desktop application via Microsoft Edge Native App Mode or PyWebView.*

### Option B: Local Browser Mode
1. Start the local server daemon:
   ```bash
   python c:\Users\TAG-SB\Desktop\Sanskrit_Zero\Om-synth\serve.py
   ```
2. Open in any modern web browser:
   `http://localhost:8080/index.html`

### Option C: Install as Desktop PWA
Open `http://localhost:8080/index.html` in Microsoft Edge or Google Chrome, and click the **"Install ॐ-SYNTH"** icon in the URL bar to pin it to your Windows Taskbar/Start Menu as an offline progressive web app.
