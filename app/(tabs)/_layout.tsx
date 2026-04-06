import { Tabs } from "expo-router";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { HapticTab } from "@/components/haptic-tab";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AnimatedTabIcon from "@/components/AnimatedTabIcon";
import { View, StyleSheet, } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: "#297cff",   // color cuando está seleccionado
      tabBarInactiveTintColor: "#999",    // color cuando NO está seleccionado
      headerShown: false,
      tabBarButton: HapticTab,
    }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: (props) => (
            <AnimatedTabIcon focused={props.focused}>
              <MaterialIcons name="home" size={28} color={props.color} />
            </AnimatedTabIcon>
          )
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Mapa",
          tabBarIcon: (props) => (
            <AnimatedTabIcon focused={props.focused}>
              <MaterialIcons name="map" size={28} color={props.color} />
            </AnimatedTabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused}>
              <View style={styles.centerButton}>
                <Ionicons name="add" size={28} color="white" />
              </View>
            </AnimatedTabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: (props) => (
            <AnimatedTabIcon focused={props.focused}>
              <MaterialIcons name="favorite" size={28} color={props.color} />
            </AnimatedTabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "Perfil",
          tabBarIcon: (props) => (
            <AnimatedTabIcon focused={props.focused}>
              <MaterialIcons name="person" size={28} color={props.color} />
            </AnimatedTabIcon>
          )
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
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
});