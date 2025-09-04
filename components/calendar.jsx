import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, Pressable, FlatList } from "react-native";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DayCalendar({
  daysBefore = 180,
  daysAfter = 180,
  selectedDate,
  onChange,
  locale = "en",
  showHeader = true,
}) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const base = useMemo(() => startOfDay(new Date()), []);
  const data = useMemo(() => {
    const arr = [];
    for (let i = -daysBefore; i <= daysAfter; i++) {
      const d = addDays(base, i);
      arr.push({ key: d.toISOString().slice(0, 10), date: d });
    }
    return arr;
  }, [base, daysBefore, daysAfter]);

  const listRef = useRef(null);
  const initialIndex = daysBefore; // hoy queda al centro del array

  // 👇 Centrar hoy cuando carga la página
  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: initialIndex,
        animated: false,
        viewPosition: 0.5, // lo centra
      });
    }, 0);
  }, [initialIndex]);

  const WEEK =
    locale === "es"
      ? ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View className="mx-4 mt-4 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
      <FlatList
        ref={listRef}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, i) => ({ length: 64, offset: 64 * i, index: i })}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
        renderItem={({ item, index }) => {
          const d = item.date;
          const selected = selectedDate
            ? isSameDay(d, selectedDate)
            : isSameDay(d, today);
          const isToday = isSameDay(d, today);

          return (
            <Pressable
              className="items-center w-14"
              onPress={() => {
                onChange?.(d);
                listRef.current?.scrollToIndex({
                  index,
                  animated: true,
                  viewPosition: 0.5,
                });
              }}
            >
              <Text className="text-[11px] text-zinc-500 mb-1">
                {WEEK[d.getDay()]}
              </Text>

              <View
                className={`h-10 w-10 items-center justify-center rounded-full ${
                  selected ? "bg-blue-600" : "bg-blue-100"
                }`}
              >
                <Text
                  className={`${
                    selected
                      ? "text-white font-semibold"
                      : "text-blue-800 font-medium"
                  }`}
                >
                  {d.getDate()}
                </Text>
              </View>

              {isToday && !selected ? (
                <View className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
              ) : (
                <View className="mt-1 h-1.5" />
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}
