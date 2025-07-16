# Documentación del Código: Módulos de Análisis y Procesamiento de Datos

## Descripción General

Este conjunto de módulos (`05-reportes.js`, `06-identificacion_libro.js`, `07-calculos_estadisticos.js`, `08-manejo_cadenas.js`) proporciona funcionalidades avanzadas para el análisis de los datos de la biblioteca. Incluyen la generación de reportes, la identificación de libros por patrones, el cálculo de estadísticas y la normalización de datos.

---

## Requisitos Previos

Estos módulos dependen de los módulos de datos (`01-lista_libros.js`) y de gestión (`02-gestion_libro.js`) para obtener la colección de libros a analizar.

## Funcionamiento del Código

### Módulo 5: Reportes (`generarReporteLibros`)

*   **Propósito**: Crear y mostrar en la consola un reporte resumido del estado de la biblioteca.
*   **Lógica**:
    1.  Calcula el número total de libros (`biblioteca.length`).
    2.  Filtra y cuenta los libros prestados (`!libro.disponible`).
    3.  Utiliza `reduce()` para crear un objeto que cuenta cuántos libros hay de cada género.
    4.  Ordena la tabla de géneros de mayor a menor cantidad.
    5.  Utiliza `reduce()` para encontrar el libro con el año de publicación más antiguo y el más nuevo.
    6.  Imprime toda esta información en un formato claro y estructurado, usando `console.log()` y `console.table()`.

### Módulo 6: Identificación Avanzada de Libros (`librosConPalabrasEnTitulo`)

*   **Propósito**: Encontrar libros cuyos títulos estén compuestos por más de una palabra y contengan solo letras y espacios.
*   **Lógica**:
    1.  Utiliza `filter()` para seleccionar libros que cumplan dos condiciones:
        *   Una expresión regular (`/^[a-zA-Z\s]+$/.test(libro.titulo)`) para asegurar que el título solo contenga letras y espacios.
        *   `libro.titulo.trim().split(" ").length > 1` para asegurar que haya más de una palabra.
    2.  Utiliza `map()` para extraer solo los títulos de los libros filtrados.
*   **Retorno**: Un array de strings, cada uno siendo un título de libro que cumple las condiciones.

### Módulo 7: Cálculos Estadísticos (`calcularEstadisticas`)

*   **Propósito**: Realizar un análisis estadístico detallado sobre los años de publicación de los libros.
*   **Lógica**:
    1.  Utiliza `reduce()` para realizar varias acumulaciones en una sola pasada por el array de libros:
        *   Suma total de los años de publicación.
        *   Conteo de frecuencia de cada año de publicación.
        *   Identificación del libro más antiguo y el más nuevo.
    2.  Calcula el año promedio y lo redondea con `Math.round()`.
    3.  Calcula la diferencia de años entre el libro más nuevo y el más antiguo.
    4.  Formatea la frecuencia de años en un array de objetos para poder ordenarlo y mostrarlo en una tabla.
*   **Retorno**: Un objeto que contiene todas las estadísticas calculadas (año promedio, tabla de frecuencias, libro más antiguo, libro más nuevo y diferencia de años).

### Módulo 8: Manejo de Cadenas (`normalizarDatos`)

*   **Propósito**: Limpiar y estandarizar los datos de un array (que puede contener tanto libros como usuarios).
*   **Lógica**:
    1.  Utiliza `map()` para crear un nuevo array sin modificar el original.
    2.  Para cada elemento, comprueba si tiene las propiedades de un libro o de un usuario.
    3.  **Si es un libro**: Devuelve una copia del objeto libro con el `titulo` en mayúsculas (`toUpperCase()`) y los espacios extra del `autor` eliminados (`trim()`).
    4.  **Si es un usuario**: Devuelve una copia del objeto usuario con el `email` en minúsculas (`toLowerCase()`).
    5.  Si no es ni libro ni usuario, lo devuelve sin cambios.
*   **Retorno**: Un nuevo array con los datos normalizados.

---

## Salida Esperada por Consola

#### Ejemplo de uso de `generarReporteLibros()`:
```bash
📚📋 REPORTE DE LIBROS 📋📚
📘 Cantidad Total de libros: 11
📕 Cantidad de libros Prestados: 3
📗 Cantidad de libros por Género:
┌─────────┬─────────────────────────────┬──────────────────────┐
│ (index) │           Género            │ Cantidad de Libros   │
├─────────┼─────────────────────────────┼──────────────────────┤
│    0    │          'Novela'           │          3           │
│    1    │          'Fantasía'         │          2           │
│    2    │      'Realismo mágico'      │          1           │
│    3    │   'Novela de caballerías'   │          1           │
...
└─────────┴─────────────────────────────┴──────────────────────┘
📙 Libro más Antiguo: Don Quijote de la Mancha , 📅 Año: 1605
📒 Libro más Nuevo: La sombra del viento, 📅 Año: 2001
```

#### Ejemplo de uso de `calcularEstadisticas()` (parte de la salida):
```bash
📊 ESTADÍSTICAS DE LA BIBLIOTECA 📊
=====================================
Año de publicación promedio: 1941

📖 Libro más antiguo:
┌─────────┬────┬───────────────────────────┬──────────────────────┬──────┬─────────────────────────┐
│ (index) │ ID │          Título           │        Autor         │ Año  │         Género          │
├─────────┼────┼───────────────────────────┼──────────────────────┼──────┼─────────────────────────┤
│    0    │ 2  │ 'Don Quijote de la Mancha'│ 'Miguel de Cervantes'│ 1605 │ 'Novela de caballerías' │
└─────────┴────┴───────────────────────────┴──────────────────────┴──────┴─────────────────────────┘
```

---

🏁 **Resumen**

Estos módulos demuestran el poder de los métodos de array de alto orden (`map`, `filter`, `reduce`, `sort`) para realizar análisis de datos complejos de manera concisa y expresiva. Proveen insights valiosos sobre la colección de la biblioteca y herramientas para mantener la calidad de los datos.