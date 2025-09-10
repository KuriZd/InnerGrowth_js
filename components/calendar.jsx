import React, {
    useEffect,
    useMemo,
    useRef,
    useCallback,
    useState,
  } from "react";
  import { View, Text, Pressable, FlatList, Dimensions } from "react-native";
  
  const ITEM_WIDTH = 56; // Debe coincidir con w-14 (56px aprox)
  const SEPARATOR = 8; // separación horizontal entre ítems
  const SNAP = ITEM_WIDTH + SEPARATOR;
  
  const clamp = (v, min, max) => Math.max(min, Math.min(v, max));
  
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
  
  function formatKey(d) {
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  }
  
  /**
   * events: {
   *   "2025-09-05": [{ type: "important", label: "Reunión" }, ...],
   *   ...
   * }
   */
  export default function DayCalendar({
    daysBefore = 180,
    daysAfter = 180,
    selectedDate,
    onChange,
    locale = "en",
    events = {},
    eventColorMap = {
      important: "#ef4444",
      normal: "#10b981",
      reminder: "#3b82f6",
      other: "#a855f7",
    },
    maxMarkers = 3,
  }) {
    const today = useMemo(() => startOfDay(new Date()), []);
    const base = useMemo(() => startOfDay(new Date()), []);
  
    const data = useMemo(() => {
      const arr = [];
      for (let i = -daysBefore; i <= daysAfter; i++) {
        const d = addDays(base, i);
        arr.push({ key: formatKey(d), date: d });
      }
      return arr;
    }, [base, daysBefore, daysAfter]);
  
    const listRef = useRef(null);
  
    const screenWidth = Dimensions.get("window").width;
    const sidePadding = Math.max(0, (screenWidth - ITEM_WIDTH) / 2);
  
    // Índice objetivo inicial
    const initialIndexWanted = useMemo(() => {
      const target = selectedDate ? startOfDay(selectedDate) : today;
      const idx = data.findIndex((x) => isSameDay(x.date, target));
      return idx >= 0 ? idx : daysBefore;
    }, [data, selectedDate, today, daysBefore]);
  
    const WEEK =
      locale === "es"
        ? ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
    const getItemLayout = useCallback(
      (_, index) => ({ length: SNAP, offset: SNAP * index, index }),
      []
    );
  
    const renderMarkers = (key, isToday, selected) => {
      const dayEvents = events[key] || [];
      if (dayEvents.length === 0) {
        if (isToday && !selected) {
          return (
            <View
              className="mt-1 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#2563eb" }}
            />
          );
        }
        return <View className="mt-1 h-1.5" />;
      }
  
      return (
        <View className="mt-1 flex-row justify-center" style={{ gap: 4 }}>
          {dayEvents.slice(0, maxMarkers).map((ev, i) => {
            const color = eventColorMap[ev.type] || eventColorMap.other || "#6b7280";
            return (
              <View
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
            );
          })}
        </View>
      );
    };
  
    const centerIndex = useCallback(
      (index, animated = true) => {
        listRef.current?.scrollToIndex({
          index,
          animated,
          viewPosition: 0.5, // 👈 Centrado visual perfecto
        });
      },
      []
    );
  
    const renderItem = useCallback(
      ({ item, index }) => {
        const d = item.date;
        const selected = selectedDate
          ? isSameDay(d, selectedDate)
          : isSameDay(d, today);
        const isToday = isSameDay(d, today);
  
        // Detectar si es el primer ítem o si el mes cambió respecto al anterior
        const isFirstItem = index === 0;
        const prevItem = data[index - 1];
        const monthChanged =
          isFirstItem ||
          !prevItem ||
          d.getMonth() !== prevItem.date.getMonth() ||
          d.getFullYear() !== prevItem.date.getFullYear();
  
        const monthNames =
          locale === "es"
            ? ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
            : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const monthLabel = monthNames[d.getMonth()];
  
        return (
          <Pressable
            className="items-center w-14"
            onPress={() => {
              onChange?.(d);
              centerIndex(index, true);
            }}
          >
            {/* Etiqueta del mes (solo cuando cambia) */}
            {monthChanged && (
              <View className="absolute -top-5 left-0">
                <Text className="text-[10px] font-medium text-zinc-900">
                  {monthLabel}
                </Text>
              </View>
            )}
  
            {/* Día de la semana */}
            <Text className="text-[11px] text-zinc-500 mb-1">
              {WEEK[d.getDay()]}
            </Text>
  
            {/* Círculo del día */}
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
  
            {/* Indicadores de eventos */}
            {renderMarkers(item.key, isToday, selected)}
          </Pressable>
        );
      },
      [
        WEEK,
        onChange,
        centerIndex,
        selectedDate,
        today,
        events,
        eventColorMap,
        data,
        locale,
      ]
    );
  
    return (
      <View className="mx-4 mt-4 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
        <FlatList
          ref={listRef}
          data={data}
          horizontal
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          getItemLayout={getItemLayout}
          decelerationRate="fast"
          initialScrollIndex={initialIndexWanted}
          viewabilityConfig={{
            viewPosition: 0.5,
            itemVisiblePercentThreshold: 50,
          }}
          contentContainerStyle={{
            paddingLeft: sidePadding,
            paddingRight: sidePadding,
            paddingTop: 24, // 👈 espacio extra para los labels de mes
          }}
          ItemSeparatorComponent={() => <View style={{ width: SEPARATOR }} />}
          renderItem={renderItem}
          initialNumToRender={50}
          windowSize={10}
          removeClippedSubviews={false}
        />
      </View>
    );
  }