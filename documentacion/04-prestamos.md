# Documentación del Código: Módulo - Sistema de Préstamos

## Descripción General

Este módulo maneja la lógica fundamental de una biblioteca: el préstamo y la devolución de libros. Proporciona funciones para actualizar el estado de disponibilidad de un libro y la lista de libros prestados de un usuario.

---

## Requisitos Previos

Este módulo requiere los siguientes módulos locales:
*   `./01-lista_libros.js` y `01-lista_usuarios.js` para acceder a los arrays de datos.
*   `./02-gestion_libro.js` para acceder al array `biblioteca` (que es una copia de la lista de libros).

## Funcionamiento del Código

El módulo define y exporta tres funciones principales:

### 1️⃣ Función `prestarLibro(idLibro, idUsuario)`

*   **Propósito**: Registrar el préstamo de un libro a un usuario.
*   **Parámetros**:
    *   `idLibro` (number): El ID del libro a prestar.
    *   `idUsuario` (number): El ID del usuario que recibe el préstamo.
*   **Lógica**:
    1.  **Búsqueda**: Utiliza `find()` para localizar tanto el objeto `libro` como el objeto `usuario` en sus respectivos arrays basándose en los IDs proporcionados.
    2.  **Validación**: Comprueba tres condiciones simultáneamente:
        *   Que el `libro` haya sido encontrado.
        *   Que el `usuario` haya sido encontrado.
        *   Que la propiedad `disponible` del libro sea `true`.
    3.  **Acción**: Si todas las validaciones son exitosas:
        *   Cambia la propiedad `disponible` del libro a `false`.
        *   Agrega el `idLibro` al array `librosPrestados` del usuario usando `push()`.
        *   Muestra un mensaje de éxito en la consola.
    4.  **Error**: Si alguna validación falla, muestra un mensaje de error.
*   **Retorno**: Devuelve `true` si el préstamo fue exitoso, y `false` en caso contrario.

### 2️⃣ Función `devolverLibro(idLibro, idUsuario)`

*   **Propósito**: Registrar la devolución de un libro por parte de un usuario.
*   **Parámetros**:
    *   `idLibro` (number): El ID del libro que se devuelve.
    *   `idUsuario` (number): El ID del usuario que realiza la devolución.
*   **Lógica**:
    1.  **Búsqueda**: Localiza el `libro` y el `usuario` por sus IDs.
    2.  **Validación**: Comprueba que el `libro` y el `usuario` existan y que la propiedad `disponible` del libro sea `false` (lo que indica que está actualmente prestado).
    3.  **Acción**: Si las validaciones son exitosas:
        *   Cambia la propiedad `disponible` del libro a `true`.
        *   Utiliza `filter()` para crear un nuevo array `librosPrestados` para el usuario que excluye el `idLibro` que se está devolviendo. Esto elimina eficazmente el libro de la lista del usuario.
        *   Muestra un mensaje de éxito en la consola.
    *   **Error**: Si alguna validación falla, muestra un mensaje de error.
*   **Retorno**: Devuelve `true` si la devolución fue exitosa, y `false` en caso contrario.

### 3️⃣ Función `mostrarLibrosDisponibles(biblioteca)`

*   **Propósito**: Obtener una lista de todos los libros que están actualmente disponibles para ser prestados.
*   **Parámetros**:
    *   `biblioteca`: El array completo de libros.
*   **Lógica**:
    1.  Utiliza `Array.filter()` sobre el array `biblioteca`.
    2.  La condición del filtro es `libro => libro.disponible`, que devuelve `true` solo para los libros cuya propiedad `disponible` es `true`.
*   **Retorno**: Un nuevo array que contiene únicamente los objetos de los libros disponibles.

---

## Salida Esperada por Consola

Las funciones `prestarLibro` y `devolverLibro` producen salidas directas a la consola para informar al usuario del resultado de la operación.

#### Ejemplo de uso de `prestarLibro`:
```bash
# Si se presta el libro con ID 4 al usuario con ID 103:
✅ Libro: El Señor de los Anillos prestado a: Lucía Rodríguez.
```
```bash
# Si se intenta prestar un libro no disponible (ID 3):
❌ No se pudo realizar el préstamo del libro. Verifique:
- ID del libro: 3
- ID del usuario: 103
```

#### Ejemplo de uso de `devolverLibro`:
```bash
# Si el usuario 101 devuelve el libro con ID 3:
✅ Libro: 1984 devuelto por: Ana García correctamente.
```

---

🏁 **Resumen**

El módulo de préstamos es crucial ya que conecta la gestión de libros con la gestión de usuarios. Implementa la lógica de negocio que cambia el estado de los datos (la disponibilidad de un libro y los préstamos de un usuario) en respuesta a las acciones clave del sistema.
