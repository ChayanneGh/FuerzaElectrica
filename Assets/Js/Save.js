export class SaveSimulation {
  constructor(carga1 = 0, carga2 = 0, distancia = 1, fuerza = 0) {
    this.k = 8.9875e9; // Constante de Coulomb (Nm2/C2)
    this._carga1 = this._leerNumero(carga1);
    this._carga2 = this._leerNumero(carga2);
    this._distancia = this._leerNumero(distancia);
    this._fuerza = this._leerNumero(fuerza);
  }

  _leerNumero(valor) {
    if (
      (typeof valor !== "number" && typeof valor !== "string") ||
      String(valor).trim() === ""
    ) {
      throw new Error("Los valores de la simulación deben ser números válidos.");
    }
    const numero = Number(valor);
    if (!Number.isFinite(numero)) {
      throw new Error("Los valores de la simulación deben ser números finitos.");
    }
    return numero;
  }

  Get_q1() {
    return this._carga1;
  }
  Get_q2() {
    return this._carga2;
  }
  Get_r() {
    return this._distancia;
  }
  Get_F() {
    return this._fuerza;
  }
}
