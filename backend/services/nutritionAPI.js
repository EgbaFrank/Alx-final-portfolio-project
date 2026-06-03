import axios from "axios";
import https from "https";
import nutrients from "../utils/nutrients.js";
import roundToDecimal from "../utils/conversions.js";

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";
const usdaApi = axios.create({
  baseURL: "https://api.nal.usda.gov/fdc/v1",
  timeout: 10000,
  httpsAgent: new https.Agent({
    family: 4,
  }),
});

async function fetchNutrientData(foodName) {
  const nutrientIds = Object.values(nutrients).map(
    (nutrient) => nutrient.usdaId,
  );
  const { USDA_API_KEY } = process.env;

  try {
    if (!foodName) {
      throw new Error("Invalid ingredient provided");
    }

    const searchResponse = await usdaApi.get("/foods/search", {
      params: {
        api_key: USDA_API_KEY,
        query: foodName,
        dataType: "SR Legacy",
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
            value: roundToDecimal(nutrient.value),
            unit: nutrient.unitName,
          };
        }
        return null;
      })
      .filter(Boolean);
    return filteredNutrients;
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
