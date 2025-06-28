/* 🖥 PUNTO 9: Interfaz de Usuario por Consola

---------------------------------------------------------
menuPrincipal()
Muestra un menú interactivo con prompt(). 
---------------------------------------------------------*/

const prompt = require("prompt-sync")();
// const prestamos = require('./prestamos.js');

const {
  impresionTablaUsuario,
  impresionTablaLibro,
} = require("./00-funciones_auxiliares.js");

const libros = require("./01-lista_libros.js");
const usuarios = require("./01-lista_usuarios.js")

const {
  agregarLibro,
  buscarLibro,
  ordenarLibros,
  borrarLibro
} = require("./02-gestion_libro.js");

const {
  registrarUsuario,
  mostrarTodosLosUsuarios,
  buscarUsuario,
  solicitarEmailExistente,
  borrarUsuario,
  esEmailValido
} = require("./03-gestion_usuario.js");

const {
  prestarLibro,
  devolverLibro,
  mostrarLibrosDisponibles
} = require("./04-sistema_prestamos.js");

const {
  generarReporteLibros
} = require("./05-reportes.js");

const {
  librosConPalabrasEnTitulo
} = require("./06-identificacion_libro.js");

const {
  calcularEstadisticas
} = require("./07-calculos_estadisticos.js");

const {
  normalizarDatos
} = require("./08-manejo_cadenas.js");

function menuPrincipal() {
  while (true) {
    const entrada = prompt(
      `📚✨ === SISTEMA DE BIBLIOTECA === ✨📚
  
     ✨ === MENU PRINCIPAL === ✨
       - Seleccione una opción -

1️⃣   Agregar libro
2️⃣   Buscar libro
3️⃣   Ordenar libros
4️⃣   Borrar libro
5️⃣   Registrar usuario
6️⃣   Ver todos los usuarios
7️⃣   Buscar usuario
8️⃣   Borrar usuario
9️⃣   Prestar libro
1️⃣ 0️⃣  Devolver libro
1️⃣ 1️⃣  Reporte de libros
1️⃣ 2️⃣  Libros con títulos largos
1️⃣ 3️⃣  Estadísticas
1️⃣ 4️⃣  Normalizar datos
0️⃣   Salir

📥Ingrese una opción: `);

    const opcion = parseInt(entrada);

    if (isNaN(opcion) || opcion < 0 || opcion > 14) {
      console.log("⚠️ Opción inválida. Ingrese un número entre 0 y 14.");
      prompt("⏎ Presione Enter para continuar...");
      continue;
    }

    switch (opcion) {
      case 1:
        agregarLibro(
          parseInt(prompt("🔢 ID del libro: ")),
          prompt("📖 Título: "),
          prompt("✍️ Autor: "),
          parseInt(prompt("📅 Año: ")),
          prompt("🏷️ Género: ")
        );
        break;

      case 2:
        const crit = prompt("🔍 Buscar por: ¿titulo, autor o genero? ");
        const val = prompt("🔎 Ingrese valor a buscar: ");
        console.log(buscarLibro(crit, val));
        break;

      case 3:
        const criterio = prompt("↕️ Ordenar por: titulo o año ");
        ordenarLibros(criterio);
        break;

      case 4:
        borrarLibro(parseInt(prompt("🗑️ ID del libro a borrar: ")));
        break;

      case 5:
        const nombre = prompt("🧑 Nombre: ");
        let email = prompt("📧 Email: ");

        while (!esEmailValido(email)) {
          console.log("❌ Email inválido. Debe tener al menos 8 caracteres antes de '@', un '@' y un '.' después. Ejemplo: xxxxxxxx@xxx.com");
          email = prompt("📧 Ingrese un email válido: ");
        }

        registrarUsuario(nombre, email);
        break;

      case 6:
        mostrarTodosLosUsuarios();
        break;

      case 7:
        const usuario = solicitarEmailExistente(prompt);
        if (usuario) {
          console.log("✅ Usuario encontrado: ", usuario);
        } else {
          console.log("↩️ Operación cancelada.");
        }
        break;

      case 8:
        borrarUsuario(prompt("🧑 Nombre: "), prompt("📧 Email: "));
        break;

      case 9:
        mostrarLibrosDisponibles(libros);
        prestarLibro(
          parseInt(prompt("📘 ID del libro: ")),
          parseInt(prompt("🧑 ID del usuario: "))
        );
        break;

      case 10:
        devolverLibro(
          parseInt(prompt("📘 ID del libro: ")),
          parseInt(prompt("🧑 ID del usuario: "))
        );
        break;

      case 11:
        generarReporteLibros();
        break;

      case 12:
        librosConPalabrasEnTitulo();
        break;

      case 13:
        const estadisticasLibros = calcularEstadisticas(libros);

        console.log("📊 ESTADÍSTICAS DE LA BIBLIOTECA 📊");
        console.log("=====================================");
        console.log(`Año de publicación promedio: ${estadisticasLibros.anioPromedio}`);
        console.log("\n📖 Libro más antiguo:");
        console.table(estadisticasLibros.libroMasAntiguo);
        console.log("\n📖 Libro más nuevo:");
        console.table(estadisticasLibros.libroMasNuevo);
        console.log("\n📖 Diferencia de años entre el libro más antiguo y el más nuevo:");
        console.log(`${estadisticasLibros.diferenciaAnios}`);
        console.log("\n📚 Conteo de libros por año:");
        console.table(estadisticasLibros.anioMasFrecuente);
        break;

      case 14:
        const librosNormalizados = normalizarDatos(libros);
        const usuariosNormalizados = normalizarDatos(usuarios);

        impresionTablaLibro(librosNormalizados);
        impresionTablaUsuario(usuariosNormalizados);
        break;

      case 0:
        console.log("👋 Gracias por usar el sistema. ¡Hasta luego!");
        return; // 🔚 Salir de la función y del programa
    }

    prompt("⏎ Presione Enter para volver al menú...");
  }
}

menuPrincipal();
