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
import { mockSignup } from "../../services/mockAuth";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // validaciones
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

  async function onSubmit() {
    setSubmitted(true);
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await mockSignup({ email, password: pw });
      Alert.alert("Éxito", `Usuario creado: ${res.user.email}`);
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  }

  const requirements = [
    { key: "length", label: "Mínimo 8 caracteres", valid: hasMinLen },
    { key: "upper", label: "Al menos 1 mayúscula", valid: hasUpper },
    { key: "symbol", label: "Al menos 1 símbolo", valid: hasSymbol },
  ];

  const keyboardOffset = Platform.select({ ios: 100, android: 80 });

  // Componente Button inline
  function Button({ children, variant = "primary", onPress, disabled }) {
    const base = "h-14 w-full rounded-xl items-center justify-center";
    const style =
      variant === "outline"
        ? "border border-zinc-300 bg-white"
        : "bg-black active:bg-zinc-900";
    return (
      <Pressable
        className={`${base} ${style} ${disabled ? "opacity-70" : ""}`}
        onPress={onPress}
        disabled={disabled}
      >
        {children}
      </Pressable>
    );
  }

  // Componente Separator inline
  function Separator({ label = "or" }) {
    return (
      <View className="my-6 flex-row items-center">
        <View className="h-px flex-1 bg-zinc-200" />
        <Text className="px-3 text-sm text-zinc-500">{label}</Text>
        <View className="h-px flex-1 bg-zinc-200" />
      </View>
    );
  }

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
          contentInsetAdjustmentBehavior="automatic"
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

            {/* Requisitos */}
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

            {/* Social */}
            <Separator />
            <View className="gap-3 mb-6">
              <Button variant="outline" onPress={() => { /* google flow */ }}>
                <View className="flex-row items-center justify-center gap-3 px-4">
                  <AntDesign name="google" size={20} color="#DB4437" />
                  <Text className="font-medium text-zinc-900">
                    Continue with Google
                  </Text>
                </View>
              </Button>
              <Button variant="outline" onPress={() => { /* apple flow */ }}>
                <View className="flex-row items-center justify-center gap-3 px-4">
                  <AntDesign name="apple1" size={20} color="#000000" />
                  <Text className="font-medium text-zinc-900">
                    Continue with Apple
                  </Text>
                </View>
              </Button>
            </View>

            {/* Legal / Link a Login */}
            <View className="mt-4">
              <Text className="text-center text-xs leading-5 text-zinc-500">
                By registering, you agree to the{" "}
                <Text className="font-semibold">Terms</Text> y la{" "}
                <Text className="font-semibold">Privacy Policy</Text>.
              </Text>
              <Pressable
                className="mt-3"
                onPress={() => router.push("/auth/login")}
              >
                <Text className="text-center text-sm text-zinc-700">
                  All ready, have an account?{" "}
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
