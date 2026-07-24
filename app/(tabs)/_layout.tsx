import { Bookmark, Home, Settings } from "lucide-react-native";
import { Tabs } from "expo-router";
import { colors } from "@/theme/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.backgroundSoft,
          borderTopColor: colors.borderSoft,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Accueil", tabBarIcon: ({ color }) => <Home color={color} size={23} /> }} />
      <Tabs.Screen
        name="read-later"
        options={{ title: "Read Later", tabBarIcon: ({ color }) => <Bookmark color={color} size={23} /> }}
      />
      <Tabs.Screen name="settings" options={{ title: "Réglages", tabBarIcon: ({ color }) => <Settings color={color} size={23} /> }} />
    </Tabs>
  );
}
