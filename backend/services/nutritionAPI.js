import axios from 'axios';
import nutrients from '../utils/nutrients.js';

const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

async function fetchNutrientData(foodName) {
  const nutrientIds = Object.values(nutrients).map((nutrient) => nutrient.usdaId);
  const { USDA_API_KEY } = process.env;

  try {
    if (!foodName) {
      throw new Error('Invalid ingredient provided');
    }

    const searchResponse = await axios.get(`${USDA_BASE_URL}/foods/search`, {
      params: {
        api_key: USDA_API_KEY,
        query: foodName,
        dataType: 'Foundation',
        pageSize: 1,
      },
    });

    const foodItem = searchResponse.data.foods?.[0];

    if (!foodItem) {
      throw new Error(`Ingredient not found in the USDA database: ${foodName}`);
    }

    const filteredNutrients = foodItem.foodNutrients
      .filter((nutrient) => nutrientIds.includes(nutrient.nutrientId))
      .map((nutrient) => {
        const nutrientName = Object.keys(nutrients).find(
          (key) => nutrients[key].usdaId === nutrient.nutrientId,
        );

        if (nutrientName) {
          return {
            name: nutrientName,
            amount: nutrient.value,
            unit: nutrient.unitName,
          };
        }
        return null;
      })
      .filter(Boolean);
console.log(filteredNutrients);
    return filteredNutrients;
  } catch (err) {
    console.error(`Error fetching food nutrients: ${err.message}`);
    throw err;
  }
}

export default fetchNutrientData;
