import React from 'react';
import { View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../styles/global.css';
import { Slot } from 'expo-router';

const RootLayout = () => {
  const colorScheme = useColorScheme();
  console.log(colorScheme);

  return (
    // Solo padding superior en la app usando Slot para renderizar pantallas
    <SafeAreaView className="flex-1 pt-4 bg-white">
      <View className="flex-1">
        <Slot />
      </View>
    </SafeAreaView>
  );
};

export default RootLayout;
