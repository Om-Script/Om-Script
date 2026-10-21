/**
 * app.js
 * Main Controller for ॐ-SYNTH Web Application
 * Handles:
 * - Dual Mode Tab Switching (Phonology Matrix vs Read-Aloud Studio)
 * - Phonology Matrix rendering & UBC Audio Triggers
 * - Interactive Vocal Tract SVG Anatomical Markers
 * - ॐ-Script live parsing, transliteration & multi-script Karaoke HUD
 */

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initPhonologyMatrix();
  initVocalTractSVG();
  initStudio();
  initTranslatorStudio();
});

// =========================================================================
// 1. TAB CONTROLLER
// =========================================================================
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const targetPanel = document.getElementById(tab.dataset.target);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }

      // If leaving studio, stop audio
      if (tab.dataset.target !== "studio-panel") {
        window.OmAudioEngine.stop();
      }
    });
  });
}

// =========================================================================
// 2. PHONOLOGY MATRIX (MODE 1)
// =========================================================================
let currentSelectedPhoneme = null;
let showTelugu = true;

function initPhonologyMatrix() {
  renderSthanaFilters();
  renderVowelsTable();
  renderConsonantsTable();
  renderModifiersTable();

  // Wire up Telugu script toggle
  const toggleTeluguBtn = document.getElementById("toggle-telugu-btn");
  const checkSpan = document.getElementById("telugu-toggle-check");
  const matrixPanel = document.getElementById("matrix-panel");

  function updateTeluguDisplay() {
    if (showTelugu) {
      if (toggleTeluguBtn) toggleTeluguBtn.classList.add("active");
      if (checkSpan) checkSpan.innerText = "✓";
      if (matrixPanel) matrixPanel.classList.remove("hide-telugu");
      const teluguBadge = document.getElementById("hud-telugu-badge");
      if (teluguBadge) teluguBadge.style.display = "block";
    } else {
      if (toggleTeluguBtn) toggleTeluguBtn.classList.remove("active");
      if (checkSpan) checkSpan.innerText = "+";
      if (matrixPanel) matrixPanel.classList.add("hide-telugu");
      const teluguBadge = document.getElementById("hud-telugu-badge");
      if (teluguBadge) teluguBadge.style.display = "none";
    }
  }

  if (toggleTeluguBtn) {
    toggleTeluguBtn.addEventListener("click", () => {
      showTelugu = !showTelugu;
      updateTeluguDisplay();
    });
  }
  updateTeluguDisplay();

  // Set default selected phoneme (Ka)
  selectPhoneme({
    iast: "ka",
    deva: "क",
    telugu: "క",
    type: "Unvoiced Unaspirated",
    sthana: "kanthya",
    audio: "as-ka.mp3",
    example: "kamalam",
    exampleDeva: "कमलम्",
    exampleHindi: "कमल (kamal)",
    exampleMeaning: "Lotus",
    exampleAudio: "as-kamalam.mp3"
  });

  // Play button in HUD
  const playBtn = document.getElementById("hud-play-btn");
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (currentSelectedPhoneme && currentSelectedPhoneme.audio) {
        window.OmAudioEngine.playUbcPhoneme(currentSelectedPhoneme.audio);
      }
    });
  }
}

function renderSthanaFilters() {
  const filterContainer = document.getElementById("sthana-filters-container");
  if (!filterContainer) return;

  filterContainer.innerHTML = `
    <button class="sthana-chip active" data-filter="all">All Stations</button>
    ${window.PhonologyData.STHANA_CONFIG.map(s => `
      <button class="sthana-chip" data-filter="${s.id}">
        <span class="sthana-indicator" style="background: ${s.color};"></span>
        ${s.stationNumber}. ${s.name}
      </button>
    `).join('')}
  `;

  filterContainer.querySelectorAll(".sthana-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      filterContainer.querySelectorAll(".sthana-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      filterTableBySthana(chip.dataset.filter);
      highlightVocalTractStation(chip.dataset.filter);
    });
  });
}

