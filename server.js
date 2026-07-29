import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

const SYSTEM_PROMPT = `You are a helpful cooking assistant.
Your job is to make easy, step-by-step recipes for any ingredient or dish the user enters.

CRITICAL INSTRUCTION:
Write everything in VERY SIMPLE, EASY, BASIC ENGLISH so that anyone, including beginners and kids, can understand easily.
Avoid hard culinary words.
- Use "fry" instead of "sauté"
- Use "mix" instead of "fold" or "combine"
- Use "boil" instead of "parboil" or "poach"
- Use "cut" or "chop" instead of "mince" or "dice"

You MUST respond ONLY with a raw, valid JSON object matching this EXACT schema:
{
  "title": "string (Simple dish title matching user's input)",
  "description": "string (Short 1-sentence simple description)",
  "baseServings": 2,
  "prepTimeMinutes": 10,
  "cookTimeMinutes": 20,
  "isLeftoverRecipe": false,
  "sustainabilityScore": "95%",
  "ingredients": [
    {
      "id": "ing-1",
      "name": "string (Simple ingredient name)",
      "amount": 3,
      "unit": "cloves",
      "icon": "garlic",
      "commonlyAvailable": "string (e.g. 'Pantry', 'Fridge door', 'Fridge', 'Vegetable box', 'Spice box')"
    }
  ],
  "steps": [
    {
      "id": "step-1",
      "instruction": "string (Very simple, step-by-step instruction in plain English)",
      "durationMinutes": 5
    }
  ],
  "swaps": [
    {
      "ingredient": "string (Ingredient name)",
      "alternatives": ["string", "string"]
    }
  ],
  "nutrition": {
    "caloriesPerServing": 420,
    "proteinGrams": 35,
    "carbsGrams": 14,
    "fatGrams": 18
  },
  "ageNote": "string (Simple note about why this food is good for the selected age group)"
}

RULES:
1. Return ONLY valid JSON matching this exact schema. No markdown fences.
2. Icon keywords must be simple lowercase terms from: "salt", "garlic", "lemon", "chicken", "beef", "meat", "oil", "vegetable", "spinach", "herb", "cheese", "pasta", "butter", "pepper".
3. Keep instructions clear, short, and extremely simple.`;

const LEFTOVER_SYSTEM_PROMPT = `${SYSTEM_PROMPT}

SPECIAL LEFTOVER ZERO-WASTE INSTRUCTION:
The user is providing LEFTOVER food items.
1. Generate a quick 15-20 minute recipe using ONLY these leftovers plus simple pantry staples (oil, salt, ghee, spices, garlic).
2. Set "isLeftoverRecipe": true and "sustainabilityScore": "98% Waste Reduction".
3. Explain how to re-purpose and heat leftovers safely so no food is wasted!`;

/**
 * 25 Age-Specific Recipes in Plain, Basic, Simple English
 */
const AGE_RECIPE_DATABASE = {
  // --- TODDLERS & INFANTS (Ages 1-3) ---
  'moong dal khichdi': {
    title: 'Simple Yellow Moong Dal Khichdi',
    description: 'A soft, light rice and lentil meal cooked in ghee that is very gentle on the stomach.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Yellow Moong Dal', amount: 0.5, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Rice', amount: 0.5, unit: 'cup', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-3', name: 'Ghee (Butter)', amount: 1, unit: 'spoon', icon: 'oil', commonlyAvailable: 'Fridge door' },
      { id: 'ing-4', name: 'Cumin and Turmeric', amount: 0.5, unit: 'small spoon', icon: 'salt', commonlyAvailable: 'Spice box' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Wash the yellow dal and rice together with clean water 3 times.', durationMinutes: 3 },
      { id: 'step-2', instruction: 'Heat 1 spoon of ghee in a cooker. Fry cumin seeds and a little turmeric for 1 minute.', durationMinutes: 2 },
      { id: 'step-3', instruction: 'Add the washed dal, rice, and 3 cups of water. Close lid and cook for 4 whistles until soft.', durationMinutes: 10 },
      { id: 'step-4', instruction: 'Mash the food gently with a spoon. Add a tiny drop of ghee and serve warm.', durationMinutes: 2 }
    ],
    swaps: [
      { ingredient: 'Yellow Moong Dal', alternatives: ['Toor Dal', 'Masoor Dal'] }
    ],
    nutrition: { caloriesPerServing: 260, proteinGrams: 9, carbsGrams: 42, fatGrams: 6 },
    ageNote: 'Good for Babies (Ages 1–3): Soft, easy to swallow, and gives good energy.'
  }
};

/**
 * Generate a dynamic recipe object fallback for offline/development mode
 */
