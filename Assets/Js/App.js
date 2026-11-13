import { CoulombPhysics } from './Physics.js';

export async function guardarSimulacionEnBackend(carga1, carga2, distancia) {
    // 1. Instanciamos la física pura
    const simulador = new CoulombPhysics(carga1, carga2, distancia);

    // 2. Preparamos el paquete de datos usando los getters que creamos
    const datosASubir = {
        fuerzaBase: simulador.FuerzaBase,
        comprobaciones: {
            cuartaParte: simulador.CumpleCuartaParte,
            dobleCarga: simulador.CumpleDobleFuerza,
            invertirSigno: simulador.CumpleInvertirFuerza,
            accionReaccion: simulador.CumpleAmbasCargas
        }
    };

    try {
        // 3. Petición asíncrona a tu API en PHP
        const response = await fetch('api/save_simulation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosASubir)
        });

        const resultado = await response.json();
        return resultado;

    } catch (error) {
        console.error("Error al conectar con el backend:", error);
        throw error;
    }
}