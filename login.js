// 🧠 Iniciar sesión institucional
export async function iniciarSesion(correo, contrasena) {
  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena })
    });

    const datos = await res.json();

    if (!res.ok) throw new Error(datos.detail || "Error de autenticación");

    // 💾 Guardar token en sesión
    localStorage.setItem("token", datos.access_token);
    localStorage.setItem("rol", datos.rol);

    console.log("✅ Sesión iniciada como:", datos.rol);
    return true;

  } catch (error) {
    console.error("⛔ Error al iniciar sesión:", error.message);
    return false;
  }
}
