/**
 * Validates the structured JSON recipe object returned by the LLM.
 * Throws descriptive errors if any required field is missing or invalid.
 * Safely sanitizes optional nutrition and ageNote metadata.
 */
export function validateRecipe(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Recipe data is missing or not a valid JSON object.');
  }

  if (typeof data.title !== 'string' || !data.title.trim()) {
    throw new Error('Recipe title is missing or empty.');
  }

  if (typeof data.description !== 'string') {
    data.description = '';
  }

  if (typeof data.baseServings !== 'number' || data.baseServings <= 0) {
    throw new Error('Invalid baseServings: must be a number greater than 0.');
  }

  if (typeof data.prepTimeMinutes !== 'number' || data.prepTimeMinutes < 0) {
    data.prepTimeMinutes = 10;
  }

  if (typeof data.cookTimeMinutes !== 'number' || data.cookTimeMinutes < 0) {
    data.cookTimeMinutes = 15;
  }

  if (!Array.isArray(data.ingredients) || data.ingredients.length === 0) {
    throw new Error('Recipe contains no ingredients.');
  }

  data.ingredients.forEach((ing, index) => {
    if (!ing || typeof ing !== 'object') {
      throw new Error(`Ingredient at index ${index} is invalid.`);
    }
    if (typeof ing.name !== 'string' || !ing.name.trim()) {
      throw new Error(`Ingredient at index ${index} is missing a name.`);
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
  });

  if (!Array.isArray(data.steps) || data.steps.length === 0) {
    throw new Error('Recipe contains no steps.');
  }

  data.steps.forEach((step, index) => {
    if (!step || typeof step !== 'object') {
      throw new Error(`Step at index ${index} is invalid.`);
    }
    if (typeof step.instruction !== 'string' || !step.instruction.trim()) {
      throw new Error(`Step at index ${index} is missing instructions.`);
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

  // Optional Nutrition Metadata Sanitization (Graceful handling)
  if (data.nutrition && typeof data.nutrition === 'object') {
    data.nutrition = {
      caloriesPerServing: typeof data.nutrition.caloriesPerServing === 'number' ? data.nutrition.caloriesPerServing : 400,
      proteinGrams: typeof data.nutrition.proteinGrams === 'number' ? data.nutrition.proteinGrams : 25,
      carbsGrams: typeof data.nutrition.carbsGrams === 'number' ? data.nutrition.carbsGrams : 30,
      fatGrams: typeof data.nutrition.fatGrams === 'number' ? data.nutrition.fatGrams : 15
    };
  } else {
    data.nutrition = null;
  }

  if (typeof data.ageNote !== 'string') {
    data.ageNote = '';
  }

  return true;
}
