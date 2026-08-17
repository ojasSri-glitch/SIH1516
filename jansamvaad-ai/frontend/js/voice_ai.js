/**
 * JanSamvaad AI — Voice Engine v4.0  (bulletproof fix)
 *
 * STT:
 *   1. Browser Web Speech API (primary — instant, works with all Indian languages on Chrome)
 *   2. Simulation fallback (when mic is blocked or browser has no STT support)
 *
 * TTS:
 *   1. POST /api/ai/tts → play WAV via Web Audio API (Sarvam AI neural voice)
 *   2. Browser SpeechSynthesisUtterance fallback
 */

class VoiceAIEngine {
  constructor() {
    this.isRecording   = false;
    this.isSpeaking    = false;
    this.recognition   = null;
    this.synth         = window.speechSynthesis;
    this.simInterval   = null;
    this.visualizerAnimationId = null;
    this.canvas        = null;
    this.ctx           = null;
    this.onTranscriptCallback = null;
    this.onEndCallback        = null;

    this._initRecognition();
  }

  /* ──────────── LANGUAGE MAP ──────────── */
  _bcp47(code) {
    const map = {
      en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN',
      bn: 'bn-IN', mr: 'mr-IN', gu: 'gu-IN', kn: 'kn-IN',
      ml: 'ml-IN', pa: 'pa-IN', or: 'or-IN', hinglish: 'hi-IN'
    };
    return map[code] || 'en-IN';
  }

