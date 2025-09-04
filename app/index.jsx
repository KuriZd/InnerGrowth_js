import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'
import '../styles/global.css'

const _layout = () => {
  return (
    <View className='flex-1 items-center justify-center mt-20 px-4'>
      <Text className='text-2xl font-bold'>Redirecting...</Text>
      <Link href="/" className='text-blue-500'>Home</Link>
      <Link href="/profile" className='text-blue-500'>Profile</Link>
      <Link href="/settings" className='text-blue-500'>Settings</Link>
      <Link href="/about" className='text-blue-500'>About</Link>
    </View>
  )
}

export default _layout
