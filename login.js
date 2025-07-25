// login.js – Módulo de acceso institucional con Supabase

import { createClient } from "@supabase/supabase-js";

// 🟪 Conexión real al proyecto Wioo
const supabase = createClient(
  "https://sjrmzkomzlqpsfvjdnle.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcm16a29temxxcHNmdmpkbmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDU0NTMsImV4cCI6MjA2ODM4MTQ1M30.lX1F-w3ar2LEunf6OTfHoWkDOGFn4KdFTxEuCm34Wmw"
);

// 🧠 Función principal para iniciar sesión según correo y contraseña exacta
export async function iniciarSesion(correo, contrasena) {
  try {
    const { data, error } = await supabase
      .from("usuarios_institucionales")
      .select("id, rol, activo, contrasena")
      .eq("correo", correo)
      .single();

    if (error) throw new Error("📧 Correo no registrado");
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
document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("botonLogin");
  if (boton) {
    boton.addEventListener("click", async () => {
      const correo = document.getElementById("user").value.toLowerCase();
      const contrasena = document.getElementById("pass").value;

      const exito = await iniciarSesion(correo, contrasena);
      const rol = localStorage.getItem("rol");

      if (!exito) {
        alert("⛔ Credenciales incorrectas");
        return;
      }

      if (rol === "admin") {
        window.location.href = "admin-panel.html";
      } else if (rol === "chofer") {
        window.location.href = "chofer-panel.html";
      } else {
        alert("⚠️ Rol no reconocido. Contacta al equipo técnico.");
      }
    });
  }
});
