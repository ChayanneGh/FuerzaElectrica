## Ejecutar y verificar

Sirve la raíz con un servidor estático (por ejemplo, `python3 -m http.server 8000`) y abre `http://localhost:8000/Index.html`. Bootstrap CSS 5.3.3 y Anime.js 3.2.2 están incluidos con sus licencias, sin descargas en tiempo de ejecución.

Para las pruebas y el formato usa Node.js 22 o posterior:

```sh
npm ci
npm test
npm run format:check
```

El simulador valida cargas finitas y distancia positiva, muestra las cuatro comprobaciones y permite calcular con el botón o Enter. El guardado sigue pendiente; no se envían simulaciones al backend.

## 👥 Autores

| Autor        | Rol / Descripción |
| :----------- | :---------------- |
| **Chayanne** | #BuenosProgramas  |
| **Yaneyri**  | #BuenosDias       |
| **Dariel**   | #BuenasTardes     |
| **Enmanuel** | #BuenasNoches     |

---

## 💬 Opiniones Personales

### Chayanne

> "Siento que es mejor no complicarse con el guardado local y mejor se crea un diccionario, preferiblemente en JS, para guardar un máximo de 10 cambios. En retrospectiva, solo se guardarían los datos del input + resultado. Este diccionario, al ser estático, se eliminaría al recargar la página, de modo que no ocuparía espacio innecesario."
