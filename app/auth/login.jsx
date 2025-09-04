import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";

function Field({ placeholder, value, onChangeText, secureTextEntry, leftIcon, right, keyboardType }) {
  return (
    <View className="h-12 w-full flex-row items-center rounded-lg border border-zinc-300 bg-white px-3 mb-5">
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
  );
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-black active:bg-zinc-900",
    outline: "border border-zinc-300 bg-white",
  };
  return (
    <Pressable
      className={`h-12 w-full rounded-lg items-center justify-center ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Pressable>
  );
}

function Separator({ label = "or" }) {
  return (
    <View className="my-6 flex-row items-center gap-3">
      <View className="h-px flex-1 bg-zinc-200" />
      <Text className="text-sm text-zinc-500">{label}</Text>
      <View className="h-px flex-1 bg-zinc-200" />
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);

  function onLogin() {
    console.log("Login with:", { email, pw, remember });
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"} />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 }}
        >
          <View className="flex-1">
            {/* Header */}
            <View className="mb-8 flex-row items-center gap-3">
              <Image
                source={{
                  uri: "https://plus.unsplash.com/premium_photo-1661914978519-52a11fe159a7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0",
                }}
                className="h-12 w-12 rounded-xl"
              />
              <Text className="text-3xl font-bold tracking-tight">Ledgerly</Text>
            </View>

            <Text className="text-4xl font-bold mb-2">Sign In</Text>
            <Text className="mb-6 text-lg text-zinc-500">Let’s keep it quick</Text>

            {/* Fields */}
            <Field
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              leftIcon={<AntDesign name="mail" size={18} color="#71717A" />}
            />
            <Field
              placeholder="Password"
              value={pw}
              onChangeText={setPw}
              secureTextEntry={!showPw}
              leftIcon={<Feather name="lock" size={18} color="#71717A" />}
              right={
                <Pressable onPress={() => setShowPw((s) => !s)}>
                  <Feather name={showPw ? "eye-off" : "eye"} size={18} color="#71717A" />
                </Pressable>
              }
            />

            {/* Remember & Forgot */}
            <View className="mb-6 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Checkbox value={remember} onValueChange={setRemember} color={remember ? "#000" : undefined} />
                <Text className="text-sm text-zinc-700">Remember me</Text>
              </View>
              <Pressable>
                <Text className="text-sm font-semibold text-zinc-900">Forgot password?</Text>
              </Pressable>
            </View>

            {/* CTA */}
            <Button onPress={onLogin}>
              <Text className="font-semibold text-white text-lg">Sign In</Text>
            </Button>

            {/* Social */}
            <Separator />
            <View className="gap-3">
              <Button variant="outline">
                <View className="flex-row items-center justify-center gap-3">
                  <AntDesign name="google" size={20} color="#DB4437" />
                  <Text className="font-medium text-zinc-900 text-lg">Continuar con Google</Text>
                </View>
              </Button>
              <Button variant="outline">
                <View className="flex-row items-center justify-center gap-3">
                  <AntDesign name="apple1" size={20} color="#000" />
                  <Text className="font-medium text-zinc-900 text-lg">Continuar con Apple</Text>
                </View>
              </Button>
            </View>

            {/* Footer */}
            <View className="mt-8">
              <Text className="text-center text-sm text-zinc-700 text-base">
                Don’t have an account?{" "}
                <Text className="font-bold" onPress={() => router.push("/auth/signup")}>
                  Sign Up
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
