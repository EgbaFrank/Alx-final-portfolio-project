import axios from "axios";
import https from "https";
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

async function fetchNutrientData(foodName, state) {
  const nutrientIds = Object.values(nutrients).map(
    (nutrient) => nutrient.usdaId,
  );
  const { USDA_API_KEY } = process.env;

  try {
    if (!foodName || !state) {
      throw new Error(
        "Invalid ingredient provided, foodName and state are required",
      );
    }

    const query = `${foodName}, ${state}`;

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

    const rankedFoods = searchResponse.data.foods?.sort((a, b) =>
      rankFoods(a, b, foodName),
    );

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
