import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../utils/supabase";
import BottomNav from "../../components/BottomNav";

function SectionCard({ children, onEdit }) {
  return (
    <View className="relative mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-md">
      {onEdit && (
        <Pressable
          onPress={onEdit}
          className="absolute right-3 top-3 h-10 w-10 items-center justify-center rounded-full active:bg-zinc-100"
          accessibilityLabel="Editar sección"
        >
          <Feather name="edit-3" size={22} color="#111" />
        </Pressable>
      )}
      {children}
    </View>
  );
}

function Field({ label, value }) {
  return (
    <View className="mb-3">
      <Text className="text-lg leading-6 text-zinc-900">
        <Text className="font-semibold">{label}: </Text>
        {value || "—"}
      </Text>
    </View>
  );
}

export default function EditProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace("/auth/login");
        return;
      }
      const userId = session.user.id;
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "full_name, avatar_url, curp, gender, marital, email, medical_id, address:address(street, neighborhood, postal_code, city, state, phone)"
        )
        .eq("id", userId)
        .single();
      if (error) {
        console.error(error);
      } else if (mounted) {
        const addr = data.address || {};
        setProfile({
          name: data.full_name,
          avatar: data.avatar_url,
          curp: data.curp,
          gender: data.gender,
          marital: data.marital,
          email: data.email,
          medicalId: data.medical_id,
          address: {
            street: addr.street,
            neighborhood: addr.neighborhood,
            postalCode: addr.postal_code,
            city: addr.city,
            state: addr.state,
            phone: addr.phone,
          },
        });
      }
      setLoading(false);
    }
    loadProfile();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const user = profile;
  const avatarUri =
    user.avatar ||
    "https://images.unsplash.com/photo-1560972550-aba3456b5564?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const navItems = [
    { key: "profile", label: "Profile", icon: "user", href: "/profile" },
    { key: "todo", label: "To Do", icon: "check-square", href: "/todo" },
    { key: "home", label: "Home", icon: "home", href: "/main" },
    { key: "break", label: "Break", icon: "coffee", href: "/break" },
    { key: "config", label: "Config", icon: "settings", href: "/settings" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          paddingBottom: 120,
        }}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        {/* Header con flecha */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="mr-4 p-2"
            accessibilityLabel="Atrás"
          >
            <Feather name="arrow-left" size={24} color="#111" />
          </Pressable>
          <Text className="text-3xl font-bold tracking-tight text-zinc-900">
            Mi Información
          </Text>
        </View>

        {/* Datos personales */}
        <SectionCard onEdit={() => router.push("/mysettings/editProfile")}>  
          <View className="items-center mb-6">
            <Image
              source={{ uri: avatarUri }}
              className="mb-4 h-48 w-48 rounded-full"
            />
          </View>
          <Field label="Name" value={user.name} />
          <Field label="CURP" value={user.curp} />
          <Field label="Gender" value={user.gender} />
          <Field label="Marital Status" value={user.marital} />
          <Field label="Email Address" value={user.email} />
          <Field label="N° de servicio médico" value={user.medicalId} />
        </SectionCard>

        {/* Dirección */}
        <SectionCard onEdit={() => router.push("/mysettings/editProfile")}>  
          <Field label="Calle y número" value={user.address.street} />
          <Field label="Colonia" value={user.address.neighborhood} />
          <Field label="Código postal" value={user.address.postalCode} />
          <Field label="Municipio" value={user.address.city} />
          <Field label="Estado" value={user.address.state} />
          <Field label="Teléfono" value={user.address.phone} />
        </SectionCard>
      </ScrollView>

      {/* Barra de navegación */}
      <BottomNav items={navItems} />
    </SafeAreaView>
  );
}