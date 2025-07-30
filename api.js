// api.js – WIOO Conexión Urbana 🚍

const BASE_URL = "https://wioo-backend.onrender.com"; // ✅ URL real del backend Render
const token = localStorage.getItem("tokenWioo") || ""; // 🔒 Token institucional para rutas protegidas

// 🔍 Validar código QR o manual contra Supabase
export async function validarCodigo(codigo) {
  try {
    const res = await fetch(`${BASE_URL}/validar-codigo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo }),
    });

    const texto = await res.text();
    console.log("📡 Respuesta cruda:", texto);

    if (!res.ok) {
      return { estado: "error", mensaje: "Backend no respondió correctamente." };
    }

    return JSON.parse(texto);
  } catch (error) {
    console.error("Error al validar código:", error);
    return { estado: "error", mensaje: "No se pudo validar el código." };
  }
}

// 💳 Enviar comprobante de pago
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

// 🔐 Login urbano por rol
export async function login(usuario, contraseña) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contraseña }),
    });
    const resultado = await res.json();
    if (resultado.token) {
      localStorage.setItem("tokenWioo", resultado.token);
    }
    return resultado;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return { estado: "error", mensaje: "Credenciales inválidas." };
  }
}

// 👥 Traer lista de choferes
export async function traerChoferes() {
  const res = await fetch(`${BASE_URL}/choferes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
}

// 📝 Registrar nuevo chofer
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

// ✏️ Editar chofer existente
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

// 🗑️ Eliminar chofer
export async function eliminarChofer(id) {
  const res = await fetch(`${BASE_URL}/choferes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
}

// 🎫 Traer tickets por chofer
export async function traerTicketsPorChofer(codigo) {
  const res = await fetch(`${BASE_URL}/tickets?codigo_chofer=${codigo}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al traer tickets");
  return await res.json();
      }
