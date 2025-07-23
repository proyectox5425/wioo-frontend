// api.js – WIOO Conexión Urbana 🚍

// ✅ Configuración de URL base del backend
const BASE_URL = "https://api.wioo.com.ve"; // Actualiza esto cuando tengas dominio real

// ✅ Función para validar código QR o manual
export async function validarCodigo(codigo) {
  try {
    const res = await fetch(`${BASE_URL}/validar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error al validar código:", error);
    return { estado: "error", mensaje: "No se pudo validar el código." };
  }
}

// ✅ Enviar comprobante de pago
export async function cargarComprobante(datos) {
  try {
    const res = await fetch(`${BASE_URL}/comprobante`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    return await res.json();
  } catch (error) {
    console.error("Error al enviar comprobante:", error);
    return { estado: "error", mensaje: "Falló el envío del comprobante." };
  }
}

// ✅ Login urbano por rol
export async function login(usuario, contraseña) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contraseña }),
    });
    const resultado = await res.json();
    if (resultado.token) {
      localStorage.setItem("tokenWioo", resultado.token); // Guarda el token institucional
    }
    return resultado;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return { estado: "error", mensaje: "Credenciales inválidas." };
  }
      }

const BASE_URL = "https://tu-backend-wioo.com/api"; // ← reemplaza por tu URL real
const token = localStorage.getItem("tokenWioo") || "";

export async function traerChoferes() {
  const res = await fetch(`${BASE_URL}/choferes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
}

export async function registrarChofer(datos) {
  const res = await fetch(`${BASE_URL}/choferes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(datos)
  });
  return await res.json();
}

export async function editarChofer(id, datos) {
  const res = await fetch(`${BASE_URL}/choferes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(datos)
  });
  return await res.json();
}

export async function eliminarChofer(id) {
  const res = await fetch(`${BASE_URL}/choferes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
    }
