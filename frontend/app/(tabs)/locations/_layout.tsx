import { Stack } from "expo-router"

const StackLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='create' />
            <Stack.Screen name='locations_map' />
            <Stack.Screen name='[id]' />
        </Stack>
    )
}

export default StackLayout