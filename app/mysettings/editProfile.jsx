import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  SafeAreaView,
  Modal,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/* ---------------- Select ligero con Modal ---------------- */
function Select({ label, value, placeholder = "Select…", items = [], onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-2 text-sm font-medium text-zinc-700">{label}</Text>
      )}
      <Pressable
        className="h-12 flex-row items-center justify-between rounded-xl border border-zinc-300 bg-white px-3"
        onPress={() => setOpen(true)}
      >
        <Text className={`text-base ${value ? "text-zinc-900" : "text-zinc-400"}`}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={18} color="#71717A" />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable className="flex-1 bg-black/30" onPress={() => setOpen(false)} />
        <View className="absolute left-4 right-4 top-1/4 rounded-2xl bg-white p-3 shadow-lg">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-zinc-800">
              {label || "Select"}
            </Text>
            <Pressable className="p-2 -mr-2" onPress={() => setOpen(false)}>
              <Feather name="x" size={20} color="#111" />
            </Pressable>
          </View>
          <FlatList
            data={items}
            keyExtractor={(it, idx) => String(it?.value ?? it ?? idx)}
            ItemSeparatorComponent={() => <View className="h-px bg-zinc-200" />}
            style={{ maxHeight: 320 }}
            renderItem={({ item }) => {
              const shown = item?.label ?? String(item);
              const val = item?.value ?? item;
              const selected = value === val;
              return (
                <Pressable
                  className="px-3 py-3 active:bg-zinc-50"
                  onPress={() => {
                    onChange?.(val);
                    setOpen(false);
                  }}
                >
                  <Text
                    className={`text-base ${
                      selected ? "font-semibold text-blue-600" : "text-zinc-900"
                    }`}
                  >
                    {shown}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- Input reutilizable ---------------- */
function Field({ label, placeholder, value, onChangeText, keyboardType = "default" }) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-2 text-sm font-medium text-zinc-700">{label}</Text>
      )}
      <TextInput
        className="h-12 rounded-xl border border-zinc-300 bg-white px-3 text-base text-zinc-900"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
}

/* ---------------- Pantalla ---------------- */
export default function ProfileEditScreen() {
  const router = useRouter();

  const [avatarUri, setAvatarUri] = useState(
    "https://images.unsplash.com/photo-1560972550-aba3456b5564?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0"
  );

  // Estados del formulario
  const [fullname, setFullname] = useState("");
  const [curp, setCurp] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [colonia, setColonia] = useState("");
  const [zip, setZip] = useState("");
  const [town, setTown] = useState("");
  const [township, setTownship] = useState("");
  const [phone, setPhone] = useState("");
  const [stature, setStature] = useState("");
  const [weight, setWeight] = useState("");

  // Fecha de nacimiento
  const now = new Date();
  const years = useMemo(() => {
    const arr = [];
    for (let y = now.getFullYear(); y >= now.getFullYear() - 100; y--) {
      arr.push({ label: String(y), value: String(y) });
    }
    return arr;
  }, []);
  const months = useMemo(
    () =>
      ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(
        (m, i) => ({ label: m, value: String(i + 1).padStart(2, "0") })
      ),
    []
  );
  const days = useMemo(
    () =>
      Array.from({ length: 31 }, (_, i) => ({
        label: String(i + 1),
        value: String(i + 1).padStart(2, "0"),
      })),
    []
  );
  const [dDay, setDDay] = useState("");
  const [dMonth, setDMonth] = useState("");
  const [dYear, setDYear] = useState("");

  const maritalOptions = [
    { label: "Soltero(a)", value: "single" },
    { label: "Casado(a)", value: "married" },
    { label: "Divorciado(a)", value: "divorced" },
    { label: "Viudo(a)", value: "widowed" },
    { label: "Unión libre", value: "cohabiting" },
  ];
  const [marital, setMarital] = useState("");

  function onSave() {
    const payload = {
      fullname,
      curp,
      email,
      street,
      colonia,
      zip,
      town,
      township,
      phone,
      stature,
      weight,
      marital,
      birthdate:
        dYear && dMonth && dDay ? `${dYear}-${dMonth}-${dDay}` : null,
    };
    console.log("SAVE:", payload);
    // aquí harías el POST a tu API...
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 16,
          paddingBottom: 140,
        }}
      >
        {/* Header con flecha de back */}
        <View className="mb-4 flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="p-2 mr-2 rounded-full active:bg-zinc-100"
            accessibilityLabel="Volver"
          >
            <Feather name="arrow-left" size={24} color="#111" />
          </Pressable>
          <Text className="text-3xl font-bold tracking-tight text-zinc-900">
            Mi Information
          </Text>
        </View>

        {/* Avatar */}
        <View className="items-center mb-6">
          <Image
            source={{ uri: avatarUri }}
            onError={() =>
              setAvatarUri(
                "https://images.unsplash.com/photo-1560972550-aba3456b5564?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              )
            }
            className="h-36 w-36 rounded-full"
          />
        </View>

        {/* Campos del formulario */}
        <Field
          label="Fullname"
          placeholder="Nombre completo"
          value={fullname}
          onChangeText={setFullname}
        />
        <Field
          label="CURP"
          placeholder="LOVA031223MMNMRLA1"
          value={curp}
          onChangeText={setCurp}
        />

        {/* Fecha de nacimiento */}
        <Text className="mb-2 text-sm font-medium text-zinc-700">Date</Text>
        <View className="mb-4 flex-row items-center gap-3">
          <View className="flex-1">
            <Select value={dDay} items={days} onChange={setDDay} placeholder="DD" />
          </View>
          <View className="flex-[1.2]">
            <Select
              value={dMonth}
              items={months}
              onChange={setDMonth}
              placeholder="MM"
            />
          </View>
          <View className="flex-[1.1]">
            <Select value={dYear} items={years} onChange={setDYear} placeholder="YYYY" />
          </View>
        </View>

        <Select
          label="Marital Status"
          value={marital}
          items={maritalOptions}
          onChange={setMarital}
          placeholder="Selecciona estado civil"
        />

        <Field
          label="Email Address"
          placeholder="correo@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Field
          label="Calle y Numero"
          placeholder="Paseo del Ebano No.282"
          value={street}
          onChangeText={setStreet}
        />

        <Field
          label="Colonia"
          placeholder="Prados Verdes"
          value={colonia}
          onChangeText={setColonia}
        />
        <Field
          label="Zip Code"
          placeholder="58110"
          value={zip}
          onChangeText={setZip}
          keyboardType="number-pad"
        />
        <Field label="Town" placeholder="Morelia" value={town} onChangeText={setTown} />
        <Field
          label="Township"
          placeholder="Morelia"
          value={township}
          onChangeText={setTownship}
        />
        <Field
          label="Phone number"
          placeholder="443 422 7564"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Estatura y Peso en fila */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Field
              label="Stature"
              placeholder="170 (cm)"
              value={stature}
              onChangeText={setStature}
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1">
            <Field
              label="Weight"
              placeholder="70 (kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Pressable
          className="mt-2 h-12 items-center justify-center rounded-xl bg-[#1677C3] active:bg-[#0D66AE] shadow"
          onPress={onSave}
        >
          <Text className="text-base font-semibold text-white">SAVE</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