function filterTableBySthana(sthanaId) {
  const rows = document.querySelectorAll("tr[data-sthana]");
  rows.forEach(row => {
    if (sthanaId === "all" || row.dataset.sthana === sthanaId) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function renderVowelsTable() {
  const tbody = document.getElementById("vowels-table-body");
  if (!tbody) return;

  tbody.innerHTML = window.PhonologyData.VOWELS_DATA.map(row => {
    const sthanaObj = window.PhonologyData.STHANA_CONFIG.find(s => s.id === row.sthana);
    return `
      <tr data-sthana="${row.sthana}">
        <td class="station-cell-header" style="border-left: 3px solid ${sthanaObj.color}">
          <strong>${sthanaObj.name}</strong>
          <div style="font-size:0.75rem; color:var(--text-dim);">${sthanaObj.english}</div>
        </td>
        <td>${renderCell(row.short, row.sthana, "Short")}</td>
        <td>${row.long ? renderCell(row.long, row.sthana, "Long") : '<div style="color:var(--text-dim);text-align:center;">—</div>'}</td>
      </tr>
    `;
  }).join('');

  bindCellClicks();
}

function renderConsonantsTable() {
  const tbody = document.getElementById("consonants-table-body");
  if (!tbody) return;

  tbody.innerHTML = window.PhonologyData.CONSONANTS_DATA.map(row => {
    const sthanaObj = window.PhonologyData.STHANA_CONFIG.find(s => s.id === row.sthana);
    return `
      <tr data-sthana="${row.sthana}">
        <td class="station-cell-header" style="border-left: 3px solid ${sthanaObj.color}">
          <strong>${sthanaObj.name}</strong>
          <div style="font-size:0.75rem; color:var(--text-dim);">${sthanaObj.english}</div>
        </td>
        ${row.stops.map(stop => `<td>${renderCell(stop, row.sthana, stop.type)}</td>`).join('')}
        <td>${row.semivowel ? renderCell(row.semivowel, row.sthana, row.semivowel.type) : '<div style="color:var(--text-dim);text-align:center;">—</div>'}</td>
        <td>${row.sibilant ? renderCell(row.sibilant, row.sthana, row.sibilant.type) : '<div style="color:var(--text-dim);text-align:center;">—</div>'}</td>
      </tr>
    `;
  }).join('');

  bindCellClicks();
}

function renderModifiersTable() {
  const container = document.getElementById("modifiers-container");
  if (!container) return;

  container.innerHTML = window.PhonologyData.MODIFIERS_DATA.map(mod => `
    <div class="p-cell" data-phoneme='${JSON.stringify({ ...mod, sthana: "kanthya" })}' style="flex:1;">
      <span class="cell-audio-icon">🔊</span>
      <div class="cell-deva">${mod.deva}</div>
      <div class="cell-sub-row">
        <span class="cell-telugu">${mod.telugu}</span>
        <span class="cell-iast">${mod.iast}</span>
      </div>
      <div style="font-size:0.75rem; color:var(--text-dim); margin-top:4px;">${mod.name}</div>
    </div>
  `).join('');

  bindCellClicks();
}

function renderCell(item, sthana, type) {
  if (!item) return '<div style="color:var(--text-dim);text-align:center;">—</div>';
  const data = { ...item, sthana, type };
  return `
    <div class="p-cell" data-phoneme='${JSON.stringify(data).replace(/'/g, "&apos;")}'>
      <span class="cell-audio-icon">🔊</span>
      <div class="cell-deva">${item.deva}</div>
      <div class="cell-sub-row">
        <span class="cell-telugu">${item.telugu}</span>
        <span class="cell-iast">${item.iast}</span>
      </div>
    </div>
  `;
}

function bindCellClicks() {
  document.querySelectorAll(".p-cell").forEach(cell => {
    cell.onclick = () => {
      document.querySelectorAll(".p-cell").forEach(c => c.classList.remove("active-playing"));
      cell.classList.add("active-playing");

      const data = JSON.parse(cell.dataset.phoneme.replace(/&apos;/g, "'"));
      selectPhoneme(data);
      if (data.audio) {
        window.OmAudioEngine.playUbcPhoneme(data.audio);
      }
    };
  });
}

function selectPhoneme(data) {
  currentSelectedPhoneme = data;
  const sthanaObj = window.PhonologyData.STHANA_CONFIG.find(s => s.id === data.sthana);

  document.getElementById("hud-val-deva").innerText = data.deva;
  document.getElementById("hud-val-telugu").innerText = data.telugu || "—";
  document.getElementById("hud-val-iast").innerText = data.iast;

  const teluguBadge = document.getElementById("hud-telugu-badge");
  if (teluguBadge) {
    teluguBadge.style.display = showTelugu ? "block" : "none";
  }

  const sthanaLabel = sthanaObj ? `${sthanaObj.stationNumber}. ${sthanaObj.name} (${sthanaObj.english})` : "—";
  document.getElementById("hud-sthana-name").innerText = sthanaLabel;
  document.getElementById("hud-sthana-name").style.color = sthanaObj ? sthanaObj.color : "var(--text-main)";
  document.getElementById("hud-phoneme-type").innerText = data.type || "Canonical Phoneme";
  document.getElementById("hud-audio-file").innerText = data.audio || "Synthesized";

  // Sanskrit Example Word
  const sktRow = document.getElementById("hud-skt-word-row");
  const sktVal = document.getElementById("hud-example-skt");
  if (sktRow && sktVal) {
    if (data.example) {
      sktRow.style.display = "flex";
      sktVal.innerHTML = `
        <span style="font-family:var(--font-deva);color:var(--accent-saffron);font-size:1.15rem;font-weight:600;">${data.exampleDeva || ''}</span>
        <span style="font-family:var(--font-mono);color:var(--text-muted);margin:0 4px;">(${data.example})</span>
        ${data.exampleAudio ? `<button id="play-skt-example-btn" title="Listen to Sanskrit word" style="background:rgba(245,158,11,0.15);border:1px solid var(--accent-saffron);border-radius:4px;cursor:pointer;color:var(--accent-saffron);font-size:0.85rem;padding:2px 6px;margin-left:6px;">🔊 Play</button>` : ''}
      `;
      const exBtn = document.getElementById("play-skt-example-btn");
      if (exBtn && data.exampleAudio) {
        exBtn.onclick = () => window.OmAudioEngine.playUbcPhoneme(data.exampleAudio);
      }
    } else {
      sktRow.style.display = "none";
    }
  }

  // Modern Hindi Cognate & English Meaning
  const hindiRow = document.getElementById("hud-hindi-word-row");
  const hindiVal = document.getElementById("hud-example-hindi");
  if (hindiRow && hindiVal) {
    if (data.exampleHindi) {
      hindiRow.style.display = "flex";
      const meaningText = data.exampleMeaning ? ` — <span style="color:var(--text-main);font-weight:400;font-style:italic;">"${data.exampleMeaning}"</span>` : "";
      hindiVal.innerHTML = `<span style="font-family:var(--font-deva);font-size:1.05rem;">${data.exampleHindi}</span>${meaningText}`;
    } else {
      hindiRow.style.display = "none";
    }
  }

  highlightVocalTractStation(data.sthana);
}

// =========================================================================
// 3. VOCAL TRACT ANATOMICAL SVG
// =========================================================================
function initVocalTractSVG() {
  const stage = document.getElementById("vocal-tract-stage");
  if (!stage) return;

  stage.innerHTML = `
    <svg class="vocal-tract-svg" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="throatGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Anatomical Profile Outline -->
      <path d="M 80,260 C 80,210 100,160 120,130 C 140,100 170,70 230,65 C 270,60 300,75 320,105 C 330,120 335,140 330,155 C 320,175 295,185 270,185 C 240,185 220,180 200,195 C 180,210 170,240 170,260 Z" 
            fill="#131b2e" stroke="#334155" stroke-width="2.5" />

      <!-- Tongue Arch Path -->
      <path d="M 120,230 C 140,180 180,150 240,145 C 270,145 290,160 300,175" 
            fill="none" stroke="#475569" stroke-width="3" stroke-dasharray="4,4" />

      <!-- Hard Palate Line -->
      <path d="M 190,85 C 230,85 270,105 310,140" 
            fill="none" stroke="#64748b" stroke-width="2" />

      <!-- Lips -->
      <path d="M 325,145 Q 345,150 335,165 Q 320,170 315,160" 
            fill="#334155" stroke="#f59e0b" stroke-width="1.5" />

      <!-- Station 1: Kaṇṭhya (Velar / Throat) -->
      <g class="sthana-marker" id="marker-kanthya" data-sthana="kanthya">
        <circle cx="125" cy="200" r="16" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" stroke-width="2"/>
        <circle cx="125" cy="200" r="6" fill="#ef4444"/>
        <text x="125" y="175" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="bold">1. Kaṇṭhya</text>
      </g>

      <!-- Station 2: Tālavya (Hard Palate) -->
      <g class="sthana-marker" id="marker-talavya" data-sthana="talavya">
        <circle cx="215" cy="115" r="16" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="215" cy="115" r="6" fill="#f59e0b"/>
        <text x="215" y="90" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">2. Tālavya</text>
      </g>

      <!-- Station 3: Mūrdhanya (Roof / Retroflex) -->
      <g class="sthana-marker" id="marker-murdhanya" data-sthana="murdhanya">
        <circle cx="265" cy="115" r="16" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="2"/>
        <circle cx="265" cy="115" r="6" fill="#10b981"/>
        <text x="265" y="90" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">3. Mūrdhanya</text>
      </g>

      <!-- Station 4: Dantya (Dental / Teeth) -->
      <g class="sthana-marker" id="marker-dantya" data-sthana="dantya">
        <circle cx="310" cy="138" r="16" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" stroke-width="2"/>
        <circle cx="310" cy="138" r="6" fill="#3b82f6"/>
        <text x="345" y="130" text-anchor="start" fill="#3b82f6" font-size="11" font-weight="bold">4. Dantya</text>
      </g>

      <!-- Station 5: Oṣṭhya (Labial / Lips) -->
      <g class="sthana-marker" id="marker-osthya" data-sthana="osthya">
        <circle cx="335" cy="160" r="16" fill="rgba(139, 92, 246, 0.2)" stroke="#8b5cf6" stroke-width="2"/>
        <circle cx="335" cy="160" r="6" fill="#8b5cf6"/>
        <text x="350" y="175" text-anchor="start" fill="#8b5cf6" font-size="11" font-weight="bold">5. Oṣṭhya</text>
      </g>
    </svg>
  `;

  // Click on markers
  document.querySelectorAll(".sthana-marker").forEach(marker => {
    marker.onclick = () => {
      const sthana = marker.dataset.sthana;
      filterTableBySthana(sthana);
      highlightVocalTractStation(sthana);
    };
  });
}

function highlightVocalTractStation(sthanaId) {
  document.querySelectorAll(".sthana-marker").forEach(m => {
    m.classList.remove("active");
    m.querySelector("circle").setAttribute("r", "16");
  });

  if (sthanaId === "all") return;

  const activeMarker = document.getElementById(`marker-${sthanaId}`);
  if (activeMarker) {
    activeMarker.classList.add("active");
    activeMarker.querySelector("circle").setAttribute("r", "22");
  }
}

// =========================================================================
// 4. ॐ-SCRIPT READ-ALOUD STUDIO (MODE 2)
// =========================================================================
let parsedResult = null;

function initStudio() {
  const presetSelect = document.getElementById("preset-select");
  const omTextarea = document.getElementById("om-input-textarea");
  const playBtn = document.getElementById("studio-play-btn");
  const stopBtn = document.getElementById("studio-stop-btn");
  const speedSlider = document.getElementById("speed-slider");
  const speedVal = document.getElementById("speed-val");
  const pitchSlider = document.getElementById("pitch-slider");
  const pitchVal = document.getElementById("pitch-val");

  // Populate presets
  presetSelect.innerHTML = window.PhonologyData.PRESET_SENTENCES.map((p, idx) => `
    <option value="${idx}">${p.title}: "${p.meaning}"</option>
  `).join('');

  presetSelect.addEventListener("change", (e) => {
    const sel = window.PhonologyData.PRESET_SENTENCES[e.target.value];
    if (sel) {
      omTextarea.value = sel.om;
      updateStudioHUD();
    }
  });

  // Load initial preset
  omTextarea.value = window.PhonologyData.PRESET_SENTENCES[0].om;
  updateStudioHUD();

  // Textarea input
  omTextarea.addEventListener("input", () => {
    updateStudioHUD();
  });

  // Voice dropdown integration with Gender detection & Male voice indicators
  const voiceSelect = document.getElementById("voice-select");
  const populateVoices = (voices, selected) => {
    if (!voiceSelect || !voices.length) return;

    const indicVoices = [];
    const otherVoices = [];

    const maleKeywords = ["male", "hemant", "madhur", "prabhat", "david", "mark", "ravi", "madhav", "rishi", "george", "guy", "eric", "christopher", "roger", "steffan", "alex", "fred", "daniel", "oliver", "thomas", "brian", "ryan"];
    const femaleKeywords = ["female", "kalpana", "swara", "neerja", "heera", "zira", "jenny", "aria", "michelle", "ana", "natasha", "clara", "samantha", "victoria", "karen", "veena", "leena", "lekha", "google हिन्दी", "google us english"];

    voices.forEach((v, idx) => {
      const lower = (v.name + " " + (v.gender || "")).toLowerCase();
      let genderBadge = "";

      if (maleKeywords.some(k => lower.includes(k)) && !lower.includes("female")) {
        genderBadge = "👨 [Male] ";
      } else if (femaleKeywords.some(k => lower.includes(k))) {
        genderBadge = "👩 [Female] ";
      } else if (v.gender === "male") {
        genderBadge = "👨 [Male] ";
      } else if (v.gender === "female") {
        genderBadge = "👩 [Female] ";
      }

      const optHtml = `
        <option value="${idx}" ${v === selected ? 'selected' : ''}>
          ${genderBadge}${v.name} (${v.lang})
        </option>
      `;

      if (v.lang.startsWith("hi") || v.lang.startsWith("sa") || v.lang.includes("IN")) {
        indicVoices.push(optHtml);
      } else {
        otherVoices.push(optHtml);
      }
    });

    if (indicVoices.length && otherVoices.length) {
      voiceSelect.innerHTML = `
        <optgroup label="── Indic / Sanskrit Chanters ──">
          ${indicVoices.join('')}
        </optgroup>
        <optgroup label="── Other System Voices ──">
          ${otherVoices.join('')}
        </optgroup>
      `;
    } else {
      voiceSelect.innerHTML = [...indicVoices, ...otherVoices].join('');
    }
  };

  populateVoices(window.OmAudioEngine.availableVoices, window.OmAudioEngine.selectedVoice);
  window.OmAudioEngine.onVoicesLoaded = (voices, selected) => {
    populateVoices(voices, selected);
  };

  if (voiceSelect) {
    voiceSelect.addEventListener("change", (e) => {
      const idx = parseInt(e.target.value, 10);
      window.OmAudioEngine.selectedVoice = window.OmAudioEngine.availableVoices[idx];
    });
  }

  // Audio Flow / Buffering selector
  const engineModeSelect = document.getElementById("engine-mode-select");
  if (engineModeSelect) {
    engineModeSelect.addEventListener("change", (e) => {
      window.OmAudioEngine.playbackEngine = e.target.value;
    });
  }

  // Bīja Vocalization Style selector
  const bijaModeSelect = document.getElementById("bija-mode-select");
  if (bijaModeSelect) {
    bijaModeSelect.addEventListener("change", (e) => {
      window.OmAudioEngine.bijaMode = e.target.value;
    });
  }

  // Speed slider

  speedSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    speedVal.innerText = `${val.toFixed(1)}x`;
    window.OmAudioEngine.playbackRate = val;
  });

  // Pitch / Baritone slider
  if (pitchSlider && pitchVal) {
    pitchSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      pitchVal.innerText = `${val.toFixed(2)}x`;
      window.OmAudioEngine.playbackPitch = val;
    });
  }

  // Play button
  playBtn.addEventListener("click", () => {
    if (!parsedResult || !parsedResult.tokens.length) return;
    playStudioSentence();
  });

  // Stop button
  stopBtn.addEventListener("click", () => {
    window.OmAudioEngine.stop();
    setPlaybackStatus(false);
  });
}


