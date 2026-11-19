import { CoulombPhysics } from "./Physics.js";
import { SaveSimulation } from "./Save.js";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formSimulador");
  const error = document.getElementById("errorSimulacion");
  const botonAyuda = document.getElementById("btnAyuda");
  const panelAyuda = document.getElementById("panelAyuda");
  const botonHistorial = document.getElementById("btnHistorial");
  const panelHistorial = document.getElementById("panelHistorial");
  const listaHistorial = document.getElementById("listaHistorial");
  const mensajeHistorialVacio = document.getElementById("mensajeHistorialVacio");
  const comprobaciones = [
    [
      "chkCuartaParte",
      "CumpleCuartaParte",
      "resultadoCuartaParte",
      "F_distanciaDoble",
      "Formato",
    ],
    [
      "chkDobleCarga",
      "CumpleDobleFuerza",
      "resultadoDobleCarga",
      "F_cargaDoble",
      "Formato",
    ],
    [
      "chkInvertirSigno",
      "CumpleInvertirFuerza",
      "resultadoInvertirSigno",
      "F_otroSigno",
      "Tipo",
    ],
    [
      "chkAccionReaccion",
      "CumpleAmbasCargas",
      "resultadoAccionReaccion",
      "F_mismaFuerza",
      "Formato",
    ],
  ];

  botonAyuda.addEventListener("click", () => {
    const mostrarAyuda = panelAyuda.hidden;
    establecerPanel(botonHistorial, panelHistorial, false, "historial");
    establecerPanel(botonAyuda, panelAyuda, mostrarAyuda, "ayuda");
  });

  botonHistorial.addEventListener("click", () => {
    const mostrarHistorial = panelHistorial.hidden;
    establecerPanel(botonAyuda, panelAyuda, false, "ayuda");
    establecerPanel(
      botonHistorial,
      panelHistorial,
      mostrarHistorial,
      "historial",
    );
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    error.hidden = true;
    error.textContent = "";
    try {
      const fisica = new CoulombPhysics(
        document.getElementById("carga1").value,
        document.getElementById("carga2").value,
        document.getElementById("distancia").value,
      );
      agregarAlHistorial(
        new SaveSimulation(
          Number(document.getElementById("carga1").value),
          Number(document.getElementById("carga2").value),
          Number(document.getElementById("distancia").value),
          fisica.FuerzaBase.Magnitud,
        ),
        listaHistorial,
        mensajeHistorialVacio,
      );
      actualizarColoresParticulas(
        Number(document.getElementById("carga1").value),
        Number(document.getElementById("carga2").value),
      );
      document.getElementById("forceResult").textContent =
        fisica.FuerzaBase.Formato;
      document.getElementById("txtTipo").textContent = fisica.FuerzaBase.Tipo;
      document.getElementById("txtTipoInteraccion").textContent =
        fisica.FuerzaBase.Tipo;
      for (const [
        id,
        propiedad,
        resultadoId,
        fuerzaPropiedad,
        resultadoPropiedad,
      ] of comprobaciones) {
        const indicador = document.getElementById(id);
        document.getElementById(resultadoId).textContent =
          fisica[fuerzaPropiedad][resultadoPropiedad];
        const noAplica =
          propiedad === "CumpleInvertirFuerza" &&
          fisica.FuerzaBase.Tipo === "Nula.";
        indicador.textContent = noAplica
          ? "No aplica (carga cero)"
          : fisica[propiedad]
            ? "Cumple ✓"
            : "No cumple ✗";
        indicador.className = `badge ${noAplica ? "bg-secondary" : fisica[propiedad] ? "bg-success" : "bg-danger"}`;
      }
      animarParticulas(fisica.FuerzaBase.Tipo);
    } catch (causa) {
      error.textContent = causa.message;
      error.hidden = false;
      document.getElementById("forceResult").textContent = "—";
      document.getElementById("txtTipo").textContent = "Sin resultado";
      document.getElementById("txtTipoInteraccion").textContent =
        "Revisa los datos ingresados.";
      for (const [id, , resultadoId] of comprobaciones) {
        const indicador = document.getElementById(id);
        indicador.textContent = "Pendiente";
        indicador.className = "badge bg-secondary";
        document.getElementById(resultadoId).textContent = "—";
      }
      actualizarColoresParticulas(0, 0);
      animarParticulas("Nula.");
    }
  });
});

