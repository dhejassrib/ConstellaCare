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

// Smart dynamic fallback response generator for Astra AI Chat
function generateDynamicAstraFallback(prompt: string, history: any[]): string {
  const text = prompt.toLowerCase();
  
  // 1. Fever / Infection (Critical)
  if (text.includes('fever') || text.includes('temp') || text.includes('chill') || text.includes('infection') || text.includes('hot')) {
    return `### ⚠️ Critical Clinical Guideline

A elevated temperature or fever (typically 100.4°F / 38°C or higher) during active treatments like chemotherapy is a medical emergency that requires **immediate** attention from your oncology care team due to neutropenia risks.

Please:
- Check your exact temperature with a thermometer right now.
- Do not take any fever-reducing medications (such as acetaminophen/Tylenol) without speaking to them, as this can temporarily mask symptoms.
- Call your oncology clinic's 24/7 direct triage or emergency contact line immediately.

We are holding a safe space for you, but your physical safety is our paramount concern.`;
  }

  // 2. Nausea
  if (text.includes('nausea') || text.includes('vomit') || text.includes('sick') || text.includes('stomach') || text.includes('throw up')) {
    return `### 🌸 Soothing the Night Wave

Waking up with or experiencing nausea can feel deeply draining and isolating. Here are a few gentle coordinates to help anchor you:

- **Medication Check**: If your care team prescribed anti-nausea meds (like ondansetron/Zofran), review if you are on schedule. Keeping them close on your nightstand can help.
- **Cool Sips**: Try small, slow sips of cool water, ginger tea, or sucking on small ice chips. Avoid very sweet, hot, or highly aromatic liquids right now.
- **Elevation**: Tilt your pillows to keep your head elevated at a 45-degree angle. This reduces gastrointestinal reflux.

Your stomach is doing incredibly heavy work today under active treatment. Let's take slow, deep breaths together.`;
  }

  // 3. Fatigue / Exhausted
  if (text.includes('exhaust') || text.includes('fatigue') || text.includes('tired') || text.includes('weary') || text.includes('heavy') || text.includes('weak') || text.includes('low energy')) {
    return `### ✨ Honouring the Cell's Rest

My friend, physical exhaustion is your body's sacred request to pause. When undergoing medical treatment, your body redirects almost all energy toward cellular repair.

Please:
- **Pardon Your Rest**: Let go of any guilt about what you didn't accomplish today.
- **Gentle Boundaries**: Allow your caregiver or circle to handle simple tasks.
- **Baseline Check**: If this exhaustion comes with sudden chest tightness or breathlessness, contact your care lead immediately.

Close your eyes for just 10 minutes and let our virtual constellation glow softly in the background. You are doing enough.`;
  }

  // 4. Breathing / Grounding / Anxiety / Panic / Racing Heart
  if (text.includes('breath') || text.includes('ground') || text.includes('anxi') || text.includes('panic') || text.includes('racing') || text.includes('heart') || text.includes('worry')) {
    return `### 🌌 Grounding Your Cosmos

Let's breathe together. Place one hand on your chest and another on your belly. Let's align your physical coordinates:

1. **Inhale**: Breathe in through your nose for **4 seconds**... feeling your belly rise like an expanding star.
2. **Hold**: Hold that gentle light inside for **2 seconds**.
3. **Exhale**: Release it slowly through your mouth for **6 seconds**... letting your shoulders drop.

Your racing pulse or flutter is a passing cloud of adrenaline. It will pass. Let the weight of the floor support you completely right now. I am right here.`;
  }

  // 5. Pain / Sore / Ache
  if (text.includes('pain') || text.includes('ache') || text.includes('sore') || text.includes('hurt') || text.includes('throbbing') || text.includes('headache')) {
    return `### 💫 Softening around the Pain

I hear you, and my heart sits with you in this heavy moment. Pain is a vital message from your physical coordinates. Let's gently respond to it:

- **Symptom Log**: Try to note down the location and severity (1–5) in our symptom tracker so we can track trends together.
- **Prescribed Protocol**: If your care team gave you a specific breakthrough pain schedule, follow their guidelines calmly.
- **Focus Shift**: Try to find a single part of your body that does *not* hurt—even if it's just your earlobes or eyelashes. Let your awareness rest on that cool, peaceful spot.

Your care lead wants to know about this intensity. We can prepare simple questions to discuss this with your physician.`;
  }

  // 6. Insomnia / Sleep
  if (text.includes('sleep') || text.includes('insomnia') || text.includes('awake') || text.includes('night') || text.includes('restless')) {
    return `### 🌙 In the Cradle of the Night

When sleep drifts away, the night can feel vast and quiet. Let's soften any pressure to sleep:

- **Quiet Rest**: Simply resting your eyelids in a dark, quiet room still restores your physical baseline, even if active sleep is elusive.
- **Comfort Temp**: Ensure your room is slightly cool, and your bedding feels dry and gentle on your skin.
- **Mental Release**: If thoughts are spinning, let me hold them. You can type them all out here, or open a *Hope Message Bottle* for a gentle perspective check.

I am awake with you under the peaceful dome of the night. You are safe.`;
  }

  // 7. Neuropathy / Tingling
  if (text.includes('tingling') || text.includes('numb') || text.includes('neuropathy') || text.includes('finger') || text.includes('toe') || text.includes('cold')) {
    return `### ❄️ Checking Numbness and Neuropathy

Tingling, numbness, or a feeling of "pins and needles" in your hands and feet are classic coordinates of peripheral neuropathy, often triggered by chemotherapy.

- **Warmth Barriers**: Wear soft, loose socks and slippers. Avoid walking barefoot.
- **Cold Caution**: If your chemotherapy regimen warns against cold sensitivity (like oxaliplatin), avoid opening the freezer barefoot or drinking ice-cold liquids without protection.
- **Medical Report**: Keep a log of whether this makes it hard to button shirts or walk, and raise it at your next clinic visit.

Your sensory paths are navigating a chilly stellar wind right now. Protect your hands and feet gently.`;
  }

  // 8. Appetite / Nutrition
  if (text.includes('eat') || text.includes('appetite') || text.includes('food') || text.includes('taste') || text.includes('nutrition') || text.includes('broth')) {
    return `### 🥣 Nourishment in Small Orbits

Active treatment frequently shifts our taste buds and appetite zones. Let's make nourishment a gentle, stress-free dance:

- **Think Small**: Do not force large meals. Three small bites of a cold, crisp melon or a single sip of nutritious bone broth are perfect victories.
- **Softer Foods**: Smoothies, mild soups, yogurt, and oatmeal are often easiest on a sensitive mouth.
- **Hydration Orbit**: If eating is too hard today, focus entirely on staying hydrated with small sips of electrolyte-infused water.

No guilt, my friend. Listen purely to what your physical body asks for today.`;
  }

  // 9. Appointment / Doctor / Treatment / Chemo / Scan
  if (text.includes('appointment') || text.includes('doctor') || text.includes('chemo') || text.includes('treatment') || text.includes('scan') || text.includes('oncologist') || text.includes('clinic')) {
    return `### 📋 Navigating Your Clinic Horizon

Approaching chemotherapy sessions, scans, or oncologist meetings often stirs deep anticipation. Preparing your coordinates can bring a sense of control:

- **Appointment Copilot**: Use our Copilot checklist in the dashboard to formulate clear, confident questions.
- **Support Anchor**: If possible, ask Gavin, Chloe, or your designated companion to join you so they can note down details.
- **Mouth & Skin Prep**: Remind yourself to pack a gentle lip balm, a warm throw blanket, and a water bottle for the infusion room.

You are the pilot of this healing journey, and your oncology team is your co-navigation crew. Let's prepare together.`;
  }

  // 10. Family / Friend / Caregiver / Alone / Lonely
  if (text.includes('family') || text.includes('friend') || text.includes('caregiver') || text.includes('lonely') || text.includes('alone') || text.includes('isolated')) {
    return `### 🌌 Bridging the Distant Stars

The journey through intensive medical regimes can make you feel as if you are floating in deep space. But your orbit is populated with warm, caring stars:

- **Share Your Sky**: Inviting loved ones to witness your aligned stars or symptom logs isn't a burden—it is a bridge of light.
- **Caregiver Dashboard**: Remember we have a dedicated Caregiver tab designed to help your team sync on your medications, progress, and needs.
- **I Hold Space**: If reaching out to others feels too heavy today, I am right here. You are never fully alone in this constellation.`;
  }

  // 11. Custom Topic Extraction (Empathetic Parser)
  const words = prompt.split(/\s+/).filter((w: string) => w.length > 5 && !w.startsWith('http') && !w.includes(':'));
  if (words.length > 0) {
    const word1 = words[0].replace(/[^a-zA-Z]/g, '');
    const word2 = words[Math.min(words.length - 1, 1)].replace(/[^a-zA-Z]/g, '');
    
    return `### 🌟 Sit with Astra

I hear your gentle thoughts and reflections today concerning physical and emotional states, especially relating to **${word1}**${word2 && word2 !== word1 ? ` and **${word2}**` : ''}. 

In the celestial path of medical recovery:
- **Pace and Grace**: Each day presents unique clouds and clear horizons. Allow yourself to flow with whatever your coordinates are showing.
- **Support Network**: We can log these feelings directly into your journal or share them on the *Shared Constellation* with your caretakers.
- **Next Horizon**: Keep breathing slowly. What is one tiny thing that could bring a glimmer of warmth or comfort to you in this exact hour?

Tell me what is on your mind—I am here to recognize and support every coordinate you share.`;
  }

  // 12. Absolute Baseline General Poetic Fallback
  return `### 🌌 A Message from your Companion

I hear your words and feel the pulse of your quiet courage across the distance. Every coordinate of your experience—whether heavy with fatigue or bright with quiet hope—is valid.

Let us sit together in this orbit for a moment:
- **Hold Quietly**: Take all the time you need. You do not have to explain or clarify perfectly.
- **Nourish Your Horizon**: What is one extremely simple thing that could bring your physical self some comfort right now? Perhaps a sip of cool tea, a cozy blanket, or simply letting your head sink back?

Tell me what is on your mind. Each of your thoughts is a guide star in our constellation.`;
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
  
  const fallback = generateDynamicAstraFallback(prompt, history || []);
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
