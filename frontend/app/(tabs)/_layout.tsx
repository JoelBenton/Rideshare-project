import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router"
import React from "react";
import { TextStyle, StyleSheet } from "react-native";

export default () => {
    return (
        <Tabs
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap = 'alert';
                
                if (route.name === 'home') {
                    iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'settings') {
                    iconName = focused ? 'settings' : 'settings-outline';
                } else if (route.name === 'chat') {
                    iconName = focused ? 'chatbox' : 'chatbox-outline';
                } else if (route.name === 'locations') {
                    iconName = focused ? 'location-sharp' : 'location-outline';
                } else if (route.name === 'profile') {
                    iconName = focused ? 'person-circle-sharp' : 'person-circle-outline';
                }
                
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#C8A2C8',
            tabBarInactiveTintColor: '#D3D3D3',
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel as TextStyle,
        })}
        >
            <Tabs.Screen name="home" options={{ tabBarLabel: 'Home' }}/>
            <Tabs.Screen name="chat" options={{ tabBarLabel: 'Chat' }} />
            <Tabs.Screen name="profile" options={{ tabBarLabel: 'Profile' }} />
            <Tabs.Screen name='locations' options={{ tabBarLabel: 'Locations' }}/>
            <Tabs.Screen name='settings' options={{ tabBarLabel: 'Settings'}} />
        </Tabs>
    )
}

const styles = StyleSheet.create ({
    tabBar: {
        backgroundColor: '#5A2B81',
        paddingBottom: 20,
        paddingTop: 10,
        height: 80,
    },
    tabBarLabel: {
        fontSize: 14,
        fontWeight: "bold",
    },
    tarBarProfileIconStyle: {
        
    },
});