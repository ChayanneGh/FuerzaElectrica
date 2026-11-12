import {fuerzaElectrica} from 'Physics.js';

export function comprobaciones(carga1, carga2, distancia){
    const _tolerancia = 1e-5;
    
    const Fuerza = fuerzaElectrica(carga1, carga2, distancia);

// Comprueba que Duplicar la Distancia provoca que la Fuerza Disminulla a una cuarta parte 
    const F_distanciaDoble = fuerzaElectrica(carga1, carga2, distancia * 2);
    const CumpleCuartaParte = Math.abs(F_distanciaDoble.Magnitud - (Fuerza.Magnitud / 4)) < _tolerancia;
    
// Comprueba que Duplicar una Carga puede Duplicar la Fuerza
    const F_cargaDoble = fuerzaElectrica(carga1 * 2, carga2, distancia);
    const CumpleDobleFuerza = Math.abs(F_cargaDoble.Magnitud - (Fuerza.Magnitud * 2)) < _tolerancia;

// Comprueba que Cambiar el Signo de una Carga puede Invertir el Sentido de la Fuerza
    const F_otroSigno = fuerzaElectrica(carga1 * -1, carga2, distancia);
    const CumpleInvertirFuerza = (
        (F_otroSigno.Magnitud === Fuerza.Magnitud) &&
        (F_otroSigno.Tipo != Fuerza.Tipo) );

// Comprueba que la Fuerza es Exactamente la misma para Ambas Cargas
    const F_mismaFuerza = fuerzaElectrica(carga2, carga1, distancia);
    const CumpleAmbasCargas = (
        (F_mismaFuerza.Magnitud === Fuerza.Magnitud) &&
        (F_mismaFuerza.Tipo === Fuerza.Tipo) &&
        (F_mismaFuerza.Formato === Fuerza.Formato)    
    );

    return {
        fuerzaBase: Fuerza,
        resultados: {
            cuartaParteAlDuplicarDistancia: {F_distanciaDoble, CumpleCuartaParte},
            dobleFuerzaAlDuplicarCarga: {F_cargaDoble, CumpleDobleFuerza},
            conservaMagnitudCambiaTipoAlInvertirSigno: {F_otroSigno, CumpleInvertirFuerza},
            igualMagnitudSentidoOpuestoNewton: {F_mismaFuerza, CumpleAmbasCargas}
        }
    };
}