import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import '../styles/global.css'
import { Stack } from 'expo-router'

const RootLayout = () => {
const colorScheme = useColorScheme()
console.log(colorScheme)

  return (
    <View className='flex-1'>
      <Stack screenOptions={{ headerStyle: { backgroundColor: '#ddd' }, headerTintColor: 'black' }}>
        <Stack.Screen name='index' options={{ title: 'Home' }} />
        <Stack.Screen name='profile' options={{ title: 'Profile' }} />
        <Stack.Screen name='settings' options={{ title: 'Settings' }} />
        <Stack.Screen name='about' options={{ title: 'About', headers: { visible: false } }} />
      </Stack>
      <Text className='text-2xl font-bold fixed bottom-0 left-0 right-0 text-center'>noi se que hago</Text>
    </View>
  )
}

export default RootLayout