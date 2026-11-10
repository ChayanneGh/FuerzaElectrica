import {fuerzaElectrica} from 'Physics.js';

function comprobaciones(carga1, carga2, distancia){
    const _tolerancia = 1e-5;
    
    const Fuerza = fuerzaElectrica(carga1, carga2, distancia);

    const F_distanciaDoble = fuerzaElectrica(carga1, carga2, distancia * 2);
    const CumpleCuartaParte = Math.abs(F_distanciaDoble.Magnitud - (Fuerza.Magnitud / 4)) < _tolerancia;
    
    const F_cargaDoble = fuerzaElectrica(carga1 * 2, carga2, distancia);
    const cumpleDobleFuerza = Math.abs(F_cargaDoble.Magnitud - (Fuerza.Magnitud * 2)) < _tolerancia;

    // Falta comprobar si el signo de una carga puede invertir el sentido de la fuerza
    // Fala comprobar si la fuerza es la misma para ambas cargas, spoiler, si loes por el principio de Accion/Reaccion
}