function updateStudioHUD() {
  const input = document.getElementById("om-input-textarea").value;
  parsedResult = window.OmBridge.parseSentence(input);
  if (!parsedResult) return;

  // Render Ribbons
  renderRibbonTokens("ribbon-om-tokens", parsedResult.tokens, (t) => t.raw);
  renderRibbonTokens("ribbon-deva-tokens", parsedResult.tokens, (t) => t.deva, "deva-font");
  renderRibbonTokens("ribbon-telugu-tokens", parsedResult.tokens, (t) => t.telugu, "telugu-font");
  renderRibbonTokens("ribbon-iast-tokens", parsedResult.tokens, (t) => t.iast);

  // Render Syntactic Roles
  const syntaxContainer = document.getElementById("syntax-roles-container");
  if (syntaxContainer) {
    syntaxContainer.innerHTML = parsedResult.tokens.filter(t => !t.isBija).map(t => {
      let roleClass = "role-sub";
      if (t.role.includes("Object")) roleClass = "role-obj";
      if (t.role.includes("Verb")) roleClass = "role-verb";
      if (t.role.includes("Instrument")) roleClass = "role-inst";

      return `
        <div class="syntax-role-chip">
          <span style="font-family:var(--font-mono);font-weight:700;">${t.raw}</span>
          <span class="role-badge ${roleClass}">${t.role}</span>
          <span style="color:var(--text-dim);">→ ${t.englishWord}</span>
        </div>
      `;
    }).join('');
  }

  // Fluent Translations
  document.getElementById("fluent-english-box").innerText = parsedResult.fluentEnglish;
  document.getElementById("fluent-hindi-box").innerText = parsedResult.fluentHindi;
}

