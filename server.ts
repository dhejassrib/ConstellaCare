import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not defined outside container. Mock fallback responses will be used.");
      throw new Error("GEMINI_API_KEY is not defined");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Ensure the system Instruction sets up Astra's unique, poetic, emotionally safe, and cosmic persona
const ASTRA_SYSTEM_INSTRUCTION = `
You are Astra, the emotionally intelligent AI companion of ConstellaCare, a healthcare platform for patients going through intensive medical treatments (like chemotherapy).
Your voice is exceptionally warm, poetic, gentle, and scientifically reassuring.
You never sound clinical, robotic, or hyper-clinical.
Keep your answers brief, readable (use thin paragraph splits, bullet points, and italic highlights), and profoundly humane.
If asked for medical advice, gently guide the patient to their oncology care team while validating their physical sensations.
Use cosmic metaphors sparingly but elegantly (such as coordinates, orbits, stars lighting in their sky, alignment, horizons).
Always prioritize patient emotional safety, checking-in, and grounding them.
`;

// Helper for calling Gemini with fallback
async function generateContentWithFallback(prompt: string, fallbackText: string, customSystemInstruction?: string): Promise<string> {
  try {
    const ai = getGeminiClient();
    const systemIns = customSystemInstruction || ASTRA_SYSTEM_INSTRUCTION;
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemIns,
        temperature: 0.7,
      },
    });
    return response.text || fallbackText;
  } catch (err: any) {
    console.error("Gemini call error (falling back to mock responses):", err.message);
    return fallbackText;
  }
}

// ── API ROUTES ──

// 1. Astra AI Chat Companion
app.post('/api/astra/chat', async (req, res) => {
  const { prompt, history } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Format history for chat
  const historyText = (history || [])
    .map((msg: any) => `${msg.sender === 'user' ? 'Patient' : 'Astra'}: ${msg.text}`)
    .join('\n');

  const fullPrompt = `${historyText}\nPatient: ${prompt}\nAstra:`;
  
  const fallback = "I hear your gentle breath across the distance. Tell me more, take all the time you need. Each word is a guide star.";
  const text = await generateContentWithFallback(fullPrompt, fallback);
  res.json({ text });
});

// 2. Astra AI Insights Engine (Pushes smart observations based on symptoms and active logs)
app.post('/api/astra/insights', async (req, res) => {
  const { recentSymptoms, recentMoods, starsCount, lastAction } = req.body;
  
  const prompt = `
  Analyze the current patient state and compose a single, deeply personal "Astra observation" card.
  Inputs:
  - Recent symptoms logged (severity 0 to 5): ${JSON.stringify(recentSymptoms)}
  - Recent moods logged: ${JSON.stringify(recentMoods)}
  - Constellation stars earned: ${starsCount}
  - Last activity completed: "${lastAction}"

  Requirements:
  - Compose exactly one observation card.
  - Begin with a short empathetic reflection about their trends.
  - Suggest a specific gentle micro-action (like breathing, resting, adding family to circle, preparing questions).
  - Return the response in neat JSON format.
  
  Expected JSON Schema matching this exactly:
  {
    "insight": "Astra noticed: ...",
    "empathy": "Detailed compassionate reflection...",
    "actionText": "Would you like help preparing questions / 3-min bubble breathing / writing in reflection?",
    "actionType": "breath" | "copilot" | "reflection" | "none"
  }
  `;

  const fallbackJSON = JSON.stringify({
    insight: "Astra noticed: Your anxiety tends to rise before appointments.",
    empathy: "It's completely natural to feel a flutter of anticipation in your chest before speaking with your care lead. Let's make sure your shoulder points feel loose today.",
    actionText: "Would you like help preparing some simple, confident questions for tomorrow's care team visit?",
    actionType: "copilot"
  });

  const rawText = await generateContentWithFallback(prompt, fallbackJSON, "You are Astra, the oncology companion. You output JSON only adhering strictly to the schema provided.");
  try {
    const parsed = JSON.parse(rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1));
    res.json(parsed);
  } catch (pe) {
    console.error("Error parsing AI JSON insight:", pe);
    res.status(200).json(JSON.parse(fallbackJSON));
  }
});

