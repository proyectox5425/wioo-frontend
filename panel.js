// 🔧 Navegación institucional Wioo PRO
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function toggleSidebar() {
  sidebar.classList.toggle('show');
  overlay.classList.toggle('active');
}

function closeSidebar() {
  sidebar.classList.remove('show');
  overlay.classList.remove('active');
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  closeSidebar();
}

// 🔧 Supabase institucional
const SUPABASE_URL = "https://sjrmzkomzlqpsfvjdnle.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcm16a29temxxcHNmdmpkbmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDU0NTMsImV4cCI6MjA2ODM4MTQ1M30.lX1F-w3ar2LEunf6OTfHoWkDOGFn4KdFTxEuCm34Wmw";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔧 Funciones API institucionales
async function traerChoferes() {
  const { data, error } = await supabase.from("choferes").select("*");
  if (error) throw error;
  return data;
}

async function registrarChofer(chofer) {
  const { error } = await supabase.from("choferes").insert([chofer]);
  if (error) throw error;
}

async function editarChofer(codigo, campos) {
  const { error } = await supabase.from("choferes").update(campos).eq("codigo", codigo);
  if (error) throw error;
}

async function eliminarChofer(codigo) {
  const { error } = await supabase.from("choferes").delete().eq("codigo", codigo);
  if (error) throw error;
}

async function traerTicketsPorChofer(codigoChofer) {
  const { data, error } = await supabase
    .from("tickets_wifi")
    .select("*")
    .eq("codigo_chofer", codigoChofer)
    .order("creado_en", { ascending: false });
  if (error) throw error;
  return data;
}

// 🔧 Renderizado institucional de choferes
async function renderChoferes() {
  try {
    const datos = await traerChoferes();
    const cuerpo = document.querySelector("#choferes-table-body");
    cuerpo.innerHTML = "";

    datos.forEach(c => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${c.nombre}</td>
        <td>${c.codigo}</td>
        <td>${c.ruta}</td>
        <td class="${c.activo ? 'activo' : 'inactivo'}">
          ${c.activo ? '✅ Activo' : '⛔ Inactivo'}
        </td>
        <td>
          <button class="nav-link editar">✏️ Editar</button>
          <button class="nav-link ${c.activo ? 'inhabilitar' : 'activar'}">
            ${c.activo ? '🔒 Inhabilitar' : '✅ Activar'}
          </button>
          <button class="nav-link eliminar">🗑️ Eliminar</button>
        </td>
      `;
      cuerpo.appendChild(fila);
    });

    activarBotonesChoferes(datos);
  } catch (error) {
    console.error("Error al renderizar choferes:", error);
  }
}

function activarBotonesChoferes(listaChoferes) {
  const filas = document.querySelectorAll("#choferes-table-body tr");

  filas.forEach((fila, index) => {
    const chofer = listaChoferes[index];
    const { codigo, nombre, ruta } = chofer;

    fila.querySelector(".editar").addEventListener("click", async () => {
      const nuevoNombre = prompt("Nuevo nombre:", nombre);
      const nuevaRuta = prompt("Nueva ruta:", ruta);
      if (nuevoNombre && nuevaRuta) {
        await editarChofer(codigo, { nombre: nuevoNombre, ruta: nuevaRuta });
        alert("✏️ Chofer editado");
        renderChoferes();
      }
    });

    fila.querySelector(".inhabilitar, .activar").addEventListener("click", async () => {
      const nuevoEstado = !chofer.activo;
      await editarChofer(codigo, { activo: nuevoEstado });
      alert(nuevoEstado ? "✅ Chofer activado" : "🔒 Chofer inhabilitado");
      renderChoferes();
    });

    fila.querySelector(".eliminar").addEventListener("click", async () => {
      const confirmar = confirm("¿Eliminar este chofer definitivamente?");
      if (confirmar) {
        await eliminarChofer(codigo);
        alert("🗑️ Chofer eliminado");
        renderChoferes();
      }
    });
  });
}

// 🔧 Registro desde formulario institucional
document.querySelector('form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const nombre = this.querySelector('input[placeholder*="Luis"]').value.trim();
  const ruta = this.querySelector('input[placeholder*="Ruta"]').value.trim();
  const codigo = this.querySelector('input[placeholder*="CHF"]').value.trim();

  if (!nombre || !ruta || !codigo) {
    alert("⚠️ Todos los campos son obligatorios");
    return;
  }

  const nuevoChofer = {
    codigo: codigo,
    nombre: nombre,
    ruta: ruta,
    activo: true
  };

  try {
    await registrarChofer(nuevoChofer);
    alert("✅ Chofer registrado exitosamente");
    this.reset();
    renderChoferes();
  } catch (error) {
    console.error("Error al registrar chofer:", error);
    alert("⛔ Fallo de registro. Verifica conexión y permisos.");
  }
});

// 🔧 Traer todos los tickets
async function traerTickets() {
  const { data, error } = await supabase
    .from("tickets_wifi")
    .select("*")
    .order("creado_en", { ascending: false });
  if (error) throw error;
  return data;
}

// 🔧 Validar código manual por panel administrativo
async function validarTicketManual() {
  const input = document.querySelector("#codigo-manual");
  const codigoIngresado = input.value.trim();

  if (!codigoIngresado) {
    alert("⚠️ Debes ingresar un código");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("tickets_wifi")
      .select("*")
      .eq("codigo", codigoIngresado)
      .single();

    if (error || !data) {
      alert("⛔ Código no encontrado o inválido");
      return;
    }

    // Activación simulada del WiFi institucional
    const actualizado = await supabase
      .from("tickets_wifi")
      .update({ validado: true, validado_por: "admin" })
      .eq("codigo", codigoIngresado);

    alert("✅ Código validado. WiFi activado institucionalmente.");
    input.value = "";
    renderTickets();
  } catch (error) {
    console.error("Error al validar ticket manual:", error);
    alert("⛔ Fallo en validación manual");
  }
}

// 🔧 Activar WiFi desde QR del chofer
async function activarWifiDesdeChofer(codigoTicket, codigoChofer) {
  try {
    const { data, error } = await supabase
      .from("tickets_wifi")
      .update({ validado: true, validado_por: codigoChofer })
      .eq("codigo", codigoTicket);

    if (error) throw error;

    alert("✅ WiFi activado desde panel del chofer");
    renderTickets();
  } catch (error) {
    console.error("Error activando WiFi desde chofer:", error);
    alert("⛔ Fallo en activación por chofer");
  }
}

// 🔧 Render institucional de tickets comprobantes
async function renderTickets() {
  try {
    const lista = await traerTickets();
    const tabla = document.querySelector("#tickets-table-body");
    tabla.innerHTML = "";

    lista.forEach(ticket => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${ticket.codigo}</td>
        <td>${ticket.codigo_chofer || '🧍‍♂️ Manual'}</td>
        <td>${ticket.validado ? '✅ Validado' : '⛔ Pendiente'}</td>
        <td>${new Date(ticket.creado_en).toLocaleString()}</td>
      `;
      tabla.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al renderizar tickets:", error);
  }
}

// 🔧 Botón institucional de validación manual
document.querySelector("#btn-validar-manual").addEventListener("click", validarTicketManual);

// 🔧 Render inicial al cargar
document.addEventListener("DOMContentLoaded", () => {
  renderChoferes();
  renderTickets();
});
