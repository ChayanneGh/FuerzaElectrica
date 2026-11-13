import { SimuladorCoulomb } from './Physics.js'; // O la forma en que importes tu clase/función física

export class CoulombService {
    constructor() {
        this.tolerancia = 1e-5;
    }

    /**
     * Comprueba que duplicar la distancia reduce la magnitud de la fuerza a la cuarta parte.
     */
    verificarCuartaParteDistancia(carga1, carga2, distancia) {
        const simulador = new SimuladorCoulomb();
        const fuerzaBase = simulador.calcular(carga1, carga2, distancia);
        const fDistanciaDoble = simulador.calcular(carga1, carga2, distancia * 2);
        
        const cumple = Math.abs(fDistanciaDoble.Magnitud - (fuerzaBase.Magnitud / 4)) < this.tolerancia;

        return {
            fuerzaBase,
            fuerzaCalculada: fDistanciaDoble,
            cumple
        };
    }

    /**
     * Comprueba que duplicar la magnitud de una carga duplica la fuerza.
     */
    verificarDobleCarga(carga1, carga2, distancia) {
        const simulador = new SimuladorCoulomb();
        const fuerzaBase = simulador.calcular(carga1, carga2, distancia);
        const fCargaDoble = simulador.calcular(carga1 * 2, carga2, distancia);
        
        const cumple = Math.abs(fCargaDoble.Magnitud - (fuerzaBase.Magnitud * 2)) < this.tolerancia;

        return {
            fuerzaBase,
            fuerzaCalculada: fCargaDoble,
            cumple
        };
    }

    /**
     * Comprueba que cambiar el signo de una carga invierte el tipo (atracción/repulsión) conservando la magnitud.
     */
    verificarInversionSigno(carga1, carga2, distancia) {
        const simulador = new SimuladorCoulomb();
        const fuerzaBase = simulador.calcular(carga1, carga2, distancia);
        const fOtroSigno = simulador.calcular(carga1 * -1, carga2, distancia);
        
        const mismaMagnitud = Math.abs(fOtroSigno.Magnitud - fuerzaBase.Magnitud) < this.tolerancia;
        const cambiaTipo = fOtroSigno.Tipo !== fuerzaBase.Tipo;
        const cumple = mismaMagnitud && cambiaTipo;

        return {
            fuerzaBase,
            fuerzaCalculada: fOtroSigno,
            cumple
        };
    }

    /**
     * Comprueba que la fuerza es la misma para ambas cargas (Principio de Acción y Reacción).
     */
    verificarAccionReaccion(carga1, carga2, distancia) {
        const simulador = new SimuladorCoulomb();
        const fuerzaBase = simulador.calcular(carga1, carga2, distancia);
        const fMismaFuerza = simulador.calcular(carga2, carga1, distancia);
        
        const mismaMagnitud = Math.abs(fMismaFuerza.Magnitud - fuerzaBase.Magnitud) < this.tolerancia;
        const mismoTipo = fMismaFuerza.Tipo === fuerzaBase.Tipo;
        const mismoFormato = fMismaFuerza.Formato === fuerzaBase.Formato;
        const cumple = mismaMagnitud && mismoTipo && mismoFormato;

        return {
            fuerzaBase,
            fuerzaCalculada: fMismaFuerza,
            cumple
        };
    }

    /**
     * Ejecuta todas las comprobaciones juntas (reutilizando los métodos individuales).
     */
    ejecutarTodasLasPruebas(carga1, carga2, distancia) {
        const cuartaParte = this.verificarCuartaParteDistancia(carga1, carga2, distancia);
        const dobleCarga = this.verificarDobleCarga(carga1, carga2, distancia);
        const inversionSigno = this.verificarInversionSigno(carga1, carga2, distancia);
        const accionReaccion = this.verificarAccionReaccion(carga1, carga2, distancia);

        return {
            fuerzaBase: cuartaParte.fuerzaBase,
            resultados: {
                cuartaParteAlDuplicarDistancia: { 
                    F_distanciaDoble: cuartaParte.fuerzaCalculada, 
                    CumpleCuartaParte: cuartaParte.cumple 
                },
                dobleFuerzaAlDuplicarCarga: { 
                    F_cargaDoble: dobleCarga.fuerzaCalculada, 
                    CumpleDobleFuerza: dobleCarga.cumple 
                },
                conservaMagnitudCambiaTipoAlInvertirSigno: { 
                    F_otroSigno: inversionSigno.fuerzaCalculada, 
                    CumpleInvertirFuerza: inversionSigno.cumple 
                },
                igualMagnitudSentidoOpuestoNewton: { 
                    F_mismaFuerza: accionReaccion.fuerzaCalculada, 
                    CumpleAmbasCargas: accionReaccion.cumple 
                }
            }
        };
    }
}