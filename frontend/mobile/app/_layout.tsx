import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux'
import React, { useEffect } from 'react';
import '../index.css';
import 'react-native-reanimated';
import { persistor, store } from '@/store/store';
import { useColorScheme } from '@/hooks/useColorScheme';
import { PersistGate } from 'redux-persist/integration/react';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        setTimeout(() => {
            if (loaded) {
                SplashScreen.hideAsync();
            }
        }, 2000);
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
                    </Stack>
                    <StatusBar style="auto" />
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}
