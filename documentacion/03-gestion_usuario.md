# Documentación del Código: Módulo - Gestión de Usuarios

## Descripción General

Este módulo se encarga de todas las operaciones relacionadas con los usuarios de la biblioteca, como registrar nuevos usuarios, mostrarlos, buscarlos por email y eliminarlos. Utiliza funciones auxiliares para una mejor organización y maneja la generación de IDs únicos para nuevos registros.

---

## Requisitos Previos

Este módulo requiere los siguientes módulos locales y externos:
*   `./00-funciones_auxiliares.js` para funciones de visualización.
*   `./01-lista_usuarios.js` para la lista inicial de usuarios.
*   `prompt-sync` para la función `solicitarEmailExistente`.

## Funcionamiento del Código

El módulo define y exporta varias funciones de gestión de usuarios:

### 1️⃣ Función `generarNuevoIdUsuario()`

*   **Propósito**: Crear un ID único y secuencial para un nuevo usuario.
*   **Lógica**:
    1.  Si el array `usuarios` está vacío, devuelve `1`.
    2.  Si hay usuarios, extrae todos los IDs existentes a un nuevo array usando `map()`.
    3.  Utiliza `Math.max(...ids)` para encontrar el ID más alto actual y le suma 1 para obtener el nuevo ID.
*   **Retorno**: Un número que representa el nuevo ID único.

### 2️⃣ Función `registrarUsuario(nombre, email)`

*   **Propósito**: Añadir un nuevo usuario al sistema.
*   **Parámetros**:
    *   `nombre` (string): El nombre del nuevo usuario.
    *   `email` (string): El email del nuevo usuario.
*   **Lógica**:
    1.  Llama a `generarNuevoIdUsuario()` para obtener un ID único.
    2.  Crea un nuevo objeto `usuario` con el ID generado, el nombre, el email y una propiedad `librosPrestados` inicializada como un array vacío `[]`.
    3.  Agrega el `nuevoUsuario` al array global `usuarios` usando `push()`.
    4.  Muestra los detalles del usuario recién creado en formato de tabla.
*   **Retorno**: `true` para indicar que la operación fue exitosa.

### 3️⃣ Función `mostrarTodosLosUsuarios(arrayDeLibros)`

*   **Propósito**: Visualizar la lista completa de usuarios registrados.
*   **Parámetros**:
    *   `arrayDeLibros`: El array completo de libros, necesario para la función de formateo que resuelve los títulos de los libros prestados.
*   **Lógica**:
    1.  Imprime un encabezado.
    2.  Llama a la función auxiliar `impresionTablaUsuario` para formatear y mostrar todos los usuarios en una tabla.
*   **Retorno**: `true`.

### 4️⃣ Función `buscarUsuario(email)`

*   **Propósito**: Encontrar un usuario específico a partir de su dirección de email.
*   **Parámetros**:
    *   `email` (string): El email a buscar.
*   **Lógica**:
    1.  Utiliza `Array.find()` para buscar un usuario cuyo email coincida con el proporcionado.
    2.  La comparación se hace en minúsculas (`.toLowerCase()`) para que sea insensible a mayúsculas/minúsculas.
*   **Retorno**: El objeto `usuario` si se encuentra, o `undefined` si no.

### 5️⃣ Función `solicitarEmailExistente(prompt)`

*   **Propósito**: Interactuar con el usuario para obtener un email que ya esté registrado en el sistema.
*   **Parámetros**:
    *   `prompt`: La instancia de `prompt-sync` para solicitar la entrada.
*   **Lógica**:
    1.  Entra en un ciclo `while` que solicita un email.
    2.  Llama a `buscarUsuario` para verificar si el email existe.
    3.  Si no existe, muestra un error y vuelve a pedir el email. El usuario puede escribir "salir" para cancelar.
    4.  El ciclo se rompe solo cuando se encuentra un usuario o el usuario cancela.
*   **Retorno**: El objeto `usuario` encontrado, o `null` si el usuario canceló la operación.

### 6️⃣ Función `borrarUsuario(nombre, email)`

*   **Propósito**: Eliminar un usuario del sistema.
*   **Parámetros**:
    *   `nombre` (string): El nombre del usuario a borrar.
    *   `email` (string): El email del usuario a borrar.
*   **Lógica**:
    1.  Utiliza `findIndex` para localizar el índice del usuario que coincida tanto en nombre como en email.
    2.  Para la comparación del nombre, utiliza una función auxiliar `normalizarTexto` para ignorar acentos y mayúsculas, haciendo la búsqueda más robusta.
    3.  Si no se encuentra el usuario (`index === -1`), muestra un error.
    4.  Si se encuentra, utiliza `splice(index, 1)` para eliminar el usuario del array `usuarios` y muestra un mensaje de éxito con los datos del usuario borrado.
*   **Retorno**: `true` si el borrado fue exitoso, `false` si no.

### 7️⃣ Funciones Auxiliares Internas (`normalizarTexto`, `esEmailValido`)

*   **Propósito**: Proporcionar lógica de validación y normalización.
*   **Detalle**:
    *   `normalizarTexto`: Convierte un texto a minúsculas y elimina los acentos.
    *   `esEmailValido`: Realiza una validación simple del formato del email.

---

## Salida Esperada por Consola

#### Ejemplo de uso de `mostrarTodosLosUsuarios`:
```bash
✨ === USUARIOS DE LA BIBLIOTECA === ✨
┌─────────┬─────┬───────────────────┬─────────────────────────────┬─────────────────────────────────────────────────┐
│ (index) │ ID  │      Nombre       │            Email            │                 LibrosPrestados                 │
├─────────┼─────┼───────────────────┼─────────────────────────────┼─────────────────────────────────────────────────┤
│    0    │ 101 │   'Ana García'    │  'ana.garcia@example.com'   │ '3: 1984 - 10: Crónica de una muerte anunciada' │
│    1    │ 102 │ 'Carlos Martinez' │    'carlos.m@example.com'     │           '6: Matar a un ruiseñor'            │
│    2    │ 103 │ 'Lucía Rodríguez' │ 'lucia.rodriguez@email.net' │                   'Ninguno'                   │
│    3    │ 104 │ 'Javier Fernández'│  'j.fernandez@workplace.com'  │ '1: Cien años de soledad - 4: El Señor de l…' │
│    4    │ 105 │   'Sofía López'   │   'sofialopez@email.org'    │ '8: Orgullo y prejuicio - 11: La sombra del…' │
└─────────┴─────┴───────────────────┴─────────────────────────────┴─────────────────────────────────────────────────┘
```

#### Ejemplo de uso de `borrarUsuario`:
```bash
=========================================
✅✅ Usuario borrado correctamente:✅✅
┌─────────┬─────┬─────────────────┬──────────────────────────┬─────────────────┐
│ (index) │ ID  │     Nombre      │          Email           │ LibrosPrestados │
├─────────┼─────┼─────────────────┼──────────────────────────┼─────────────────┤
│    0    │ 102 │ 'Carlos Martinez' │ 'carlos.m@example.com' │     'Array'     │
└─────────┴─────┴─────────────────┴──────────────────────────┴─────────────────┘
=========================================
```

---

🏁 **Resumen**

Este módulo encapsula toda la funcionalidad relacionada con la gestión de usuarios. Proporciona una interfaz clara para interactuar con la lista de usuarios, desde el registro hasta la eliminación, con funciones de búsqueda y validación que aseguran la consistencia de los datos.