let animacionesActivas = [];
const historialSimulaciones = [];

function establecerPanel(boton, panel, abierto, nombre) {
  panel.hidden = !abierto;
  boton.setAttribute("aria-expanded", String(abierto));
  boton.setAttribute(
    "aria-label",
    `${abierto ? "Ocultar" : "Mostrar"} ${nombre}`,
  );
}

function agregarAlHistorial(simulacion, lista, mensajeVacio) {
  historialSimulaciones.unshift(simulacion);
  if (historialSimulaciones.length > 10) historialSimulaciones.pop();

  mensajeVacio.hidden = historialSimulaciones.length > 0;
  lista.replaceChildren(
    ...historialSimulaciones.map(crearElementoHistorial),
  );
}

function crearElementoHistorial(registro, indice) {
  const elemento = document.createElement("li");
  elemento.className = `list-group-item p-2 ${indice % 2 === 0 ? "bg-white" : "bg-light"}`;

  const tabla = document.createElement("table");
  tabla.className =
    "table table-bordered table-sm mb-0 text-center align-middle history-record";
  tabla.setAttribute("aria-label", "Datos guardados de la simulación");

  const cuerpo = document.createElement("tbody");
  const filaCargas = document.createElement("tr");
  filaCargas.append(
    crearCeldaCarga("q₁", registro.Get_q1(), "history-charge-q1"),
    crearCeldaCarga("q₂", registro.Get_q2(), "history-charge-q2"),
  );
  const filaMedidas = document.createElement("tr");
  filaMedidas.append(
    crearCeldaMedida("Distancia", registro.Get_r(), "m"),
    crearCeldaMedida("Fuerza", registro.Get_F(), "N"),
  );
  cuerpo.append(filaCargas, filaMedidas);
  tabla.append(cuerpo);
  elemento.append(tabla);
  return elemento;
}

function crearCeldaCarga(nombre, carga, claseColor) {
  const celda = document.createElement("td");
  const contenido = document.createElement("div");
  contenido.className =
    "d-flex flex-column justify-content-center align-items-center gap-1";

  const distintivo = document.createElement("span");
  distintivo.className = `history-charge ${claseColor}`;
  distintivo.textContent = nombre;
  distintivo.setAttribute("aria-label", `Carga ${nombre}`);

  const valor = document.createElement("span");
  valor.className = "history-value";
  valor.textContent = `${formatearCientifico(carga)} C`;

  contenido.append(distintivo, valor);
  celda.append(contenido);
  return celda;
}

function crearCeldaMedida(nombre, valor, unidad) {
  const celda = document.createElement("td");
  const etiqueta = document.createElement("span");
  etiqueta.className = "history-label";
  etiqueta.textContent = nombre;

  const resultado = document.createElement("span");
  resultado.className = "history-value fw-semibold";
  resultado.textContent = `${formatearCientifico(valor)} ${unidad}`;

  celda.append(etiqueta, resultado);
  return celda;
}

function formatearCientifico(valor) {
  return valor.toExponential(2);
}

function actualizarColoresParticulas(carga1, carga2) {
  const particulas = ["particula1", "particula2"].map((id) =>
    document.getElementById(id),
  );
  const cargas = [carga1, carga2];
  for (let indice = 0; indice < particulas.length; indice++) {
    const color =
      cargas[indice] > 0
        ? "bg-primary"
        : cargas[indice] < 0
          ? "bg-danger"
          : "bg-secondary";
    particulas[indice].classList.remove(
      "bg-danger",
      "bg-primary",
      "bg-secondary",
    );
    particulas[indice].classList.add(color);
  }
}

function animarParticulas(tipo) {
  for (const animacion of animacionesActivas) animacion.revert();
  animacionesActivas = [];
  const particulas = ["particula1", "particula2"].map((id) =>
    document.getElementById(id),
  );
  for (const particula of particulas)
    particula.style.transform = "translateX(0px)";
  if (tipo === "Nula.") return;
  const desplazamiento = tipo === "Repulsion." ? -30 : 20;
  animacionesActivas = particulas.map((particula, indice) =>
    anime.animate(particula, {
      translateX: [0, indice === 0 ? desplazamiento : -desplazamiento],
      alternate: true,
      loop: 1,
      duration: 600,
    }),
  );
}
