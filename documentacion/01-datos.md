# Documentación del Código: Módulos de Datos (Libros y Usuarios)

## Descripción General

Estos archivos (`01-lista_libros.js` y `01-lista_usuarios.js`) actúan como la "base de datos" de la aplicación. Su única responsabilidad es definir y exportar los arrays de datos iniciales con los que operará el sistema: una lista de libros y una lista de usuarios.

---

## Requisitos Previos

Estos archivos no tienen dependencias y utilizan la sintaxis básica de JavaScript para definir arrays de objetos.

## Funcionamiento del Código

### Archivo: `01-lista_libros.js`

1️⃣ **Definición del Array `libros`**

```js
const libros = [
    {
        id: 1,
        titulo: "Cien años de soledad",
        autor: "Gabriel García Márquez",
        anio: 1967,
        genero: "Realismo mágico",
        disponible: true
    },
    // ... más objetos libro
];
```

*   **Propósito**: Definir la colección inicial de libros de la biblioteca.
*   **Detalle**:
    *   `const libros = [...]`: Se declara un array constante llamado `libros`.
    *   Cada elemento del array es un objeto que representa un libro y contiene las siguientes propiedades:
        *   `id` (number): Un identificador único para el libro.
        *   `titulo` (string): El título del libro.
        *   `autor` (string): El autor del libro.
        *   `anio` (number): El año de publicación.
        *   `genero` (string): El género literario del libro.
        *   `disponible` (boolean): Un indicador de si el libro está disponible (`true`) o prestado (`false`).

2️⃣ **Exportación del Módulo**

```js
module.exports = libros;
```

*   **Propósito**: Hacer que el array `libros` esté disponible para otros módulos que necesiten acceder a la lista de libros.

### Archivo: `01-lista_usuarios.js`

1️⃣ **Definición del Array `usuarios`**

```js
const usuarios = [
    {
        id: 101,
        nombre: "Ana García",
        email: "ana.garcia@example.com",
        librosPrestados: [3, 10]
    },
    // ... más objetos usuario
];
```

*   **Propósito**: Definir la lista inicial de usuarios registrados en la biblioteca.
*   **Detalle**:
    *   `const usuarios = [...]`: Se declara un array constante llamado `usuarios`.
    *   Cada elemento del array es un objeto que representa un usuario y contiene las siguientes propiedades:
        *   `id` (number): Un identificador único para el usuario.
        *   `nombre` (string): El nombre completo del usuario.
        *   `email` (string): El correo electrónico del usuario.
        *   `librosPrestados` (array de numbers): Un array que contiene los `id` de los libros que el usuario tiene actualmente prestados.

2️⃣ **Exportación del Módulo**

```js
module.exports = usuarios;
```

*   **Propósito**: Hacer que el array `usuarios` esté disponible para otros módulos que necesiten acceder a la lista de usuarios.

---

## Salida Esperada por Consola
Estos archivos no producen una salida directa a la consola. Su función es únicamente definir y exportar los datos.

---

🏁 **Resumen**

Estos archivos de datos son fundamentales para la aplicación, ya que proporcionan el estado inicial sobre el cual operan todas las funciones de gestión, préstamo y reporte. Separar los datos de la lógica (las funciones que los manipulan) es una práctica de diseño de software sólida.