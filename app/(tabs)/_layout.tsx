import { Tabs } from "expo-router";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { HapticTab } from "@/components/haptic-tab";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { View, StyleSheet, } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="map" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "",
          tabBarIcon: () => (
            <View style={styles.centerButton}>
              <Ionicons name="add" size={28} color="white" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={28} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
}
const styles = StyleSheet.create({
  centerButton: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#297cff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
});