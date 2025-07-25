// 🔧 Navegación institucional Wioo PRO

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

// 👉 Abrir/Cerrar menú lateral
export function toggleSidebar() {
  sidebar.classList.toggle('show');
  overlay.classList.toggle('active');
}

export function closeSidebar() {
  sidebar.classList.remove('show');
  overlay.classList.remove('active');
}

// 👉 Mostrar sección activa
export function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  closeSidebar();
}

// 🔧 Renderizado y botones funcionales para choferes

import {
  traerChoferes,
  registrarChofer,
  editarChofer,
  eliminarChofer
} from "./api.js";

export async function renderChoferes() {
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


    // ✏️ Editar
    fila.querySelector(".editar").addEventListener("click", async () => {
      const nuevoNombre = prompt("Nuevo nombre:", nombre);
      const nuevaRuta = prompt("Nueva ruta:", ruta);
      if (nuevoNombre && nuevaRuta) {
        await editarChofer(codigo, {
          nombre: nuevoNombre,
          ruta: nuevaRuta
        });
        alert("✏️ Chofer editado");
        renderChoferes();
      }
    });

    // 🔒 Inhabilitar / ✅ Activar
    fila.querySelector(".inhabilitar, .activar").addEventListener("click", async () => {
      const nuevoEstado = !chofer.activo;
      await editarChofer(codigo, { activo: nuevoEstado });
      alert(nuevoEstado ? "✅ Chofer activado" : "🔒 Chofer inhabilitado");
      renderChoferes();
    });

    // 🗑️ Eliminar
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

// 🔧 Registro de nuevo chofer real (formulario)

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
    activo: true  // ← Se registra como activo por defecto
  };

  try {
    await registrarChofer(nuevoChofer);
    alert("✅ Chofer registrado exitosamente en el sistema urbano");
    this.reset();
    renderChoferes();
  } catch (error) {
    console.error("Error al registrar chofer:", error);
    alert("⛔ No se pudo registrar. Verifica conexión y permisos.");
  }
});

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://sjrmzkomzlqpsfvjdnle.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcm16a29temxxcHNmdmpkbmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDU0NTMsImV4cCI6MjA2ODM4MTQ1M30.lX1F-w3ar2LEunf6OTfHoWkDOGFn4KdFTxEuCm34Wmw"
);
async function cargarComprobantes(filtro = "") {
  let query = supabase
    .from('pago_manual')
    .select('*')
    .order('fecha', { ascending: false });

  if (filtro) query = query.eq('estado', filtro);

  const { data, error } = await query;
  const tbody = document.getElementById('tabla-comprobantes');
  tbody.innerHTML = "";

  data.forEach(item => {
    // ... render como ya lo tienes
  });
}

  const tbody = document.getElementById('tabla-comprobantes');
  tbody.innerHTML = '';

  data.forEach(item => {
    const tr = document.createElement('tr');

    const estado = item.estado === 'aprobado'
      ? '🟢 Aprobado'
      : '🕒 Pendiente';

    const boton = item.estado === 'aprobado'
      ? '<button disabled style="opacity:0.5;">✔️ Activado</button>'
      : `<button onclick="activarComprobante('${item.id}')">✅ Activar</button>`;

    tr.innerHTML = `
      <td>${item.telefono}</td>
      <td>${item.banco}</td>
      <td>${item.referencia}</td>
      <td>$${item.monto}</td>
      <td>${item.unidad}</td>
      <td>${estado}</td>
      <td>${item.fecha}</td>
      <td>${boton}</td>
    `;

    tbody.appendChild(tr);
  });
}

    function filtrarComprobantes() {
  const estado = document.getElementById("filtro-estado").value;
  cargarComprobantes(estado);
    }

window.activarComprobante = async function(id) {
  await supabase
    .from('pago_manual')
    .update({ estado: 'aprobado' })
    .eq('id', id);

  cargarComprobantes(); // recarga visual
};

cargarComprobantes(); // inicialización

// 🔧 Gráficas institucionales y exportación

import Chart from "https://cdn.jsdelivr.net/npm/chart.js";

// 👉 Método de pago
new Chart(document.getElementById('graficoPagos'), {
  type: 'pie',
  data: {
    labels: ['Pago móvil', 'Transferencia', 'Efectivo'],
    datasets: [{
      data: [92, 60, 62],
      backgroundColor: ['#7344D0', '#FFB347', '#88CC88']
    }]
  },
  options: {
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Métodos de pago' }
    }
  }
});

// 👉 Uso de rutas por día
new Chart(document.getElementById('graficoRutas'), {
  type: 'bar',
  data: {
    labels: ['Ruta 3', 'Ruta 9', 'Ruta 14', 'Ruta 7'],
    datasets: [{
      label: 'Tickets por ruta',
      data: [24, 41, 55, 32],
      backgroundColor: '#7344D0'
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Rutas activas' }
    }
  }
});

// 👉 Actividad por empresa
new Chart(document.getElementById('graficoEmpresas'), {
  type: 'bar',
  data: {
    labels: ['Expresos Occidente', 'Expresos Los Llanos'],
    datasets: [{
      label: 'Validaciones semanales',
      data: [83, 52],
      backgroundColor: '#b87fff'
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Actividad por empresa' }
    }
  }
});

// 🔁 Botones exportación
document.querySelector('button.nav-link[onclick*="descargarPDF"]')?.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Resumen institucional Wioo", 20, 20);
  doc.text("Total tickets: 214", 20, 30);
  doc.text("Tickets usados: 189", 20, 40);
  doc.text("Validaciones: 37", 20, 50);
  doc.save("resumen-wioo.pdf");
});

document.querySelector('button.nav-link[onclick*="descargarCSV"]')?.addEventListener('click', () => {
  const data = [
    ["Empresa", "Tickets", "Choferes", "Activos"],
    ["Expresos Occidente", 122, 14, "Sí"],
    ["Expresos Los Llanos", 92, 11, "Sí"]
  ];
  let csv = data.map(r => r.join(",")).join("\n");
  let blob = new Blob([csv], { type: "text/csv" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "resumen-wioo.csv";
  link.click();
});

document.querySelector('button.nav-link[onclick*="descargarJSON"]')?.addEventListener('click', () => {
  const datos = {
    tickets: 214,
    usados: 189,
    empresas: {
      occidente: { validaciones: 122 },
      llanos: { validaciones: 92 }
    }
  };
  let blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "resumen-wioo.json";
  link.click();
});

import { traerTicketsPorChofer } from "./api.js";

document.getElementById("select-chofer").addEventListener("change", async () => {
  const codigo = document.getElementById("select-chofer").value;
  const resumen = document.getElementById("resumen-chofer");
  const tabla = document.getElementById("tabla-detalle-tickets");
  const total = document.getElementById("total-tickets");

  if (!codigo) {
    resumen.style.display = "none";
    tabla.innerHTML = "";
    return;
  }

  try {
    const tickets = await traerTicketsPorChofer(codigo);
    if (!tickets.length) {
      resumen.style.display = "none";
      tabla.innerHTML = "";
      return;
    }

    total.innerText = tickets.length;
    tabla.innerHTML = "";

    tickets.forEach(t => {
      const fila = `<tr>
        <td>${new Date(t.creado_en).toLocaleDateString()}</td>
        <td>${new Date(t.creado_en).toLocaleTimeString()}</td>
        <td>${t.estado}</td>
      </tr>`;
      tabla.innerHTML += fila;
    });

    resumen.style.display = "block";
  } catch (error) {
    console.error("Error al cargar tickets:", error);
    alert("⛔ No se pudieron cargar los tickets. Verifica conexión.");
  }
});
