// login.js – Módulo de acceso institucional con Supabase

import { createClient } from "@supabase/supabase-js";

// 🔐 Conexión directa a tu proyecto Supabase
const supabase = createClient("https://TU_PROYECTO.supabase.co", "TU_CLAVE_PUBLICA");

// 🧠 Función principal para iniciar sesión según correo y contraseña exacta
export async function iniciarSesion(correo, contrasena) {
  try {
    const { data, error } = await supabase
      .from("usuarios_institucionales")
      .select("id, rol, activo, contrasena")
      .eq("correo", correo)
      .single();

    if (error) throw new Error("⛔ Correo no registrado");
    if (!data.activo) throw new Error("🚫 Usuario desactivado");

    // Comparación exacta sin hash (modo prototipo)
    if (data.contrasena !== contrasena) throw new Error("🔐 Contraseña incorrecta");

    // 🎯 Token temporal por ID y rol institucional
    localStorage.setItem("token", data.id);
    localStorage.setItem("rol", data.rol);

    console.log("✅ Login exitoso:", data.rol);
    return true;
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error.message);
    return false;
  }
}

// 🚪 Evento que se dispara desde el botón "Ingresar"
window.ingresar = async function () {
  const correo = document.getElementById("user").value.toLowerCase();
  const contrasena = document.getElementById("pass").value;

  const exito = await iniciarSesion(correo, contrasena);
  const rol = localStorage.getItem("rol");

  if (!exito) {
    alert("⛔ Credenciales incorrectas");
    return;
  }

  // 🔁 Redirección por rol institucional
  if (rol === "admin") {
    window.location.href = "admin-panel.html";
  } else if (rol === "chofer") {
    window.location.href = "chofer-panel.html";
  } else {
    alert("⚠️ Rol no reconocido. Contacta al equipo técnico.");
  }
};
