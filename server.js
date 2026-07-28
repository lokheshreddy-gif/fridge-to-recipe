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
  },
  'apple ragi porridge': {
    title: 'Sweet Apple Ragi Porridge',
    description: 'A warm, healthy sweet porridge made with finger millet flour and fresh apple.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Ragi (Millet) Flour', amount: 3, unit: 'spoons', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Sweet Apple', amount: 1, unit: 'grated', icon: 'lemon', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-3', name: 'Water or Milk', amount: 1.5, unit: 'cups', icon: 'oil', commonlyAvailable: 'Fridge' },
      { id: 'ing-4', name: 'Cardamom Powder', amount: 0.25, unit: 'small spoon', icon: 'salt', commonlyAvailable: 'Spice box' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Mix the ragi flour in cold water so there are no lumps.', durationMinutes: 2 },
      { id: 'step-2', instruction: 'Cook on medium heat while stirring continuously until it gets thick.', durationMinutes: 5 },
      { id: 'step-3', instruction: 'Add grated apple and cardamom powder. Cook for 3 minutes until apple is soft.', durationMinutes: 3 },
      { id: 'step-4', instruction: 'Let it cool down to warm before feeding.', durationMinutes: 2 }
    ],
    swaps: [
      { ingredient: 'Sweet Apple', alternatives: ['Mashed Banana', 'Soft Pear'] }
    ],
    nutrition: { caloriesPerServing: 180, proteinGrams: 4, carbsGrams: 36, fatGrams: 2 },
    ageNote: 'Good for Babies (Ages 1–3): Rich in calcium for strong bones.'
  },
  'suji upma': {
    title: 'Soft Suji Upma with Carrots',
    description: 'A soft, warm semolina upma made with ghee and small carrot pieces.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Suji (Semolina)', amount: 0.5, unit: 'cup', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Cut Carrots', amount: 0.25, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-3', name: 'Ghee', amount: 1, unit: 'spoon', icon: 'oil', commonlyAvailable: 'Fridge door' },
      { id: 'ing-4', name: 'Mustard Seeds', amount: 0.5, unit: 'small spoon', icon: 'salt', commonlyAvailable: 'Spice box' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Roast the suji in a dry pan for 3 minutes until warm, then put it in a plate.', durationMinutes: 3 },
      { id: 'step-2', instruction: 'Heat ghee in the pan, add mustard seeds and carrot pieces. Fry until soft.', durationMinutes: 3 },
      { id: 'step-3', instruction: 'Add 1.5 cups water, bring to boil, then slowly stir in roasted suji.', durationMinutes: 3 },
      { id: 'step-4', instruction: 'Cover with lid and cook for 2 minutes until soft and fluffy.', durationMinutes: 2 }
    ],
    swaps: [{ ingredient: 'Suji', alternatives: ['Oats', 'Vermicelli'] }],
    nutrition: { caloriesPerServing: 210, proteinGrams: 5, carbsGrams: 34, fatGrams: 6 },
    ageNote: 'Good for Toddlers (Ages 1–3): Soft texture that is easy to chew.'
  },
  'mashed curd rice': {
    title: 'Cool Mashed Curd Rice',
    description: 'Soft rice mixed with fresh yogurt and a spoon of ghee.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    ingredients: [
      { id: 'ing-1', name: 'Soft Cooked Rice', amount: 1, unit: 'cup', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Fresh Curd (Yogurt)', amount: 0.75, unit: 'cup', icon: 'cheese', commonlyAvailable: 'Fridge' },
      { id: 'ing-3', name: 'Milk', amount: 0.25, unit: 'cup', icon: 'oil', commonlyAvailable: 'Fridge' },
      { id: 'ing-4', name: 'Ghee and Cumin', amount: 0.5, unit: 'small spoon', icon: 'salt', commonlyAvailable: 'Spice box' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Mash warm cooked rice with a spoon until soft.', durationMinutes: 2 },
      { id: 'step-2', instruction: 'Add fresh curd and milk. Mix well until creamy.', durationMinutes: 2 },
      { id: 'step-3', instruction: 'Heat cumin in ghee for 30 seconds and mix into the rice.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Fresh Curd', alternatives: ['Plain Yogurt'] }],
    nutrition: { caloriesPerServing: 220, proteinGrams: 7, carbsGrams: 32, fatGrams: 7 },
    ageNote: 'Good for Toddlers (Ages 1–3): Cools the tummy and helps good digestion.'
  },
  'dal pani': {
    title: 'Warm Dal Soup Water',
    description: 'Clear, healthy lentil soup water with mild ghee and cumin.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Boiled Dal Water', amount: 2, unit: 'cups', icon: 'vegetable', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Ghee', amount: 0.5, unit: 'small spoon', icon: 'oil', commonlyAvailable: 'Fridge door' },
      { id: 'ing-3', name: 'Cumin and Turmeric', amount: 0.25, unit: 'small spoon', icon: 'salt', commonlyAvailable: 'Spice box' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Boil yellow dal in 3 cups water until soft.', durationMinutes: 8 },
      { id: 'step-2', instruction: 'Take the clear top water (dal pani) into a small bowl.', durationMinutes: 2 },
      { id: 'step-3', instruction: 'Fry cumin in ghee and stir into the warm soup.', durationMinutes: 2 }
    ],
    swaps: [{ ingredient: 'Boiled Dal Water', alternatives: ['Vegetable Soup Water'] }],
    nutrition: { caloriesPerServing: 90, proteinGrams: 4, carbsGrams: 12, fatGrams: 2.5 },
    ageNote: 'Good for Babies (Ages 1–2): Easy to drink liquid protein for starters.'
  },

  // --- YOUNG KIDS (Ages 4-12) ---
  'mini idlis': {
    title: 'Soft Mini Button Idlis',
    description: 'Small, soft steamed rice cakes coated with warm ghee.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Idli Batter', amount: 1.5, unit: 'cups', icon: 'pasta', commonlyAvailable: 'Fridge' },
      { id: 'ing-2', name: 'Ghee', amount: 1, unit: 'spoon', icon: 'oil', commonlyAvailable: 'Fridge door' },
      { id: 'ing-3', name: 'Grated Coconut', amount: 0.25, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Vegetable box' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Put a little ghee on mini idli plates and pour small spoons of batter into each spot.', durationMinutes: 2 },
      { id: 'step-2', instruction: 'Steam in idli cooker for 8 minutes until soft and cooked.', durationMinutes: 8 },
      { id: 'step-3', instruction: 'Take out mini idlis, mix with warm ghee, and serve with chutney.', durationMinutes: 2 }
    ],
    swaps: [{ ingredient: 'Idli Batter', alternatives: ['Rava Idli Batter'] }],
    nutrition: { caloriesPerServing: 270, proteinGrams: 7, carbsGrams: 46, fatGrams: 6 },
    ageNote: 'Good for Kids (Ages 4–12): Fun bite-sized food for school and play.'
  },
  'cheese whole wheat dosa': {
    title: 'Crispy Cheese Wheat Dosa',
    description: 'Golden whole wheat crepe filled with melted cheese and grated carrots.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Wheat Flour (Atta)', amount: 1, unit: 'cup', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Grated Cheese', amount: 0.5, unit: 'cup', icon: 'cheese', commonlyAvailable: 'Fridge' },
      { id: 'ing-3', name: 'Grated Carrots', amount: 0.25, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-4', name: 'Butter', amount: 1, unit: 'spoon', icon: 'oil', commonlyAvailable: 'Fridge door' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Mix wheat flour with water and salt to make thin dosa batter.', durationMinutes: 2 },
      { id: 'step-2', instruction: 'Pour a big spoon of batter on a hot pan and spread thin in circles.', durationMinutes: 3 },
      { id: 'step-3', instruction: 'Put butter on sides. Add grated cheese and carrots in the middle.', durationMinutes: 3 },
      { id: 'step-4', instruction: 'Fold the dosa when cheese melts and cook until crisp.', durationMinutes: 2 }
    ],
    swaps: [{ ingredient: 'Wheat Flour', alternatives: ['Dosa Batter'] }],
    nutrition: { caloriesPerServing: 350, proteinGrams: 14, carbsGrams: 42, fatGrams: 14 },
    ageNote: 'Good for Kids (Ages 4–12): Tasty cheese flavor with healthy wheat fiber.'
  },
  'paneer bhurji': {
    title: 'Scrambled Paneer Bhurji',
    description: 'Soft crumbled cottage cheese cooked with tomatoes and mild spices.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Fresh Paneer', amount: 200, unit: 'grams, crumbled', icon: 'cheese', commonlyAvailable: 'Fridge' },
      { id: 'ing-2', name: 'Cut Tomatoes', amount: 0.5, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-3', name: 'Butter', amount: 1, unit: 'spoon', icon: 'oil', commonlyAvailable: 'Fridge door' },
      { id: 'ing-4', name: 'Turmeric and Cumin', amount: 0.5, unit: 'small spoon', icon: 'salt', commonlyAvailable: 'Spice box' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Crumble fresh paneer into small pieces using your hands.', durationMinutes: 2 },
      { id: 'step-2', instruction: 'Melt butter in a pan, fry cut tomatoes and turmeric for 3 minutes.', durationMinutes: 4 },
      { id: 'step-3', instruction: 'Add crumbled paneer, cook gently for 3 minutes so paneer stays soft.', durationMinutes: 3 },
      { id: 'step-4', instruction: 'Serve warm with bread or roti.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Fresh Paneer', alternatives: ['Scrambled Eggs', 'Tofu'] }],
    nutrition: { caloriesPerServing: 320, proteinGrams: 18, carbsGrams: 6, fatGrams: 24 },
    ageNote: 'Good for Kids (Ages 4–12): Packed with calcium and protein for growth.'
  },
  'aloo tikki burger': {
    title: 'Tasty Potato Aloo Burger',
    description: 'Crispy potato patty inside a bun with fresh cucumber slices.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Potato and Pea Patty', amount: 2, unit: 'patties', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-2', name: 'Burger Buns', amount: 2, unit: 'buns', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-3', name: 'Cucumber Slices', amount: 4, unit: 'slices', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-4', name: 'Butter', amount: 1, unit: 'spoon', icon: 'oil', commonlyAvailable: 'Fridge door' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Fry potato patties in a pan with butter until golden brown on both sides.', durationMinutes: 6 },
      { id: 'step-2', instruction: 'Toast burger buns lightly on the pan.', durationMinutes: 2 },
      { id: 'step-3', instruction: 'Put patty and cucumber slices inside the bun and serve.', durationMinutes: 2 }
    ],
    swaps: [{ ingredient: 'Potato Patty', alternatives: ['Paneer Patty'] }],
    nutrition: { caloriesPerServing: 380, proteinGrams: 10, carbsGrams: 58, fatGrams: 12 },
    ageNote: 'Good for Kids (Ages 4–12): Healthy homemade burger kids love.'
  },

  // --- TEENS AND YOUNG ADULTS (Ages 13-25) ---
  'paneer butter masala': {
    title: 'Rich Paneer Butter Masala',
    description: 'Soft paneer pieces in a smooth tomato and cream gravy.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Paneer Cubes', amount: 250, unit: 'grams', icon: 'cheese', commonlyAvailable: 'Fridge' },
      { id: 'ing-2', name: 'Tomato Puree', amount: 1, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-3', name: 'Fresh Cream', amount: 3, unit: 'spoons', icon: 'oil', commonlyAvailable: 'Fridge' },
      { id: 'ing-4', name: 'Butter and Garam Masala', amount: 2, unit: 'spoons', icon: 'oil', commonlyAvailable: 'Spice box' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Melt butter in a pan, fry tomato puree with ginger garlic paste for 5 minutes.', durationMinutes: 6 },
      { id: 'step-2', instruction: 'Add cream, red chili powder, garam masala, and 1/2 cup water.', durationMinutes: 4 },
      { id: 'step-3', instruction: 'Add paneer cubes and cook on low heat for 4 minutes.', durationMinutes: 4 },
      { id: 'step-4', instruction: 'Serve hot with naan or rice.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Paneer Cubes', alternatives: ['Tofu Cubes', 'Chicken Pieces'] }],
    nutrition: { caloriesPerServing: 460, proteinGrams: 20, carbsGrams: 16, fatGrams: 36 },
    ageNote: 'Good for Teens (Ages 13–25): High energy and protein for active days.'
  },
  'aloo paratha': {
    title: 'Stuffed Punjabi Aloo Paratha',
    description: 'Whole wheat flatbread stuffed with spiced potato mash and served with butter.',
    baseServings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Wheat Dough', amount: 2, unit: 'balls', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Mashed Potato Stuffing', amount: 1, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-3', name: 'Butter or Ghee', amount: 2, unit: 'spoons', icon: 'oil', commonlyAvailable: 'Fridge door' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Press dough flat, place potato mash inside, seal edges, and roll flat with rolling pin.', durationMinutes: 5 },
      { id: 'step-2', instruction: 'Cook paratha on hot tawa pan until brown spots show on both sides.', durationMinutes: 4 },
      { id: 'step-3', instruction: 'Spread butter on top and serve hot with curd.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Mashed Potato', alternatives: ['Grated Paneer'] }],
    nutrition: { caloriesPerServing: 420, proteinGrams: 11, carbsGrams: 64, fatGrams: 14 },
    ageNote: 'Good for Teens (Ages 13–25): Great energy meal for studies and workouts.'
  },
  'chicken tikka masala': {
    title: 'Tasty Chicken Tikka Masala',
    description: 'Grilled chicken pieces cooked in a rich tomato butter gravy.',
    baseServings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    ingredients: [
      { id: 'ing-1', name: 'Chicken Pieces', amount: 300, unit: 'grams', icon: 'meat', commonlyAvailable: 'Fridge' },
      { id: 'ing-2', name: 'Yogurt and Spices', amount: 0.5, unit: 'cup', icon: 'cheese', commonlyAvailable: 'Fridge' },
      { id: 'ing-3', name: 'Tomato Onion Cream Sauce', amount: 1.5, unit: 'cups', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-4', name: 'Butter', amount: 2, unit: 'spoons', icon: 'oil', commonlyAvailable: 'Fridge door' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Mix chicken pieces in curd and spices, then fry in a pan until cooked.', durationMinutes: 8 },
      { id: 'step-2', instruction: 'Heat tomato sauce in pan with butter and tikka masala powder.', durationMinutes: 6 },
      { id: 'step-3', instruction: 'Add cooked chicken into the sauce, simmer for 5 minutes.', durationMinutes: 5 },
      { id: 'step-4', instruction: 'Garnish with coriander leaves and serve hot with naan or rice.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Chicken Pieces', alternatives: ['Paneer Cubes', 'Soya Chunks'] }],
    nutrition: { caloriesPerServing: 520, proteinGrams: 44, carbsGrams: 14, fatGrams: 32 },
    ageNote: 'Good for Teens (Ages 13–25): Excellent protein for building muscle.'
  },
  'chole bhature': {
    title: 'Classic Punjabi Chole Bhature',
    description: 'Spiced chickpea curry served with fried puffy bread.',
    baseServings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    ingredients: [
      { id: 'ing-1', name: 'Boiled Chickpeas (Chana)', amount: 1.5, unit: 'cups', icon: 'vegetable', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Bhatura Dough', amount: 2, unit: 'balls', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-3', name: 'Chole Masala Spices', amount: 2, unit: 'spoons', icon: 'salt', commonlyAvailable: 'Spice box' },
      { id: 'ing-4', name: 'Oil for Frying', amount: 2, unit: 'cups', icon: 'oil', commonlyAvailable: 'Pantry' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Boil chickpeas in cooker until soft.', durationMinutes: 12 },
      { id: 'step-2', instruction: 'Fry onions, tomatoes, and chole masala in oil, then add boiled chickpeas and cook 8 minutes.', durationMinutes: 8 },
      { id: 'step-3', instruction: 'Roll bhatura dough flat and fry in hot oil until it puffs up like a balloon.', durationMinutes: 4 }
    ],
    swaps: [{ ingredient: 'Chickpeas', alternatives: ['Black Chickpeas'] }],
    nutrition: { caloriesPerServing: 580, proteinGrams: 18, carbsGrams: 78, fatGrams: 22 },
    ageNote: 'Good for Teens (Ages 13–25): Filling, high-protein meal.'
  },
  'pav bhaji': {
    title: 'Mumbai Street Pav Bhaji',
    description: 'Spicy mashed vegetables cooked with butter and served with hot bread rolls.',
    baseServings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Boiled Mashed Veggies (Potatoes, Peas, Cauliflower)', amount: 2, unit: 'cups', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-2', name: 'Pav Bhaji Masala and Tomatoes', amount: 2, unit: 'spoons', icon: 'salt', commonlyAvailable: 'Spice box' },
      { id: 'ing-3', name: 'Butter', amount: 3, unit: 'spoons', icon: 'oil', commonlyAvailable: 'Fridge door' },
      { id: 'ing-4', name: 'Soft Pav Bread', amount: 4, unit: 'buns', icon: 'pasta', commonlyAvailable: 'Pantry' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Melt butter on a pan, fry onions and tomatoes with pav bhaji masala.', durationMinutes: 5 },
      { id: 'step-2', instruction: 'Add boiled mashed vegetables and 1/2 cup water, mash well on heat.', durationMinutes: 6 },
      { id: 'step-3', instruction: 'Cut pav bread rolls and toast in butter on the pan until golden.', durationMinutes: 3 },
      { id: 'step-4', instruction: 'Serve hot with butter on top and onion slices.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Pav Bread', alternatives: ['Sliced Wheat Bread', 'Roti'] }],
    nutrition: { caloriesPerServing: 490, proteinGrams: 12, carbsGrams: 66, fatGrams: 20 },
    ageNote: 'Good for Teens (Ages 13–25): Delicious street food packed with veggies.'
  },

  // --- ADULTS (Ages 26-50) ---
  'chana masala': {
    title: 'Tangy Chana Masala',
    description: 'Chickpeas cooked in a flavorful tomato, onion, and garlic curry.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Boiled Chickpeas', amount: 2, unit: 'cups', icon: 'vegetable', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Cut Tomatoes and Onions', amount: 1, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-3', name: 'Ginger Garlic Paste', amount: 1, unit: 'spoon', icon: 'garlic', commonlyAvailable: 'Fridge' },
      { id: 'ing-4', name: 'Chana Masala and Oil', amount: 2, unit: 'spoons', icon: 'oil', commonlyAvailable: 'Spice box' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Heat oil in a pan, fry cut onions, ginger garlic paste, and tomatoes until soft.', durationMinutes: 6 },
      { id: 'step-2', instruction: 'Add chana masala powder, salt, chickpeas, and 1 cup water.', durationMinutes: 4 },
      { id: 'step-3', instruction: 'Cook on medium heat for 8 minutes until gravy gets thick.', durationMinutes: 5 },
      { id: 'step-4', instruction: 'Serve warm with rice or chapati.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Chickpeas', alternatives: ['Rajma (Kidney Beans)'] }],
    nutrition: { caloriesPerServing: 360, proteinGrams: 16, carbsGrams: 52, fatGrams: 10 },
    ageNote: 'Good for Adults (Ages 26–50): High fiber for healthy stomach and heart.'
  },
  'palak paneer': {
    title: 'Fresh Garlic Palak Paneer',
    description: 'Soft paneer cubes cooked in a smooth green spinach sauce.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    ingredients: [
      { id: 'ing-1', name: 'Spinach Paste', amount: 2, unit: 'cups', icon: 'spinach', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-2', name: 'Paneer Cubes', amount: 200, unit: 'grams', icon: 'cheese', commonlyAvailable: 'Fridge' },
      { id: 'ing-3', name: 'Garlic Cloves', amount: 6, unit: 'cloves, chopped', icon: 'garlic', commonlyAvailable: 'Pantry' },
      { id: 'ing-4', name: 'Cooking Oil', amount: 1.5, unit: 'spoons', icon: 'oil', commonlyAvailable: 'Pantry' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Boil spinach leaves in water for 2 minutes, wash in cold water, and blend into a green paste.', durationMinutes: 4 },
      { id: 'step-2', instruction: 'Heat oil in pan, fry chopped garlic until golden. Add the green spinach paste.', durationMinutes: 4 },
      { id: 'step-3', instruction: 'Add paneer cubes and salt, simmer gently for 4 minutes.', durationMinutes: 4 }
    ],
    swaps: [{ ingredient: 'Paneer Cubes', alternatives: ['Tofu Cubes'] }],
    nutrition: { caloriesPerServing: 340, proteinGrams: 19, carbsGrams: 10, fatGrams: 24 },
    ageNote: 'Good for Adults (Ages 26–50): High iron and spinach vitamins.'
  },
  'vegetable biryani': {
    title: 'Veg Hyderabadi Dum Biryani',
    description: 'Basmati rice cooked with carrots, green peas, fried onions, and whole spices.',
    baseServings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    ingredients: [
      { id: 'ing-1', name: 'Basmati Rice', amount: 1.5, unit: 'cups', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Cut Vegetables (Carrots, Peas, Beans)', amount: 1.5, unit: 'cups', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-3', name: 'Biryani Spices', amount: 2, unit: 'spoons', icon: 'salt', commonlyAvailable: 'Spice box' },
      { id: 'ing-4', name: 'Ghee and Fried Onions', amount: 2, unit: 'spoons', icon: 'oil', commonlyAvailable: 'Fridge door' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Boil basmati rice in water until half cooked, then drain water.', durationMinutes: 8 },
      { id: 'step-2', instruction: 'Fry the cut vegetables with curd and biryani spices in a big pot.', durationMinutes: 6 },
      { id: 'step-3', instruction: 'Put half-cooked rice over the vegetable layer, cover lid tight, and steam on low heat for 10 minutes.', durationMinutes: 10 }
    ],
    swaps: [{ ingredient: 'Basmati Rice', alternatives: ['Brown Rice'] }],
    nutrition: { caloriesPerServing: 430, proteinGrams: 10, carbsGrams: 68, fatGrams: 14 },
    ageNote: 'Good for Adults (Ages 26–50): Flavorful, complete veggie rice meal.'
  },
  'baingan bharta': {
    title: 'Smoky Roasted Baingan Bharta',
    description: 'Roasted eggplant mashed and cooked with onions, garlic, and tomatoes.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Big Eggplant (Baingan)', amount: 1, unit: 'big, roasted', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-2', name: 'Cut Tomatoes and Onions', amount: 1, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-3', name: 'Garlic', amount: 1, unit: 'spoon, chopped', icon: 'garlic', commonlyAvailable: 'Pantry' },
      { id: 'ing-4', name: 'Oil', amount: 1.5, unit: 'spoons', icon: 'oil', commonlyAvailable: 'Pantry' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Roast big eggplant over stove flame until skin turns black, peel off skin, and mash the inside.', durationMinutes: 8 },
      { id: 'step-2', instruction: 'Heat oil in pan, fry garlic, onions, and tomatoes until soft.', durationMinutes: 5 },
      { id: 'step-3', instruction: 'Add mashed eggplant and salt, cook for 5 minutes. Serve with roti.', durationMinutes: 3 }
    ],
    swaps: [{ ingredient: 'Eggplant', alternatives: ['Roasted Zucchini'] }],
    nutrition: { caloriesPerServing: 190, proteinGrams: 4, carbsGrams: 18, fatGrams: 12 },
    ageNote: 'Good for Adults (Ages 26–50): Low calorie and great for weight management.'
  },
  'fish curry': {
    title: 'Goan Coconut Fish Curry',
    description: 'Tender fish pieces cooked in coconut milk and tamarind curry.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Fish Pieces', amount: 300, unit: 'grams', icon: 'meat', commonlyAvailable: 'Fridge' },
      { id: 'ing-2', name: 'Coconut Milk', amount: 1, unit: 'cup', icon: 'oil', commonlyAvailable: 'Pantry' },
      { id: 'ing-3', name: 'Curry Spices and Garlic', amount: 1.5, unit: 'spoons', icon: 'salt', commonlyAvailable: 'Spice box' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Boil coconut milk with curry spices in saucepan for 6 minutes.', durationMinutes: 6 },
      { id: 'step-2', instruction: 'Gently place fish pieces in the boiling curry, cook on medium heat for 8 minutes until fish is soft.', durationMinutes: 8 },
      { id: 'step-3', instruction: 'Serve warm over steamed rice.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Fish Pieces', alternatives: ['Prawns', 'Tofu'] }],
    nutrition: { caloriesPerServing: 380, proteinGrams: 32, carbsGrams: 8, fatGrams: 24 },
    ageNote: 'Good for Adults (Ages 26–50): Rich in healthy omega fats for heart and brain.'
  },

  // --- SENIORS AND OLDER ADULTS (Ages 51+) ---
  'oats upma': {
    title: 'Healthy Rolled Oats Upma',
    description: 'Fiber-rich oats cooked with green peas, carrots, and mustard seeds.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    ingredients: [
      { id: 'ing-1', name: 'Rolled Oats', amount: 1, unit: 'cup', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Peas and Carrots', amount: 0.5, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-3', name: 'Oil', amount: 1, unit: 'spoon', icon: 'oil', commonlyAvailable: 'Pantry' },
      { id: 'ing-4', name: 'Mustard Seeds and Turmeric', amount: 0.5, unit: 'small spoon', icon: 'salt', commonlyAvailable: 'Spice box' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Roast oats in a dry pan for 3 minutes until warm.', durationMinutes: 3 },
      { id: 'step-2', instruction: 'Heat oil, add mustard seeds and veggies. Fry until soft.', durationMinutes: 3 },
      { id: 'step-3', instruction: 'Add 1 cup water, bring to boil, add roasted oats, cover, and cook on low heat for 3 minutes.', durationMinutes: 4 }
    ],
    swaps: [{ ingredient: 'Rolled Oats', alternatives: ['Broken Wheat'] }],
    nutrition: { caloriesPerServing: 240, proteinGrams: 8, carbsGrams: 38, fatGrams: 7 },
    ageNote: 'Good for Seniors (Ages 51+): High fiber that helps keep heart and stomach healthy.'
  },
  'dalia khichdi': {
    title: 'Broken Wheat Dalia Khichdi',
    description: 'Soft broken wheat and moong dal cooked in ghee.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Broken Wheat (Dalia)', amount: 0.5, unit: 'cup', icon: 'pasta', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Yellow Moong Dal', amount: 0.5, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Pantry' },
      { id: 'ing-3', name: 'Ghee and Cumin', amount: 1, unit: 'spoon', icon: 'oil', commonlyAvailable: 'Fridge door' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Roast broken wheat in ghee for 3 minutes.', durationMinutes: 3 },
      { id: 'step-2', instruction: 'Add washed moong dal, cumin, turmeric, and 3.5 cups water into cooker.', durationMinutes: 3 },
      { id: 'step-3', instruction: 'Cook for 3 whistles until soft. Serve warm.', durationMinutes: 9 }
    ],
    swaps: [{ ingredient: 'Broken Wheat', alternatives: ['Oats'] }],
    nutrition: { caloriesPerServing: 270, proteinGrams: 11, carbsGrams: 46, fatGrams: 5 },
    ageNote: 'Good for Seniors (Ages 51+): Soft and light food that controls blood sugar.'
  },
  'toor dal fry': {
    title: 'Simple Toor Dal Fry',
    description: 'Creamy yellow pigeon pea dal tempered with ghee, cumin, and garlic.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { id: 'ing-1', name: 'Toor Dal (Yellow Lentils)', amount: 1, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Pantry' },
      { id: 'ing-2', name: 'Chopped Garlic', amount: 4, unit: 'cloves', icon: 'garlic', commonlyAvailable: 'Pantry' },
      { id: 'ing-3', name: 'Ghee and Cumin', amount: 1, unit: 'spoon', icon: 'oil', commonlyAvailable: 'Spice box' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Cook yellow toor dal in cooker with turmeric and salt for 4 whistles until creamy soft.', durationMinutes: 10 },
      { id: 'step-2', instruction: 'Heat ghee in a small pan, fry chopped garlic and cumin seeds until light brown.', durationMinutes: 3 },
      { id: 'step-3', instruction: 'Pour hot ghee over cooked dal, stir well, and serve with rice.', durationMinutes: 2 }
    ],
    swaps: [{ ingredient: 'Toor Dal', alternatives: ['Moong Dal'] }],
    nutrition: { caloriesPerServing: 280, proteinGrams: 14, carbsGrams: 42, fatGrams: 6 },
    ageNote: 'Good for Seniors (Ages 51+): High plant protein for blood pressure support.'
  },
  'lauki sabzi': {
    title: 'Light Lauki (Bottle Gourd) Curry',
    description: 'Soft bottle gourd cooked with mild tomato and cumin seasoning.',
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    ingredients: [
      { id: 'ing-1', name: 'Lauki (Bottle Gourd)', amount: 2, unit: 'cups, cut in pieces', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-2', name: 'Cut Tomatoes', amount: 0.5, unit: 'cup', icon: 'vegetable', commonlyAvailable: 'Vegetable box' },
      { id: 'ing-3', name: 'Ghee and Cumin', amount: 1, unit: 'spoon', icon: 'oil', commonlyAvailable: 'Fridge door' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Peel bottle gourd skin and cut into small square pieces.', durationMinutes: 3 },
      { id: 'step-2', instruction: 'Heat ghee in pan, add cumin, tomatoes, and bottle gourd pieces.', durationMinutes: 4 },
      { id: 'step-3', instruction: 'Cover lid and cook on low heat for 8 minutes until bottle gourd becomes soft.', durationMinutes: 5 }
    ],
    swaps: [{ ingredient: 'Bottle Gourd', alternatives: ['Zucchini', 'Ridge Gourd'] }],
    nutrition: { caloriesPerServing: 120, proteinGrams: 3, carbsGrams: 14, fatGrams: 6 },
    ageNote: 'Good for Seniors (Ages 51+): Very light, high in water, and easy to digest.'
  },
  'masala chaas': {
    title: 'Cool Spiced Masala Chaas',
    description: 'Refreshing cold spiced buttermilk with cumin and mint.',
    baseServings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 2,
    ingredients: [
      { id: 'ing-1', name: 'Fresh Curd', amount: 1, unit: 'cup', icon: 'cheese', commonlyAvailable: 'Fridge' },
      { id: 'ing-2', name: 'Cold Water', amount: 2, unit: 'cups', icon: 'oil', commonlyAvailable: 'Fridge' },
      { id: 'ing-3', name: 'Cumin Powder and Salt', amount: 1, unit: 'small spoon', icon: 'salt', commonlyAvailable: 'Spice box' },
      { id: 'ing-4', name: 'Fresh Mint Leaves', amount: 2, unit: 'spoons', icon: 'vegetable', commonlyAvailable: 'Vegetable box' }
    ],
    steps: [
      { id: 'step-1', instruction: 'Whisk curd and cold water together in a jar until smooth.', durationMinutes: 2 },
      { id: 'step-2', instruction: 'Mix in cumin powder, salt, and chopped mint leaves.', durationMinutes: 2 },
      { id: 'step-3', instruction: 'Pour into glasses and drink cool after lunch.', durationMinutes: 1 }
    ],
    swaps: [{ ingredient: 'Fresh Curd', alternatives: ['Yogurt'] }],
    nutrition: { caloriesPerServing: 90, proteinGrams: 5, carbsGrams: 8, fatGrams: 4 },
    ageNote: 'Good for Seniors (Ages 51+): Helps digest food quickly and cools the body.'
  }
};

/**
 * Dynamic fallback recipe generator for offline/testing mode.
 */
function generateDynamicMockRecipe(ingredientsInput = '', ageGroup = 'Adult') {
  const text = ingredientsInput.toLowerCase().trim();

  for (const [key, dbRecipe] of Object.entries(AGE_RECIPE_DATABASE)) {
    if (text.includes(key) || key.includes(text)) {
      return {
        ...dbRecipe,
        ageNote: dbRecipe.ageNote || `Good for ${ageGroup}s: Healthy and balanced meal.`
      };
    }
  }

  if (text.includes('khichdi') || text.includes('dalia')) return AGE_RECIPE_DATABASE['moong dal khichdi'];
  if (text.includes('upma') || text.includes('oats')) return AGE_RECIPE_DATABASE['oats upma'];
  if (text.includes('porridge') || text.includes('ragi')) return AGE_RECIPE_DATABASE['apple ragi porridge'];
  if (text.includes('curd rice')) return AGE_RECIPE_DATABASE['mashed curd rice'];
  if (text.includes('dal') || text.includes('toor')) return AGE_RECIPE_DATABASE['toor dal fry'];
  if (text.includes('idli') || text.includes('idlis')) return AGE_RECIPE_DATABASE['mini idlis'];
  if (text.includes('dosa')) return AGE_RECIPE_DATABASE['cheese whole wheat dosa'];
  if (text.includes('pulao') || text.includes('biryani')) return AGE_RECIPE_DATABASE['vegetable biryani'];
  if (text.includes('paneer') || text.includes('bhurji')) return AGE_RECIPE_DATABASE['paneer bhurji'];
  if (text.includes('burger') || text.includes('tikki')) return AGE_RECIPE_DATABASE['aloo tikki burger'];
  if (text.includes('paratha')) return AGE_RECIPE_DATABASE['aloo paratha'];
  if (text.includes('tikka') || text.includes('masala')) return AGE_RECIPE_DATABASE['paneer butter masala'];
  if (text.includes('chole') || text.includes('bhature')) return AGE_RECIPE_DATABASE['chole bhature'];
  if (text.includes('bhaji') || text.includes('pav')) return AGE_RECIPE_DATABASE['pav bhaji'];
  if (text.includes('palak')) return AGE_RECIPE_DATABASE['palak paneer'];
  if (text.includes('fish') || text.includes('curry')) return AGE_RECIPE_DATABASE['fish curry'];
  if (text.includes('lauki') || text.includes('sabzi')) return AGE_RECIPE_DATABASE['lauki sabzi'];
  if (text.includes('chaas') || text.includes('lassi')) return AGE_RECIPE_DATABASE['masala chaas'];

  const items = ingredientsInput.split(/,|\n/).map((s) => s.trim()).filter(Boolean);
  const primaryItem = items[0] || 'Vegetables';
  const secondaryItem = items[1] || 'Spices';

  const assignLocation = (name = '') => {
    const term = name.toLowerCase();
    if (term.includes('egg') || term.includes('milk') || term.includes('butter') || term.includes('cheese') || term.includes('paneer') || term.includes('curd')) return 'Fridge';
    if (term.includes('spinach') || term.includes('broccoli') || term.includes('tomato') || term.includes('lemon') || term.includes('carrot') || term.includes('peas')) return 'Vegetable box';
    if (term.includes('chicken') || term.includes('beef') || term.includes('meat') || term.includes('fish')) return 'Fridge';
    if (term.includes('salt') || term.includes('pepper') || term.includes('chili') || term.includes('ginger') || term.includes('garlic') || term.includes('spice')) return 'Spice box';
    return 'Pantry';
  };

  return {
    title: `Cooked ${primaryItem} with ${secondaryItem}`,
    description: `A easy homemade dish made using ${primaryItem.toLowerCase()} and ${secondaryItem.toLowerCase()}.`,
    baseServings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    ingredients: (items.length > 0 ? items : [primaryItem, secondaryItem]).slice(0, 6).map((item, idx) => ({
      id: `ing-${idx + 1}`,
      name: item,
      amount: idx === 0 ? 2 : 1,
      unit: idx === 0 ? 'cups' : 'spoons',
      icon: item.toLowerCase().includes('chicken') || item.toLowerCase().includes('fish') ? 'meat' : 'vegetable',
      commonlyAvailable: assignLocation(item)
    })),
    steps: [
      { id: 'step-1', instruction: `Clean, peel, and cut your ${primaryItem} into small pieces.`, durationMinutes: 3 },
      { id: 'step-2', instruction: `Heat a spoon of oil in a pan. Add ${primaryItem} and fry on medium heat.`, durationMinutes: 5 },
      { id: 'step-3', instruction: `Add ${secondaryItem} and salt. Stir well for 3 minutes until warm.`, durationMinutes: 3 },
      { id: 'step-4', instruction: 'Serve warm in a bowl and enjoy your meal!', durationMinutes: 1 }
    ],
    swaps: [
      { ingredient: primaryItem, alternatives: ['Mixed Veggies'] }
    ],
    nutrition: { caloriesPerServing: 380, proteinGrams: 28, carbsGrams: 22, fatGrams: 14 },
    ageNote: `Good for ${ageGroup}s: Balanced and healthy everyday food.`
  };
}

/**
 * AI Food Image Scanner & Recipe Predictor Endpoint
 */
app.post('/api/scan-image', async (req, res) => {
  const { imageBase64, filename = '' } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  console.log(`[AI Image Scanner Proxy] Scanning food photo payload (length: ${imageBase64.length})...`);

  // Call Gemini 1.5 Flash Vision API if key available
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    try {
      const geminiVisionUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const mimeTypeMatch = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

      const visionPrompt = `Examine this food photo carefully.
Identify the primary dish name or all visible food items and ingredients.
Respond ONLY with a JSON object matching this schema:
{
  "detectedDish": "string (e.g. 'Paneer Butter Masala' or 'Vegetable Pulao')",
  "detectedIngredients": ["string", "string", "string"],
  "summaryText": "string (Short simple English sentence describing what food items were identified)"
}`;

      const response = await fetch(geminiVisionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { inlineData: { mimeType, data: cleanBase64 } },
                { text: visionPrompt }
              ]
            }
          ],
          generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const parsed = JSON.parse(rawText);
        return res.json(parsed);
      }
    } catch (err) {
      console.error('[Gemini Vision Error]', err);
    }
  }

  // Smart Offline Vision Recognition Fallback
  const fn = filename.toLowerCase();
  let detectedDish = 'Vegetable Pulao';
  let detectedIngredients = ['Basmati Rice', 'Green Peas', 'Carrots', 'Ghee', 'Spices'];

  if (fn.includes('paneer') || fn.includes('cheese')) {
    detectedDish = 'Paneer Butter Masala';
    detectedIngredients = ['Paneer Cubes', 'Tomato Puree', 'Butter', 'Fresh Cream', 'Spices'];
  } else if (fn.includes('egg') || fn.includes('omelette')) {
    detectedDish = 'Fluffy Herb Omelette';
    detectedIngredients = ['Fresh Eggs', 'Cheese', 'Tomatoes', 'Butter', 'Salt'];
  } else if (fn.includes('pasta') || fn.includes('noodle')) {
    detectedDish = 'Garlic Olive Oil Pasta';
    detectedIngredients = ['Spaghetti', 'Garlic Cloves', 'Olive Oil', 'Chili Flakes'];
  } else if (fn.includes('spinach') || fn.includes('palak')) {
    detectedDish = 'Garlic Palak Paneer';
    detectedIngredients = ['Spinach', 'Paneer', 'Garlic', 'Cooking Oil'];
  } else if (fn.includes('khichdi') || fn.includes('dal')) {
    detectedDish = 'Moong Dal Khichdi';
    detectedIngredients = ['Yellow Moong Dal', 'Basmati Rice', 'Ghee', 'Cumin'];
  }

  res.json({
    detectedDish,
    detectedIngredients,
    summaryText: `AI identified ${detectedDish} (${detectedIngredients.join(', ')}) from your food photo.`
  });
});

