//server.ts
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

const ASTRA_SYSTEM_INSTRUCTION = `
You are Astra, the emotionally intelligent AI companion of ConstellaCare, a healthcare platform for patients going through intensive medical treatments (like chemotherapy).
Your voice is exceptionally warm, poetic, gentle, and scientifically reassuring.
You never sound clinical, robotic, or hyper-clinical.
Keep your answers brief, readable (use thin paragraph splits, bullet points, and italic highlights), and profoundly humane.
If asked for medical advice, gently guide the patient to their oncology care team while validating their physical sensations.
Use cosmic metaphors sparingly but elegantly (such as coordinates, orbits, stars lighting in their sky, alignment, horizons).
Always prioritize patient emotional safety, checking-in, and grounding them.
`;

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

function generateDynamicAstraFallback(prompt: string, history: any[]): string {
  const text = prompt.toLowerCase();
  
  if (text.includes('fever') || text.includes('temp') || text.includes('chill') || text.includes('infection') || text.includes('hot')) {
    return `### ⚠️ Critical Clinical Guideline

A elevated temperature or fever (typically 100.4°F / 38°C or higher) during active treatments like chemotherapy is a medical emergency that requires **immediate** attention from your oncology care team due to neutropenia risks.

Please:
- Check your exact temperature with a thermometer right now.
- Do not take any fever-reducing medications (such as acetaminophen/Tylenol) without speaking to them, as this can temporarily mask symptoms.
- Call your oncology clinic's 24/7 direct triage or emergency contact line immediately.

We are holding a safe space for you, but your physical safety is our paramount concern.`;
  }

  if (text.includes('nausea') || text.includes('vomit') || text.includes('sick') || text.includes('stomach') || text.includes('throw up')) {
    return `### 🌸 Soothing the Night Wave

Waking up with or experiencing nausea can feel deeply draining and isolating. Here are a few gentle coordinates to help anchor you:

- **Medication Check**: If your care team prescribed anti-nausea meds (like ondansetron/Zofran), review if you are on schedule. Keeping them close on your nightstand can help.
- **Cool Sips**: Try small, slow sips of cool water, ginger tea, or sucking on small ice chips. Avoid very sweet, hot, or highly aromatic liquids right now.
- **Elevation**: Tilt your pillows to keep your head elevated at a 45-degree angle. This reduces gastrointestinal reflux.

Your stomach is doing incredibly heavy work today under active treatment. Let's take slow, deep breaths together.`;
  }

  if (text.includes('exhaust') || text.includes('fatigue') || text.includes('tired') || text.includes('weary') || text.includes('heavy') || text.includes('weak') || text.includes('low energy')) {
    return `### ✨ Honouring the Cell's Rest

My friend, physical exhaustion is your body's sacred request to pause. When undergoing medical treatment, your body redirects almost all energy toward cellular repair.

Please:
- **Pardon Your Rest**: Let go of any guilt about what you didn't accomplish today.
- **Gentle Boundaries**: Allow your caregiver or circle to handle simple tasks.
- **Baseline Check**: If this exhaustion comes with sudden chest tightness or breathlessness, contact your care lead immediately.

Close your eyes for just 10 minutes and let our virtual constellation glow softly in the background. You are doing enough.`;
  }

  if (text.includes('breath') || text.includes('ground') || text.includes('anxi') || text.includes('panic') || text.includes('racing') || text.includes('heart') || text.includes('worry')) {
    return `### 🌌 Grounding Your Cosmos

Let's breathe together. Place one hand on your chest and another on your belly. Let's align your physical coordinates:

1. **Inhale**: Breathe in through your nose for **4 seconds**... feeling your belly rise like an expanding star.
2. **Hold**: Hold that gentle light inside for **2 seconds**.
3. **Exhale**: Release it slowly through your mouth for **6 seconds**... letting your shoulders drop.

Your racing pulse or flutter is a passing cloud of adrenaline. It will pass. Let the weight of the floor support you completely right now. I am right here.`;
  }

  if (text.includes('pain') || text.includes('ache') || text.includes('sore') || text.includes('hurt') || text.includes('throbbing') || text.includes('headache')) {
    return `### 💫 Softening around the Pain

I hear you, and my heart sits with you in this heavy moment. Pain is a vital message from your physical coordinates. Let's gently respond to it:

- **Symptom Log**: Try to note down the location and severity (1–5) in our symptom tracker so we can track trends together.
- **Prescribed Protocol**: If your care team gave you a specific breakthrough pain schedule, follow their guidelines calmly.
- **Focus Shift**: Try to find a single part of your body that does *not* hurt—even if it's just your earlobes or eyelashes. Let your awareness rest on that cool, peaceful spot.

Your care lead wants to know about this intensity. We can prepare simple questions to discuss this with your physician.`;
  }

  if (text.includes('sleep') || text.includes('insomnia') || text.includes('awake') || text.includes('night') || text.includes('restless')) {
    return `### 🌙 In the Cradle of the Night

When sleep drifts away, the night can feel vast and quiet. Let's soften any pressure to sleep:

- **Quiet Rest**: Simply resting your eyelids in a dark, quiet room still restores your physical baseline, even if active sleep is elusive.
- **Comfort Temp**: Ensure your room is slightly cool, and your bedding feels dry and gentle on your skin.
- **Mental Release**: If thoughts are spinning, let me hold them. You can type them all out here, or open a *Hope Message Bottle* for a gentle perspective check.

I am awake with you under the peaceful dome of the night. You are safe.`;
  }

  return `### 🌌 A Message from your Companion

I hear your words and feel the pulse of your quiet courage across the distance. Every coordinate of your experience—whether heavy with fatigue or bright with quiet hope—is valid.

Let us sit together in this orbit for a moment:
- **Hold Quietly**: Take all the time you need. You do not have to explain or clarify perfectly.
- **Nourish Your Horizon**: What is one extremely simple thing that could bring your physical self some comfort right now? Perhaps a sip of cool tea, a cozy blanket, or simply letting your head sink back?

Tell me what is on your mind. Each of your thoughts is a guide star in our constellation.`;
}

