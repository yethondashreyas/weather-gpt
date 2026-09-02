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
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sawtooth";

      // Emergency siren sweep 450Hz -> 850Hz -> 450Hz
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(850, now + 0.6);
      osc.frequency.linearRampToValueAtTime(450, now + 1.2);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    };

    playTone();
    sirenInterval = window.setInterval(playTone, 1500) as unknown as number;
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
