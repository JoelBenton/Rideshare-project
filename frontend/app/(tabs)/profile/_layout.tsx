import { Stack } from "expo-router"

const StackLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='changePassword' />
        </Stack>
    )
}

export default StackLayout