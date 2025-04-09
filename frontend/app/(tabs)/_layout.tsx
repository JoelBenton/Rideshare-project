import { FIREBASE_AUTH } from "@/src/config/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { TextStyle, StyleSheet, Keyboard } from "react-native";

export default () => {
  const [admin, setAdmin] = React.useState(false);
  const [keyboardShow, setKeyboardShow] = React.useState(false);
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardShow(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardShow(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  FIREBASE_AUTH.currentUser?.getIdTokenResult(true).then((token) => {
    const role = token.claims.role;
    console.log(token);
    if (role == "admin") {
      setAdmin(true);
    }
  });

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "alert";

          if (route.name === "home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "chat") {
            iconName = focused ? "chatbox" : "chatbox-outline";
          } else if (route.name === "locations") {
            iconName = focused ? "location-sharp" : "location-outline";
          } else if (route.name === "profile") {
            iconName = focused
              ? "person-circle-sharp"
              : "person-circle-outline";
          } else if (route.name === "admin") {
            iconName = focused ? "shield-checkmark" : "shield-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#C8A2C8",
        tabBarInactiveTintColor: "#D3D3D3",
        tabBarStyle: [styles.tabBar, { marginBottom: keyboardShow ? -100 : 0 }],
        tabBarLabelStyle: styles.tabBarLabel as TextStyle,
      })}
    >
      <Tabs.Screen name="home" options={{ tabBarLabel: "Home" }} />
      <Tabs.Screen name="chat" options={{ tabBarLabel: "Chat" }} />
      <Tabs.Screen name="profile" options={{ tabBarLabel: "Profile" }} />
      <Tabs.Screen name="locations" options={{ tabBarLabel: "Locations" }} />
      <Tabs.Screen
        name="admin"
        options={{ tabBarLabel: "Admin", href: admin ? "/(tabs)/admin" : null }}
      />
      <Tabs.Screen name="(trips)" options={{ href: null }} />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#5A2B81",
    paddingBottom: 20,
    paddingTop: 10,
    height: 80,
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
