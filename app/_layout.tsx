import {
  BestScoreProvider
} from "@/context/BestScoreContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <BestScoreProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            headerTitle: "",

            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: true,
            headerTitle: "Settings",
            //headerBackTitle: "Home",
            headerTransparent: true,
            headerTintColor: "white",
            //headerBackVisible: false
          }}
        />
      </Stack>
    </BestScoreProvider>
  );
}
