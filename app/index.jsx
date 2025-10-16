// app/auth/index.jsx

import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "../utils/supabase";
import '../styles/global.css';

function Button({ variant = "primary", children, className = "", ...props }) {
  const styles = {
    primary: "bg-black active:bg-zinc-900",
    outline: "border border-zinc-300",
    ghost: "",
  };
  return (
    <Pressable
      className={`h-14 rounded-xl items-center justify-center ${styles[variant]} ${className}`}
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
      <Text className="text-base text-zinc-500">{label}</Text>
      <View className="h-px flex-1 bg-zinc-200" />
    </View>
  );
}

export default function AuthScreen() {
  const router = useRouter();

  const handleOAuth = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      // options: { redirectTo: "ledgerly://login-callback" } // si usas esquema nativo
    });
    if (error) {
      Alert.alert(`${provider} Sign-In error`, error.message);
    } else if (data?.url) {
      await Linking.openURL(data.url);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-16">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-5 pt-8 pb-10"
      >
        <View className="flex-1 gap-6">
          {/* Marca y tagline */}
          <View className="gap-7">
            <View className="flex-row items-center gap-4">
              <Image
                source={{
                  uri:
                    "https://plus.unsplash.com/premium_photo-1661914978519-52a11fe159a7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0",
                }}
                className="h-20 w-20 rounded-2xl"
              />
              <Text className="text-4xl font-bold tracking-tight">Ledgerly</Text>
            </View>
            <Text className="text-zinc-600 text-xl leading-6 px-3 text-justify w-[85%]">
              Success starts with financial sense, because every number leads to
              progress, and every progress leads to goals.
            </Text>
          </View>

          {/* Acciones principales */}
          <View className="mt-10 gap-5">
            <Button onPress={() => router.push("/auth/login")}>
              <Text className="font-medium text-white text-xl">Sign In</Text>
            </Button>
            <Button
              variant="outline"
              onPress={() => router.push("/auth/signup")}
            >
              <Text className="font-medium text-zinc-900 text-xl">Sign up</Text>
            </Button>
          </View>

          <Separator />

          {/* OAuth buttons */}
          <View className="gap-3">
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
                <AntDesign name="apple" size={20} color="#000" />
                <Text className="font-medium text-zinc-900 text-lg">
                  Continuar con Apple
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Legal */}
          <View className="mt-10">
            <Text className="text-center text-xs leading-5 text-zinc-500">
              Al continuar aceptas nuestros{" "}
              <Text className="font-semibold">Términos</Text> y la{" "}
              <Text className="font-semibold">Política de privacidad</Text>.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
