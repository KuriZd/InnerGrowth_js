// app/auth/signup.jsx

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
  Alert,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "../../utils/supabase";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // validations
  const hasMinLen = pw.length >= 8;
  const hasUpper = /[A-Z]/.test(pw);
  const hasSymbol = /\W/.test(pw);
  const pwMatch = pw2 === pw;

  const emailError =
    submitted && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Correo inválido"
      : "";
  const matchError =
    submitted && pw2 && !pwMatch ? "Las contraseñas no coinciden" : "";

  const canSubmit =
    email && hasMinLen && hasUpper && hasSymbol && pwMatch && !loading;

  const requirements = [
    { key: "length", label: "Mínimo 8 caracteres", valid: hasMinLen },
    { key: "upper", label: "Al menos 1 mayúscula", valid: hasUpper },
    { key: "symbol", label: "Al menos 1 símbolo", valid: hasSymbol },
  ];

  async function onSubmit() {
    setSubmitted(true);
    if (!canSubmit) return;

    setLoading(true);
    // Supabase sign-up
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pw,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Error al registrar", error.message);
    } else {
      Alert.alert(
        "¡Éxito!",
        "Revisa tu correo para verificar tu cuenta.",
        [{ text: "OK", onPress: () => router.replace("/auth/login") }]
      );
    }
  }

  async function handleOAuth(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      // options: { redirectTo: "ledgerly://login-callback" }
    });
    if (error) {
      Alert.alert(`${provider} Sign-In error`, error.message);
    } else if (data?.url) {
      Linking.openURL(data.url);
    }
  }

  const keyboardOffset = Platform.select({ ios: 100, android: 80 });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardOffset}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 32,
            paddingBottom: 32,
          }}
        >
          <View className="flex-1">
            {/* Header */}
            <View className="mb-8 flex-row items-center">
              <Image
                source={{
                  uri:
                    "https://plus.unsplash.com/premium_photo-1661914978519-52a11fe159a7",
                }}
                className="h-16 w-16 rounded-lg"
              />
              <Text className="ml-4 text-4xl font-bold">Register</Text>
            </View>

            {/* Email */}
            <View className="mb-6">
              <Text className="mb-2 text-base font-medium text-zinc-700">
                Correo electrónico
              </Text>
              <View
                className={`h-14 w-full flex-row items-center rounded-xl px-4 ${
                  emailError
                    ? "border-2 border-red-500"
                    : "border border-zinc-300"
                } bg-white`}
              >
                <AntDesign
                  name="mail"
                  size={20}
                  color="#71717A"
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  className="flex-1 text-lg text-zinc-900"
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {!!emailError && (
                <Text className="mt-1 text-sm text-red-600">{emailError}</Text>
              )}
            </View>

            {/* Password */}
            <View className="mb-6">
              <Text className="mb-2 text-base font-medium text-zinc-700">
                Contraseña
              </Text>
              <View className="h-14 w-full flex-row items-center rounded-xl px-4 border border-zinc-300 bg-white">
                <Feather
                  name="lock"
                  size={20}
                  color="#71717A"
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  className="flex-1 text-lg text-zinc-900"
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={pw}
                  onChangeText={setPw}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShowPw((s) => !s)}>
                  <Feather
                    name={showPw ? "eye-off" : "eye"}
                    size={20}
                    color="#71717A"
                  />
                </Pressable>
              </View>
            </View>

            {/* Requirements */}
            {submitted && (
              <View className="mb-6 space-y-2">
                {requirements.map(({ key, label, valid }) => (
                  <View
                    key={key}
                    className="flex-row items-center"
                    style={{ gap: 10 }}
                  >
                    <View
                      className={`h-6 w-6 rounded-full items-center justify-center ${
                        valid ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      <Feather
                        name={valid ? "check" : "x"}
                        size={14}
                        color="white"
                      />
                    </View>
                    <Text
                      className={`text-base ${
                        valid ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {label}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="mb-2 text-base font-medium text-zinc-700">
                Repetir contraseña
              </Text>
              <View
                className={`h-14 w-full flex-row items-center rounded-xl px-4 ${
                  submitted && !pwMatch
                    ? "border-2 border-red-500"
                    : "border border-zinc-300"
                } bg-white`}
              >
                <Feather
                  name="lock"
                  size={20}
                  color="#71717A"
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  className="flex-1 text-lg text-zinc-900"
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={pw2}
                  onChangeText={setPw2}
                  secureTextEntry={!showPw2}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShowPw2((s) => !s)}>
                  <Feather
                    name={showPw2 ? "eye-off" : "eye"}
                    size={20}
                    color="#71717A"
                  />
                </Pressable>
              </View>
              {submitted && matchError && (
                <Text className="mt-1 text-sm text-red-600">{matchError}</Text>
              )}
            </View>

            {/* Submit */}
            <Pressable
              className={`h-14 w-full rounded-xl items-center justify-center bg-black active:bg-zinc-900 ${
                !canSubmit ? "opacity-70" : ""
              }`}
              onPress={onSubmit}
              disabled={!canSubmit && submitted}
            >
              <Text className="text-lg font-semibold text-white">
                {loading ? "Registrando..." : "Sign Up"}
              </Text>
            </Pressable>

            {/* OAuth buttons */}
            <View className="gap-3 mt-6">
              <Pressable
                className="h-12 w-full rounded-lg border border-zinc-300 bg-white items-center justify-center"
                onPress={() => handleOAuth("google")}
              >
                <View className="flex-row items-center justify-center gap-3">
                  <AntDesign name="google" size={20} color="#DB4437" />
                  <Text className="font-medium text-zinc-900 text-lg">
                    Continuar con Google
                  </Text>
                </View>
              </Pressable>

              <Pressable
                className="h-12 w-full rounded-lg border border-zinc-300 bg-white items-center justify-center"
                onPress={() => handleOAuth("apple")}
              >
                <View className="flex-row items-center justify-center gap-3">
                  <AntDesign name="apple1" size={20} color="#000" />
                  <Text className="font-medium text-zinc-900 text-lg">
                    Continuar con Apple
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Legal / Link a Login */}
            <View className="mt-6">
              <Text className="text-center text-xs leading-5 text-zinc-500">
                By registering, you agree to the{" "}
                <Text className="font-semibold">Terms</Text> and{" "}
                <Text className="font-semibold">Privacy Policy</Text>.
              </Text>
              <Pressable
                className="mt-3"
                onPress={() => router.push("/auth/login")}
              >
                <Text className="text-center text-sm text-zinc-700">
                  Already have an account?{" "}
                  <Text className="font-semibold">Log in</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
