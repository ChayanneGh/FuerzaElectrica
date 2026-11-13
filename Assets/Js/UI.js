import { CoulombPhysics } from "./Physics.js";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formSimulador");
  const error = document.getElementById("errorSimulacion");
  const comprobaciones = [
    ["chkCuartaParte", "CumpleCuartaParte"],
    ["chkDobleCarga", "CumpleDobleFuerza"],
    ["chkInvertirSigno", "CumpleInvertirFuerza"],
    ["chkAccionReaccion", "CumpleAmbasCargas"],
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
      document.getElementById("forceResult").textContent =
        fisica.FuerzaBase.Formato;
      document.getElementById("txtTipo").textContent = fisica.FuerzaBase.Tipo;
      document.getElementById("txtTipoInteraccion").textContent =
        fisica.FuerzaBase.Tipo;
      for (const [id, propiedad] of comprobaciones) {
        const indicador = document.getElementById(id);
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
      for (const [id] of comprobaciones) {
        const indicador = document.getElementById(id);
        indicador.textContent = "Pendiente";
        indicador.className = "badge bg-secondary";
      }
      animarParticulas("Nula.");
    }
  });
});

function animarParticulas(tipo) {
  const particulas = ["particula1", "particula2"].map((id) =>
    document.getElementById(id),
  );
  if (typeof anime !== "function") return;
  anime.remove(particulas);
  for (const particula of particulas)
    particula.style.transform = "translateX(0px)";
  if (tipo === "Nula.") return;
  const desplazamiento = tipo === "Repulsion." ? -30 : 20;
  particulas.forEach((particula, indice) =>
    anime({
      targets: particula,
      translateX: indice === 0 ? desplazamiento : -desplazamiento,
      direction: "alternate",
      loop: 2,
      duration: 600,
    }),
  );
}
