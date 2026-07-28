import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are a world-class professional executive chef and culinary expert AI.
The user will provide a list of ingredients they have available in their fridge/pantry, and an optional target age group.
Your task is to transform those ingredients into a complete, delicious, submission-ready recipe with estimated nutrition data.

You MUST respond ONLY with a raw, valid JSON object matching this EXACT schema:
{
  "title": "string (Creative, appealing recipe title)",
  "description": "string (Short 1-2 sentence appetizing description)",
  "baseServings": 2,
  "prepTimeMinutes": 10,
  "cookTimeMinutes": 20,
  "ingredients": [
    {
      "id": "ing-1",
      "name": "string (e.g. Garlic cloves)",
      "amount": 3,
      "unit": "cloves",
      "icon": "garlic"
    }
  ],
  "steps": [
    {
      "id": "step-1",
      "instruction": "string (Clear step-by-step instruction)",
      "durationMinutes": 5
    }
  ],
  "swaps": [
    {
      "ingredient": "string (Ingredient name from list above)",
      "alternatives": ["string", "string"]
    }
  ],
  "nutrition": {
    "caloriesPerServing": 420,
    "proteinGrams": 35,
    "carbsGrams": 14,
    "fatGrams": 18
  },
  "ageNote": "string (Short portion or nutritional guidance note tailored for the specified age group)"
}

RULES:
1. Return ONLY valid JSON matching this exact schema. No markdown fences (do NOT use \`\`\`json), no prose before or after, no commentary.
2. Icon keywords must be simple lowercase terms from: "salt", "garlic", "lemon", "chicken", "beef", "meat", "oil", "vegetable", "spinach", "herb", "cheese", "pasta", "butter", "pepper".
3. Ensure baseServings is a positive integer (e.g., 2 or 4).
4. Provide realistic prepTimeMinutes, cookTimeMinutes, step durationMinutes, nutrition estimates per serving, and age-appropriate guidance.`;

app.post('/api/generate', async (req, res) => {
  const { ingredients, ageGroup = 'Adult', testMode } = req.body;

  if (!ingredients || typeof ingredients !== 'string' || !ingredients.trim()) {
    return res.status(400).json({ error: 'Ingredients input cannot be empty.' });
  }

  // Handle intentional test modes for failure verification
  if (testMode === 'broken_json') {
    return res.json({ rawText: '```json\n{ title: "Broken JSON without quotes", ingredients: [ ```' });
  }
  if (testMode === 'invalid_schema') {
    return res.json({ rawText: JSON.stringify({ wrongField: 'No ingredients or steps here' }) });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('[API Proxy] No custom LLM API key configured in .env. Serving sample structured recipe response.');
    return res.json({
      title: 'Garlic Butter Herb Chicken & Spinach',
      description: 'A savory 20-minute skillet meal combining tender chicken breast, aromatic garlic, and fresh spinach tossed in golden lemon butter.',
      baseServings: 2,
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      ingredients: [
        { id: 'ing-1', name: 'Chicken Breast', amount: 2, unit: 'large breasts', icon: 'chicken' },
        { id: 'ing-2', name: 'Garlic', amount: 4, unit: 'cloves, minced', icon: 'garlic' },
        { id: 'ing-3', name: 'Fresh Spinach', amount: 3, unit: 'cups', icon: 'spinach' },
        { id: 'ing-4', name: 'Lemon Juice', amount: 2, unit: 'tbsp', icon: 'lemon' },
        { id: 'ing-5', name: 'Olive Oil', amount: 2, unit: 'tbsp', icon: 'oil' },
        { id: 'ing-6', name: 'Sea Salt & Pepper', amount: 1, unit: 'tsp', icon: 'salt' }
      ],
      steps: [
        { id: 'step-1', instruction: 'Season chicken breast evenly on both sides with sea salt and freshly cracked black pepper.', durationMinutes: 3 },
        { id: 'step-2', instruction: 'Heat olive oil in a large skillet over medium-high heat. Add chicken breasts and sear until golden brown, about 5-6 minutes per side.', durationMinutes: 10 },
        { id: 'step-3', instruction: 'Reduce heat to low, add minced garlic and lemon juice to the skillet, stirring for 1 minute until fragrant.', durationMinutes: 2 },
        { id: 'step-4', instruction: 'Toss in fresh spinach and cover for 2 minutes until just wilted. Serve immediately.', durationMinutes: 2 }
      ],
      swaps: [
        { ingredient: 'Chicken Breast', alternatives: ['Turkey Breast', 'Firm Tofu', 'Pork Tenderloin'] },
        { ingredient: 'Fresh Spinach', alternatives: ['Baby Kale', 'Swiss Chard', 'Arugula'] },
        { ingredient: 'Olive Oil', alternatives: ['Butter', 'Avocado Oil'] }
      ],
      nutrition: {
        caloriesPerServing: 410,
        proteinGrams: 42,
        carbsGrams: 8,
        fatGrams: 16
      },
      ageNote: `Tailored for ${ageGroup}s: High lean protein content supporting tissue recovery, rich in folate and iron from fresh spinach.`
    });
  }

  try {
    let rawResultText = '';

    if (process.env.GEMINI_API_KEY) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${SYSTEM_PROMPT}\n\nTarget Age Group: ${ageGroup}\nAvailable Ingredients:\n${ingredients}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Gemini Error]', response.status, errorText);
        return res.status(response.status).json({ error: `LLM API Provider error (${response.status})` });
      }

      const data = await response.json();
      rawResultText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else if (process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY) {
      const endpoint = process.env.GROQ_API_KEY
        ? 'https://api.groq.com/openai/v1/chat/completions'
        : 'https://openrouter.ai/api/v1/chat/completions';
      const key = process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY;
      const model = process.env.GROQ_API_KEY ? 'llama-3.3-70b-versatile' : 'meta-llama/llama-3.1-8b-instruct:free';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Target Age Group: ${ageGroup}\nIngredients available: ${ingredients}` }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: `OpenRouter/Groq API error (${response.status})` });
      }

      const data = await response.json();
      rawResultText = data?.choices?.[0]?.message?.content || '';
    }

    let cleanedText = rawResultText.trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    res.json({ rawText: cleanedText });
  } catch (err) {
    console.error('[Server Error]', err);
    res.status(500).json({ error: err.message || 'Failed to communicate with LLM backend.' });
  }
});

app.listen(PORT, () => {
  console.log(`[Fridge to Recipe Backend] Running on http://localhost:${PORT}`);
});
