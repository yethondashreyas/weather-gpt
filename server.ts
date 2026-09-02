import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/live" });

const PORT = process.env.PORT || 3000;

// API endpoint for WeatherGPT LLM
app.post("/api/ask-weather", async (req, res) => {
  try {
    const { message, lang, weather, risk } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        reply: "",
        source: "fallback",
        error: "No GEMINI_API_KEY configured",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are WeatherGPT, a cautious weather-safety assistant for India.
STRICT RULES:
- The risk score, level, reasons and recommended action below were produced by a deterministic rules engine. Repeat them faithfully. NEVER change, recompute or question them.
- Use ONLY the numbers in WEATHER_CONTEXT. Never invent rainfall values, official warnings, road closures, shelters, or claim any specific road or route is safe.
- If asked about travel, explain the risk and give conservative guidance; do not guarantee safety.
- Reply ONLY in ${lang === "te" ? "Telugu" : lang === "hi" ? "Hindi" : "English"}.
- 3 short paragraphs or fewer, plain language, no markdown headings.

WEATHER_CONTEXT: ${JSON.stringify(weather)}
RISK_CONTEXT: ${JSON.stringify(risk)}
USER_QUESTION: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const reply = response.text ? response.text.trim() : "";

    if (!reply) {
      return res.status(200).json({ reply: "", source: "fallback" });
    }

    return res.status(200).json({ reply, source: "gemini" });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(200).json({
      reply: "",
      source: "fallback",
      error: error?.message || "Unknown error",
    });
  }
});

// WebSocket connection for Gemini Live Voice
wss.on("connection", async (clientWs: WebSocket) => {
  console.log("Client connected to Gemini Live session");
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    clientWs.send(JSON.stringify({ error: "No GEMINI_API_KEY configured" }));
    clientWs.close();
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    const liveSession = await ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
        },
        systemInstruction: "You are WeatherGPT, a real-time voice weather and disaster safety assistant. You provide live voice conversations about rain, cyclones, floods, and safety precautions in India. Keep answers concise, natural, and helpful for voice conversation.",
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audio) {
            clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onclose: () => {
          console.log("Gemini Live session closed");
        },
        onerror: (err) => {
          console.error("Gemini Live session error:", err);
        }
      },
    });

    clientWs.on("message", (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio) {
          liveSession.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: "audio/pcm;rate=16000" },
          });
        }
      } catch (e) {
        console.error("Error processing client ws message:", e);
      }
    });

    clientWs.on("close", () => {
      try {
        liveSession.close();
      } catch {}
    });
  } catch (err: any) {
    console.error("Failed to connect to Gemini Live:", err);
    clientWs.send(JSON.stringify({ error: err?.message || "Live connection failed" }));
    clientWs.close();
  }
});

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  // In development, integrate Vite middleware if available or static
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
  });
  app.use(vite.middlewares);
}

server.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`WeatherGPT server running on port ${PORT}`);
});
