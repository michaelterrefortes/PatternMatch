import { EMAIL_SUPPORT, WEBPAGE_URL } from "@/constants/url";
import { BestScoreContext } from "@/context/BestScoreContext";
import { removeData } from "@/services/storage";
import React, { useCallback, useContext } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  const { best, setBest } = useContext(BestScoreContext);
  const confirmDelete = () => {
    Alert.alert(
      "Delete Best Score", // Title
      "Are you sure you want to delete best score? This action cannot be undone.", // Message
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel", // Optional: gives it a "cancel" look on iOS
        },
        {
          text: "Delete", // Your delete logic here
          onPress: () => {
            removeData();
            setBest(0);
          },
          style: "destructive", // Optional: highlights the button in red on iOS
        },
      ],
      { cancelable: true }, // Android only: allows dismissing by tapping outside
    );
  };

  const handleLink = useCallback(async () => {
    // Check if the link is supported
    const linkUrl = WEBPAGE_URL;
    const supported = await Linking.canOpenURL(linkUrl);

    if (supported) {
      // Open the URL
      await Linking.openURL(linkUrl);
    } else {
      Alert.alert(`Don't know how to open this URL: ${linkUrl}`);
    }
  }, []);

  const handleEmail = async () => {
    // Check if the link is supported
    const email = EMAIL_SUPPORT;
    const subject = "Contact Us";
    const body = "Hello Support team,";

    // Construct the mailto link
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      // Check if the device can handle the email URL
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Error",
          `No email app found to handle this request. The email for support is: ${email}`,
        );
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: "#1a1e24",
          paddingVertical: 15,
          width: "70%",
          borderRadius: 50,
          marginBottom: 15,
        }}
        onPress={handleLink}
      >
        <Text style={{ color: "lightblue", marginLeft: 20 }}>
          Privacy Policy
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#1a1e24",
          paddingVertical: 15,
          width: "70%",
          borderRadius: 50,
          marginBottom: 15,
        }}
        onPress={handleEmail}
      >
        <Text style={{ color: "lightblue", marginLeft: 20 }}>Contact Us</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#1a1e24",
          paddingVertical: 15,
          width: "70%",
          borderRadius: 50,
        }}
        onPress={confirmDelete}
      >
        <Text style={{ color: "red", marginLeft: 20 }}>Delete Best Score</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes up the full screen
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d0f13",
  },
});
