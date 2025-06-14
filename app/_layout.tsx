import { criarTabela } from '@/services/ReceitaService';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';


export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  return (
      <Stack>
        <Stack.Screen name="index" options={{ title: '🍔 Outdoor recipes 🍪', headerTitleAlign: 'center',  headerBackVisible: false, }} />
        <Stack.Screen name="details" options={{ title: 'Detalhes da Receita', headerTitleAlign: 'center'}} />
        <Stack.Screen name="addRecipe" options={{ title: 'Receita' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
  );
}
