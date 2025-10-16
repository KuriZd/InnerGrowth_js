// app/auth/login.jsx

import React, { useState, useEffect, useRef } from "react";
import {
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
  Animated,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { AntDesign, Feather } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { supabase } from "../../utils/supabase";

export default function LoginScreen() {
  const router = useRouter();

  // form state
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);

  // cred loading flag
  const [credsLoaded, setCredsLoaded] = useState(false);

  // loading flags
  const [sessionLoading, setSessionLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // error messages
  const [errors, setErrors] = useState({ email: "", pw: "", general: "" });

  // spin animation ref
  const spinAnim = useRef(new Animated.Value(0)).current;

  // start spin animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ).start();
  }, [spinAnim]);

  // check session & listener
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session) router.replace("/main");
      })
      .finally(() => setSessionLoading(false));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) router.replace("/main");
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  // load saved credentials on mount
  useEffect(() => {
    async function loadCreds() {
      try {
        const savedEmail = await SecureStore.getItemAsync("email");
        const savedPw = await SecureStore.getItemAsync("password");
        if (savedEmail && savedPw) {
          setEmail(savedEmail);
          setPw(savedPw);
          setRemember(true);
        }
      } catch (err) {
        console.warn("Error loading credentials:", err);
      } finally {
        setCredsLoaded(true);
      }
    }
    loadCreds();
  }, []);

  // email/password login
  async function onLogin() {
    // evita login antes de cargar credenciales
    if (!credsLoaded) return;

    setErrors({ email: "", pw: "", general: "" });

    const newErr = { email: "", pw: "", general: "" };
    let hasError = false;
    if (!email) {
      newErr.email = "Ingresa tu email";
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErr.email = "Dirección de email inválida";
      hasError = true;
    }
    if (!pw) {
      newErr.pw = "Ingresa tu contraseña";
      hasError = true;
    }
    if (hasError) {
      setErrors(newErr);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pw,
    });
    if (error) {
      setErrors({ ...newErr, general: error.message });
      setLoading(false);
    } else {
      // login exitoso → guardamos o borramos credenciales
      try {
        if (remember) {
          await SecureStore.setItemAsync("email", email);
          await SecureStore.setItemAsync("password", pw);
        } else {
          await SecureStore.deleteItemAsync("email");
          await SecureStore.deleteItemAsync("password");
        }
      } catch (err) {
        console.warn("Error saving credentials:", err);
      }
      // el listener de onAuthStateChange redirigirá a /main
    }
  }

  // render input field
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
      <View className="w-full mb-3">
        <View
          className={`h-12 flex-row items-center px-3 bg-white rounded-lg ${
            hasError ? "border border-red-500" : "border border-zinc-300"
          }`}
        >
          <View className="mr-2">{leftIcon}</View>
          <TextInput
            className="flex-1 text-base text-zinc-900"
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

  // spin interpolation
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

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
                  uri:
                    "https://plus.unsplash.com/premium_photo-1661914978519-52a11fe159a7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0",
                }}
                className="h-12 w-12 rounded-xl"
              />
              <Text className="text-3xl font-bold tracking-tight">
                Ledgerly
              </Text>
            </View>

            <Text className="text-4xl font-bold mb-2">Login</Text>
            <Text className="mb-6 text-lg text-zinc-500">
              Let’s keep it quick
            </Text>

            {/* general error */}
            {errors.general && (
              <View className="mb-4 px-3 py-2 bg-red-100 border border-red-400 rounded">
                <Text className="text-red-700">{errors.general}</Text>
              </View>
            )}

            {/* fields */}
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
              keyboardType: "default",
              errorMsg: errors.pw,
            })}

            {/* remember / forgot */}
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
                  Alert.alert("Forgot password", "Flujo no implementado")
                }
              >
                <Text className="text-sm font-semibold text-zinc-900">
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            {/* Sign in */}
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

            {/* separator */}
            <View className="my-6 flex-row items-center gap-3">
              <View className="h-px flex-1 bg-zinc-200" />
              <Text className="text-sm text-zinc-500">or</Text>
              <View className="h-px flex-1 bg-zinc-200" />
            </View>

            {/* OAuth buttons */}
            <View className="gap-3">
              {/* Google */}
              <Pressable
                className="h-12 w-full rounded-lg border border-zinc-300 bg-white items-center justify-center"
                onPress={async () => {
                  const { data, error } =
                    await supabase.auth.signInWithOAuth({
                      provider: "google",
                    });
                  if (error) {
                    Alert.alert("Google Sign-In error", error.message);
                  } else if (data?.url) {
                    await Linking.openURL(data.url);
                  }
                }}
              >
                <View className="flex-row items-center justify-center gap-3">
                  <AntDesign name="google" size={20} color="#DB4437" />
                  <Text className="font-medium text-zinc-900 text-lg">
                    Continuar con Google
                  </Text>
                </View>
              </Pressable>

              {/* Apple */}
              <Pressable
                className="h-12 w-full rounded-lg border border-zinc-300 bg-white items-center justify-center"
                onPress={async () => {
                  const { data, error } =
                    await supabase.auth.signInWithOAuth({
                      provider: "apple",
                    });
                  if (error) {
                    Alert.alert("Apple Sign-In error", error.message);
                  } else if (data?.url) {
                    await Linking.openURL(data.url);
                  }
                }}
              >
                <View className="flex-row items-center justify-center gap-3">
                  <AntDesign name="apple" size={20} color="#000" />
                  <Text className="font-medium text-zinc-900 text-lg">
                    Continuar con Apple
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* footer */}
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

      {/* blur + spinning loader overlay */}
      {(sessionLoading || loading) && (
        <BlurView intensity={60} className="absolute inset-0">
          <View className="flex-1 justify-center items-center">
            <Animated.View
              style={{ transform: [{ rotate: spin }] }}
              className="w-12 h-12 border-4 border-black border-t-transparent border-r-transparent rounded-full"
            />
          </View>
        </BlurView>
      )}
    </SafeAreaView>
  );
}
