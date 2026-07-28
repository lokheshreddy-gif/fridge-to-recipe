import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are a world-class professional executive chef and culinary expert AI.
The user will provide a list of ingredients they have available in their fridge/pantry, and a target age group.
Your task is to transform those specific ingredients into a complete, delicious, submission-ready recipe with estimated nutrition data.

CRITICAL INSTRUCTION:
You MUST create a recipe that uses the SPECIFIC ingredients listed by the user as the primary components.
Do NOT default to a generic dish or a chicken recipe unless the user specifically lists chicken.
The recipe title, ingredients list, and step instructions MUST directly reflect and incorporate the ingredients provided by the user.

You MUST respond ONLY with a raw, valid JSON object matching this EXACT schema:
{
  "title": "string (Creative, appealing recipe title matching user's ingredients)",
  "description": "string (Short 1-2 sentence appetizing description)",
  "baseServings": 2,
  "prepTimeMinutes": 10,
  "cookTimeMinutes": 20,
  "ingredients": [
    {
      "id": "ing-1",
      "name": "string (Exact ingredient name)",
      "amount": 3,
      "unit": "cloves",
      "icon": "garlic"
    }
  ],
  "steps": [
    {
      "id": "step-1",
      "instruction": "string (Clear step-by-step instruction for cooking these ingredients)",
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

/**
 * Dynamic fallback recipe generator for offline/testing mode when no live API key is configured.
 * Generates distinct recipes matching the specific ingredients provided in input.
 */
function generateDynamicMockRecipe(ingredientsInput = '', ageGroup = 'Adult') {
  const text = ingredientsInput.toLowerCase();

  // 1. Morning Omelette / Eggs pattern
  if (text.includes('egg') || text.includes('omelette') || text.includes('cheddar') || text.includes('chive')) {
    return {
      title: 'Fluffy Cheddar & Herb Omelette',
      description: 'A delicate 10-minute French-style folded omelette stuffed with melted cheddar cheese and fresh chives.',
      baseServings: 2,
      prepTimeMinutes: 5,
      cookTimeMinutes: 5,
      ingredients: [
        { id: 'ing-1', name: 'Fresh Eggs', amount: 4, unit: 'large eggs', icon: 'cheese' },
        { id: 'ing-2', name: 'Cheddar Cheese', amount: 0.5, unit: 'cup, shredded', icon: 'cheese' },
        { id: 'ing-3', name: 'Cherry Tomatoes', amount: 0.5, unit: 'cup, halved', icon: 'vegetable' },
        { id: 'ing-4', name: 'Unsalted Butter', amount: 1.5, unit: 'tbsp', icon: 'oil' },
        { id: 'ing-5', name: 'Sea Salt & Chives', amount: 0.5, unit: 'tsp', icon: 'salt' }
      ],
      steps: [
        { id: 'step-1', instruction: 'Whisk fresh eggs in a bowl with sea salt until completely smooth and frothy.', durationMinutes: 2 },
        { id: 'step-2', instruction: 'Melt unsalted butter in a non-stick skillet over medium-low heat.', durationMinutes: 2 },
        { id: 'step-3', instruction: 'Pour in eggs, gently pushing edges toward center until soft curds form. Sprinkle shredded cheddar and cherry tomatoes over top.', durationMinutes: 3 },
        { id: 'step-4', instruction: 'Fold omelette in half, slide onto plate, and garnish with fresh chives.', durationMinutes: 1 }
      ],
      swaps: [
        { ingredient: 'Cheddar Cheese', alternatives: ['Feta Cheese', 'Swiss Cheese', 'Mozzarella'] },
        { ingredient: 'Cherry Tomatoes', alternatives: ['Bell Peppers', 'Mushrooms', 'Spinach'] }
      ],
      nutrition: { caloriesPerServing: 340, proteinGrams: 22, carbsGrams: 4, fatGrams: 26 },
      ageNote: `Tailored for ${ageGroup}s: High quality complete protein and choline for cognitive health and muscle maintenance.`
    };
  }

  // 2. Pasta / Aglio e Olio pattern
  if (text.includes('pasta') || text.includes('spaghetti') || text.includes('chili') || text.includes('parmesan')) {
    return {
      title: 'Garlic Olive Oil & Chili Pasta (Aglio e Olio)',
      description: 'A classic 15-minute Italian pasta tossed in golden garlic oil, crushed red chili flakes, and fresh parsley.',
      baseServings: 2,
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      ingredients: [
        { id: 'ing-1', name: 'Spaghetti Pasta', amount: 8, unit: 'oz', icon: 'pasta' },
        { id: 'ing-2', name: 'Garlic Cloves', amount: 6, unit: 'cloves, thinly sliced', icon: 'garlic' },
        { id: 'ing-3', name: 'Extra Virgin Olive Oil', amount: 3, unit: 'tbsp', icon: 'oil' },
        { id: 'ing-4', name: 'Red Chili Flakes', amount: 1, unit: 'tsp', icon: 'pepper' },
        { id: 'ing-5', name: 'Parmesan Cheese', amount: 0.25, unit: 'cup, grated', icon: 'cheese' }
      ],
      steps: [
        { id: 'step-1', instruction: 'Boil spaghetti in a pot of generously salted water until al dente, reserving 0.5 cup pasta water.', durationMinutes: 9 },
        { id: 'step-2', instruction: 'Heat olive oil in a skillet over medium-low heat. Add sliced garlic and chili flakes, simmering until garlic turns pale golden.', durationMinutes: 3 },
        { id: 'step-3', instruction: 'Toss cooked spaghetti directly into garlic oil with reserved pasta water, stirring vigorously to create a glossy emulsion.', durationMinutes: 2 },
        { id: 'step-4', instruction: 'Plate hot pasta, garnish with grated parmesan cheese and fresh parsley.', durationMinutes: 1 }
      ],
      swaps: [
        { ingredient: 'Spaghetti Pasta', alternatives: ['Penne', 'Fettuccine', 'Gluten-Free Pasta'] },
        { ingredient: 'Olive Oil', alternatives: ['Garlic Butter', 'Avocado Oil'] }
      ],
      nutrition: { caloriesPerServing: 480, proteinGrams: 14, carbsGrams: 62, fatGrams: 20 },
      ageNote: `Tailored for ${ageGroup}s: Energy-dense complex carbohydrates providing sustained vitality throughout the day.`
    };
  }

  // 3. Tofu / Broccoli Stir-fry pattern
  if (text.includes('tofu') || text.includes('broccoli') || text.includes('soy') || text.includes('ginger')) {
    return {
      title: 'Ginger Soy Crispy Tofu & Broccoli Stir-Fry',
      description: 'Golden seared tofu cubes and crisp broccoli florets tossed in a fragrant ginger garlic soy glaze.',
      baseServings: 2,
      prepTimeMinutes: 10,
      cookTimeMinutes: 10,
      ingredients: [
        { id: 'ing-1', name: 'Firm Tofu', amount: 14, unit: 'oz, cubed', icon: 'vegetable' },
        { id: 'ing-2', name: 'Fresh Broccoli', amount: 2, unit: 'cups, florets', icon: 'vegetable' },
        { id: 'ing-3', name: 'Soy Sauce', amount: 2, unit: 'tbsp', icon: 'oil' },
        { id: 'ing-4', name: 'Fresh Ginger', amount: 1, unit: 'tbsp, minced', icon: 'garlic' },
        { id: 'ing-5', name: 'Sesame Oil', amount: 1, unit: 'tbsp', icon: 'oil' }
      ],
      steps: [
        { id: 'step-1', instruction: 'Press tofu dry with paper towels and cut into 1-inch cubes.', durationMinutes: 3 },
        { id: 'step-2', instruction: 'Heat sesame oil in a skillet over high heat. Add cubed tofu and sear until all sides are golden brown and crispy.', durationMinutes: 6 },
        { id: 'step-3', instruction: 'Add broccoli florets, minced ginger, and soy sauce to skillet, stir-frying for 3 minutes until broccoli is tender-crisp.', durationMinutes: 3 },
        { id: 'step-4', instruction: 'Plate immediately over steamed rice or grain bowl.', durationMinutes: 1 }
      ],
      swaps: [
        { ingredient: 'Firm Tofu', alternatives: ['Seitan', 'Tempeh', 'Edamame'] },
        { ingredient: 'Broccoli', alternatives: ['Snap Peas', 'Bok Choy', 'Baby Corn'] }
      ],
      nutrition: { caloriesPerServing: 310, proteinGrams: 24, carbsGrams: 16, fatGrams: 17 },
      ageNote: `Tailored for ${ageGroup}s: Plant-based protein and high fiber for digestive and cardiovascular wellness.`
    };
  }

  // 4. Default Dynamic Fallback matching parsed items
  const items = ingredientsInput.split(/,|\n/).map((s) => s.trim()).filter(Boolean);
  const primaryItem = items[0] || 'Seasonal Veggies';
  const secondaryItem = items[1] || 'Aromatic Herbs';

  return {
    title: `Sautéed ${primaryItem} & ${secondaryItem} Medley`,
    description: `A delicious custom dish created around your fresh ${primaryItem.toLowerCase()} and ${secondaryItem.toLowerCase()}.`,
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    ingredients: items.slice(0, 5).map((item, idx) => ({
      id: `ing-${idx + 1}`,
      name: item,
      amount: idx === 0 ? 2 : 1,
      unit: idx === 0 ? 'cups' : 'tbsp',
      icon: item.toLowerCase().includes('chicken') || item.toLowerCase().includes('beef') ? 'meat' : 'vegetable'
    })),
    steps: [
      { id: 'step-1', instruction: `Wash, prep, and slice your ${primaryItem} and ${secondaryItem}.`, durationMinutes: 3 },
      { id: 'step-2', instruction: `Heat a skillet with cooking oil over medium heat. Add ${primaryItem} and cook until tender.`, durationMinutes: 5 },
      { id: 'step-3', instruction: `Toss in ${secondaryItem} and seasonings, stirring until fragrant.`, durationMinutes: 3 },
      { id: 'step-4', instruction: 'Serve warm and enjoy your custom creation!', durationMinutes: 1 }
    ],
    swaps: [
      { ingredient: primaryItem, alternatives: ['Seasonal Greens', 'Root Vegetables'] }
    ],
    nutrition: { caloriesPerServing: 380, proteinGrams: 28, carbsGrams: 22, fatGrams: 14 },
    ageNote: `Tailored for ${ageGroup}s: Balanced macronutrient breakdown supporting overall wellness.`
  };
}

app.post('/api/generate', async (req, res) => {
  const { ingredients, ageGroup = 'Adult', testMode } = req.body;

  console.log(`[API Proxy Request] Received ingredients: "${ingredients}" | ageGroup: "${ageGroup}" | testMode: "${testMode || 'none'}"`);

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
    console.log(`[API Proxy] Serving dynamic recipe matching ingredients: "${ingredients}"`);
    const dynamicRecipe = generateDynamicMockRecipe(ingredients, ageGroup);
    return res.json(dynamicRecipe);
  }

  try {
    let rawResultText = '';

    if (process.env.GEMINI_API_KEY) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      
      const fullPromptText = `${SYSTEM_PROMPT}\n\nTarget Age Group: ${ageGroup}\nUser's Specific Ingredients Available:\n${ingredients}`;
      console.log(`[LLM Prompt Sent to Gemini]: "${fullPromptText.slice(0, 150)}..."`);

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: fullPromptText }]
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
            { role: 'user', content: `Target Age Group: ${ageGroup}\nUser's Specific Ingredients available: ${ingredients}` }
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
