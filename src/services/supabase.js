import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "...";
const supabaseAnonKey =
  "...";
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const fetchCityImage = async (cityName) => {
  try {
    const trimmedCityName = cityName.trim();
    const lowerCaseCityName = trimmedCityName.toLowerCase();

    const { data, error } = await supabase
      .from("Cities")
      .select("*")
      .ilike("city_name", `%${lowerCaseCityName}%`);

    if (error) {
      console.error("Error fetching city image:", error);
      return null;
    }

    if (data && data.length > 0) {
      return {
        id: data[0].id,
        cityName: data[0].city_name,
        cityImage: data[0].city_img,
        PossibleAchievement_1: data[0].achievement_1 || "",
        PossibleAchievement_2: data[0].achievement_2 || "",
        money: data[0].money,
        players: data[0].players,
        Description: data[0].description,
      };
    } else {
      console.log(`No image found for city '${cityName}'.`);
      return null;
    }
  } catch (error) {
    console.error("Unexpected error fetching city image:", error);
    return null;
  }
};

export const fetchDataFromTable = async () => {
  try {
    const { data, error, status } = await supabase.from("LnR").select("*");
    if (error && status !== 406) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

export const fetchDataAndGroupByCity = async () => {
  try {
    const { data, error } = await supabase.from("LnR").select("*");

    if (error) {
      console.error("Error fetching data", error);
      return {};
    }

    const groupedData = data.reduce((acc, item) => {
      const cityName = item.city_name.trim();
      if (!acc[cityName]) {
        acc[cityName] = [];
      }
      acc[cityName].push(item);
      return acc;
    }, {});

    return groupedData;
  } catch (error) {
    console.error("Unexpected error fetching data:", error);
    return {};
  }
};
export const getKeysCollected = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("keys_collected")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching keys collected", error);
    return 0;
  }

  return data.keys_collected;
};

export const fetchDealFromTable = async () => {
  try {
    const { data, error, status } = await supabase.from("Deals").select("*");

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      const dealsWithImages = await Promise.all(
        data.map(async (deal) => {
          const cityImage = await fetchCityImage(deal.city);
          return {
            ...deal,
            image: cityImage || deal.location_img,
          };
        })
      );

      return dealsWithImages.map((deal) => ({
        id: deal.id,
        title: deal.location,
        description: deal.description,
        offer: deal.offer,
        keys: deal.key_amount,
        popular: deal.popular,
        image: deal.location_img,
        rating: deal.rating,
        city: deal.city,
        history: deal.history,
        shop_image: deal.shop_img,
        lat: deal.lat,
        long: deal.long,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching deals:", error.message);
    return [];
  }
};

export const fetchExplorerData = async (explorerType) => {
  try {
    const { data, error } = await supabase
      .from("pictures_explorer")
      .select("name, img, Player_Description")
      .eq("types", explorerType);

    if (error) {
      console.error("Error fetching explorer data:", error);
      return null;
    }

    if (data && data.length > 0) {
      return data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Unexpected error fetching explorer data:", error);
    return null;
  }
};

export async function fetchUserProgress(userId, gameName) {
  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("game_name", gameName)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching user progress:", error);
      return { error };
    }

    return data;
  } catch (error) {
    console.error(
      "Unexpected error occurred while fetching user progress:",
      error
    );
    return { error };
  }
}

export async function updateUserProgress(userId, selectedGameName, newStage) {
  try {
    const { data, error } = await supabase.from("user_progress").upsert([
      {
        user_id: userId,
        game_name: selectedGameName,
        stage_completed: newStage,
      },
    ]);

    if (error) {
      console.error("Failed to update user progress:", error);
      return { error };
    }

    return { data };
  } catch (error) {
    console.error("An error occurred while updating user progress:", error);
    return { error };
  }
}
