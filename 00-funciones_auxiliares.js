// archivo con funciones que pueden ser reutilizada a lo largo del código
const prompt = require("prompt-sync")();


function solicitarTextoValido(mensaje) {
  let texto = prompt(mensaje);
  while (!texto || texto.trim() === "") {
    console.log("❌ El campo no puede quedar vacío.");
    texto = prompt(mensaje);
  }
  return texto.trim();
}

// crear una función auxiliar para buscar por ID
const encontrado = (array, id) => array.find(elemento => elemento.id === id);

// crear una función para mostrar último elemento -> indicar al usuario cual es el último id
const ultimoElemento = array => array[array.length - 1];

// función para formatear la vista de un solo objeto (anio por año, titulo po título y genero por género)
const transformarLibro = elemento => ({

    ID: elemento.id,
    Título: elemento.titulo,
    Autor: elemento.autor,
    Año: elemento.anio,
    Género: elemento.genero
});

// función que decide que formatear, si un objeto o una lista de objetos

const resultadosParaVistaLibros = datos => {
    if (datos === null) {
        return '=== No hay información para mostrar ===';
    }

    if (Array.isArray(datos)) {
        // si es un array, mapeamos cada elementos y los transformamos con la funcion transformarLibro()
        return datos.map(transformarLibro);
    } else {
        // si es un solo elemento, aplicamos la funcion transformarLibro()
        return transformarLibro(datos);
    }
}

const impresionTablaLibro = elemento => console.table(resultadosParaVistaLibros(elemento));

const transformarUsuario = (elemento, arrayDeLibros) => {

    //caso en el que no hay libros
    if (!elemento.librosPrestados || elemento.librosPrestados.length === 0) {
        return {
            ID: elemento.id,
            Nombre: elemento.nombre,
            Email: elemento.email,
            LibrosPrestados: "Ninguno"
        };
    }

    //mapeo de array de librosPrestados del elemento
    const infoLibro = elemento.librosPrestados.map(id => {

        //buscamos los id coicidentes con los id de la lista de libros
        const libroEncontrado = encontrado(arrayDeLibros, id)

        if (libroEncontrado) {
            return `${libroEncontrado.id}: ${libroEncontrado.titulo}`;
        }

        // Por si un ID de libro prestado no se encuentra
        return `Libro ID ${id} no encontrado`;
    }).join(' - ')  // cada libro ocupa una linea

    //devolvemos objeto libro
    return {
        ID: elemento.id,
        Nombre: elemento.nombre,
        Email: elemento.email,
        LibrosPrestados: infoLibro
    }

};

const resultadosParaVistaUsuarios = (datos, arrayDeLibros) => {

    if (Array.isArray(datos)) {
        // si es un array, mapeamos cada elementos y los transformamos con la funcion transformarUsuario()
        return datos.map(usuario => transformarUsuario(usuario, arrayDeLibros));
    } else {
        // si es un solo elemento, aplicamos la funcion transformarUsuario()
        return transformarUsuario(datos, arrayDeLibros);
    }
}


// imprimir usuarios con formato multi-línea
const impresionUsuariosConDetalle = (datos, arrayDeLibros) => {
    // Obtenemos los datos ya procesados (con los títulos y el .join('\n'))
    const usuariosFormateados = resultadosParaVistaUsuarios(datos, arrayDeLibros);

    if (!usuariosFormateados) return;

    // Usamos forEach para iterar sobre cada usuario formateado
    usuariosFormateados.forEach(usuario => {
        console.log("-----------------------------------------");
        console.log(`  ID:     ${usuario.ID}`);
        console.log(`  Nombre: ${usuario.Nombre}`);
        console.log(`  Email:  ${usuario.Email}`);
        console.log("  Libros Prestados:");
        // Como 'LibrosPrestados' ya tiene los \n, console.log lo mostrará correctamente
        // Usamos una sangría para que se vea mejor
        // El replace(/\n/g, '\n ') reemplaza cada salto de línea con un salto de línea seguido de 4 espacios, para que todos los libros de la lista queden indentados.
        console.log(`    ${usuario.LibrosPrestados.replace(/\n/g, '\n    ')}`);
    });
    console.log("-----------------------------------------");
};

const impresionTablaUsuario = (elemento, arrayDeLibros) => console.table(resultadosParaVistaUsuarios(elemento, arrayDeLibros));

// Este objeto traduce la entrada del usuario a las claves reales del objeto libro
const mapaCriterios = {
    "título": "titulo",
    "titulo": "titulo",
    "autor": "autor",
    "género": "genero",
    "genero": "genero",
    "año": "anio",
    "anio": "anio"
};

function solicitarTextoValido(mensaje) {
  let texto = prompt(mensaje);
  while (!texto || texto.trim() === "") {
    console.log("❌ El campo no puede quedar vacío.");
    texto = prompt(mensaje);
  }
  return texto.trim();
}

//exportación para que puedan emplearse en otros archivos
module.exports = {
    solicitarTextoValido,
    encontrado,
    ultimoElemento,
    resultadosParaVistaLibros,
    impresionTablaLibro,
    resultadosParaVistaUsuarios,
    impresionTablaUsuario,
    impresionUsuariosConDetalle,
    mapaCriterios
};