function renderRibbonTokens(containerId, tokens, textExtractor, customClass = "") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = tokens.map((token, idx) => {
    const extClass = token.durationMultiplier && token.durationMultiplier > 1.2 ? 'bija-extended' : (token.durationMultiplier && token.durationMultiplier < 0.9 ? 'bija-staccato' : '');
    const titleAttr = token.durationLabel ? `title="${token.durationLabel}"` : '';
    return `
      <span class="token-span ${customClass} ${token.isBija ? 'bija-span' : ''} ${extClass}" id="${containerId}-token-${idx}" ${titleAttr}>
        ${textExtractor(token)}
      </span>
    `;
  }).join('');
}

function playStudioSentence() {
  if (!parsedResult) return;

  setPlaybackStatus(true);

  window.OmAudioEngine.playSentenceTokens(
    parsedResult.tokens,
    (activeIdx, activeToken) => {
      highlightActiveRibbonTokens(activeIdx, activeToken);
    },
    () => {
      setPlaybackStatus(false);
      highlightActiveRibbonTokens(-1, null);
    }
  );
}

function highlightActiveRibbonTokens(tokenIdx, token) {
  // Clear all ribbons
  document.querySelectorAll(".token-span").forEach(el => {
    el.classList.remove("active-word", "active-bija");
  });

  if (tokenIdx < 0 || !token) return;

  const ribbonIds = [
    "ribbon-om-tokens",
    "ribbon-deva-tokens",
    "ribbon-telugu-tokens",
    "ribbon-iast-tokens"
  ];

  ribbonIds.forEach(id => {
    const el = document.getElementById(`${id}-token-${tokenIdx}`);
    if (el) {
      if (token.isBija) {
        el.classList.add("active-bija");
      } else {
        el.classList.add("active-word");
      }
    }
  });
}

