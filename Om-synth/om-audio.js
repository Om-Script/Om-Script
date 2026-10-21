/**
 * om-audio.js
 * Dual-Engine Acoustic Synthesizer for ॐ-Script
 * 1. Web Audio API Procedural Synthesizer for Carrier Waves (him, hūṃ, OM, ॥)
 * 2. UBC Sanskrit MP3 Streamer & Cache for Isolated Phonemes
 * 3. Browser Neural Speech Engine for Smooth Continuous Reading with Live Boundary Events
 */

class OmAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.soundCache = new Map();
    this.isPlaying = false;
    this.playbackQueue = [];
    this.currentStep = 0;
    this.playbackRate = 1.0;
    this.playbackPitch = 0.85; // Default 0.85 for deep resonant Vedic chanting
    this.bijaMode = "human"; // "human", "bell", "mute"
    this.playbackEngine = "buffered"; // "buffered" (default continuous flow) or "step" (discrete)
    this.onTokenChange = null;
    this.onPlaybackEnd = null;
    this.onVoicesLoaded = null;
    this.activeUtterance = null;

    // Detect Indic speech synthesis voices
    this.availableVoices = [];
    this.selectedVoice = null;
    this.initVoices();
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  initVoices() {
    if ('speechSynthesis' in window) {
      const load = () => {
        this.availableVoices = window.speechSynthesis.getVoices();
        // Priority 1: sa-IN (Sanskrit), Priority 2: hi-IN (Hindi), Priority 3: any Indic
        this.selectedVoice = this.availableVoices.find(v => v.lang === 'sa-IN' || v.lang === 'sa') ||
                             this.availableVoices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi')) ||
                             this.availableVoices.find(v => v.lang.includes('IN')) ||
                             this.availableVoices[0];
        if (this.onVoicesLoaded) {
          this.onVoicesLoaded(this.availableVoices, this.selectedVoice);
        }
      };
      load();
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  // =========================================================================
  // 1. ACOUSTIC PHYSICAL MODELING & VEDIC SINGING BOWL RESONANCE
  // =========================================================================

  // Natural acoustic Tibetan singing bowl / meditation chime
  // Uses physical modeling: mallet strike transient + detuned partials + exponential decay
  playSingingBowlChime(fundamental = 432, duration = 1.4, gainLevel = 0.25) {
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;

    // Master bus with gentle acoustic compression
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(gainLevel, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    masterGain.connect(ctx.destination);

    // 1. Soft mallet felt strike transient (filtered noise burst)
    const strikeBufferSize = Math.floor(ctx.sampleRate * 0.015);
    const strikeBuffer = ctx.createBuffer(1, strikeBufferSize, ctx.sampleRate);
    const strikeData = strikeBuffer.getChannelData(0);
    for (let i = 0; i < strikeBufferSize; i++) {
      strikeData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (strikeBufferSize * 0.3));
    }
    const strikeSource = ctx.createBufferSource();
    strikeSource.buffer = strikeBuffer;
    const strikeFilter = ctx.createBiquadFilter();
    strikeFilter.type = "lowpass";
    strikeFilter.frequency.setValueAtTime(600, now);
    strikeSource.connect(strikeFilter);
    strikeFilter.connect(masterGain);
    strikeSource.start(now);

    // 2. Multi-partial singing bowl modes with acoustic shimmer
    const modes = [
      { freq: fundamental, gain: 0.6, decay: duration },
      { freq: fundamental * 1.004, gain: 0.5, decay: duration * 0.95 },
      { freq: fundamental * 2.76, gain: 0.25, decay: duration * 0.6 },
      { freq: fundamental * 5.4, gain: 0.12, decay: duration * 0.35 }
    ];

    modes.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(gain, now + 0.02);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + decay);
    });

    return duration * 1000;
  }

  // Soft natural breath intake (gentle respiration)
  playSoftBreath(duration = 0.22) {
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(950, now);
    filter.Q.setValueAtTime(1.8, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + duration * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    return duration * 1000;
  }

  playTerminalHalt(duration = 0.4) {
    return this.playSingingBowlChime(432, duration, 0.25);
  }

  // =========================================================================
  // 2. PHONEME AUDIO STREAMER & AUTOMATIC SILENCE TRIMMING (DSP)
  // =========================================================================

  // Trims leading encoder silence and trailing room tone from audio buffers
  async loadAndTrimAudio(url) {
    if (!this.trimmedBufferCache) {
      this.trimmedBufferCache = new Map();
    }
    if (this.trimmedBufferCache.has(url)) {
      return this.trimmedBufferCache.get(url);
    }

    const ctx = this.getAudioContext();
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);

    // Audio DSP: Scan PCM samples for actual vocal onset and release
    const channelData = decodedBuffer.getChannelData(0);
    const threshold = 0.012; // Silence gate threshold
    let start = 0;
    while (start < channelData.length && Math.abs(channelData[start]) < threshold) {
      start++;
    }
    let end = channelData.length - 1;
    while (end > start && Math.abs(channelData[end]) < threshold) {
      end--;
    }

    // Safety margin of 3ms to avoid click/pop transients
    const margin = Math.floor(decodedBuffer.sampleRate * 0.003);
    start = Math.max(0, start - margin);
    end = Math.min(channelData.length, end + margin);

    const length = Math.max(1, end - start);
    const trimmed = ctx.createBuffer(decodedBuffer.numberOfChannels, length, decodedBuffer.sampleRate);
    for (let c = 0; c < decodedBuffer.numberOfChannels; c++) {
      trimmed.copyToChannel(decodedBuffer.getChannelData(c).subarray(start, end), c);
    }

    this.trimmedBufferCache.set(url, trimmed);
    return trimmed;
  }

  async playUbcPhoneme(filename) {
    if (!filename) return;
    const ctx = this.getAudioContext();

    // Check local sounds/ first (instant zero-latency), fallback to remote UBC
    const localUrl = `sounds/${filename}`;
    const remoteUrl = `https://ubcsanskrit.ca/sounds/${filename}`;

    try {
      let buffer;
      try {
        buffer = await this.loadAndTrimAudio(localUrl);
      } catch (eLocal) {
        buffer = await this.loadAndTrimAudio(remoteUrl);
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);

      return new Promise(resolve => {
        source.onended = resolve;
      });
    } catch (err) {
      console.warn("Audio load error, falling back to Web Speech:", err);
      return this.speakWordFallback(filename.replace(/^as-|\.mp3$/g, ''));
    }
  }

  speakWordFallback(text) {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        setTimeout(resolve, 300);
        return;
      }
      const utter = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) utter.voice = this.selectedVoice;
      utter.rate = this.playbackRate;
      utter.onend = () => resolve();
      utter.onerror = () => resolve();
      window.speechSynthesis.speak(utter);
    });
  }

  // =========================================================================
  // 3. CONTINUOUS SPEECH SYNTHESIS ENGINES
  // =========================================================================

  playSentenceTokens(tokens, onTokenChange, onPlaybackEnd) {
    if (this.playbackEngine === "buffered") {
      return this.playBufferedSentence(tokens, onTokenChange, onPlaybackEnd);
    } else {
      return this.playStepByStepSentence(tokens, onTokenChange, onPlaybackEnd);
    }
  }

  // -------------------------------------------------------------------------
  // BUFFERED STREAM: Assembles the entire sentence into ONE continuous, smooth breath!
  // Natural prosody without stop-and-start micro-delays between words.
  // -------------------------------------------------------------------------
  playBufferedSentence(tokens, onTokenChange, onPlaybackEnd) {
    this.stop();
    this.isPlaying = true;
    this.onTokenChange = onTokenChange;
    this.onPlaybackEnd = onPlaybackEnd;

    if (!('speechSynthesis' in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    // Build buffered spoken sentence & token offset mapping without artificial comma pauses
    let bufferedText = "";
    const tokenRanges = [];

    tokens.forEach((token, idx) => {
      let spokenSegment = "";

      if (token.isBija) {
        if (this.bijaMode === "mute") {
          spokenSegment = ""; // Skip spoken bīja
        } else if (this.bijaMode === "bell") {
          spokenSegment = ""; // Sound triggered acoustically
        } else {
          // Human voice chanting without artificial comma pauses
          const bBase = token.bijaBase || token.raw;
          if (bBase === "him" || bBase === "hum") spokenSegment = "हिम्";
          else if (bBase === "hūṃ" || bBase === "hīṃ") spokenSegment = "हूँ";
          else if (bBase === "OM") spokenSegment = "ॐ";
          else if (bBase === "॥" || bBase === "।") spokenSegment = "";
        }
      } else {
        spokenSegment = token.deva || token.iast;
      }

      if (spokenSegment) {
        const start = bufferedText.length;
        bufferedText += (bufferedText ? " " : "") + spokenSegment;
        const end = bufferedText.length;
        tokenRanges.push({ tokenIdx: idx, start, end, token, spokenSegment });
      } else {
        tokenRanges.push({ tokenIdx: idx, start: -1, end: -1, token, spokenSegment: "" });
      }
    });


    const utter = new SpeechSynthesisUtterance(bufferedText);
    this.activeUtterance = utter;
    if (this.selectedVoice) utter.voice = this.selectedVoice;
    utter.rate = Math.max(0.65, Math.min(1.3, this.playbackRate * 0.9));
    utter.pitch = this.playbackPitch;

    let currentHighlightedToken = -1;

    // Real-time word boundary synchronization (Karaoke)
    utter.onboundary = (event) => {
      if (!this.isPlaying) return;
      if (event.name === 'word' || event.name === 'sentence') {
        const charIdx = event.charIndex;

        // Match charIdx to token range
        const matched = tokenRanges.find(r => r.start !== -1 && charIdx >= r.start && charIdx <= r.end) ||
                        tokenRanges.find(r => r.start !== -1 && Math.abs(charIdx - r.start) <= 4);

        if (matched && matched.tokenIdx !== currentHighlightedToken) {
          currentHighlightedToken = matched.tokenIdx;
          if (this.onTokenChange) {
            this.onTokenChange(matched.tokenIdx, matched.token);
          }

          // Concurrent acoustic singing bowl layers on bījas
          const mult = matched.token.durationMultiplier || 1.0;
          const bBase = matched.token.bijaBase || matched.token.raw;
          if (bBase === "OM") {
            this.playSingingBowlChime(136.1, (1.8 * mult) / this.playbackRate, 0.22);
          } else if (bBase === "him" || bBase === "hum") {
            this.playSoftBreath((0.18 * mult) / this.playbackRate);
          } else if (bBase === "hūṃ" || bBase === "hīṃ") {
            this.playSingingBowlChime(216, (0.9 * mult) / this.playbackRate, 0.12);
          } else if (bBase === "॥" || bBase === "।") {
            this.playSingingBowlChime(432, (1.6 * mult) / this.playbackRate, 0.3);
          }
        }
      }
    };

    utter.onstart = () => {
      // Highlight initial token immediately
      if (tokenRanges.length && tokenRanges[0].start !== -1) {
        currentHighlightedToken = 0;
        if (this.onTokenChange) this.onTokenChange(0, tokenRanges[0].token);
        if (tokenRanges[0].token.raw === "him") this.playSoftBreath(0.18);
      }
    };

    utter.onend = () => {
      this.isPlaying = false;
      this.activeUtterance = null;
      if (this.onTokenChange) this.onTokenChange(-1, null);
      if (this.onPlaybackEnd) this.onPlaybackEnd();
    };

    utter.onerror = () => {
      this.isPlaying = false;
      this.activeUtterance = null;
      if (this.onTokenChange) this.onTokenChange(-1, null);
      if (this.onPlaybackEnd) this.onPlaybackEnd();
    };

    window.speechSynthesis.speak(utter);
  }

  // -------------------------------------------------------------------------
  // STEP-BY-STEP PACING: Discrete word analysis loop
  // -------------------------------------------------------------------------
  async playStepByStepSentence(tokens, onTokenChange, onPlaybackEnd) {
    this.stop();
    this.isPlaying = true;
    this.onTokenChange = onTokenChange;
    this.onPlaybackEnd = onPlaybackEnd;

    for (let i = 0; i < tokens.length; i++) {
      if (!this.isPlaying) break;

      const token = tokens[i];
      if (this.onTokenChange) {
        this.onTokenChange(i, token);
      }

      if (token.isBija) {
        const mult = token.durationMultiplier || 1.0;
        const bBase = token.bijaBase || token.raw;
        if (this.bijaMode === "mute") {
          await new Promise(r => setTimeout(r, (260 * mult) / this.playbackRate));
        } else if (this.bijaMode === "bell") {
          if (bBase === "him" || bBase === "hum") {
            this.playSoftBreath((0.2 * mult) / this.playbackRate);
            await new Promise(r => setTimeout(r, (220 * mult) / this.playbackRate));
          } else if (bBase === "hūṃ" || bBase === "hīṃ") {
            this.playSingingBowlChime(216, (1.2 * mult) / this.playbackRate, 0.2);
            await new Promise(r => setTimeout(r, (350 * mult) / this.playbackRate));
          } else if (bBase === "OM") {
            this.playSingingBowlChime(136.1, (1.8 * mult) / this.playbackRate, 0.25);
            await new Promise(r => setTimeout(r, (600 * mult) / this.playbackRate));
          } else if (bBase === "॥" || bBase === "।") {
            const chimeMs = this.playSingingBowlChime(432, (1.6 * mult) / this.playbackRate, 0.3);
            await new Promise(r => setTimeout(r, Math.min(600 * mult, chimeMs)));
          }
        } else {
          if (bBase === "him" || bBase === "hum") {
            this.playSoftBreath((0.18 * mult) / this.playbackRate);
            await this.speakWordAsync("हिम्", { pitch: 0.95, rate: this.playbackRate * (mult < 1 ? 1.2 : 0.95), volume: 0.85 });
            await new Promise(r => setTimeout(r, (100 * mult) / this.playbackRate));
          } else if (bBase === "hūṃ" || bBase === "hīṃ") {
            this.playSingingBowlChime(216, (0.9 * mult) / this.playbackRate, 0.12);
            await this.speakWordAsync("हूँ", { pitch: 0.85, rate: this.playbackRate * (mult < 1 ? 1.2 : 0.8), volume: 0.9 });
            await new Promise(r => setTimeout(r, (160 * mult) / this.playbackRate));
          } else if (bBase === "OM") {
            this.playSingingBowlChime(136.1, (1.8 * mult) / this.playbackRate, 0.22);
            await this.speakWordAsync("ॐ", { pitch: 0.9, rate: this.playbackRate * (mult < 1 ? 1.1 : 0.75), volume: 1.0 });
            await new Promise(r => setTimeout(r, (250 * mult) / this.playbackRate));
          } else if (bBase === "॥" || bBase === "।") {
            const chimeMs = this.playSingingBowlChime(432, (1.5 * mult) / this.playbackRate, 0.3);
            await new Promise(r => setTimeout(r, Math.min(600 * mult, chimeMs)));
          }
        }
      } else {
        const speechText = token.deva || token.iast;
        await this.speakWordAsync(speechText, { pitch: 1.0, rate: this.playbackRate * 0.92 });
        await new Promise(r => setTimeout(r, 130 / this.playbackRate));
      }
    }

    this.isPlaying = false;
    if (this.onTokenChange) this.onTokenChange(-1, null);
    if (this.onPlaybackEnd) this.onPlaybackEnd();
  }


  speakWordAsync(text, options = {}) {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        setTimeout(resolve, 350);
        return;
      }

      const utter = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) utter.voice = this.selectedVoice;
      utter.rate = options.rate || Math.max(0.6, Math.min(1.4, this.playbackRate * 0.9));
      utter.pitch = options.pitch !== undefined ? options.pitch : this.playbackPitch;
      utter.volume = options.volume !== undefined ? options.volume : 1.0;

      utter.onend = () => resolve();
      utter.onerror = () => resolve();
      window.speechSynthesis.speak(utter);
    });
  }


  stop() {
    this.isPlaying = false;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.onTokenChange) {
      this.onTokenChange(-1, null);
    }
  }
}

window.OmAudioEngine = new OmAudioEngine();
