// app/home.jsx (o tu pantalla)
import React, { useState } from "react";
import { SafeAreaView, View, Text, Pressable, Image } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import DayCalendar from "../components/calendar"; // ajusta el path

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header mejorado */}
      <View className="flex-row items-center justify-between px-5 pt-6">
        <Pressable className="active:opacity-80">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0",
            }}
            className="h-12 w-12 rounded-full border-2 border-blue-400 shadow-sm"
          />
        </Pressable>
        <Pressable className="h-12 w-12 rounded-full items-center justify-center bg-zinc-100 active:bg-zinc-200 shadow-sm">
          <Feather name="search" size={26} color="#111" />
        </Pressable>
      </View>

      {/* Calendario (centrado en hoy, scrollable) */}
      <DayCalendar
        selectedDate={selectedDate}
        onChange={setSelectedDate}
        daysBefore={180}
        daysAfter={180}
        locale="en" // o "es"
      />

      {/* Ejemplo de contenido dependiente del día */}
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-base text-zinc-700">
          Selected: {selectedDate.toDateString()}
        </Text>
      </View>

      <Pressable
        className="absolute bottom-24 right-6 h-14 w-14 rounded-full bg-blue-500 items-center justify-center shadow-lg active:bg-blue-600"
        onPress={() => {
          // acción: crear entrada / abrir modal / navegar
        }}
        accessibilityLabel="Add new"
      >
        <AntDesign name="plus" size={28} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}
