export class CoulombPhysics {
    constructor(carga1 = 0, carga2 = 0, distancia = 1) {
        this.k = 8.9875e9; // Constante de Coulomb (Nm2/C2)
        this._carga1 = parseFloat(carga1);
        this._carga2 = parseFloat(carga2);
        this._distancia = parseFloat(distancia);
        this._tolerancia = 1e-5;

        this._calcularEscenarios();
    }

    _calcularEscenarios() {
        if (this._distancia <= 0 || isNaN(this._distancia)) {
            throw new Error("La distancia debe ser mayor a cero y un número válido.");
        }

        // 1. Fuerza Base
        this._fuerzaBase = this._calcularFuerzaPura(this._carga1, this._carga2, this._distancia);

        // 2. Distancia Doble
        this._f_distanciaDoble = this._calcularFuerzaPura(this._carga1, this._carga2, this._distancia * 2);
        this._cumpleCuartaParte = Math.abs(this._f_distanciaDoble.Magnitud - (this._fuerzaBase.Magnitud / 4)) < this._tolerancia;

        // 3. Carga Doble
        this._f_cargaDoble = this._calcularFuerzaPura(this._carga1 * 2, this._carga2, this._distancia);
        this._cumpleDobleFuerza = Math.abs(this._f_cargaDoble.Magnitud - (this._fuerzaBase.Magnitud * 2)) < this._tolerancia;

        // 4. Invertir Signo
        this._f_otroSigno = this._calcularFuerzaPura(this._carga1 * -1, this._carga2, this._distancia);
        const mismaMagnitudSigno = Math.abs(this._f_otroSigno.Magnitud - this._fuerzaBase.Magnitud) < this._tolerancia;
        const cambiaTipoSigno = this._f_otroSigno.Tipo !== this._fuerzaBase.Tipo;
        this._cumpleInvertirFuerza = mismaMagnitudSigno && cambiaTipoSigno;

        // 5. Acción y Reacción (Cargas intercambiadas)
        this._f_mismaFuerza = this._calcularFuerzaPura(this._carga2, this._carga1, this._distancia);
        const mismaMagnitudAccion = Math.abs(this._f_mismaFuerza.Magnitud - this._fuerzaBase.Magnitud) < this._tolerancia;
        const mismoTipoAccion = this._f_mismaFuerza.Tipo === this._fuerzaBase.Tipo;
        const mismoFormatoAccion = this._f_mismaFuerza.Formato === this._fuerzaBase.Formato;
        this._cumpleAmbasCargas = mismaMagnitudAccion && mismoTipoAccion && mismoFormatoAccion;
    }

    _calcularFuerzaPura(q1, q2, r) {
        if (q1 === 0 || q2 === 0 || isNaN(q1) || isNaN(q2)) {
            return { Magnitud: 0, Tipo: "Nula.", Formato: "0 N." };
        }

        const fuerza = this.k * Math.abs(q1 * q2) / (r ** 2);
        const esRepulsion = (q1 > 0 && q2 > 0) || (q1 < 0 && q2 < 0);
        const tipo = esRepulsion ? "Repulsion." : "Atraccion.";
        
        const formato = (fuerza >= 1e4 || fuerza <= 1e-4)
            ? fuerza.toExponential(4) + " N." 
            : fuerza.toFixed(4) + " N.";

        return { Magnitud: fuerza, Tipo: tipo, Formato: formato };
    }

    actualizarValores(carga1, carga2, distancia) {
        this._carga1 = parseFloat(carga1);
        this._carga2 = parseFloat(carga2);
        this._distancia = parseFloat(distancia);
        this._calcularEscenarios();
    }

    // Getters para las fuerzas
    get FuerzaBase() { return this._fuerzaBase; }
    get F_distanciaDoble() { return this._f_distanciaDoble; }
    get F_cargaDoble() { return this._f_cargaDoble; }
    get F_otroSigno() { return this._f_otroSigno; }
    get F_mismaFuerza() { return this._f_mismaFuerza; }

    // Getters para las comprobaciones
    get CumpleCuartaParte() { return this._cumpleCuartaParte; }
    get CumpleDobleFuerza() { return this._cumpleDobleFuerza; }
    get CumpleInvertirFuerza() { return this._cumpleInvertirFuerza; }
    get CumpleAmbasCargas() { return this._cumpleAmbasCargas; }
}