import {guardarSimulacionEnBackend} from 'App.js';
//es una mausque herramienta para mas tardeimport {  } from './Physics.js';
// Suponiendo que anime.min.js está cargado globalmente o importado localmente:
// import anime from '../vendor/anime.min.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const inputQ1 = document.getElementById('inputQ1');
    const inputQ2 = document.getElementById('inputQ2');
    const inputDistancia = document.getElementById('inputDistancia');
    const btnSimular = document.getElementById('btnSimular');

    btnSimular.addEventListener('click', () => {
        const q1 = inputQ1.value;
        const q2 = inputQ2.value;
        const r = inputDistancia.value;

        // 1. Instanciamos la física pura
        const fisica = new CoulombPhysics(q1, q2, r);

        // 2. Actualizamos los textos en el HTML
        document.getElementById('txtFuerza').textContent = fisica.FuerzaBase.Formato;
        document.getElementById('txtTipo').textContent = fisica.FuerzaBase.Tipo;
        
        // Actualizamos comprobaciones físicas en la vista
        document.getElementById('chkCuartaParte').textContent = fisica.CumpleCuartaParte ? "Cumple ✓" : "No cumple ✗";

        // 3. Animación con Anime.js según el tipo de interacción
        animarParticulas(fisica.FuerzaBase.Tipo);
    });
});

function animarParticulas(tipoInteraccion) {
    const particula1 = document.getElementById('particula1');
    const particula2 = document.getElementById('particula2');

    if (tipoInteraccion === "Repulsion.") {
        // Si se repelen, se separan el uno del otro
        anime({
            targets: particula1,
            translateX: -30,
            direction: 'alternate',
            loop: 2,
            duration: 600
        });
        anime({
            targets: particula2,
            translateX: 30,
            direction: 'alternate',
            loop: 2,
            duration: 600
        });
    } else if (tipoInteraccion === "Atraccion.") {
        // Si se atraen, se acercan hacia el centro
        anime({
            targets: particula1,
            translateX: 20,
            direction: 'alternate',
            loop: 2,
            duration: 600
        });
        anime({
            targets: particula2,
            translateX: -20,
            direction: 'alternate',
            loop: 2,
            duration: 600
        });
    }
}