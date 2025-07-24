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
