// login.js - acceso institucional con Supabase y evento por DOM

import { createClient } from "@supabase/supabase-js";

// 🔗 Conexión real al proyecto Supabase
const supabase = createClient(
  "https://sirxmzomlazpsfyjdnle.supabase.co",
  "eyJhBGiOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // ← mantené tu clave como la tenés
);

// 🔐 Función principal de validación con trazabilidad urbana
export async function iniciarSesion(correo, contrasena) {
  try {
    const { data, error } = await supabase
      .from("usuarios_institucionales")
      .select("id, rol, activo, contrasena")
      .eq("correo", correo)
      .single();

    if (error) throw new Error("📧 Correo no registrado");
    if (!data.activo) throw new Error("🚫 Usuario desactivado");
    if (data.contrasena != contrasena)
      throw new Error("🔑 Contraseña incorrecta");

    localStorage.setItem("token", data.id);
    localStorage.setItem("rol", data.rol);

    console.log("✅ Login exitoso:", data.rol);
    return true;
  } catch (error) {
    console.error("❌ Error:", error.message);
    return false;
  }
}

// 🔁 Evento institucional cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("botonLogin");
  if (boton) {
    boton.addEventListener("click", async () => {
      const correo = document.getElementById("user")?.value?.toLowerCase();
      const contrasena = document.getElementById("pass")?.value;
// 🟣 Activador institucional oculto: abrir modal
window.abrirLogin = function () {
  document.getElementById("login-title").innerText = "Ingreso institucional";
  document.getElementById("login-modal").style.display = "flex";
};
      if (!correo || !contrasena) {
        alert("Completa los campos por favor.");
        return;
      }
      
      const exito = await iniciarSesion(correo, contrasena);
      const rol = localStorage.getItem("rol");

      if (!exito) {
        alert("🚫 Credenciales incorrectas");
        return;
      }

      if (rol === "admin") {
        window.location.href = "admin-panel.html";
      } else if (rol === "chofer") {
        window.location.href = "chofer-panel.html";
      } else {
        alert("⚠️ Rol no reconocido");
      }
    });
  }

  // 🟣 Activador institucional oculto: abrir modal
  window.abrirLogin = function () {
    document.getElementById("login-title").innerText = "Ingreso institucional";
    document.getElementById("login-modal").style.display = "flex";
  };
});
