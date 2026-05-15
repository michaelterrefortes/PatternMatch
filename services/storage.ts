import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// Saving data
export const storeData = async (value) => {
  if (value === 0) return;
  //console.log("Store Value", value);
  try {
    const item = { best: value };
    // AsyncStorage only stores strings; use JSON.stringify for objects
    await AsyncStorage.setItem("@bestScore", JSON.stringify(item));
  } catch (e) {
    // Error saving data
    Alert.alert("Error", "Error saving best score to storage");
  }
};

// Reading data
export const getData = async () => {
  try {
    const value = await AsyncStorage.getItem("@bestScore");

    if (!value) return 0;

    const parsed = JSON.parse(value);
    //console.log("Get Data", parsed);
    return parsed.best ?? 0;
  } catch (e) {
    Alert.alert("Error", "Error reading best score");
    return 0;
  }
};

// Removing data
export const removeData = async () => {
  //console.log("Reset value");
  try {
    await AsyncStorage.removeItem("@bestScore");
  } catch (e) {
    // Error removing data
    Alert.alert("Error", "Error deleting best score from storage");
  }
};