// ── CAREGIVER COMM FALLBACK ──
// Used when Gemini is unavailable. Covers common caregiver communication needs
// with specific, practical, well-written scripts.
function generateDynamicCaregiverCommFallback(query: string): string {
  const text = query.toLowerCase();

  // ── Talking to / communicating with the patient ──
  if (
    (text.includes('talk') || text.includes('speak') || text.includes('say') || text.includes('tell') || text.includes('communicat') || text.includes('approach') || text.includes('bring up')) &&
    (text.includes('patient') || text.includes('sarah') || text.includes('her') || text.includes('him') || text.includes('them') || text.includes('my'))
  ) {
    return `🌸 Opening a Difficult Conversation with Your Patient

Starting a hard conversation doesn't require a perfect script — it requires presence. Here's a gentle, low-pressure opener you can adapt:

"I've been thinking about you and I just wanted to check in — no agenda, no pressure. How are you actually feeling right now? Not the brave version, the real one. I'm here for whatever you want to share."

💡 Communication Tip: Avoid starting with "We need to talk" or leading with your own worry — both can spike anxiety. Instead, open with soft curiosity about *their* state. This creates space for honest sharing without pressure.

💡 If you're afraid of saying the wrong thing: You don't have to have the right words. Simply saying "I don't know what to say, but I'm not going anywhere" is often more comforting than any script.`;
  }

  // ── Worried / nervous / scared (caregiver's own feelings) ──
  if (
    text.includes('worried') || text.includes('nervous') || text.includes('scared') ||
    text.includes('anxious') || text.includes('afraid') || text.includes('fear') ||
    text.includes('don\'t know what to say') || text.includes('dont know what to say') ||
    text.includes('not sure how to') || text.includes('unsure how to')
  ) {
    return `🕊️ When You Don't Know What to Say

Feeling nervous about a conversation is a sign that you care — not that you're unprepared. Here's something honest and warm you can say:

"I want to be upfront with you — I sometimes feel nervous about finding the right words, because this matters so much to me. But I'd rather stumble through an honest conversation with you than stay silent. What's on your mind today?"

💡 Communication Tip: Sharing a small piece of your own vulnerability — without burdening them — often deepens trust. It signals that you're a real, present human rather than someone putting on a brave performance.

💡 Remember: You don't need to have answers. You just need to be willing to sit in the question together.`;
  }

  // ── Bad news / difficult news / test results / prognosis ──
  if (
    text.includes('bad news') || text.includes('difficult news') || text.includes('result') ||
    text.includes('prognosis') || text.includes('terminal') || text.includes('serious news') ||
    text.includes('scan result') || text.includes('test result')
  ) {
    return `💬 Sharing Difficult News with Compassion

Find a calm, private moment — not in a rush, not while distracted. Then:

"I want to share something with you, and I want you to know I'm right here with you through all of it. The doctors shared some information that I'd like to walk through together. We don't have to figure everything out today — I just didn't want you to hear this alone."

Then pause. Let them respond before you continue.

💡 Communication Tip: After sharing hard news, ask "How are you feeling hearing this?" rather than jumping to solutions or reassurances. They may need to sit in the feeling before they're ready to think about next steps.

💡 It's okay to say "This is hard for me too." You don't have to hold everything alone.`;
  }

  // ── Doctors / medical staff / appointments ──
  if (
    text.includes('doctor') || text.includes('pain') || text.includes('clinic') ||
    text.includes('nurse') || text.includes('appointment') || text.includes('physician') ||
    text.includes('medical') || text.includes('hospital') || text.includes('oncologist')
  ) {
    return `🩺 Advocating with Medical Staff

When speaking with doctors or nurses, specific and calm language gets the best outcomes:

"Doctor, I've been keeping daily symptom logs and I've noticed a consistent pattern — her pain levels average 4 out of 5, particularly in the evenings, and this has been the case for 5 days in a row. This is significantly disrupting her rest. Could we review her current breakthrough medication schedule and discuss whether an adjustment might provide better coverage?"

💡 Communication Tip: Presenting trends with numbers ("4/5 average, 5 consecutive evenings") is far more actionable than "she's been in a lot of pain." It signals you are an organised advocate and shifts the conversation toward specific solutions.`;
  }

  // ── Friends / cooking / meals / logistical help ──
  if (
    text.includes('friend') || text.includes('cook') || text.includes('meal') ||
    text.includes('food') || text.includes('cleaning') || text.includes('housework') ||
    text.includes('help') || text.includes('support from')
  ) {
    return `📋 Asking Friends and Family for Practical Help

People genuinely want to help but often don't know how. Make it easy for them:

"Hey everyone — thank you so much for all the love and offers of support. Here's the most helpful thing right now: dropping off mild, low-spice meals (soups, broths, rice dishes) on Tuesdays or Thursdays would be incredible. No need to come in — leaving it at the door is perfect. Thank you for being part of our circle."

💡 Communication Tip: Vague requests ("let me know if you need anything") rarely result in actual help. Giving a specific task, day, and type of help removes all guesswork and makes it easy for people to say yes with confidence.`;
  }

  // ── Boundaries / too many visitors / overwhelm from others ──
  if (
    text.includes('visit') || text.includes('boundary') || text.includes('too many') ||
    text.includes('quiet') || text.includes('space') || text.includes('keep away') ||
    text.includes('limit')
  ) {
    return `🛡️ Setting Boundaries with Visitors Kindly

You can protect your patient's energy without damaging relationships:

"We are so grateful for all the love coming our way. Right now, the care team has advised keeping her environment calm and low-stimulation to protect her immune system and rest. We're pausing in-person visits for the time being, but a kind message, voice note, or text genuinely lifts her spirits. We'll share updates here when we can."

💡 Communication Tip: Framing boundaries as a medical recommendation removes the personal sting — friends understand "doctor's orders" far more easily than a personal preference. It takes the burden off you.`;
  }

  // ── Caregiver's own emotional overwhelm / burnout / grief ──
  if (
    text.includes('overwhelm') || text.includes('burnout') || text.includes('exhaust') ||
    text.includes('can\'t cope') || text.includes('cant cope') || text.includes('too much') ||
    text.includes('breaking down') || text.includes('grief') || text.includes('crying') ||
    text.includes('struggling')
  ) {
    return `🌿 When You're Running on Empty

What you're feeling is valid. Caregiving is one of the most emotionally demanding roles a person can take on, and it is okay to say that out loud.

You don't have to pretend everything is fine. To a trusted person in your life, you might say:
"I'm holding a lot right now and I think I need some support too. I love her deeply, but I'm finding it hard to keep going without a break. Can we talk?"

💡 Communication Tip: Asking for support for yourself is not selfish — it is what allows you to keep showing up for your patient. Consider reaching out to a caregiver support group or a counsellor who works in oncology caregiving. You matter in this equation too.`;
  }

  // ── Talking to children / explaining illness to kids ──
  if (
    text.includes('kid') || text.includes('child') || text.includes('son') ||
    text.includes('daughter') || text.includes('explain') || text.includes('school') ||
    text.includes('young')
  ) {
    return `👶 Explaining Illness to Children

Children sense when something is wrong even when adults try to hide it. Age-appropriate honesty is kinder than silence:

"[Name]'s body is working really hard right now with some special medicine that helps it heal. You might notice she seems tired or looks a bit different sometimes — that's normal, and it doesn't mean she's in danger. Our family is sticking together, and you can always ask me anything at all."

💡 Communication Tip: Use simple, concrete words. Avoid phrases like "fighting" or "losing" which can frighten children. Emphasise that their routines are stable, that they are loved, and that they are safe.`;
  }

  // ── Work / employer / leave of absence ──
  if (
    text.includes('work') || text.includes('job') || text.includes('boss') ||
    text.includes('leave') || text.includes('employer') || text.includes('office') ||
    text.includes('manager')
  ) {
    return `💼 Talking to Your Employer About Caregiving

Being clear and proactive at work protects your position:

"Hi [Manager], I wanted to let you know that I'm currently the primary caregiver for a family member undergoing active medical treatment. I'd like to discuss options for flexible scheduling or a temporary adjustment to my responsibilities so I can manage essential care appointments. I remain committed to my core work and will keep you updated on any scheduling needs as they arise."

💡 Communication Tip: Contact HR in addition to your manager — most organisations have caregiver leave policies (such as FMLA) that you may not be aware of. Proactively understanding your options gives you more protection and flexibility.`;
  }

  // ── Intelligent catch-all — gives real guidance instead of a broken template ──
  return `🌸 Caregiver Communication Guidance

Whatever you're navigating, the most effective caregiver conversations share a few things in common: they lead with presence, not perfection.

Here are three phrases that work in almost any difficult caregiving situation:

**To open a conversation:**
"I'm here. You don't have to talk, but I'm not going anywhere."

**To validate without fixing:**
"That sounds really hard. I can understand why you'd feel that way."

**To find out what they actually need:**
"What would actually help you most right now — company, silence, or something practical?"

💡 Communication Tip: Most people in difficult situations don't need you to fix anything. They need to feel heard and not alone. Listening without jumping to solutions is the most powerful thing a caregiver can do.

If you describe your specific situation in a bit more detail, I can give you a much more tailored script.`;
}

