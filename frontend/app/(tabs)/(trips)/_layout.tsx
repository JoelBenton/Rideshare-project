import { Stack } from "expo-router"

export default function StackLayout() {

    return (
        <Stack>
            <Stack.Screen name='create_locations' options={{headerShown: false}} />
            <Stack.Screen name='create_form' options={{headerShown: false }} />
            <Stack.Screen name='search' options={{headerShown: false }} />
            <Stack.Screen name='history' options={{headerShown: false }} />
        </Stack>
    )
}