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


    *Opinico personal (Chayanne):*
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

