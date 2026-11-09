const k = 8.9875e9; // Constante de Coulomb (Nm^2/C^2)

export function calculateForce(q1, q2, r) {

    if (r <= 0) {
        throw new Error("La distancia entre las cargas no puede ser cero ni menor.");
    }

    if (q1 === 0 || q2 === 0) {
        return {
            magnitud: 0,
            tipo: "Nula.",
            formato: "0 N"
        };
    }

    // F = k * |q1 * q2| / r^2
    const fuerza = k * Math.abs(q1 * q2) / (r ** 2);

    const esRepulcion = (q1 > 0 && q2 > 0) || (q1 < 0 && q2 < 0);

    const type = esRepulcion ? "Repulsion." : "Atraccion.";
    
    //trasformamos la fuerza a Notacion Cientifica y agregamos su respectiva unidad
    const direccion = (fuerza >= 1e4 || fuerza <= 1e-4)
            ? fuerza.toExponential(4) + " N." 
            : fuerza.toFixed(4) + " N.";

    return {
        magnitud: fuerza,
        tipo: type,
        formato: direccion
    };
}