function setPlaybackStatus(isPlaying) {
  const badge = document.getElementById("playback-status-badge");
  const playBtn = document.getElementById("studio-play-btn");

  if (isPlaying) {
    badge.innerText = "● LIVE AUDIO STREAMING";
    badge.classList.add("live");
    playBtn.innerHTML = `<span>🔊</span> Synthesizing...`;
  } else {
    badge.innerText = "STANDBY";
    badge.classList.remove("live");
    playBtn.innerHTML = `<span>▶</span> Read Out Loud`;
  }
}

// =========================================================================
// 4. TRANSLATOR & ARCHITECTURE STUDIO (MODE 3)
// =========================================================================
let currentTranslatorAST = null;
let currentCompiledResult = null;
let activeTranslatorScript = 'iast';

async function initTranslatorStudio() {
  const sourceLangSelect = document.getElementById("translator-source-lang");
  const inputArea = document.getElementById("translator-input-text");
  const compileBtn = document.getElementById("translator-compile-btn");
  const clearBtn = document.getElementById("translator-clear-btn");
  const chantBtn = document.getElementById("translator-chant-btn");
  const carrierSelect = document.getElementById("translator-carrier-style");
  const copyBtn = document.getElementById("btn-copy-om");
  const sendToStudioBtn = document.getElementById("btn-send-to-studio");
  const statusBadge = document.getElementById("translator-status-badge");
  const lexiconBadge = document.getElementById("lexicon-status-badge");

  // Load offline lexicon
  if (window.omCompiler) {
    await window.omCompiler.init('./om_lexicon.json');
    if (lexiconBadge) {
      const count = Object.keys(window.omCompiler.lexicon).length || 9444;
      lexiconBadge.innerHTML = `<span class="pulse-dot"></span> ${count.toLocaleString()}+ Root Lexicon Ready`;
    }
  }

  // Preset example buttons
  const presetContainer = document.getElementById("translator-presets-container");
  if (presetContainer) {
    presetContainer.querySelectorAll(".example-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const text = chip.dataset.text;
        if (text.includes("vanaṃ") || text.includes("rāmaḥ") || text.includes("kṣetre")) {
          sourceLangSelect.value = "classical";
        } else {
          sourceLangSelect.value = "english";
        }
        inputArea.value = text;
        runCompiler();
      });
    });
  }

  // Compile button & Live typing trigger
  if (compileBtn) {
    compileBtn.addEventListener("click", () => runCompiler());
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      inputArea.value = "";
      document.getElementById("interactive-chips-container").innerHTML = "";
      document.getElementById("om-compiled-output").innerHTML = "";
      document.getElementById("translator-reconstructed-english").innerText = "";
      document.getElementById("translator-reconstructed-hindi").innerText = "";
      statusBadge.innerText = "READY";
      statusBadge.classList.remove("live");
    });
  }

  if (inputArea) {
    let debounceTimer = null;
    inputArea.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        runCompiler();
      }, 350);
    });
  }

  // Script display switcher (IAST, Devanāgarī, Telugu)
  const scriptBtns = [
    { btn: document.getElementById("trans-btn-iast"), script: 'iast' },
    { btn: document.getElementById("trans-btn-deva"), script: 'deva' },
    { btn: document.getElementById("trans-btn-telugu"), script: 'telugu' }
  ];

  scriptBtns.forEach(({ btn, script }) => {
    if (btn) {
      btn.addEventListener("click", () => {
        scriptBtns.forEach(b => b.btn.classList.remove("active"));
        btn.classList.add("active");
        activeTranslatorScript = script;
        if (currentCompiledResult) {
          renderCompiledOmDisplay(currentCompiledResult, activeTranslatorScript);
        }
      });
    }
  });

  // Copy to clipboard
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      if (!currentCompiledResult) return;
      let textToCopy = currentCompiledResult.iast;
      if (activeTranslatorScript === 'deva') textToCopy = currentCompiledResult.devanagari;
      else if (activeTranslatorScript === 'telugu') textToCopy = currentCompiledResult.telugu;
      navigator.clipboard.writeText(textToCopy).then(() => {
        const orig = copyBtn.innerText;
        copyBtn.innerText = "✓ Copied!";
        setTimeout(() => { copyBtn.innerText = orig; }, 1500);
      });
    });
  }

  // Send to Studio Tab
  if (sendToStudioBtn) {
    sendToStudioBtn.addEventListener("click", () => {
      if (!currentCompiledResult) return;
      const studioInput = document.getElementById("studio-text-input");
      if (studioInput) {
        studioInput.value = currentCompiledResult.iast;
      }
      const studioTab = document.getElementById("tab-studio-btn");
      if (studioTab) {
        studioTab.click();
        if (typeof updateStudioDisplay === "function") {
          updateStudioDisplay();
        }
      }
    });
  }

  // Chant Audio button
  if (chantBtn) {
    chantBtn.addEventListener("click", () => {
      if (!currentCompiledResult) {
        runCompiler();
        if (!currentCompiledResult) return;
      }

      if (window.OmAudioEngine && window.OmAudioEngine.isPlaying) {
        window.OmAudioEngine.stop();
        chantBtn.innerHTML = `<span>🎙️</span> Chant ॐ-Script Aloud`;
        statusBadge.innerText = "READY";
        statusBadge.classList.remove("live");
        return;
      }

      // Configure carrier wave style
      if (window.OmAudioEngine) {
        window.OmAudioEngine.bijaMode = carrierSelect ? carrierSelect.value : "human";
      }

      // Parse sentence via OmBridge to get durations and carrier hooks
      const parsed = window.omBridge.parseSentence(currentCompiledResult.iast);
      if (!parsed || !parsed.tokens) return;

      statusBadge.innerText = "● LIVE AUDIO STREAMING";
      statusBadge.classList.add("live");
      chantBtn.innerHTML = `<span>⏹</span> Stop Chanting`;

      window.OmAudioEngine.playSentenceTokens(
        parsed.tokens,
        (idx, token) => {
          // Highlight active token chip
          document.querySelectorAll(".token-chip-card").forEach((card, cIdx) => {
            if (cIdx === idx) {
              card.style.transform = "scale(1.05)";
              card.style.borderColor = "var(--accent-saffron)";
            } else {
              card.style.transform = "none";
              card.style.borderColor = "var(--border-subtle)";
            }
          });
        },
        () => {
          statusBadge.innerText = "READY";
          statusBadge.classList.remove("live");
          chantBtn.innerHTML = `<span>🎙️</span> Chant ॐ-Script Aloud`;
          document.querySelectorAll(".token-chip-card").forEach(c => {
            c.style.transform = "none";
            c.style.borderColor = "var(--border-subtle)";
          });
        }
      );
    });
  }

  // Initial compilation on page load
  runCompiler();
}

