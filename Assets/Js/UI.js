import { CoulombPhysics } from "./Physics.js";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formSimulador");
  const error = document.getElementById("errorSimulacion");
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
