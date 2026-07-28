/**
 * Validates the structured JSON recipe object returned by the API.
 * Returns { isValid: boolean, data: object, reason: string | null }
 * Safely sanitizes optional nutrition metadata, missing fields, and ingredient icons.
 */
export function validateRecipe(rawData) {
  try {
    if (!rawData || typeof rawData !== 'object' || Array.isArray(rawData)) {
      return { isValid: false, data: null, reason: 'Recipe data is missing or not a valid JSON object.' };
    }

    const data = { ...rawData };

    if (typeof data.title !== 'string' || !data.title.trim()) {
      return { isValid: false, data: null, reason: 'Recipe title is missing or empty.' };
    }

    if (typeof data.description !== 'string') {
      data.description = '';
    }

    if (typeof data.baseServings !== 'number' || data.baseServings <= 0) {
      data.baseServings = 2;
    }

    if (typeof data.prepTimeMinutes !== 'number' || data.prepTimeMinutes < 0) {
      data.prepTimeMinutes = 10;
    }

    if (typeof data.cookTimeMinutes !== 'number' || data.cookTimeMinutes < 0) {
      data.cookTimeMinutes = 15;
    }

    if (!Array.isArray(data.ingredients) || data.ingredients.length === 0) {
      return { isValid: false, data: null, reason: 'Recipe contains no ingredients.' };
    }

    data.ingredients.forEach((ing, index) => {
      if (!ing || typeof ing !== 'object') {
        data.ingredients[index] = { name: `Ingredient ${index + 1}`, amount: 1, unit: '', icon: 'vegetable' };
        return;
      }
      if (typeof ing.name !== 'string' || !ing.name.trim()) {
        ing.name = `Ingredient ${index + 1}`;
      }
      if (typeof ing.amount !== 'number' || isNaN(ing.amount)) {
        ing.amount = 1;
      }
      if (typeof ing.unit !== 'string') {
        ing.unit = '';
      }
      if (!ing.id) {
        ing.id = `ing-${index + 1}`;
      }
      if (typeof ing.icon !== 'string') {
        ing.icon = 'vegetable';
      }
      if (typeof ing.commonlyAvailable !== 'string') {
        ing.commonlyAvailable = '';
      }
    });

    if (!Array.isArray(data.steps) || data.steps.length === 0) {
      return { isValid: false, data: null, reason: 'Recipe contains no steps.' };
    }

    data.steps.forEach((step, index) => {
      if (!step || typeof step !== 'object') {
        data.steps[index] = { instruction: `Cook step ${index + 1}` };
        return;
      }
      if (typeof step.instruction !== 'string' || !step.instruction.trim()) {
        step.instruction = `Step ${index + 1}`;
      }
      if (!step.id) {
        step.id = `step-${index + 1}`;
      }
      if (typeof step.durationMinutes !== 'number' && step.durationMinutes !== null) {
        step.durationMinutes = null;
      }
    });

    if (!Array.isArray(data.swaps)) {
      data.swaps = [];
    }

    // Optional Nutrition Metadata Sanitization
    if (data.nutrition && typeof data.nutrition === 'object') {
      data.nutrition = {
        caloriesPerServing: typeof data.nutrition.caloriesPerServing === 'number' ? data.nutrition.caloriesPerServing : 400,
        proteinGrams: typeof data.nutrition.proteinGrams === 'number' ? data.nutrition.proteinGrams : 25,
        carbsGrams: typeof data.nutrition.carbsGrams === 'number' ? data.nutrition.carbsGrams : 30,
        fatGrams: typeof data.nutrition.fatGrams === 'number' ? data.nutrition.fatGrams : 15
      };
    } else {
      data.nutrition = {
        caloriesPerServing: 350,
        proteinGrams: 20,
        carbsGrams: 35,
        fatGrams: 12
      };
    }

    if (typeof data.ageNote !== 'string') {
      data.ageNote = '';
    }

    return { isValid: true, data, reason: null };
  } catch (err) {
    return { isValid: false, data: null, reason: err.message || 'Unknown recipe validation error' };
  }
}
