import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { View, Text, Pressable, FlatList, Dimensions } from "react-native";

const ITEM_WIDTH = 56; // Debe coincidir con w-14 (56px ≃ 56)
const SEPARATOR = 8;   // separación horizontal
const SNAP = ITEM_WIDTH + SEPARATOR;

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

export default function DayCalendar({
  daysBefore = 180,
  daysAfter = 180,
  selectedDate,
  onChange,
  locale = "en",
  events = {},
  eventColorMap = {},
  maxMarkers = 3,
}) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const base = useMemo(() => startOfDay(new Date()), []);

  // Generar lista de días
  const data = useMemo(() => {
    const arr = [];
    for (let i = -daysBefore; i <= daysAfter; i++) {
      const date = addDays(base, i);
      arr.push({ key: formatKey(date), date });
    }
    return arr;
  }, [base, daysBefore, daysAfter]);

  const listRef = useRef(null);

  // Cálculo de padding lateral
  const screenWidth = Dimensions.get("window").width;
  const sidePadding = Math.floor(Math.max(0, (screenWidth - ITEM_WIDTH) / 2));

  // Índice que queremos centrar
  const initialIndex = useMemo(() => {
    const target = selectedDate ? startOfDay(selectedDate) : today;
    const idx = data.findIndex((x) => isSameDay(x.date, target));
    return idx >= 0 ? idx : daysBefore;
  }, [data, selectedDate, today, daysBefore]);

  // Scroll manual al montar
  useEffect(() => {
    if (listRef.current) {
      const offset = initialIndex * SNAP - sidePadding;
      listRef.current.scrollToOffset({ offset, animated: false });
    }
  }, [initialIndex, sidePadding]);

  // Fallback si falla scrollToIndex
  const onScrollToIndexFailed = useCallback(
    ({ index }) => {
      // intentar de nuevo tras pequeño delay
      setTimeout(() => {
        if (listRef.current) {
          const offset = index * SNAP - sidePadding;
          listRef.current.scrollToOffset({ offset, animated: false });
        }
      }, 100);
    },
    [sidePadding]
  );

  const WEEK =
    locale === "es"
      ? ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"]
      : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const getItemLayout = useCallback(
    (_, index) => ({ length: SNAP, offset: SNAP * index, index }),
    []
  );

  const renderMarkers = useCallback(
    (key, isToday, selected) => {
      const dayEvents = events[key] || [];
      if (dayEvents.length === 0) {
        return isToday && !selected ? (
          <View
            className="mt-1 h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "#2563eb" }}
          />
        ) : (
          <View className="mt-1 h-1.5" />
        );
      }
      return (
        <View className="mt-1 flex-row justify-center" style={{ gap: 4 }}>
          {dayEvents.slice(0, maxMarkers).map((ev, i) => {
            const color =
              (eventColorMap[ev.type] || eventColorMap.other) ?? "#6b7280";
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
    },
    [events, eventColorMap, maxMarkers]
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      const d = item.date;
      const selected = selectedDate
        ? isSameDay(d, selectedDate)
        : isSameDay(d, today);
      const isToday = isSameDay(d, today);

      const prev = data[index - 1];
      const monthChanged =
        index === 0 ||
        !prev ||
        prev.date.getMonth() !== d.getMonth() ||
        prev.date.getFullYear() !== d.getFullYear();

      const monthNames =
        locale === "es"
          ? ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"]
          : ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

      return (
        <Pressable
          className="items-center w-14"
          onPress={() => {
            onChange?.(d);
            const offset = index * SNAP - sidePadding;
            listRef.current?.scrollToOffset({
              offset,
              animated: true,
            });
          }}
        >
          {monthChanged && (
            <View className="absolute -top-5 left-0">
              <Text className="text-[10px] font-medium text-zinc-900">
                {monthNames[d.getMonth()]}
              </Text>
            </View>
          )}

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
                selected ? "text-white font-semibold" : "text-blue-800 font-medium"
              }`}
            >
              {d.getDate()}
            </Text>
          </View>

          {renderMarkers(item.key, isToday, selected)}
        </Pressable>
      );
    },
    [WEEK, data, locale, onChange, renderMarkers, selectedDate, sidePadding, today]
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
        viewabilityConfig={{ viewPosition: 0.5, itemVisiblePercentThreshold: 50 }}
        contentContainerStyle={{
          paddingLeft: sidePadding,
          paddingRight: sidePadding,
          paddingTop: 24,
        }}
        ItemSeparatorComponent={() => <View style={{ width: SEPARATOR }} />}
        renderItem={renderItem}
        initialNumToRender={50}
        windowSize={10}
        removeClippedSubviews={false}
        onScrollToIndexFailed={onScrollToIndexFailed}
      />
    </View>
  );
}
