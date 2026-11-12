Autores:

    Chayanne        #Buenos Programas

    Yaneyri         #Buenos Dias

    Dariel          #Buenas Tardes

    Enmanuel        #Buenas Noches


Arquitectura:

simulador-fuerza-electrica/

├── assets/

│....├── css/

│....│....└── styles.css          # Estilos personalizados y ajustes sobre Bootstrap

│....├── js/

│....│....├── physics.js          # Motor de cálculo (Ley de Coulomb)

│....│....├── UI.js               # Eventos, manipulación del DOM y Anime.js

│....│....└── app.js              # Controlador principal (inicialización y puente)

│....└── vendor/                  # CDN o librerías locales (Bootstrap, Anime.js)

├── api/                          # (OPCIONAL: Solo si usas PHP)

│....└── save_simulation.php      # Endpoint para guardar/cargar resultados en DB/JSON

├── index.html                    # Interfaz principal del simulador

└── README.md


Descripción de Componentes

1. Capa de Presentación (HTML + Bootstrap 5 + Anime.js)

    index.html: Estructura dividida en dos columnas principales mediante la grilla de Bootstrap:

        Panel de Control (Izquierda): Inputs numéricos y sliders para controlar las cargas (q1, q2 en microC o C) y la distancia (r en metros o cm). Botón de simular/pausar y selector de signo de carga (+/-).

        Lienzo de Simulación (Derecha): Área visual (<canvas> de HTML5 o contenedores <div> interactivos).

    Anime.js: Maneja las animaciones de la simulación:

        Movimiento o repulsión/atracción de las partículas (flechas de fuerza que se estiran o reducen según la magnitud).

        Pulsaciones visuales en las cargas según su valor.

2. Capa de Lógica y Cálculo (JavaScript Modular)

    physics.js: Módulo puro de JS sin interactuar con el DOM.

        Contiene la constante de Coulomb (k = 8.9875 x10^9 Nm^2/C^2).

        Funciones para calcular la fuerza F, determinar si es de atracción o repulsión, y formatear la notación científica.

    UI.js: Escucha los cambios en los inputs y sliders. Actualiza los valores de la fuerza en tiempo real y desencadena las animaciones de Anime.js sobre los elementos visuales de las cargas y los vectores.

    app.js: Vincula la captura de entradas de UI.js con los cálculos de physics.js y pasa el resultado de vuelta a la UI. Tambien bontiene los Tests Pedidos por por el instructor

3. Capa de Backend Opcional (PHP)
Si agregas PHP, mantén el motor interactivo 100% en el lado del cliente (JS) para garantizar fluidez inmediata sin recargas de página. PHP solo interviene para:

    Guardar un historial de experimentos o casos de prueba mediante solicitudes fetch() de JavaScript hacia api/save_simulation.php.

    Generar o descargar reportes en texto/PDF con los datos de las simulaciones realizadas.


    *Opinico personal (Chayanne):
        siento que es major no complicarse con el cuardado local y mejor se crea diccionario preferiblemente en Js para guardar un maximo de 10 cambios, en retrospectiva solo se guardarian los datos del input + resultado, este diccionario al ser estatico se eliminaria al recargar la recargar la pagina, de modo que no ocuparia espacio innecesario 

Flujo de Datos Visual

[ Usuario ajusta sliders/inputs ]

................│

................▼

........[ UI.js captura cambios ]

................│

................▼

....[ physics.js calcula F = k|q1·q2|/r² ]

................│

................├────────────────────────┐

................▼........................▼

[ Actualiza valores en DOM ]   [ Anime.js anima vectores y partículas ]

................│

................▼ (Opcional)

[ PHP API: Guarda registro / Historial ]

<!-- mintlify:inicio -->

## Cálculo de la fuerza eléctrica (Ley de Coulomb)

Esta sección documenta el motor de cálculo de `Physics.js` y las comprobaciones de `App.js`.

### `fuerzaElectrica(q1, q2, r)`

Calcula la fuerza entre dos cargas puntuales con `F = k·|q1·q2| / r²`, donde `k = 8.9875e9 N·m²/C²`.

| Parámetro | Descripción |
| --- | --- |
| `q1` | Carga 1, en coulombs (C). |
| `q2` | Carga 2, en coulombs (C). |
| `r` | Distancia entre las cargas, en metros (m). |

La función espera las cargas en coulombs. Si el valor viene de los inputs en µC, multiplícalo por `1e-6` antes de llamarla.

Devuelve un objeto con tres campos:

| Campo | Valor |
| --- | --- |
| `Magnitud` | Magnitud de la fuerza en newtons (número). |
| `Tipo` | `"Repulsion."` si las cargas tienen el mismo signo, `"Atraccion."` si tienen signos opuestos. |
| `Formato` | La magnitud como texto con 4 decimales y la unidad, por ejemplo `"21.5700 N."`. Si la fuerza es mayor o igual a `1e4` o menor o igual a `1e-4`, usa notación científica, por ejemplo `"8.9875e+9 N."`. |

Casos especiales:

- Si `r` es `0` o negativo, lanza `Error("La distancia entre las cargas no puede ser cero ni menor.")`.
- Si `q1` o `q2` es `0`, devuelve `{ magnitud: 0, tipo: "Nula.", formato: "0 N" }`. Estos campos están en minúscula, a diferencia del caso normal.

Ejemplo:

```js
import { fuerzaElectrica } from './Physics.js';

const resultado = fuerzaElectrica(2e-6, 3e-6, 0.05);
// { Magnitud: 21.57, Tipo: "Repulsion.", Formato: "21.5700 N." }
```

### Comprobaciones: `comprobaciones(carga1, carga2, distancia)`

`App.js` contiene las pruebas pedidas por el instructor. Usa `fuerzaElectrica` y compara los resultados con una tolerancia de `1e-5`:

- **Distancia doble:** al duplicar `distancia`, la fuerza debe ser la cuarta parte (`CumpleCuartaParte`).
- **Carga doble:** al duplicar `carga1`, la fuerza debe ser el doble (`cumpleDobleFuerza`).

Pendientes según los comentarios del código:

- Comprobar que cambiar el signo de una carga invierte el sentido de la fuerza.
- Comprobar que la fuerza es la misma sobre ambas cargas (principio de acción y reacción).

### Estado de la integración con la interfaz

El cálculo todavía no está conectado al botón **Calcular Fuerza** de `Index.html`:

- El botón llama a `calculateForce()`, que aún no está definida.
- `comprobaciones` todavía no devuelve sus resultados ni usa `export`, aunque `UI.js` la importa.
- `UI.js` se carga sin `type="module"`, y los `import` usan rutas como `'Physics.js'` en lugar de `'./Physics.js'`. El navegador necesita ambas cosas para cargar los módulos.

### Ícono del sitio

La pestaña del navegador usa `Assets/Icon/KirbElectronHead.ico` como ícono.

<!-- mintlify:fin -->

