let audioCtx: AudioContext | null = null;
let sirenInterval: number | null = null;

export function playEmergencySiren() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    if (sirenInterval) {
      clearInterval(sirenInterval);
    }

    const playTone = () => {
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      // Dual-tone alternating emergency siren (European Hi-Lo style: 650Hz & 950Hz square wave)
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = "square";
      osc2.type = "sawtooth";

      osc1.frequency.setValueAtTime(650, now);
      osc1.frequency.setValueAtTime(950, now + 0.3);
      osc1.frequency.setValueAtTime(650, now + 0.6);
      osc1.frequency.setValueAtTime(950, now + 0.9);

      osc2.frequency.setValueAtTime(655, now);
      osc2.frequency.setValueAtTime(955, now + 0.3);
      osc2.frequency.setValueAtTime(655, now + 0.6);
      osc2.frequency.setValueAtTime(955, now + 0.9);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 1.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.25);
      osc2.stop(now + 1.25);
    };

    playTone();
    sirenInterval = window.setInterval(playTone, 1350) as unknown as number;
  } catch (e) {
    console.warn("Audio siren error:", e);
  }
}

export function stopEmergencySiren() {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
}
