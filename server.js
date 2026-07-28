import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are a world-class professional executive chef and culinary expert AI specializing in global and Indian cuisine across all life stages.
The user will provide a list of ingredients or a dish name, and a target age group.
Your task is to transform those specific ingredients/dish into a complete, delicious, submission-ready recipe with estimated nutrition data.

CRITICAL INSTRUCTION:
You MUST create a recipe that uses the SPECIFIC ingredients or dish listed by the user as the primary components.
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
      "icon": "garlic",
      "commonlyAvailable": "string (e.g. 'Pantry', 'Fridge door', 'Fridge — dairy shelf', 'Produce drawer', 'Spice rack', 'Freezer')"
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
3. Ensure commonlyAvailable per ingredient is a realistic short location tag (e.g. 'Pantry', 'Fridge door', 'Fridge — dairy shelf', 'Produce drawer', 'Spice rack', 'Freezer').
4. Ensure baseServings is a positive integer (e.g., 2 or 4).
5. Provide realistic prepTimeMinutes, cookTimeMinutes, step durationMinutes, nutrition estimates per serving, and age-appropriate guidance.`;

/**
 * Extensive Indian & Global culinary recipe database matching 25 age-specific recipes
 */
const AGE_RECIPE_DATABASE = {
  // --- TODDLERS & INFANTS (Ages 1-3) ---
  'moong dal khichdi': {
    title: 'Comforting Yellow Moong Dal Khichdi',
    description: 'A soft, digestible, gut-friendly porridge of split yellow moong dal and basmati rice tempered gently in cow ghee.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Yellow Moong Dal', amount: 0.5, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Small Grain Basmati Rice', amount: 0.5, unit: 'cup', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-3', name: 'Pure Desi Ghee', amount: 1, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Fridge door' },
      { id: 'ing-4', name: 'Cumin Seeds & Turmeric', amount: 0.5, unit: 'tsp', icon: 'salt', commonlyAvailable: 'Spice rack' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Rinse yellow moong dal and rice together 3 times until water runs completely clear.', durationMinutes: 3 },
      { id: 'step-2', instruction: 'Heat ghee in a pressure cooker or pot. Sauté cumin seeds and pinch of turmeric until aromatic.', durationMinutes: 2 },
      { id: 'step-3', instruction: 'Add soaked dal and rice with 3.5 cups water. Pressure cook for 4 whistles until soft and porridge-like.', durationMinutes: 10 },
      { id: 'step-4', instruction: 'Mash softly with a spoon, drizzle a drop of fresh ghee, and serve lukewarm.', durationMinutes: 2 }
    ],
    swaps: [
      { ingredient: 'Yellow Moong Dal', alternatives: ['Toor Dal', 'Masoor Dal'] }
    ],
    nutrition: { caloriesPerServing: 260, proteinGrams: 9, carbsGrams: 42, fatGrams: 6 },
    ageNote: 'Tailored for Infants/Toddlers (Ages 1–3): Easy on developing digestive systems, rich in plant protein and essential fats.'
  },
  'apple ragi porridge': {
    title: 'Creamy Apple Ragi Finger Millet Porridge',
    description: 'A warm, naturally sweet breakfast rich in calcium, made with finger millet flour, fresh grated apple, and cardamom.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Sprouted Ragi (Finger Millet) Flour', amount: 3, unit: 'tbsp', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Fresh Sweet Apple', amount: 1, unit: 'medium, grated', icon: 'lemon', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-3', name: 'Water or Whole Milk', amount: 1.5, unit: 'cups', icon: 'oil', commonlyAvailable: 'Fridge — dairy shelf' },
      { id: 'ing-4', name: 'Cardamom Powder', amount: 0.25, unit: 'tsp', icon: 'salt', commonlyAvailable: 'Spice rack' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Whisk sprouted ragi flour in cold water to make a smooth lump-free slurry.', durationMinutes: 2 },
      { id: 'step-2', instruction: 'Pour slurry into a saucepan over medium heat, stirring continuously until thickened.', durationMinutes: 5 },
      { id: 'step-3', instruction: 'Fold in finely grated apple and pinch of cardamom, simmering for 3 minutes until apple softens.', durationMinutes: 3 },
      { id: 'step-4', instruction: 'Cool to room temperature before feeding your child.', durationMinutes: 2 }
    ],
    swaps: [
      { ingredient: 'Sweet Apple', alternatives: ['Mashed Banana', 'Pear Puree'] }
    ],
    nutrition: { caloriesPerServing: 180, proteinGrams: 4, carbsGrams: 36, fatGrams: 2 },
    ageNote: 'Tailored for Infants/Toddlers (Ages 1–3): Exceptional calcium density for bone development and dietary iron.'
  },
  'suji upma': {
    title: 'Gentle Semolina Suji Upma',
    description: 'A soft, savory roasted semolina upma tempered with ghee, mild mustard seeds, and tender carrot bits.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Fine Suji (Semolina)', amount: 0.5, unit: 'cup', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Fine Diced Carrots', amount: 0.25, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-3', name: 'Desi Ghee', amount: 1, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Fridge door' },
      { id: 'ing-4', name: 'Mustard Seeds & Curry Leaves', amount: 0.5, unit: 'tsp', icon: 'salt', commonlyAvailable: 'Spice rack' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Dry roast suji in a pan for 3 minutes until aromatic, then set aside.', durationMinutes: 3 },
      { id: 'step-2', instruction: 'Heat ghee, pop mustard seeds, add curry leaves and diced carrots, sautéing until soft.', durationMinutes: 3 },
      { id: 'step-3', instruction: 'Pour 1.5 cups water, bring to boil, then slowly whisk in roasted suji to avoid lumps.', durationMinutes: 3 },
      { id: 'step-4', instruction: 'Cover and steam on low heat for 2 minutes until fluffy. Cool slightly and serve.', durationMinutes: 2 }
    ],
    swaps: [{ ingredient: 'Fine Suji', alternatives: ['Roasted Vermicelli', 'Oats'] }],
    nutrition: { caloriesPerServing: 210, proteinGrams: 5, carbsGrams: 34, fatGrams: 6 },
    ageNote: 'Tailored for Infants/Toddlers (Ages 1–3): Soft texture easy for young self-feeding toddlers.'
  },
  'mashed curd rice': {
    title: 'Soothing Creamy Mashed Curd Rice',
    description: 'Soft overcooked rice mashed with probiotic homemade yogurt, a splash of warm milk, and mild ghee tempering.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    ingredients: [
      { id: 'ing-1', name: 'Soft Cooked Rice', amount: 1, unit: 'cup', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Fresh Plain Yogurt (Curd)', amount: 0.75, unit: 'cup', icon: 'cheese', commonlyAvailable: 'Fridge — dairy shelf' },
      { id: 'ing-3', name: 'Whole Milk', amount: 0.25, unit: 'cup', icon: 'oil', commonlyAvailable: 'Fridge — dairy shelf' },
      { id: 'ing-4', name: 'Ghee & Cumin Seeds', amount: 0.5, unit: 'tsp', icon: 'salt', commonlyAvailable: 'Spice rack' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Mash soft warm rice thoroughly with a potato masher or fork.', durationMinutes: 2 },
      { id: 'step-2', instruction: 'Mix in fresh yogurt and warm milk until smooth and silky.', durationMinutes: 2 },
      { id: 'step-3', instruction: 'Temper cumin seeds in ghee for 30 seconds and stir into rice.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Fresh Yogurt', alternatives: ['Greek Yogurt', 'Lactose-Free Yogurt'] }],
    nutrition: { caloriesPerServing: 220, proteinGrams: 7, carbsGrams: 32, fatGrams: 7 },
    ageNote: 'Tailored for Infants/Toddlers (Ages 1–3): Probiotic gut nourishment and cooling digestion support.'
  },
  'dal pani': {
    title: 'Nourishing Warm Dal Pani Soup',
    description: 'The clear, protein-rich strained broth of boiled yellow lentil simmered with a pinch of roasted cumin and ghee.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Yellow Moong Dal Broth', amount: 2, unit: 'cups', icon: 'vegetable', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Cow Ghee', amount: 0.5, unit: 'tsp', icon: 'oil', commonlyAvailable: 'Fridge door' },
      { id: 'ing-3', name: 'Roasted Cumin & Turmeric', amount: 0.25, unit: 'tsp', icon: 'salt', commonlyAvailable: 'Spice rack' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Boil yellow moong dal with turmeric and 3 cups water until completely tender.', durationMinutes: 8 },
      { id: 'step-2', instruction: 'Strain the clear protein-rich water (dal pani) into a small saucepan.', durationMinutes: 2 },
      { id: 'step-3', instruction: 'Temper cumin in ghee and stir into warm broth. Serve in a cup or bowl.', durationMinutes: 2 }
    ],
    swaps: [{ ingredient: 'Yellow Moong Dal Broth', alternatives: ['Red Lentil Broth'] }],
    nutrition: { caloriesPerServing: 90, proteinGrams: 4, carbsGrams: 12, fatGrams: 2.5 },
    ageNote: 'Tailored for Infants (Ages 1–2): Ideal starter weaning liquid packed with soluble protein.'
  },

  // --- YOUNG KIDS (Ages 4-12) ---
  'mini idlis': {
    title: 'Fluffy Button Mini Idlis with Ghee',
    description: 'Steamed bite-sized fermented rice cakes drizzled with warm ghee and mild coconut chutney.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Fermented Idli Batter', amount: 1.5, unit: 'cups', icon: 'pasta', commonlyAvailable: 'Fridge door' },
      { id: 'ing-2', name: 'Desi Ghee', amount: 1, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Fridge door' },
      { id: 'ing-3', name: 'Grated Coconut', amount: 0.25, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Produce drawer' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Grease mini idli mold plates with ghee and ladle batter into bite-sized cavities.', durationMinutes: 2 },
      { id: 'step-2', instruction: 'Steam in idli cooker over medium-high heat for 8-10 minutes until fluffy and cooked through.', durationMinutes: 8 },
      { id: 'step-3', instruction: 'Unmold mini idlis, toss in warm ghee, and serve with mild coconut chutney.', durationMinutes: 2 }
    ],
    swaps: [{ ingredient: 'Fermented Idli Batter', alternatives: ['Oats Idli Batter', 'Rava Batter'] }],
    nutrition: { caloriesPerServing: 270, proteinGrams: 7, carbsGrams: 46, fatGrams: 6 },
    ageNote: 'Tailored for Young Kids (Ages 4–12): Easy-to-eat bite-sized energy boost for active school kids.'
  },
  'cheese whole wheat dosa': {
    title: 'Crispy Cheese & Vegetable Whole Wheat Dosa',
    description: 'Golden whole wheat crepes stuffed with melted mozzarella cheese and finely grated carrots.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Atta (Whole Wheat Flour)', amount: 1, unit: 'cup', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Grated Mozzarella / Cheese', amount: 0.5, unit: 'cup', icon: 'cheese', commonlyAvailable: 'Fridge — dairy shelf' },
      { id: 'ing-3', name: 'Finely Grated Carrots', amount: 0.25, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-4', name: 'Butter / Oil', amount: 1, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Fridge door' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Whisk whole wheat flour with water and salt into a smooth pouring batter.', durationMinutes: 2 },
      { id: 'step-2', instruction: 'Pour a ladle of batter onto a hot tawa skillet, spreading thin in circles.', durationMinutes: 3 },
      { id: 'step-3', instruction: 'Drizzle butter around edges. Sprinkle shredded cheese and grated carrots over center.', durationMinutes: 3 },
      { id: 'step-4', instruction: 'Fold into half-moon when cheese melts and serve golden crisp.', durationMinutes: 2 }
    ],
    swaps: [{ ingredient: 'Whole Wheat Flour', alternatives: ['Multi-Grain Atta', 'Dosa Batter'] }],
    nutrition: { caloriesPerServing: 350, proteinGrams: 14, carbsGrams: 42, fatGrams: 14 },
    ageNote: 'Tailored for Young Kids (Ages 4–12): Fun cheese flavor packed with whole grain fiber and growth protein.'
  },
  'paneer bhurji': {
    title: 'Savory Mild Paneer Bhurji',
    description: 'Fresh scrambled cottage cheese sautéed with tomatoes, mild spices, and fresh coriander.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Fresh Paneer (Cottage Cheese)', amount: 200, unit: 'g, crumbled', icon: 'cheese', commonlyAvailable: 'Fridge — dairy shelf' },
      { id: 'ing-2', name: 'Diced Tomatoes', amount: 0.5, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-3', name: 'Butter or Oil', amount: 1, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Fridge door' },
      { id: 'ing-4', name: 'Mild Turmeric & Cumin', amount: 0.5, unit: 'tsp', icon: 'salt', commonlyAvailable: 'Spice rack' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Crumble fresh paneer coarsely between fingers.', durationMinutes: 2 },
      { id: 'step-2', instruction: 'Melt butter in skillet, sauté diced tomatoes and mild turmeric until soft.', durationMinutes: 4 },
      { id: 'step-3', instruction: 'Toss in crumbled paneer, cooking gently for 3 minutes so paneer stays soft and moist.', durationMinutes: 3 },
      { id: 'step-4', instruction: 'Garnish with fresh cilantro and serve with warm rotis or toast.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Fresh Paneer', alternatives: ['Firm Tofu', 'Scrambled Eggs'] }],
    nutrition: { caloriesPerServing: 320, proteinGrams: 18, carbsGrams: 6, fatGrams: 24 },
    ageNote: 'Tailored for Young Kids (Ages 4–12): High calcium and dense protein for growing bones and muscles.'
  },
  'aloo tikki burger': {
    title: 'Crispy Veggie Aloo Tikki Slider Burger',
    description: 'Spiced potato and pea patty seared golden and layered in a whole wheat bun with cucumber and mild yogurt sauce.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Boiled Potatoes & Peas Patty', amount: 2, unit: 'patties', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-2', name: 'Whole Wheat Burger Buns', amount: 2, unit: 'buns', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-3', name: 'Cucumber & Tomato Slices', amount: 4, unit: 'slices', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-4', name: 'Butter', amount: 1, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Fridge door' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Shallow fry potato pea patties on skillet with butter until both sides are golden crispy.', durationMinutes: 6 },
      { id: 'step-2', instruction: 'Toast whole wheat burger buns lightly on skillet.', durationMinutes: 2 },
      { id: 'step-3', instruction: 'Assemble burger with patty, fresh cucumber slices, and mild yogurt spread.', durationMinutes: 2 }
    ],
    swaps: [{ ingredient: 'Potato Pea Patty', alternatives: ['Paneer Patty', 'Beetroot Patty'] }],
    nutrition: { caloriesPerServing: 380, proteinGrams: 10, carbsGrams: 58, fatGrams: 12 },
    ageNote: 'Tailored for Young Kids (Ages 4–12): A healthy homemade take on kid-favorite burgers.'
  },

  // --- TEENS AND YOUNG ADULTS (Ages 13-25) ---
  'paneer butter masala': {
    title: 'Restaurant Style Paneer Butter Masala',
    description: 'Rich cottage cheese cubes simmered in a velvety tomato cashew cream gravy spiced with kasuri methi.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Paneer Cubes', amount: 250, unit: 'g', icon: 'cheese', commonlyAvailable: 'Fridge — dairy shelf' },
      { id: 'ing-2', name: 'Ripe Tomato Puree', amount: 1, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-3', name: 'Cashew Paste & Fresh Cream', amount: 3, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Fridge door' },
      { id: 'ing-4', name: 'Butter & Garam Masala', amount: 2, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Spice rack' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Melt butter in a pan, sauté tomato puree with ginger garlic paste until oil separates.', durationMinutes: 6 },
      { id: 'step-2', instruction: 'Blend in cashew paste, fresh cream, red chili powder, and garam masala with 0.5 cup water.', durationMinutes: 4 },
      { id: 'step-3', instruction: 'Add paneer cubes and crushed kasuri methi, simmering on low for 4 minutes.', durationMinutes: 4 },
      { id: 'step-4', instruction: 'Garnish with a drizzle of cream and serve hot with naan or rice.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Paneer Cubes', alternatives: ['Tofu Cubes', 'Grilled Chicken'] }],
    nutrition: { caloriesPerServing: 460, proteinGrams: 20, carbsGrams: 16, fatGrams: 36 },
    ageNote: 'Tailored for Teens/Young Adults (Ages 13–25): High-calorie, high-protein energy meal for active lifestyles.'
  },
  'aloo paratha': {
    title: 'Golden Stuffed Punjabi Aloo Paratha',
    description: 'Flaky whole wheat flatbread stuffed with spiced mashed potatoes, roasted cumin, and fresh cilantro, served with butter.',
    baseServings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Whole Wheat Dough', amount: 2, unit: 'portions', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Spiced Mashed Potato Stuffing', amount: 1, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-3', name: 'White Butter or Ghee', amount: 2, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Fridge door' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Flatten wheat dough ball, place spiced potato stuffing inside, seal edges, and roll flat.', durationMinutes: 5 },
      { id: 'step-2', instruction: 'Cook paratha on hot tawa until brown spots appear on both sides.', durationMinutes: 4 },
      { id: 'step-3', instruction: 'Spread butter generously over hot paratha and serve with fresh yogurt and pickle.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Spiced Mashed Potato', alternatives: ['Grated Paneer', 'Grated Cauliflower'] }],
    nutrition: { caloriesPerServing: 420, proteinGrams: 11, carbsGrams: 64, fatGrams: 14 },
    ageNote: 'Tailored for Teens/Young Adults (Ages 13–25): Dense carbohydrate loading for study, sports, and workout recovery.'
  },
  'chicken tikka masala': {
    title: 'Charbroiled Chicken Tikka Masala',
    description: 'Smoky spiced grilled chicken chunks folded into a rich, spicy tomato butter cream curry.',
    baseServings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    ingredients: [
      { id: 'ing-1', name: 'Chicken Breast Chunks', amount: 300, unit: 'g', icon: 'meat', commonlyAvailable: 'Fridge — meat shelf' },
      { id: 'ing-2', name: 'Yogurt & Tikka Spices', amount: 0.5, unit: 'cup', icon: 'cheese', commonlyAvailable: 'Fridge — dairy shelf' },
      { id: 'ing-3', name: 'Tomato Onion Cream Sauce', amount: 1.5, unit: 'cups', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-4', name: 'Butter', amount: 2, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Fridge door' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Marinate chicken chunks in spiced yogurt for 15 minutes, then sear in skillet until charred.', durationMinutes: 8 },
      { id: 'step-2', instruction: 'Simmer tomato onion cream sauce in a skillet with butter and tikka masala powder.', durationMinutes: 6 },
      { id: 'step-3', instruction: 'Fold charred chicken into sauce, simmering for 5 minutes until tender.', durationMinutes: 5 },
      { id: 'step-4', instruction: 'Garnish with coriander and serve hot with garlic naan or jeera rice.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Chicken Breast', alternatives: ['Paneer', 'Soya Chunks'] }],
    nutrition: { caloriesPerServing: 520, proteinGrams: 44, carbsGrams: 14, fatGrams: 32 },
    ageNote: 'Tailored for Teens/Young Adults (Ages 13–25): Excellent high-protein meal supporting athletic performance and muscle synthesis.'
  },
  'chole bhature': {
    title: 'Authentic Punjabi Chole Bhature',
    description: 'Spiced dark chickpea curry cooked with tea infusion and spices, served with fluffy deep-fried bhatura breads.',
    baseServings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    ingredients: [
      { id: 'ing-1', name: 'Soaked Kabuli Chana (Chickpeas)', amount: 1.5, unit: 'cups', icon: 'vegetable', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Fermented Bhatura Dough', amount: 2, unit: 'balls', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-3', name: 'Chole Spice Mix & Tea Infusion', amount: 2, unit: 'tbsp', icon: 'salt', commonlyAvailable: 'Spice rack' },
      { id: 'ing-4', name: 'Cooking Oil for Frying', amount: 2, unit: 'cups', icon: 'oil', commonlyAvailable: 'Pantry shelf' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Pressure cook soaked chickpeas with tea bag and whole spices until tender.', durationMinutes: 12 },
      { id: 'step-2', instruction: 'Sauté onions, tomatoes, and chole masala in oil, then simmer cooked chickpeas for 8 minutes.', durationMinutes: 8 },
      { id: 'step-3', instruction: 'Roll bhatura dough flat and deep fry in hot oil until puffed golden balloon.', durationMinutes: 4 }
    ],
    swaps: [{ ingredient: 'Kabuli Chana', alternatives: ['Black Chickpeas (Kala Chana)'] }],
    nutrition: { caloriesPerServing: 580, proteinGrams: 18, carbsGrams: 78, fatGrams: 22 },
    ageNote: 'Tailored for Teens/Young Adults (Ages 13–25): Hearty celebratory comfort meal with plant iron and fiber.'
  },
  'pav bhaji': {
    title: 'Mumbai Street Style Pav Bhaji',
    description: 'A spicy buttery mash of cauliflower, peas, potatoes, and capsicum served with butter-toasted pav buns.',
    baseServings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Mixed Mashed Veggies (Potatoes, Peas, Cauliflower)', amount: 2, unit: 'cups', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-2', name: 'Pav Bhaji Masala & Tomatoes', amount: 2, unit: 'tbsp', icon: 'salt', commonlyAvailable: 'Spice rack' },
      { id: 'ing-3', name: 'Unsalted Butter', amount: 3, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Fridge door' },
      { id: 'ing-4', name: 'Soft Pav Buns', amount: 4, unit: 'buns', icon: 'pasta', commonlyAvailable: 'Pantry' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Melt butter on flat tawa, sauté onions, capsicum, and tomatoes with pav bhaji masala.', durationMinutes: 5 },
      { id: 'step-2', instruction: 'Add boiled mashed vegetables with 0.5 cup water, mashing vigorously on high heat.', durationMinutes: 6 },
      { id: 'step-3', instruction: 'Slice pav buns, toast generously in butter on tawa until golden.', durationMinutes: 3 },
      { id: 'step-4', instruction: 'Serve piping hot bhaji topped with a knob of butter, diced onions, and lemon wedge.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Soft Pav Buns', alternatives: ['Whole Wheat Bread', 'Roti'] }],
    nutrition: { caloriesPerServing: 490, proteinGrams: 12, carbsGrams: 66, fatGrams: 20 },
    ageNote: 'Tailored for Teens/Young Adults (Ages 13–25): High energy street food favorite loaded with phytonutrients.'
  },

  // --- ADULTS (Ages 26-50) ---
  'chana masala': {
    title: 'Piquant North Indian Chana Masala',
    description: 'Tender chickpeas simmered in a tangy ginger garlic tomato onion gravy spiced with roasted pomegranate powder.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Cooked Chickpeas', amount: 2, unit: 'cups', icon: 'vegetable', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Diced Tomatoes & Onions', amount: 1, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-3', name: 'Ginger Garlic Paste', amount: 1, unit: 'tbsp', icon: 'garlic', commonlyAvailable: 'Fridge door' },
      { id: 'ing-4', name: 'Chana Masala Spices & Olive Oil', amount: 2, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Spice rack' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Heat olive oil, sauté diced onions, ginger garlic paste, and tomatoes until golden paste forms.', durationMinutes: 6 },
      { id: 'step-2', instruction: 'Add chana masala powder, cumin, and coriander powder with chickpeas and 1 cup water.', durationMinutes: 4 },
      { id: 'step-3', instruction: 'Simmer on medium heat for 8 minutes until gravy thickens naturally.', durationMinutes: 5 },
      { id: 'step-4', instruction: 'Garnish with julienned ginger, fresh cilantro, and serve warm with brown rice or chapati.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Chickpeas', alternatives: ['Kidney Beans (Rajma)', 'Black Eyed Peas'] }],
    nutrition: { caloriesPerServing: 360, proteinGrams: 16, carbsGrams: 52, fatGrams: 10 },
    ageNote: 'Tailored for Adults (Ages 26–50): High dietary fiber supporting healthy cholesterol levels and glycemic balance.'
  },
  'palak paneer': {
    title: 'Vibrant Garlic Palak Paneer',
    description: 'Fresh spinach puree simmered with aromatic garlic, mild green chilies, and soft seared paneer cubes.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    ingredients: [
      { id: 'ing-1', name: 'Blanched Fresh Spinach Puree', amount: 2, unit: 'cups', icon: 'spinach', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-2', name: 'Paneer Cubes', amount: 200, unit: 'g', icon: 'cheese', commonlyAvailable: 'Fridge — dairy shelf' },
      { id: 'ing-3', name: 'Garlic Cloves', amount: 6, unit: 'cloves, minced', icon: 'garlic', commonlyAvailable: 'Pantry' },
      { id: 'ing-4', name: 'Olive Oil or Ghee', amount: 1.5, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Pantry shelf' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Blanch spinach leaves in boiling water for 2 minutes, shock in ice water, and blend into smooth vibrant green puree.', durationMinutes: 4 },
      { id: 'step-2', instruction: 'Heat oil in pan, sauté minced garlic until golden brown. Stir in spinach puree.', durationMinutes: 4 },
      { id: 'step-3', instruction: 'Add paneer cubes, sea salt, and pinch of garam masala, simmering for 4 minutes.', durationMinutes: 4 }
    ],
    swaps: [{ ingredient: 'Paneer Cubes', alternatives: ['Tofu Cubes', 'Boiled Potatoes'] }],
    nutrition: { caloriesPerServing: 340, proteinGrams: 19, carbsGrams: 10, fatGrams: 24 },
    ageNote: 'Tailored for Adults (Ages 26–50): Nutrient powerhouse rich in iron, magnesium, and antioxidant carotenoids.'
  },
  'vegetable biryani': {
    title: 'Hyderabadi Dum Vegetable Biryani',
    description: 'Fragrant saffron basmati rice layered with spiced cauliflower, carrots, beans, and crispy fried onions.',
    baseServings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    ingredients: [
      { id: 'ing-1', name: 'Aged Basmati Rice', amount: 1.5, unit: 'cups', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Mixed Vegetables (Carrots, Beans, Peas)', amount: 1.5, unit: 'cups', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-3', name: 'Biryani Spices & Saffron Milk', amount: 2, unit: 'tbsp', icon: 'salt', commonlyAvailable: 'Spice rack' },
      { id: 'ing-4', name: 'Ghee & Fried Onions', amount: 2, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Fridge door' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Parboil basmati rice with whole spices until 70% cooked.', durationMinutes: 8 },
      { id: 'step-2', instruction: 'Sauté mixed vegetables in yogurt biryani marinade in a deep pot.', durationMinutes: 6 },
      { id: 'step-3', instruction: 'Layer parboiled rice over vegetable gravy, drizzle saffron milk and ghee, cover tight, and steam (dum) on low for 10 minutes.', durationMinutes: 10 }
    ],
    swaps: [{ ingredient: 'Basmati Rice', alternatives: ['Brown Basmati Rice', 'Quinoa'] }],
    nutrition: { caloriesPerServing: 430, proteinGrams: 10, carbsGrams: 68, fatGrams: 14 },
    ageNote: 'Tailored for Adults (Ages 26–50): Complex carbohydrate and phytonutrient rich gourmet main dish.'
  },
  'baingan bharta': {
    title: 'Smoky Roasted Baingan Bharta',
    description: 'Fire-roasted eggplant mashed and sautéed with onions, garlic, tomatoes, and mustard oil.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Large Eggplant (Baingan)', amount: 1, unit: 'large, roasted', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-2', name: 'Finely Chopped Tomatoes & Onions', amount: 1, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-3', name: 'Garlic & Green Chilies', amount: 1, unit: 'tbsp, minced', icon: 'garlic', commonlyAvailable: 'Pantry' },
      { id: 'ing-4', name: 'Mustard Oil', amount: 1.5, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Pantry shelf' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Roast whole eggplant over open flame until skin is charred, peel skin, and mash pulp.', durationMinutes: 8 },
      { id: 'step-2', instruction: 'Heat mustard oil, sauté garlic, onions, and tomatoes until soft and fragrant.', durationMinutes: 5 },
      { id: 'step-3', instruction: 'Fold in mashed eggplant pulp and spices, cooking for 5 minutes. Garnish with coriander.', durationMinutes: 3 }
    ],
    swaps: [{ ingredient: 'Eggplant', alternatives: ['Roasted Zucchini', 'Roasted Peppers'] }],
    nutrition: { caloriesPerServing: 190, proteinGrams: 4, carbsGrams: 18, fatGrams: 12 },
    ageNote: 'Tailored for Adults (Ages 26–50): Low calorie, high nasunin antioxidant content supporting metabolic health.'
  },
  'fish curry': {
    title: 'Goan Coconut Fish Curry',
    description: 'Tender sea bass or kingfish fillets simmered in a tangy coconut tamarind curry paste.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'White Fish Fillets', amount: 300, unit: 'g', icon: 'meat', commonlyAvailable: 'Fridge — meat shelf' },
      { id: 'ing-2', name: 'Coconut Milk & Tamarind Paste', amount: 1, unit: 'cup', icon: 'oil', commonlyAvailable: 'Pantry' },
      { id: 'ing-3', name: 'Goan Curry Powder & Garlic', amount: 1.5, unit: 'tbsp', icon: 'salt', commonlyAvailable: 'Spice rack' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Simmer Goan curry powder, coconut milk, and tamarind in saucepan for 6 minutes.', durationMinutes: 6 },
      { id: 'step-2', instruction: 'Gently add fish fillets into bubbling curry, simmering on medium heat for 6-8 minutes until fish flakes easily.', durationMinutes: 8 },
      { id: 'step-3', instruction: 'Serve warm over steamed basmati rice.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Fish Fillets', alternatives: ['Prawns', 'Tofu'] }],
    nutrition: { caloriesPerServing: 380, proteinGrams: 32, carbsGrams: 8, fatGrams: 24 },
    ageNote: 'Tailored for Adults (Ages 26–50): Rich in Omega-3 fatty acids for cardiovascular health and brain function.'
  },

  // --- SENIORS AND OLDER ADULTS (Ages 51+) ---
  'oats upma': {
    title: 'Heart-Healthy Rolled Oats Upma',
    description: 'Fiber-rich rolled oats cooked with mustard seeds, green peas, carrots, and turmeric in olive oil.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Rolled Oats', amount: 1, unit: 'cup', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Steamed Peas & Carrots', amount: 0.5, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-3', name: 'Extra Virgin Olive Oil', amount: 1, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Pantry shelf' },
      { id: 'ing-4', name: 'Mustard Seeds & Turmeric', amount: 0.5, unit: 'tsp', icon: 'salt', commonlyAvailable: 'Spice rack' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Dry roast rolled oats in a pan for 3 minutes until warm.', durationMinutes: 3 },
      { id: 'step-2', instruction: 'Heat olive oil, temper mustard seeds, curry leaves, and sauté veggies.', durationMinutes: 3 },
      { id: 'step-3', instruction: 'Add 1 cup water, bring to boil, stir in roasted oats, cover, and steam on low for 3 minutes.', durationMinutes: 4 }
    ],
    swaps: [{ ingredient: 'Rolled Oats', alternatives: ['Quinoa Flakes', 'Broken Wheat'] }],
    nutrition: { caloriesPerServing: 240, proteinGrams: 8, carbsGrams: 38, fatGrams: 7 },
    ageNote: 'Tailored for Seniors (Ages 51+): High in beta-glucan soluble fiber supporting cardiac health and smooth digestion.'
  },
  'dalia khichdi': {
    title: 'Nutritious Broken Wheat Dalia Khichdi',
    description: 'Wholesome broken wheat and yellow moong dal pressure cooked with cumin and ghee.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Broken Wheat (Dalia)', amount: 0.5, unit: 'cup', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Moong Dal', amount: 0.5, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Pantry' },
      { id: 'ing-3', name: 'Cow Ghee & Cumin', amount: 1, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Fridge door' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Roast broken wheat in ghee until aromatic.', durationMinutes: 3 },
      { id: 'step-2', instruction: 'Add washed moong dal, cumin, turmeric, and 3.5 cups water into pressure cooker.', durationMinutes: 3 },
      { id: 'step-3', instruction: 'Cook for 3 whistles until soft and porridge consistency. Serve warm.', durationMinutes: 9 }
    ],
    swaps: [{ ingredient: 'Broken Wheat', alternatives: ['Barnyard Millet', 'Quinoa'] }],
    nutrition: { caloriesPerServing: 270, proteinGrams: 11, carbsGrams: 46, fatGrams: 5 },
    ageNote: 'Tailored for Seniors (Ages 51+): Gentle, easily digestible low-glycemic comfort food.'
  },
  'toor dal fry': {
    title: 'Aromatic Yellow Toor Dal Tadka',
    description: 'Creamy boiled yellow pigeon peas tempered with ghee, cumin seeds, garlic, and fresh coriander.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Toor Dal (Split Pigeon Peas)', amount: 1, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Garlic Cloves', amount: 4, unit: 'cloves, sliced', icon: 'garlic', commonlyAvailable: 'Pantry' },
      { id: 'ing-3', name: 'Ghee & Cumin Seeds', amount: 1, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Spice rack' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Pressure cook toor dal with turmeric and salt for 4 whistles until soft and creamy.', durationMinutes: 10 },
      { id: 'step-2', instruction: 'Heat ghee in tadka pan, brown garlic and cumin seeds until fragrant.', durationMinutes: 3 },
      { id: 'step-3', instruction: 'Pour hot ghee tadka over cooked dal, garnish with cilantro, and serve with rice.', durationMinutes: 2 }
    ],
    swaps: [{ ingredient: 'Toor Dal', alternatives: ['Moong Dal', 'Masoor Dal'] }],
    nutrition: { caloriesPerServing: 280, proteinGrams: 14, carbsGrams: 42, fatGrams: 6 },
    ageNote: 'Tailored for Seniors (Ages 51+): High plant protein and potassium supporting blood pressure control.'
  },
  'lauki sabzi': {
    title: 'Light & Healing Lauki (Bottle Gourd) Sabzi',
    description: 'Tender bottle gourd cubes cooked softly with minimal spices, tomatoes, cumin, and ghee.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    ingredients: [
      { id: 'ing-1', name: 'Fresh Lauki (Bottle Gourd)', amount: 2, unit: 'cups, cubed', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-2', name: 'Diced Tomatoes', amount: 0.5, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Produce drawer' },
      { id: 'ing-3', name: 'Ghee & Cumin', amount: 1, unit: 'tbsp', icon: 'oil', commonlyAvailable: 'Fridge door' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Peel bottle gourd and cut into small bite-sized cubes.', durationMinutes: 3 },
      { id: 'step-2', instruction: 'Heat ghee in pan, sauté cumin, diced tomatoes, and lauki cubes.', durationMinutes: 4 },
      { id: 'step-3', instruction: 'Cover and cook on low heat for 8 minutes until lauki turns soft and translucent. Serve warm.', durationMinutes: 5 }
    ],
    swaps: [{ ingredient: 'Bottle Gourd', alternatives: ['Zucchini', 'Ridge Gourd (Turai)'] }],
    nutrition: { caloriesPerServing: 120, proteinGrams: 3, carbsGrams: 14, fatGrams: 6 },
    ageNote: 'Tailored for Seniors (Ages 51+): Extremely hydrating, low sodium, and soothing for digestive comfort.'
  },
  'masala chaas': {
    title: 'Cooling Digestive Masala Chaas',
    description: 'Refreshing spiced buttermilk churned with roasted cumin, mint leaves, rock salt, and coriander.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 2,
    ingredients: [
      { id: 'ing-1', name: 'Plain Fresh Curd', amount: 1, unit: 'cup', icon: 'cheese', commonlyAvailable: 'Fridge — dairy shelf' },
      { id: 'ing-2', name: 'Chilled Water', amount: 2, unit: 'cups', icon: 'oil', commonlyAvailable: 'Fridge door' },
      { id: 'ing-3', name: 'Roasted Cumin & Black Salt', amount: 1, unit: 'tsp', icon: 'salt', commonlyAvailable: 'Spice rack' },
      { id: 'ing-4', name: 'Fresh Mint & Cilantro', amount: 2, unit: 'tbsp', icon: 'vegetable', commonlyAvailable: 'Produce drawer' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Whisk yogurt with chilled water in a pitcher until frothy.', durationMinutes: 2 },
      { id: 'step-2', instruction: 'Stir in roasted cumin powder, black salt, finely chopped mint, and cilantro.', durationMinutes: 2 },
      { id: 'step-3', instruction: 'Pour into tall glasses and serve chilled after meals.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Fresh Curd', alternatives: ['Greek Yogurt diluted with water'] }],
    nutrition: { caloriesPerServing: 90, proteinGrams: 5, carbsGrams: 8, fatGrams: 4 },
    ageNote: 'Tailored for Seniors (Ages 51+): Excellent electrolyte rehydration and post-meal digestive aid.'
  }
};

/**
 * Dynamic fallback recipe generator for offline/testing mode when no live API key is configured.
 * Generates distinct recipes matching the specific ingredients or dish provided in input.
 */
function generateDynamicMockRecipe(ingredientsInput = '', ageGroup = 'Adult') {
  const text = ingredientsInput.toLowerCase().trim();

  // Search exact database keys first
  for (const [key, dbRecipe] of Object.entries(AGE_RECIPE_DATABASE)) {
    if (text.includes(key) || key.includes(text)) {
      return {
        ...dbRecipe,
        ageNote: dbRecipe.ageNote || `Tailored for ${ageGroup}s: Balanced nutritional composition.`
      };
    }
  }

  // Substring database search for partial names (e.g. "pulao", "upma", "khichdi", "dosa", "idli", "paratha", "paneer", "curry", "chaas")
  if (text.includes('khichdi') || text.includes('dalia')) {
    return AGE_RECIPE_DATABASE['moong dal khichdi'];
  }
  if (text.includes('upma') || text.includes('oats')) {
    return AGE_RECIPE_DATABASE['oats upma'];
  }
  if (text.includes('porridge') || text.includes('ragi')) {
    return AGE_RECIPE_DATABASE['apple ragi porridge'];
  }
  if (text.includes('curd rice')) {
    return AGE_RECIPE_DATABASE['mashed curd rice'];
  }
  if (text.includes('dal') || text.includes('toor')) {
    return AGE_RECIPE_DATABASE['toor dal fry'];
  }
  if (text.includes('idli') || text.includes('idlis')) {
    return AGE_RECIPE_DATABASE['mini idlis'];
  }
  if (text.includes('dosa')) {
    return AGE_RECIPE_DATABASE['cheese whole wheat dosa'];
  }
  if (text.includes('pulao') || text.includes('biryani')) {
    return AGE_RECIPE_DATABASE['vegetable biryani'];
  }
  if (text.includes('paneer') || text.includes('bhurji')) {
    return AGE_RECIPE_DATABASE['paneer bhurji'];
  }
  if (text.includes('burger') || text.includes('tikki')) {
    return AGE_RECIPE_DATABASE['aloo tikki burger'];
  }
  if (text.includes('paratha')) {
    return AGE_RECIPE_DATABASE['aloo paratha'];
  }
  if (text.includes('tikka') || text.includes('masala')) {
    return AGE_RECIPE_DATABASE['paneer butter masala'];
  }
  if (text.includes('chole') || text.includes('bhature')) {
    return AGE_RECIPE_DATABASE['chole bhature'];
  }
  if (text.includes('bhaji') || text.includes('pav')) {
    return AGE_RECIPE_DATABASE['pav bhaji'];
  }
  if (text.includes('palak')) {
    return AGE_RECIPE_DATABASE['palak paneer'];
  }
  if (text.includes('fish') || text.includes('curry')) {
    return AGE_RECIPE_DATABASE['fish curry'];
  }
  if (text.includes('lauki') || text.includes('sabzi')) {
    return AGE_RECIPE_DATABASE['lauki sabzi'];
  }
  if (text.includes('chaas') || text.includes('lassi')) {
    return AGE_RECIPE_DATABASE['masala chaas'];
  }

  // Default Dynamic Fallback matching parsed items
  const items = ingredientsInput.split(/,|\n/).map((s) => s.trim()).filter(Boolean);
  const primaryItem = items[0] || 'Seasonal Veggies';
  const secondaryItem = items[1] || 'Aromatic Herbs';

  const assignLocation = (name = '') => {
    const term = name.toLowerCase();
    if (term.includes('egg') || term.includes('milk') || term.includes('butter') || term.includes('cheese') || term.includes('paneer') || term.includes('curd')) return 'Fridge — dairy shelf';
    if (term.includes('spinach') || term.includes('broccoli') || term.includes('tomato') || term.includes('lemon') || term.includes('carrot') || term.includes('peas')) return 'Produce drawer';
    if (term.includes('chicken') || term.includes('beef') || term.includes('pork') || term.includes('tofu') || term.includes('fish')) return 'Fridge — meat shelf';
    if (term.includes('salt') || term.includes('pepper') || term.includes('chili') || term.includes('ginger') || term.includes('garlic') || term.includes('spice')) return 'Spice rack';
    return 'Pantry';
  };

  return {
    title: `Sautéed ${primaryItem} & ${secondaryItem} Medley`,
    description: `A delicious custom dish created around your fresh ${primaryItem.toLowerCase()} and ${secondaryItem.toLowerCase()}.`,
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    ingredients: (items.length > 0 ? items : [primaryItem, secondaryItem]).slice(0, 6).map((item, idx) => ({
      id: `ing-${idx + 1}`,
      name: item,
      amount: idx === 0 ? 2 : 1,
      unit: idx === 0 ? 'cups' : 'tbsp',
      icon: item.toLowerCase().includes('chicken') || item.toLowerCase().includes('fish') ? 'meat' : 'vegetable',
      commonlyAvailable: assignLocation(item)
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
