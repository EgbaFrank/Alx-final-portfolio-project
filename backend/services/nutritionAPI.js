import axios from "axios";
import https from "https";
import { compCache } from "../models/Recipe.js";
import nutrients from "../utils/nutrients.js";
import roundToDecimal from "../utils/conversions.js";
import { rankFoods } from "../utils/comp-utils.js";

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";
const usdaApi = axios.create({
  baseURL: "https://api.nal.usda.gov/fdc/v1",
  timeout: 10000,
  httpsAgent: new https.Agent({
    family: 4,
  }),
});

async function searchUSDA(query) {
  const { USDA_API_KEY } = process.env;

  const payload = {
    query,
    dataType: ["Foundation", "SR Legacy"],
    pageSize: 5,
    requireAllWords: true,
  };

  const searchResponse = await usdaApi.post(
    `/foods/search?api_key=${USDA_API_KEY}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  console.log(`USDA search response for "${query}":`, {
    status: searchResponse.status,
    data: searchResponse.data,
    foodItems: searchResponse.data.foods,
  });
  return searchResponse.data.foods;
}

async function fetchNutrientData(foodName, state) {
  if (!foodName || !state) {
    throw new Error(
      "Invalid ingredient provided, foodName and state are required",
    );
  }

  const query = `${foodName}, ${state}`.toLowerCase();

  // Check cache first
  const cached = await compCache.findOne({ query });
  if (cached) {
    console.log(`Cache hit for "${query}"`);
    return [cached.sourceName, cached.nutrients];
  }

  // Fetch from USDA if cache miss
  const nutrientIds = Object.values(nutrients).map(
    (nutrient) => nutrient.usdaId,
  );

  try {
    const USDAResults = await searchUSDA(query);
    const rankedFoods = USDAResults.sort((a, b) => rankFoods(a, b, foodName));

    const foodItem = rankedFoods?.[0];

    if (!foodItem) {
      throw new Error(`Ingredient not found in the USDA database: ${query}`);
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
            value: roundToDecimal(nutrient.value),
            unit: nutrient.unitName,
          };
        }
        return null;
      })
      .filter(Boolean);

    // Cache the result for future requests
    await compCache.create({
      query,
      sourceName: foodItem.description,
      sourceId: foodItem.fdcId,
      nutrients: filteredNutrients,
    });

    return [foodItem.description, filteredNutrients];
  } catch (err) {
    console.error("Error fetching food nutrients:");
    console.error({
      message: err.message || err.cause?.code || "Unknown error",
      code: err.code,
      url: err.config?.url,
      params: err.config?.params,
    });
    throw err;
  }
}

export default fetchNutrientData;