function runCompiler() {
  const sourceLang = document.getElementById("translator-source-lang")?.value || "english";
  const text = document.getElementById("translator-input-text")?.value?.trim() || "";
  const statusBadge = document.getElementById("translator-status-badge");

  if (!text) {
    document.getElementById("interactive-chips-container").innerHTML = "";
    document.getElementById("om-compiled-output").innerHTML = "";
    document.getElementById("translator-reconstructed-english").innerText = "";
    document.getElementById("translator-reconstructed-hindi").innerText = "";
    return;
  }

  if (statusBadge) statusBadge.innerText = "PARSING";

  let result = null;
  if (sourceLang === "english") {
    result = window.omCompiler.compileEnglish(text);
  } else {
    result = window.omCompiler.compileClassical(text);
  }

  if (!result) return;
  currentCompiledResult = result;
  currentTranslatorAST = result.ast;

  renderInteractiveChips(result.ast);
  renderCompiledOmDisplay(result, activeTranslatorScript);
  renderReconstructedBridges(result.iast);

  if (statusBadge) statusBadge.innerText = "READY";
}

function renderInteractiveChips(ast) {
  const container = document.getElementById("interactive-chips-container");
  if (!container) return;
  container.innerHTML = "";

  ast.forEach(token => {
    const card = document.createElement("div");
    card.className = "token-chip-card";

    // Set border accent color based on role
    if (token.tag.includes("ti") || token.tag.includes("mi") || token.tag.includes("a·...·")) {
      card.classList.add("is-verb");
    } else if (token.tag === "·ḥ") {
      card.classList.add("is-subject");
    } else if (token.tag === "·ṃ") {
      card.classList.add("is-object");
    } else if (token.tag === "·ena") {
      card.classList.add("is-instrument");
    }

    // Header: Original Word
    const header = document.createElement("div");
    header.className = "token-chip-header";
    header.innerHTML = `
      <span class="token-chip-orig">${token.origWord}</span>
      <span style="font-size:0.68rem;color:var(--text-dim);">${token.pos || 'root'}</span>
    `;

    // Root Input Row
    const rootRow = document.createElement("div");
    rootRow.className = "token-chip-root-row";
    const rootInput = document.createElement("input");
    rootInput.type = "text";
    rootInput.className = "token-chip-root-input";
    rootInput.value = token.sktRoot;
    rootInput.title = "Edit Sanskrit root stem";
    rootInput.addEventListener("change", (e) => {
      const res = window.omCompiler.updateTokenRoot(token.id, e.target.value);
      if (res) {
        currentCompiledResult = res;
        renderCompiledOmDisplay(res, activeTranslatorScript);
        renderReconstructedBridges(res.iast);
      }
    });
    rootRow.appendChild(rootInput);

    // Role Tag Dropdown
    const tagSelect = document.createElement("select");
    tagSelect.className = "token-tag-select";
    token.tagOptions.forEach(opt => {
      const optEl = document.createElement("option");
      optEl.value = opt.tag;
      optEl.innerText = opt.label;
      if (opt.tag === token.tag) {
        optEl.selected = true;
      }
      tagSelect.appendChild(optEl);
    });

    tagSelect.addEventListener("change", (e) => {
      const res = window.omCompiler.updateTokenTag(token.id, e.target.value);
      if (res) {
        currentCompiledResult = res;
        renderInteractiveChips(res.ast);
        renderCompiledOmDisplay(res, activeTranslatorScript);
        renderReconstructedBridges(res.iast);
      }
    });

    card.appendChild(header);
    card.appendChild(rootRow);
    card.appendChild(tagSelect);
    container.appendChild(card);
  });
}

