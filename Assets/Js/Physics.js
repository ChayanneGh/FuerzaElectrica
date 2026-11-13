export class SimuladorCoulomb {
    constructor(carga1 = 0, carga2 = 0, distancia = 1) {
        this.k = 8.9875e9; // Constante de Coulomb (N·m²/C²)
        this.q1 = parseFloat(carga1);
        this.q2 = parseFloat(carga2);
        this.r = parseFloat(distancia);
    }

    calcular(q1 = this.q1, q2 = this.q2, r = this.r) {
        // Actualizamos las propiedades internas si se pasan nuevos argumentos
        this.q1 = parseFloat(q1);
        this.q2 = parseFloat(q2);
        this.r = parseFloat(r);

        if (this.r <= 0 || isNaN(this.r)) {
            throw new Error("La distancia entre las cargas no puede ser cero ni menor, y debe ser un número válido.");
        }

        if (this.q1 === 0 || this.q2 === 0 || isNaN(this.q1) || isNaN(this.q2)) {
            return {
                Magnitud: 0,
                Tipo: "Nula.",
                Formato: "0 N."
            };
        }

        // F = k * |q1 * q2| / r^2
        const fuerza = this.k * Math.abs(this.q1 * this.q2) / (this.r ** 2);

        const esRepulsion = (this.q1 > 0 && this.q2 > 0) || (this.q1 < 0 && this.q2 < 0);
        const tipo = esRepulsion ? "Repulsion." : "Atraccion.";
        
        // Transformamos la fuerza a Notación Científica o Decimal según su tamaño
        const direccion = (fuerza >= 1e4 || fuerza <= 1e-4)
            ? fuerza.toExponential(4) + " N." 
            : fuerza.toFixed(4) + " N.";

        return {
            Magnitud: fuerza,
            Tipo: tipo,
            Formato: direccion
        };
    }
}