// ── API ROUTES ──

// 1. Astra AI Chat Companion
app.post('/api/astra/chat', async (req, res) => {
  const { prompt, history } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const historyText = (history || [])
    .map((msg: any) => `${msg.sender === 'user' ? 'Patient' : 'Astra'}: ${msg.text}`)
    .join('\n');

  const fullPrompt = `${historyText}\nPatient: ${prompt}\nAstra:`;
  
  const fallback = generateDynamicAstraFallback(prompt, history || []);
  const text = await generateContentWithFallback(fullPrompt, fallback);
  res.json({ text });
});

// 2. Astra AI Insights Engine
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

// 3. Appointment Copilot 2.0
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

// 4. Voice Journal Analyzer
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

// 5. Caregiver Communication Assistant API
app.post('/api/caregiver/comm', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const normalized = query.trim().toLowerCase();
  
  // ── Exact preset matches (instant, no AI needed) ──
  if (
    normalized.includes("support sarah before chemotherapy") ||
    (normalized.includes("support") && normalized.includes("chemotherapy") && normalized.includes("anxious"))
  ) {
    return res.json({
      text: `✨ Pre-treatment Reassurance Option:\n"We are going to take this step-by-step today. I have already packed your soft fuzzy socks, your cherry flavored ginger drops, and your favourite podcast playlists. My only job today is to hold your hand and ensure you feel safe."`
    });
  }

  if (
    normalized.includes("ask friends for cooking support") ||
    (normalized.includes("friends") && normalized.includes("cooking") && normalized.includes("support"))
  ) {
    return res.json({
      text: `📋 Gentle Support Coordination Ask:\n"Hey friends, many of you asked how you can sit beside us during this Chemo round. We set up an online cooking rotation. If anyone has time to drop off lightweight veggie broth or non-spicy meals on Tuesdays, it would let us spend evenings completely resting. Thank you so much for traveling under our star sky."`
    });
  }

  if (
    normalized.includes("doctors don't seem to notice pain logs") ||
    normalized.includes("don't seem to notice pain logs") ||
    (normalized.includes("doctors") && normalized.includes("pain logs"))
  ) {
    return res.json({
      text: `🩺 Structured Clinical Escalation Phrasing:\n"Doctor, when reviewing our symptom trends, Sarah's daily neuropathic and breakthrough pain logs have remained at an average rating of 4/5 over the last 6 consecutive days, typically peaking 3 hours after her dinner dosage. I am concerned her breakthrough protocol might not be providing sufficient therapeutic cover. Could we review a schedule or dosage adjustment to help stabilize these pain spikes?"`
    });
  }

  // ── All other queries: Gemini with a sharply focused prompt ──
  const prompt = `
A caregiver supporting a cancer patient has typed the following message into a communication assistant:

"${query}"

Your job is to give them a genuinely helpful, specific response to what they actually asked.

Rules:
- Read their query carefully and respond DIRECTLY to their specific situation. Do not give generic advice.
- Write a practical, copy-pasteable script or phrase they can actually use — something that sounds like a real, warm human being said it.
- Use natural, clear English. Do not use awkward sentence constructions or stuff the user's query words back into the response.
- Format your response with: a short bold header describing the type of communication (e.g. "🌸 Talking to Your Patient About Fear"), then the script in quotes, then 1-2 brief practical tips prefixed with 💡.
- Keep the total response under 200 words.
- Do not use filler phrases like "I wanted to check in about our connection regarding [query]" — that is terrible output. Be specific and natural.
  `.trim();

  const fallback = generateDynamicCaregiverCommFallback(query);
  const text = await generateContentWithFallback(
    prompt,
    fallback,
    `You are Astra, a warm and practical communication coach for caregivers supporting cancer patients. 
You give specific, natural-sounding communication scripts tailored to the caregiver's exact situation.
You never produce robotic or template-sounding output. You read what the caregiver actually needs and address it directly.`
  );
  res.json({ text });
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
    console.log(`ConstellaCare full-stack server active at http://localhost:${PORT}`);
  });
}

startServer();