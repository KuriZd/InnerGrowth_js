// services/mockAuth.js

export async function mockSignup({ email, password }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // reglas simples para simular errores
        if (email === "test@fail.com") {
          reject({
            status: 400,
            message: "Este correo ya está registrado",
          });
        } else {
          resolve({
            status: 201,
            user: {
              id: Math.floor(Math.random() * 1000),
              email,
            },
            token: "fake-jwt-token-" + Date.now(),
          });
        }
      }, 1000); // simula latencia
    });
  }
  