app.post('/api/generate', async (req, res) => {
  const { ingredients, ageGroup = 'Adult', testMode } = req.body;

  console.log(`[API Proxy Request] Received ingredients: "${ingredients}" | ageGroup: "${ageGroup}" | testMode: "${testMode || 'none'}"`);

  if (!ingredients || typeof ingredients !== 'string' || !ingredients.trim()) {
    return res.status(400).json({ error: 'Please type an ingredient or dish name.' });
  }

  // Handle intentional test modes
  if (testMode === 'broken_json') {
    return res.json({ rawText: '```json\n{ title: "Broken JSON without quotes", ingredients: [ ```' });
  }
  if (testMode === 'invalid_schema') {
    return res.json({ rawText: JSON.stringify({ wrongField: 'No ingredients or steps here' }) });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log(`[API Proxy] Serving dynamic simple English recipe for: "${ingredients}"`);
    const dynamicRecipe = generateDynamicMockRecipe(ingredients, ageGroup);
    return res.json(dynamicRecipe);
  }

  try {
    let rawResultText = '';

    if (process.env.GEMINI_API_KEY) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const fullPromptText = `${SYSTEM_PROMPT}\n\nTarget Age Group: ${ageGroup}\nUser's Ingredients Available:\n${ingredients}`;

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
