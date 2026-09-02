import React, { useState, useEffect, useRef } from "react";
import { useWeatherGPT } from "../../lib/WeatherGPTContext";
import { Mic, MicOff, X, Volume2, Sparkles, Activity } from "lucide-react";

interface GeminiLiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiLiveVoiceModal: React.FC<GeminiLiveVoiceModalProps> = ({ isOpen, onClose }) => {
  const { weather, risk, lang } = useWeatherGPT();
  const [status, setStatus] = useState<string>("Connecting to Gemini Live...");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  // Helper to convert Float32Array PCM to base64
  const pcmToBase64 = (float32Array: Float32Array) => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = "";
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  };

  // Helper to play base64 24kHz PCM audio chunk gaplessly
  const playAudioChunk = (base64Data: string) => {
    try {
      if (!outputAudioCtxRef.current) {
        outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 24000,
        });
      }
      const outCtx = outputAudioCtxRef.current;
      if (outCtx.state === "suspended") {
        outCtx.resume();
      }

      const binary = atob(base64Data);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / (int16[i] < 0 ? 0x8000 : 0x7FFF);
      }

      const audioBuffer = outCtx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = outCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outCtx.destination);

      const currentTime = outCtx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }
      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;

      setIsSpeaking(true);
      source.onended = () => {
        if (outCtx.currentTime >= nextStartTimeRef.current - 0.05) {
          setIsSpeaking(false);
        }
      };
    } catch (e) {
      console.error("Error playing audio chunk:", e);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      cleanup();
      return;
    }

    setStatus("Connecting to Gemini Live...");
    setErrorMsg("");

    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${location.host}/live`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = async () => {
      setStatus("Connected! Initializing microphone...");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const inputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 16000,
        });
        inputAudioCtxRef.current = inputAudioCtx;

        const source = inputAudioCtx.createMediaStreamSource(stream);
        sourceRef.current = source;

        const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const base64 = pcmToBase64(inputData);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ audio: base64 }));
          }
        };

        source.connect(processor);
        processor.connect(inputAudioCtx.destination);
        setIsListening(true);
        setStatus("Gemini Live Active. Speak about weather or rain...");
      } catch (err: any) {
        console.error("Mic error:", err);
        setErrorMsg("Microphone permission denied or unavailable.");
        setStatus("Microphone error");
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          setErrorMsg(data.error);
          setStatus("Error from server");
        }
        if (data.audio) {
          playAudioChunk(data.audio);
        }
        if (data.interrupted) {
          nextStartTimeRef.current = 0;
          setIsSpeaking(false);
        }
      } catch (e) {
        console.error("WS message parse error:", e);
      }
    };

    ws.onerror = (e) => {
      console.error("WS error:", e);
      setErrorMsg("WebSocket connection error.");
      setStatus("Connection failed");
    };

    ws.onclose = () => {
      setStatus("Disconnected from Gemini Live.");
      setIsListening(false);
    };

    return () => {
      cleanup();
    };
  }, [isOpen]);

  const cleanup = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current && sourceRef.current && inputAudioCtxRef.current) {
      try {
        sourceRef.current.disconnect();
        processorRef.current.disconnect();
        inputAudioCtxRef.current.close();
      } catch {}
      processorRef.current = null;
      sourceRef.current = null;
      inputAudioCtxRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      try {
        outputAudioCtxRef.current.close();
      } catch {}
      outputAudioCtxRef.current = null;
    }
    setIsListening(false);
    setIsSpeaking(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-indigo-950 border border-indigo-500/30 rounded-3xl shadow-2xl p-6 text-white flex flex-col items-center overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600 rounded-full filter blur-3xl opacity-25 animate-pulse pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600 rounded-full filter blur-3xl opacity-25 animate-pulse pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            cleanup();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-slate-300" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          <span>Gemini Live Voice AI</span>
        </div>

        {/* Visualizer / Orb */}
        <div className="relative my-8 flex items-center justify-center">
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              isSpeaking
                ? "bg-gradient-to-tr from-cyan-500 to-blue-500 shadow-cyan-500/50 scale-110 animate-pulse"
                : isListening
                ? "bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-600/40 animate-pulse"
                : "bg-slate-800"
            }`}
          >
            <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
              <Activity className={`w-10 h-10 ${isSpeaking ? "text-cyan-400 animate-bounce" : "text-blue-400"}`} />
            </div>
          </div>

          {/* Ripple rings */}
          {isListening && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping pointer-events-none" />
          )}
        </div>

        {/* Status Text */}
        <h3 className="text-lg font-bold text-center mb-1">
          {isSpeaking ? "Gemini Speaking..." : isListening ? "Listening to you..." : "Connecting..."}
        </h3>
        <p className="text-xs text-slate-400 text-center max-w-xs mb-6">{status}</p>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-3 text-xs text-red-200 text-center mb-4 w-full">
            {errorMsg}
          </div>
        )}

        {/* Context Hint */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-slate-300 text-center mb-6">
          <span className="text-blue-400 font-semibold block mb-0.5">Active Location: {weather.locationName}</span>
          <span>Risk Level: {risk.level} ({risk.score}/100)</span>
        </div>

        {/* Controls */}
        <div className="flex space-x-3 w-full">
          <button
            onClick={() => {
              cleanup();
              onClose();
            }}
            className="flex-1 py-3 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-semibold text-sm transition-colors flex items-center justify-center space-x-2 shadow-lg"
          >
            <MicOff className="w-4 h-4" />
            <span>End Live Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
