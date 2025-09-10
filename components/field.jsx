// Field.jsx
import React from "react";
import { View, TextInput, Text } from "react-native";

export function Field({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  leftIcon,
  right,
  keyboardType,
  error,          // nueva prop: booleano
  errorMessage,   // nueva prop: string
}) {
  return (
    <View className="w-full mb-2">
      <View
        className={`
          h-12 w-full flex-row items-center rounded-lg
          ${error ? "border border-red-500" : "border border-zinc-300"}
          bg-white px-3
        `}
      >
        <View className="mr-2">{leftIcon}</View>
        <TextInput
          className="flex-1 text-lg text-zinc-900"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {right ? <View className="ml-2">{right}</View> : null}
      </View>
      {errorMessage ? (
        <Text className="mt-1 text-sm text-red-600">{errorMessage}</Text>
      ) : null}
    </View>
  );
}
