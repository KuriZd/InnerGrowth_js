import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Image,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { supabase } from "../utils/supabase";

function SettingItem({ icon, label, onPress, danger }) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-4 mb-3 shadow-sm active:bg-zinc-50 ${
        danger ? "border-red-300" : ""
      }`}
    >
      <View className="flex-row items-center gap-3">
        {icon}
        <Text className={`text-base ${danger ? "text-red-600" : "text-zinc-800"}`}>
          {label}
        </Text>
      </View>
      <Feather
        name="chevron-right"
        size={20}
        color={danger ? "#dc2626" : "#6b7280"}
      />
    </Pressable>
  );
}

function SettingSwitch({ icon, label, value, onValueChange }) {
  return (
    <View className="flex-row items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-4 mb-3 shadow-sm">
      <View className="flex-row items-center gap-3">
        {icon}
        <Text className="text-base text-zinc-800">{label}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

export default function SettingsScreen() {
  const [hapticsEnabled, setHapticsEnabled] = useState(false);
  const router = useRouter();

  // Carga el valor guardado al iniciar
  useEffect(() => {
    AsyncStorage.getItem("hapticsEnabled").then((val) => {
      if (val !== null) setHapticsEnabled(val === "true");
    });
  }, []);

  // Guarda y dispara un toque ligero cuando se cambia
  const toggleHaptics = async (value) => {
    setHapticsEnabled(value);
    await AsyncStorage.setItem("hapticsEnabled", value.toString());
    if (value) {
      Haptics.selectionAsync();
    }
  };

  // Función de logout: cierra sesión en supabase, limpia AsyncStorage y redirige a Login
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error al cerrar sesión", error.message);
      return;
    }
    await AsyncStorage.clear();
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0",
            }}
            className="h-20 w-20 rounded-full mb-3"
          />
          <Text className="text-lg font-semibold text-zinc-800">
            Monsterrat Herrera
          </Text>
        </View>

        {/* Items */}
        <SettingItem
          icon={<Feather name="user" size={20} color="#111" />}
          label="Edit Profile"
          onPress={() => router.push("/settings/edit-profile")}
        />
        <SettingItem
          icon={<Feather name="help-circle" size={20} color="#111" />}
          label="Help"
          onPress={() => router.push("/settings/help")}
        />
        <SettingItem
          icon={<AntDesign name="earth" size={20} color="#111" />}
          label="Language Settings"
          onPress={() => router.push("/settings/language")}
        />
        <SettingItem
          icon={<Feather name="lock" size={20} color="#111" />}
          label="Authentication"
          onPress={() => router.push("/settings/auth")}
        />
        <SettingItem
          icon={<Feather name="bell" size={20} color="#111" />}
          label="Notifications"
          onPress={() => router.push("/settings/notifications")}
        />
        <SettingItem
          icon={
            <MaterialIcons name="delete-outline" size={22} color="#dc2626" />
          }
          label="Delete Account"
          danger
          onPress={() => Alert.alert(
            "Eliminar cuenta",
            "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Eliminar",
                style: "destructive",
                onPress: () => {
                  // llamada a la API para borrar cuenta
                  Alert.alert("Cuenta eliminada", "Tu cuenta ha sido eliminada.");
                },
              },
            ]
          )}
        />

        <SettingSwitch
          icon={<Feather name="smartphone" size={20} color="#111" />}
          label="Haptic feedback"
          value={hapticsEnabled}
          onValueChange={toggleHaptics}
        />

        <SettingItem
          icon={<Feather name="log-out" size={20} color="#111" />}
          label="Log out"
          onPress={handleLogout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
