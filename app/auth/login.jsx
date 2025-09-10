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
import { mockLogin } from "../../services/mockAuth";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  // estados de error
  const [errors, setErrors] = useState({
    email: "",
    pw: "",
    general: "",
  });

  async function onLogin() {
    // reset de errores
    setErrors({ email: "", pw: "", general: "" });

    let hasError = false;
    const newErr = { email: "", pw: "", general: "" };

    // validación de email
    if (!email) {
      newErr.email = "Ingresa tu email";
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErr.email = "Dirección de email inválida";
      hasError = true;
    }
    // validación de contraseña
    if (!pw) {
      newErr.pw = "Ingresa tu contraseña";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErr);
      return;
    }

    setLoading(true);
    try {
      await mockLogin({ email, password: pw, remember });
      router.replace("/main");
    } catch (err) {
      setErrors({
        email: "",
        pw: "",
        general: "Contraseña o dirección de email inválida",
      });
    } finally {
      setLoading(false);
    }
  }

  // helper para renderizar un campo
  function renderField({
    placeholder,
    value,
    onChange,
    secure,
    leftIcon,
    rightNode,
    keyboardType,
    errorMsg,
  }) {
    const hasError = !!errorMsg;
    return (
      <View className="w-full mb-2">
        <View
          className={`
            h-12 w-full flex-row items-center rounded-lg px-3
            ${hasError ? "border border-red-500" : "border border-zinc-300"}
            bg-white
          `}
        >
          <View className="mr-2">{leftIcon}</View>
          <TextInput
            className="flex-1 text-lg text-zinc-900"
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChange}
            secureTextEntry={secure}
            keyboardType={keyboardType}
            autoCapitalize="none"
          />
          {rightNode && <View className="ml-2">{rightNode}</View>}
        </View>
        {hasError && (
          <Text className="mt-1 text-sm text-red-600">{errorMsg}</Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white pt-10">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 28,
          }}
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

            <Text className="text-4xl font-bold mb-2">Login</Text>
            <Text className="mb-6 text-lg text-zinc-500">
              Let’s keep it quick
            </Text>

            {/* Mensaje general */}
            {errors.general ? (
              <View className="mb-4 px-3 py-2 bg-red-100 border border-red-400 rounded">
                <Text className="text-red-700">{errors.general}</Text>
              </View>
            ) : null}

            {/* Campos */}
            {renderField({
              placeholder: "Email Address",
              value: email,
              onChange: setEmail,
              secure: false,
              leftIcon: <AntDesign name="mail" size={18} color="#71717A" />,
              keyboardType: "email-address",
              errorMsg: errors.email,
            })}

            {renderField({
              placeholder: "Password",
              value: pw,
              onChange: setPw,
              secure: !showPw,
              leftIcon: <Feather name="lock" size={18} color="#71717A" />,
              rightNode: (
                <Pressable onPress={() => setShowPw((s) => !s)}>
                  <Feather
                    name={showPw ? "eye-off" : "eye"}
                    size={18}
                    color="#71717A"
                  />
                </Pressable>
              ),
              errorMsg: errors.pw,
            })}

            {/* Remember & Forgot */}
            <View className="mb-6 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Checkbox
                  value={remember}
                  onValueChange={setRemember}
                  color={remember ? "#000" : undefined}
                />
                <Text className="text-sm text-zinc-700">Remember me</Text>
              </View>
              <Pressable
                onPress={() =>
                  Alert.alert("Forgot password", "Flujo mock no implementado")
                }
              >
                <Text className="text-sm font-semibold text-zinc-900">
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            {/* Botón */}
            <Pressable
              className={`h-12 w-full rounded-lg items-center justify-center bg-black active:bg-zinc-900 ${
                loading ? "opacity-70" : ""
              }`}
              onPress={onLogin}
              disabled={loading}
            >
              <Text className="font-semibold text-white text-lg">
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </Pressable>

            {/* Separator */}
            <View className="my-6 flex-row items-center gap-3">
              <View className="h-px flex-1 bg-zinc-200" />
              <Text className="text-sm text-zinc-500">or</Text>
              <View className="h-px flex-1 bg-zinc-200" />
            </View>

            {/* Social */}
            <View className="gap-3">
              <Pressable
                className="h-12 w-full rounded-lg border border-zinc-300 bg-white items-center justify-center"
                onPress={() => Alert.alert("Google", "Mock Google login")}
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
                onPress={() => Alert.alert("Apple", "Mock Apple login")}
              >
                <View className="flex-row items-center justify-center gap-3">
                  <AntDesign name="apple1" size={20} color="#000" />
                  <Text className="font-medium text-zinc-900 text-lg">
                    Continuar con Apple
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Footer */}
            <View className="mt-8">
              <Text className="text-center text-base text-zinc-700">
                Don’t have an account?{" "}
                <Text
                  className="font-bold"
                  onPress={() => router.push("/auth/signup")}
                >
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