function generateDynamicMockRecipe(ingredientsText, ageGroup, isLeftoverMode = false) {
  const cleanInput = (ingredientsText || '').trim();
  const lowerInput = cleanInput.toLowerCase();

  // Leftover Specific Dynamic Fallback
  if (isLeftoverMode || lowerInput.includes('leftover') || lowerInput.includes('cooked')) {
    return {
      title: `Zero-Waste Leftover ${cleanInput.split(',')[0] || 'Fried Rice & Veggie Mix'}`,
      description: `A fast 15-minute zero-waste dish transforming your leftover ${cleanInput} into a hot, crispy meal.`,
      baseServings: 2,
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      isLeftoverRecipe: true,
      sustainabilityScore: '98% Waste Reduction',
      ingredients: [
        { id: 'ing-1', name: cleanInput || 'Leftover Cooked Food', amount: 2, unit: 'cups', icon: 'pasta', commonlyAvailable: 'Leftover Box' },
        { id: 'ing-2', name: 'Ghee or Cooking Oil', amount: 1.5, unit: 'spoons', icon: 'oil', commonlyAvailable: 'Pantry' },
        { id: 'ing-3', name: 'Chopped Garlic & Cumin', amount: 1, unit: 'spoon', icon: 'garlic', commonlyAvailable: 'Spice box' },
        { id: 'ing-4', name: 'Salt & Pepper', amount: 0.5, unit: 'small spoon', icon: 'salt', commonlyAvailable: 'Spice box' }
      ],
      steps: [
        { id: 'step-1', instruction: 'Take your leftover items out of the fridge and crumble or chop them into bite-sized pieces.', durationMinutes: 3 },
        { id: 'step-2', instruction: 'Heat 1.5 spoons of oil or ghee in a wide frying pan over medium heat.', durationMinutes: 2 },
        { id: 'step-3', instruction: 'Add garlic and cumin seeds. Fry for 1 minute until fragrant.', durationMinutes: 1 },
        { id: 'step-4', instruction: 'Add all leftover ingredients into the pan. Toss and fry continuously on high heat for 5 minutes until crispy and thoroughly hot.', durationMinutes: 5 },
        { id: 'step-5', instruction: 'Season with salt and lemon juice. Serve hot immediately for 100% zero-waste enjoyment!', durationMinutes: 2 }
      ],
      swaps: [
        { ingredient: 'Ghee', alternatives: ['Butter', 'Cooking Oil'] }
      ],
      nutrition: {
        caloriesPerServing: 320,
        proteinGrams: 14,
        carbsGrams: 42,
        fatGrams: 10
      },
      ageNote: `Great zero-waste dish for ${ageGroup}s! Fast to re-cook safely and reduces food waste.`
    };
  }

  // Standard Fresh Ingredient Dynamic Fallback
  return {
    title: `Quick & Easy ${cleanInput || 'Delicious Homemade Dish'}`,
    description: `A simple, tasty dish made with ${cleanInput} in easy steps.`,
    baseServings: 2,
    prepTimeMinutes: 8,
    cookTimeMinutes: 12,
    isLeftoverRecipe: false,
    sustainabilityScore: '90%',
    ingredients: [
      { id: 'ing-1', name: cleanInput || 'Fresh Ingredients', amount: 2, unit: 'cups', icon: 'vegetable', commonlyAvailable: 'Fridge' },
      { id: 'ing-2', name: 'Cooking Oil', amount: 1, unit: 'spoon', icon: 'oil', commonlyAvailable: 'Pantry' },
      { id: 'ing-3', name: 'Salt & Spices', amount: 0.5, unit: 'spoon', icon: 'salt', commonlyAvailable: 'Spice box' }
    ],
    steps: [
      { id: 'step-1', instruction: `Wash and chop ${cleanInput} carefully on a cutting board.`, durationMinutes: 3 },
      { id: 'step-2', instruction: 'Heat oil in a cooking pan over medium flame.', durationMinutes: 2 },
      { id: 'step-3', instruction: 'Add ingredients and fry until cooked through and tender.', durationMinutes: 7 }
    ],
    swaps: [{ ingredient: 'Oil', alternatives: ['Butter', 'Ghee'] }],
    nutrition: { caloriesPerServing: 340, proteinGrams: 12, carbsGrams: 38, fatGrams: 11 },
    ageNote: `Perfect for ${ageGroup}s — simple, fresh, and nutritious.`
  };
}

// POST /api/generate endpoint
app.post('/api/generate', async (req, res) => {
  const { ingredients, ageGroup = 'Adult', isLeftoverMode = false, testMode = null } = req.body;

  if (!ingredients || typeof ingredients !== 'string' || !ingredients.trim()) {
    return res.status(400).json({ error: 'Please type or select ingredients first.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log(`[API Proxy] Serving dynamic recipe for: "${ingredients}" | Mode: ${isLeftoverMode ? 'Leftovers' : 'Fresh'}`);
    const dynamicRecipe = generateDynamicMockRecipe(ingredients, ageGroup, isLeftoverMode);
    return res.json(dynamicRecipe);
  }

  try {
    let rawResultText = '';

    if (process.env.GEMINI_API_KEY) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const selectedPrompt = isLeftoverMode ? LEFTOVER_SYSTEM_PROMPT : SYSTEM_PROMPT;
      const fullPromptText = `${selectedPrompt}\n\nTarget Age Group: ${ageGroup}\nUser Ingredients (${isLeftoverMode ? 'LEFTOVER ITEMS' : 'FRESH'}):\n${ingredients}`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: fullPromptText }] }],
          generationConfig: { temperature: 0.3, responseMimeType: 'application/json' }
        })
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Service busy. Please try again.' });
      }

      const data = await response.json();
      rawResultText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    let cleanedText = rawResultText.trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    res.json({ rawText: cleanedText });
  } catch (err) {
    console.error('[Server Error]', err);
    res.status(500).json({ error: err.message || 'Failed to generate recipe.' });
  }
});

app.listen(PORT, () => {
  console.log(`[Fridge to Recipe Backend] Running on http://localhost:${PORT}`);
});
