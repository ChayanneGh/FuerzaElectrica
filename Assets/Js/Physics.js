



const k = 8.9875e9; // Constante de Coulomb (Nm^2/C^2)

export function calculateForce(carga1, carga2, distancia) {
    let q1 = parseFloat(carga1);
    let q2 = parseFloat(carga2);
    let r = parseFloat(distancia);

    if (r === 0) {
        throw new Error("La distancia entre las cargas no puede ser cero.");
    }

    if (q1 === 0 || q2 === 0) {
        return {
            magnitud: 0,
            tipo: "ninguna",
            formato: "0 N"
        };
    }

    // F = k * |q1 * q2| / r^2
    const fuerza = k * Math.abs(q1 * q2) / (r ** 2);

    const esRepulcion = (q1 > 0 && q2 > 0) || (q1 < 0 && q2 < 0);

    const type = esRepulcion ? "repulsión" : "atracción";

    const direccion = "me dio flojera seguir" // continuara, chan chan chaaan


    return {
        magnitud: fuerza,
        tipo: type,
        formato: direccion
    };
}

    // physics.js: Módulo puro de JS sin interactuar con el DOM.

    //     Contiene la constante de Coulomb (k = 8.9875 x10^9 Nm^2/C^2).

    //     Funciones para calcular la fuerza F, determinar si es de atracción o repulsión, y formatear la notación científica.