import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Image,
  Switch,
  ScrollView,
} from "react-native";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";

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
      <Feather name="chevron-right" size={20} color={danger ? "#dc2626" : "#6b7280"} />
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
  const [haptics, setHaptics] = useState(true);

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
          onPress={() => {}}
        />
        <SettingItem
          icon={<Feather name="help-circle" size={20} color="#111" />}
          label="Help"
          onPress={() => {}}
        />
        <SettingItem
          icon={<AntDesign name="earth" size={20} color="#111" />}
          label="Language Settings"
          onPress={() => {}}
        />
        <SettingItem
          icon={<Feather name="lock" size={20} color="#111" />}
          label="Authentication"
          onPress={() => {}}
        />
        <SettingItem
          icon={<Feather name="bell" size={20} color="#111" />}
          label="Notifications"
          onPress={() => {}}
        />
        <SettingItem
          icon={<MaterialIcons name="delete-outline" size={22} color="#dc2626" />}
          label="Delete Account"
          danger
          onPress={() => {}}
        />

        <SettingSwitch
          icon={<Feather name="smartphone" size={20} color="#111" />}
          label="Haptic feedback"
          value={haptics}
          onValueChange={setHaptics}
        />

        <SettingItem
          icon={<Feather name="log-out" size={20} color="#111" />}
          label="Log out"
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
