import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import '../styles/global.css'
import { Stack } from 'expo-router'

const RootLayout = () => {
const colorScheme = useColorScheme()
console.log(colorScheme)

  return (
    <View className='flex-1'>
      <Stack screenOptions={{ headerStyle: { backgroundColor: '#fff' }, headerTintColor: 'black' }}>
        <Stack.Screen name='index' options={{ title: 'Home', handers: {visible: true} }} />
        <Stack.Screen name='profile' options={{ title: 'Profile', handers: {visible: false} }} />
        <Stack.Screen name='settings' options={{ title: 'Settings', handers: {visible: false} }} />
        <Stack.Screen name='about' options={{ title: 'About', headers: { visible: false } }} />
      </Stack>
      
    </View>
  )
}

export default RootLayout