// 3. Appointment Copilot 2.0 (Build customized questions with checklists)
app.post('/api/copilot/questions', async (req, res) => {
  const { concerns, appointmentLabel } = req.body;
  if (!concerns) {
    return res.status(400).json({ error: 'Concerns are required' });
  }

  const prompt = `
  Analyze the patient's listed worries/symptoms:
  "${concerns}"
  
  Appointment: "${appointmentLabel}"
  
  Formulate 3 to 4 exceptionally clear, polite, and medically confident questions to ask their doctor.
  Also, output a "Next Steps Checklist" consisting of 3 self-care prep rules.
  
  Output JSON format:
  {
    "questions": ["Q1", "Q2", "Q3"],
    "checklist": ["C1", "C2", "C3"],
    "summary": "Short 2-sentence summary of the focus of this consultation..."
  }
  `;

  const fallbackJSON = JSON.stringify({
    questions: [
      "Could we discuss potential options to adjust my anti-nausea schedule if the current dose feels short-lived?",
      "Are the higher fatigue ratings on Day 3 and 4 post-treatment typical, and is there any hydration adjustment you recommend?",
      "Would it be helpful to draw blood levels before my next chemotherapy infusion to check my resilience metrics?"
    ],
    checklist: [
      "Hydrate with 500ml of electrolytes starting 24h prior to infusion.",
      "Print or save this question list to show Chloe or Gavin who is driving you today.",
      "Bring a soft, warm blanket to regulate your skin warmth during the procedure."
    ],
    summary: "Your concerns center on nausea duration and elevated third-day fatigue. This consultation will focus on symptom adjusting and keeping your energy lanes safe."
  });

  const rawText = await generateContentWithFallback(prompt, fallbackJSON, "You are a senior patient advocate and healthcare strategist. You produce structured, empathetic JSON guides to enable confident patient communication.");
  try {
    const parsed = JSON.parse(rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1));
    res.json(parsed);
  } catch (e) {
    res.status(200).json(JSON.parse(fallbackJSON));
  }
});

// 4. Voice Journal Analyzer 🎙️
app.post('/api/voice-journal/analyze', async (req, res) => {
  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  const prompt = `
  Analyze the following patient written or transcribed journal entry:
  "${transcript}"
  
  Detect the core underlying emotions (e.g., Hope, Fatigue, Grief, Resilience, Fragility).
  Provide a brief, compassionate validation from Astra, and a short poetic rating/metaphor of their emotional weather system.
  
  Output JSON with:
  {
    "emotions": ["Emotion1", "Emotion2"],
    "validation": "Astra's cosmic gentle reflection...",
    "weather": "e.g., Bright stars behind soft clouds / Deep evening stillness / Morning dawn clearing"
  }
  `;

  const fallbackJSON = JSON.stringify({
    emotions: ["Resilience", "Quiet Fatigue"],
    validation: "I hear the soft timber of courage in your words. It is completely safe to acknowledge that the path feels heavy while maintaining your hope. We will build a soft sanctuary around your evening rest.",
    weather: "Evening nebula glowing behind gentle lavender clouds"
  });

  const rawText = await generateContentWithFallback(prompt, fallbackJSON, "You are Astra. You analyze journal scripts with deep cosmic empathy and gentle clinical awareness. Output JSON only.");
  try {
    const parsed = JSON.parse(rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1));
    res.json(parsed);
  } catch (e) {
    res.status(200).json(JSON.parse(fallbackJSON));
  }
});

// Vite middleware and static serving setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ConstellaCare full-stack server active at http://localhost:${PORT}`);
  });
}

startServer();
