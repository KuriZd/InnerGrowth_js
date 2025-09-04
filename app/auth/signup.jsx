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

// ---------- UI PRIMITIVOS ----------
function Field({
  label,
  placeholder,
  value,
  onChangeText,
  leftIcon,
  right,
  secureTextEntry,
  keyboardType = "default",
  error,
}) {
  return (
    <View className="mb-5">
      {label ? <Text className="mb-2 text-sm font-medium text-zinc-700">{label}</Text> : null}
      <View
        className={`h-12 w-full flex-row items-center rounded-lg border px-3 ${
          error ? "border-red-500" : "border-zinc-300"
        } bg-white`}
      >
        <View className="w-6 items-center mr-2">{leftIcon}</View>
        <TextInput
          className="flex-1 text-base text-zinc-900"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel={label || placeholder}
          textContentType={keyboardType === "email-address" ? "emailAddress" : "oneTimeCode"}
        />
        {right ? <View className="ml-2">{right}</View> : null}
      </View>
      {error ? <Text className="mt-1 text-xs text-red-600">{error}</Text> : null}
    </View>
  );
}

function Button({ variant = "primary", children, className = "", ...props }) {
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

// ---------- SCREEN ----------
export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailError =
    email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Correo inválido" : "";
  const pwError = pw && pw.length < 8 ? "Mínimo 8 caracteres" : "";
  const matchError = pw2 && pw2 !== pw ? "Las contraseñas no coinciden" : "";

  const canSubmit = email && pw && pw2 && !emailError && !pwError && !matchError;

  async function onSubmit() {
    setLoading(true);
    try {
      const res = await mockSignup({ email, password: pw });
      Alert.alert("Éxito", `Usuario creado: ${res.user.email}`);
      console.log("Registro exitoso:", res);
      router.push("/auth/login"); // 👈 redirige al login
    } catch (err) {
      console.error("Error de registro:", err);
      Alert.alert("Error", err.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white pt-12">
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
            <View className="mb-4 flex-row items-center gap-3">
              <Image
                source={{
                  uri: "https://plus.unsplash.com/premium_photo-1661914978519-52a11fe159a7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0",
                }}
                className="h-12 w-12 rounded-lg"
              />
              <Text className="text-3xl font-bold tracking-tight">Register</Text>
            </View>

            <View className="mb-4 h-px w-56 bg-zinc-800" />

            {/* Formulario */}
            <Field
              label="Enter your Email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              leftIcon={<AntDesign name="mail" size={18} color="#71717A" />}
              keyboardType="email-address"
              error={emailError}
            />
            <Field
              label="Enter your Password"
              placeholder="****************"
              value={pw}
              onChangeText={setPw}
              secureTextEntry={!showPw}
              leftIcon={<Feather name="lock" size={18} color="#71717A" />}
              right={
                <Pressable
                  onPress={() => setShowPw((s) => !s)}
                  accessibilityLabel={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <Feather name={showPw ? "eye-off" : "eye"} size={18} color="#71717A" />
                </Pressable>
              }
              error={pwError}
            />
            <Field
              label="Re-Enter Password"
              placeholder="****************"
              value={pw2}
              onChangeText={setPw2}
              secureTextEntry={!showPw2}
              leftIcon={<Feather name="lock" size={18} color="#71717A" />}
              right={
                <Pressable
                  onPress={() => setShowPw2((s) => !s)}
                  accessibilityLabel={showPw2 ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <Feather name={showPw2 ? "eye-off" : "eye"} size={18} color="#71717A" />
                </Pressable>
              }
              error={matchError}
            />

            {/* CTA */}
            <View className="mt-2">
              <Button
                variant="primary"
                onPress={onSubmit}
                className={!canSubmit || loading ? "opacity-70" : ""}
                disabled={!canSubmit || loading}
              >
                <Text className="font-semibold text-white">
                  {loading ? "Loading..." : "Sign Up"}
                </Text>
              </Button>
            </View>

            {/* Social */}
            <Separator label="or" />
            <View className="gap-3">
              <Button variant="outline" onPress={() => Alert.alert("Google", "Mock Google login")}>
                <View className="flex-row items-center justify-center gap-3">
                  <AntDesign name="google" size={20} color="#DB4437" />
                  <Text className="font-medium text-zinc-900">Continue with Google</Text>
                </View>
              </Button>

              <Button variant="outline" onPress={() => Alert.alert("Apple", "Mock Apple login")}>
                <View className="flex-row items-center justify-center gap-3">
                  <AntDesign name="apple1" size={20} color="#000000" />
                  <Text className="font-medium text-zinc-900">Continue with Apple</Text>
                </View>
              </Button>
            </View>

            {/* Legal */}
            <View className="mt-6">
              <Text className="text-center text-xs leading-5 text-zinc-500">
                By registering, you agree to the <Text className="font-semibold">Terms</Text> and
                the <Text className="font-semibold">Privacy Policy</Text>.
              </Text>
              <Pressable className="mt-3" onPress={() => router.push("/auth/login")}>
                <Text className="text-center text-sm text-zinc-700">
                  Already have an account? <Text className="font-semibold">Log in</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
