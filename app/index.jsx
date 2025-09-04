import React from "react";
import { SafeAreaView, View, Text, Image, Pressable, ScrollView } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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

  return (
    <SafeAreaView className="flex-1 bg-white pt-16">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        contentContainerClassName="px-5 pt-8 pb-10"
      >
        <View className="flex-1 gap-6">
          {/* Marca y tagline */}
          <View className="gap-7">
            <View className="flex-row items-center gap-4 justify-start">
              <Image
                source={{
                  uri: "https://plus.unsplash.com/premium_photo-1661914978519-52a11fe159a7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }}
                className="h-20 w-20 rounded-2xl"
              />
              <Text className="text-4xl font-bold tracking-tight">Ledgerly</Text>
            </View>
            <Text className=" text-zinc-600 text-xl leading-6 px-3 text-justify w-[85%]">
              Success starts with financial sense, because every number leads to progress,
              and every progress leads to goals.
            </Text>
          </View>

          {/* Acciones principales */}
          <View>
            <View className="mt-10 gap-5">
               {/*  Navegación a login.jsx */}
               <Button onPress={() => router.push("/auth/login")}>
                <Text className="font-medium text-white text-xl">Sign In</Text>
              </Button>

              {/*  Navegación a signup.jsx */}
              <Button variant="outline" onPress={() => router.push("/auth/signup")}>
                <Text className="font-medium text-zinc-900 text-xl">Sign up</Text>
              </Button>
            </View>

            {/* Social */}
            <View>
              <Separator />
              <View className="gap-5">
                <Button variant="outline">
                  <View className="flex-row items-center justify-center gap-4">
                    <AntDesign name="google" size={22} color="#DB4437" />
                    <Text className="font-medium text-lg text-zinc-900">Continuar con Google</Text>
                  </View>
                </Button>

                <Button variant="outline">
                  <View className="flex-row items-center justify-center gap-4">
                    <FontAwesome name="facebook" size={22} color="#1877F2" />
                    <Text className="font-medium text-lg text-zinc-900">Continuar con Facebook</Text>
                  </View>
                </Button>
              </View>
            </View>
          </View>

          {/* Legal */}
          <View className="mt-10">
            <Text className="text-center text-xs leading-5 text-zinc-500">
              Al continuar aceptas nuestros <Text className="font-semibold">Términos</Text> y la{" "}
              <Text className="font-semibold">Política de privacidad</Text>.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