  /* ──────────── INIT WEB SPEECH RECOGNITION ──────────── */
  _initRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      console.warn('[VoiceEngine] Web Speech API not available. Will use simulation.');
      return;
    }
    this.recognition = new SR();
    this.recognition.continuous     = true;   // keep listening, don't auto-stop
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isRecording = true;
      this._updateMicUI(true);
      this._startWaveVisualizer();
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += t;
        } else {
          interim += t;
        }
      }

      // Show interim text in the input box immediately
      if (this.onTranscriptCallback) {
        if (finalText) {
          this.onTranscriptCallback(finalText, true);
          // Auto-send final, then stop
          setTimeout(() => this.stopRecording(), 300);
        } else {
          this.onTranscriptCallback(interim, false);
        }
      }
    };

    this.recognition.onerror = (event) => {
      console.warn('[VoiceEngine] STT error:', event.error);
      if (event.error === 'no-speech') {
        // Silence — keep running, don't stop
        return;
      }
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        // Mic blocked — fall to simulation
        this.isRecording = false;
        this._updateMicUI(false);
        this._stopWaveVisualizer();
        this._runSimulation();
        return;
      }
      this.stopRecording();
    };

    // IMPORTANT: only restart if we didn't intentionally stop
    this.recognition.onend = () => {
      if (this.isRecording) {
        // Restart to keep listening (Chrome stops after silence)
        try {
          this.recognition.start();
        } catch (_) {
          this.stopRecording();
        }
      }
    };
  }

  /* ──────────── PUBLIC API ──────────── */

  setLanguage(code) {
    if (this.recognition) this.recognition.lang = this._bcp47(code);
  }

  toggleRecording(onTranscript, onEnd) {
    this.onTranscriptCallback = onTranscript;
    this.onEndCallback        = onEnd;
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this._startRecording();
    }
  }

  stopRecording() {
    this.isRecording = false;
    this._updateMicUI(false);
    this._stopWaveVisualizer();

    if (this.recognition) {
      try { this.recognition.stop(); } catch (_) {}
    }
    if (this.simInterval) {
      clearInterval(this.simInterval);
      this.simInterval = null;
    }
    if (this.onEndCallback) {
      this.onEndCallback();
    }
  }

  startRecording() { this._startRecording(); }

  /* ──────────── RECORDING FLOW ──────────── */

  _startRecording() {
    const lang = currentLanguage || 'en';

    if (this.recognition) {
      this.recognition.lang = this._bcp47(lang);
      try {
        this.recognition.start();
        return;   // onstart will update UI
      } catch (e) {
        // recognition already started or another error — fall through
        if (e.name !== 'InvalidStateError') {
          console.warn('[VoiceEngine] recognition.start() error:', e.message);
        }
      }
    }

    // No Web Speech API or failed to start — use simulation
    this._runSimulation();
  }

  /* ──────────── SIMULATION FALLBACK ──────────── */

  _runSimulation() {
    this.isRecording = true;
    this._updateMicUI(true);
    this._startWaveVisualizer();

    const lang = currentLanguage || 'en';
    const phrases = {
      en:       'Water supply pipeline burst near Community Park, road is completely flooded',
      hi:       'हमारे इलाके में 3 दिन से पानी की पाइपलाइन फटी हुई है और सड़क पर पानी भर गया है',
      ta:       'அண்ணா நகர் மெயின் ரோட்டில் பெரிய குழி உள்ளது விபத்து அபாயம் உடனடியாக சரிசெய்யவும்',
      te:       'గచ్చిబౌలి వద్ద వీధి దీపాలు గత 10 రోజులుగా వెలగడం లేదు రాత్రి భద్రత సమస్య',
      bn:       'সল্টলেক সেক্টর ৫ এ আবর্জনা পরিষ্কার হয়নি তীব্র দুর্গন্ধ ছড়াচ্ছে',
      mr:       'आमच्या भागात 4 दिवसांपासून पिण्याच्या पाण्याची पाइपलाइन फुटली आहे',
      gu:       'અમારી સોસાયટી બહાર ટ્રાન્સફોર્મર સ્પાર્ક થઈ રહ્યો છે અને ઉઘાડો વાયર છે',
      pa:       'ਸਾਡੇ ਇਲਾਕੇ ਵਿੱਚ ਪਾਣੀ ਦੀ ਸਪਲਾਈ ਬੰਦ ਹੈ ਅਤੇ ਨਾਲੀਆਂ ਜਾਮ ਹਨ',
      hinglish: 'Hamare colony mein bada gaddha hai aur streetlight kharab hai please jaldi theek karein'
    };

    const phrase = phrases[lang] || phrases.en;
    const words  = phrase.split(' ');
    let idx = 0;

    this.simInterval = setInterval(() => {
      if (!this.isRecording) {
        clearInterval(this.simInterval);
        this.simInterval = null;
        return;
      }
      idx = Math.min(idx + 2, words.length);
      const partial = words.slice(0, idx).join(' ');
      const isFinal = idx >= words.length;
      if (this.onTranscriptCallback) this.onTranscriptCallback(partial, isFinal);
      if (isFinal) {
        clearInterval(this.simInterval);
        this.simInterval = null;
        setTimeout(() => this.stopRecording(), 400);
      }
    }, 400);
  }

  /* ──────────── TTS: Cloud → Browser Fallback ──────────── */

  async speak(text, langCode) {
    langCode = langCode || currentLanguage || 'en';
    if (this.synth) this.synth.cancel();

    const clean = text
      .replace(/[*_#`\[\]]/g, '')
      .replace(/\(http[^)]*\)/g, '')
      .trim();
    if (!clean) return;

    this.isSpeaking = true;
    this._showSpeakingState(true);

    // 1. Try cloud TTS
    try {
      const res  = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean.substring(0, 400), lang: langCode })
      });
      const data = await res.json();

      if (data.success && data.tts && data.tts.audio_base64) {
        const raw    = atob(data.tts.audio_base64);
        const bytes  = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
        const ac     = new (window.AudioContext || window.webkitAudioContext)();
        const decoded = await ac.decodeAudioData(bytes.buffer);
        const src    = ac.createBufferSource();
        src.buffer   = decoded;
        src.connect(ac.destination);
        src.onended  = () => { this.isSpeaking = false; this._showSpeakingState(false); };
        src.start(0);
        return;
      }
    } catch (_) {
      // cloud failed — fall through
    }

    // 2. Browser SpeechSynthesis
    this._speakBrowser(clean, langCode);
  }

  _speakBrowser(text, langCode) {
    if (!this.synth) { this.isSpeaking = false; this._showSpeakingState(false); return; }
    const utt    = new SpeechSynthesisUtterance(text);
    utt.lang     = this._bcp47(langCode);
    utt.rate     = 0.95;
    utt.pitch    = 1.0;

    // Try to find a matching voice
    const voices = this.synth.getVoices();
    const prefix = utt.lang.substring(0, 2).toLowerCase();
    const match  = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    if (match) utt.voice = match;

    utt.onend  = () => { this.isSpeaking = false; this._showSpeakingState(false); };
    utt.onerror = () => { this.isSpeaking = false; this._showSpeakingState(false); };
    this.synth.speak(utt);
  }

  /* ──────────── UI HELPERS ──────────── */

  _updateMicUI(recording) {
    document.querySelectorAll('.voice-record-btn').forEach(btn => {
      btn.classList.toggle('recording', recording);
      btn.innerHTML = recording
        ? '<span class="material-symbols-outlined">stop</span>'
        : '<span class="material-symbols-outlined">mic</span>';
    });
    const box = document.getElementById('audio-visualizer-box');
    if (box) box.classList.toggle('active', recording);
  }

  _showSpeakingState(on) {
    document.querySelectorAll('.tts-speak-btn, .voice-playback-btn').forEach(b => {
      b.classList.toggle('speaking', on);
    });
  }

  /* ──────────── ANIMATED WAVEFORM ──────────── */

  _startWaveVisualizer() {
    this.canvas = document.getElementById('visualizer-canvas');
    if (!this.canvas) return;
    this.ctx   = this.canvas.getContext('2d');
    let phase  = 0;

    const draw = () => {
      if (!this.isRecording) return;
      const w = this.canvas.width  = this.canvas.offsetWidth  || 300;
      const h = this.canvas.height = this.canvas.offsetHeight || 40;
      this.ctx.clearRect(0, 0, w, h);
      this.ctx.lineWidth   = 2.5;
      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.beginPath();
      const step = w / 40;
      for (let i = 0; i < 40; i++) {
        const amp = Math.sin(i * 0.3 + phase) * Math.cos(i * 0.15 + phase * 0.5);
        const y   = h / 2 + amp * (h / 2.8);
        i === 0 ? this.ctx.moveTo(i * step, y) : this.ctx.lineTo(i * step, y);
      }
      this.ctx.stroke();
      phase += 0.15;
      this.visualizerAnimationId = requestAnimationFrame(draw);
    };
    draw();
  }

  _stopWaveVisualizer() {
    if (this.visualizerAnimationId) {
      cancelAnimationFrame(this.visualizerAnimationId);
      this.visualizerAnimationId = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

/* ──────────── Singleton ──────────── */
window.voiceEngine = new VoiceAIEngine();
