// app/home.jsx
import React, { useMemo, useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, AntDesign } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";

// util: normaliza eventos a objetos {type,label}
function normalizeEvents(raw) {
  const out = {};
  for (const k in raw) {
    const arr = raw[k] || [];
    out[k] = arr.map((e) =>
      typeof e === "string" ? { type: "normal", label: e } : e
    );
  }
  return out;
}

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tab, setTab] = useState("home");

  const rawEvents = useMemo(
    () => ({
      "2025-09-05": ["Reunión"],                          // string -> normal
      "2025-09-06": ["Examen", "Cumpleaños"],             // string/string
      "2025-09-08": [{ type: "important", label: "Entrega" }], // objeto
    }),
    []
  );

  const events = useMemo(() => normalizeEvents(rawEvents), [rawEvents]);

  const navItems = [
    { key: "profile", label: "Profile", icon: "user",        href: "/profile" },
    { key: "todo",    label: "To Do",   icon: "check-square",href: "/todo" },
    { key: "home",    label: "Home",    icon: "home",        href: "/main" },
    { key: "break",   label: "Break",   icon: "coffee",      href: "/break" },
    { key: "config",  label: "Config",  icon: "settings",    href: "/settings" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 mt-10">
        <Pressable className="active:opacity-80">
          <Image
            source={{
              uri:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0",
            }}
            className="h-12 w-12 rounded-full border-2 border-blue-400 shadow-sm"
          />
        </Pressable>
        <Pressable className="h-12 w-12 rounded-full items-center justify-center bg-zinc-100 active:bg-zinc-200 shadow-sm">
          <Feather name="search" size={26} color="#111" />
        </Pressable>
      </View>

      {/* Calendario */}
      

      {/* Contenido */}
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-base text-zinc-700">
          Selected: {selectedDate.toDateString()}
        </Text>
      </View>

      {/* FAB */}
      <Pressable
        className="absolute right-6 h-14 w-14 rounded-full bg-blue-500 items-center justify-center shadow-lg active:bg-blue-600"
        style={{ bottom: 88 }}
        onPress={() => {}}
        accessibilityLabel="Add new"
      >
        <AntDesign name="plus" size={28} color="#fff" />
      </Pressable>

      {/* Barra inferior */}
      <BottomNav items={navItems} activeKey={tab} onChange={setTab} />
    </SafeAreaView>
  );
}
