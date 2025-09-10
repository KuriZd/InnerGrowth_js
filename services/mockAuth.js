// services/mockAuth.js
import AsyncStorage from "@react-native-async-storage/async-storage";

// ---- "BD" en memoria para demo ----
const db = {
  users: [
    // usuario semilla para probar login inmediato
    { id: 1, email: "KuriZd@protonmaIL.com", password: "a" },
  ],
};

const AUTH_KEY = "auth.session"; // { email, token }

// util mini
const delay = (ms = 800) => new Promise((r) => setTimeout(r, ms));
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function mockSignup({ email, password }) {
  await delay();

  if (!emailRegex.test(email)) {
    throw { status: 400, message: "Correo inválido" };
  }
  if (!password || password.length < 8) {
    throw { status: 400, message: "La contraseña debe tener al menos 8 caracteres" };
  }
  const exists = db.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    throw { status: 409, message: "Este correo ya está registrado" };
  }

  const newUser = {
    id: Math.max(...db.users.map((u) => u.id), 0) + 1,
    email,
    password, // en real, se guardaría hasheado
  };
  db.users.push(newUser);

  return {
    status: 201,
    user: { id: newUser.id, email: newUser.email },
    token: "fake-jwt-" + Date.now(),
  };
}

export async function mockLogin({ email, password, remember = false }) {
  await delay();

  if (!email || !password) {
    throw { status: 400, message: "Correo y contraseña son requeridos" };
  }

  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    throw { status: 401, message: "Credenciales inválidas" };
  }

  const token = "fake-jwt-" + Date.now();

  if (remember) {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ email: user.email, token }));
  } else {
    await AsyncStorage.removeItem(AUTH_KEY);
  }

  return {
    status: 200,
    user: { id: user.id, email: user.email },
    token,
  };
}

export async function getCurrentSession() {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null; // { email, token } | null
}

export async function logout() {
  await AsyncStorage.removeItem(AUTH_KEY);
}