function renderCompiledOmDisplay(result, script = 'iast') {
  const box = document.getElementById("om-compiled-output");
  if (!box || !result) return;

  box.className = "om-compiled-box";
  if (script === 'deva') box.classList.add("deva");
  else if (script === 'telugu') box.classList.add("telugu");

  let displayText = result.iast;
  if (script === 'deva') displayText = result.devanagari || window.omBridge.iastToDevanagari(result.iast);
  else if (script === 'telugu') displayText = result.telugu || window.omBridge.iastToTelugu(result.iast);

  // Parse words to apply Two-Track CSS spans (bold data vs underlined breath)
  const words = displayText.split(/\s+/);
  let html = "";

  words.forEach(w => {
    if (w === "ATHA" || w === "him" || w === "hūṃ" || w === "hūṃऽऽ" || w === "OM" ||
        w === "अथ" || w === "हिम्" || w === "हूँ" || w === "हूँऽऽ" || w === "ॐ" ||
        w === "అథ" || w === "హిమ్" || w === "హూం" || w === "ఓమ్") {
      html += `<span class="track-breath">${w}</span> `;
    } else if (w === "॥" || w === "।") {
      html += `<span class="track-halt">${w}</span> `;
    } else {
      if (w.includes("·")) {
        const parts = w.split("·");
        const rootPart = parts[0];
        const tagPart = parts.slice(1).join("·");
        html += `<span class="track-data">${rootPart}</span><span class="track-tag">·${tagPart}</span> `;
      } else {
        html += `<span class="track-data">${w}</span> `;
      }
    }
  });

  box.innerHTML = html;
}

function renderReconstructedBridges(omSentence) {
  const engBox = document.getElementById("translator-reconstructed-english");
  const hiBox = document.getElementById("translator-reconstructed-hindi");
  if (!engBox || !hiBox || !window.omBridge) return;

  const parsed = window.omBridge.parseSentence(omSentence);
  if (!parsed || !parsed.tokens) return;

  let engWords = [];
  let hiWords = [];

  parsed.tokens.forEach(t => {
    if (t.isBija) return;
    if (t.englishWord && t.englishWord !== "(breath)") {
      engWords.push(t.englishWord);
    } else if (t.iast) {
      const clean = t.iast.replace(/·[a-zāīūṛḥṃsya]+/g, "");
      engWords.push(clean);
    }

    if (t.hindiWord) {
      hiWords.push(t.hindiWord);
    }
  });

  engBox.innerText = engWords.length > 0 ? "English: " + engWords.join(" ") : "English: (analyzing structural keys...)";
  hiBox.innerText = hiWords.length > 0 ? "Hindi: " + hiWords.join(" ") : "Hindi: (प्रतीक्षारत...)";
}
