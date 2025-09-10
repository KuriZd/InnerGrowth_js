// components/BottomNav.jsx
import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
// ✅ Si usas expo-router, descomenta estas 2 líneas:
import { usePathname, useRouter } from "expo-router";

export default function BottomNav({
  items = [],        // [{ key, label, icon, href?, onPress? }]
  activeKey,         // string (opcional si usas href + expo-router)
  onChange,          // (key) => void (si no usas router)
  safe = true,       // agrega padding extra en iOS
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View
      className="border-t border-zinc-200 bg-white"
      style={{
        paddingBottom: safe && Platform.OS === "ios" ? 12 : 8,
        paddingTop: 8,
      }}
    >
      <View className="mx-4 flex-row items-center justify-between">
        {items.map((it) => {
          const isActive = it.href ? pathname === it.href : activeKey === it.key;
          //const isActive = activeKey === it.key; // usa esta línea si no usas router
          const color = isActive ? "#3B82F6" : "#111"; // azul para activo
          return (
            <Pressable
              key={it.key}
              accessibilityRole="button"
              accessibilityLabel={it.label}
              accessibilityState={{ selected: isActive }}
              className="flex-1 items-center py-1 active:opacity-80"
              onPress={() => {
                if (it.onPress) it.onPress();
                if (it.href) router.push(it.href);
                if (!it.onPress && onChange) onChange(it.key);
              }}
            >
              <Feather name={it.icon} size={22} color={color} />
              <Text
                className="mt-1 text-[11px]"
                style={{ color, fontWeight: isActive ? "600" : "400" }}
                numberOfLines={1}
              >
                {it.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
