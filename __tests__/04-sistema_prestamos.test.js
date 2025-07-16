// Importamos las funciones que vamos a probar
const {
    prestarLibro,
    devolverLibro,
    mostrarLibrosDisponibles
} = require('../04-sistema_prestamos.js'); 

// Importamos los arrays de estado para poder controlarlos
const { biblioteca } = require("../02-gestion_libro.js");
const usuarios = require("../01-lista_usuarios.js");

// --- Mock de Datos Inicial ---
// Definimos un estado inicial consistente para todos los tests
const librosOriginales = [
    { id: 1, titulo: 'El Aleph', disponible: true },
    { id: 2, titulo: '1984', disponible: true },
    { id: 3, titulo: 'Duna', disponible: false }, // Este libro ya está prestado
];

const usuariosOriginales = [
    { id: 10, nombre: 'Ana García', librosPrestados: [3] }, // Ana ya tiene "Duna"
    { id: 20, nombre: 'Beto Pérez', librosPrestados: [] },
];

// ==========================================================================================
// === Configuración del Entorno de Test                                                  ===
// ==========================================================================================

beforeEach(() => {
    // Reseteamos los arrays a su estado original antes de cada test
    // Esto es vital para que un préstamo en un test no afecte al siguiente
    biblioteca.length = 0;
    usuarios.length = 0;
    biblioteca.push(...JSON.parse(JSON.stringify(librosOriginales)));
    usuarios.push(...JSON.parse(JSON.stringify(usuariosOriginales)));

    // Espiamos console.log para mantener la salida del test limpia
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
    jest.restoreAllMocks();
});

// ==========================================================================================
// === Tests para prestarLibro                                                          ===
// ==========================================================================================

describe('prestarLibro', () => {
    
    test('debe prestar un libro disponible a un usuario válido y devolver true', () => {
        const idLibro = 1; // "El Aleph", disponible
        const idUsuario = 20; // "Beto Pérez", sin libros

        const resultado = prestarLibro(idLibro, idUsuario);

        // Verificamos el valor de retorno
        expect(resultado).toBe(true);

        // Verificamos los efectos secundarios (el estado de la aplicación)
        const libroPrestado = biblioteca.find(l => l.id === idLibro);
        const usuarioPrestamo = usuarios.find(u => u.id === idUsuario);

        expect(libroPrestado.disponible).toBe(false); // El libro ya no está disponible
        expect(usuarioPrestamo.librosPrestados).toContain(idLibro); // El usuario tiene el ID del libro
        expect(usuarioPrestamo.librosPrestados.length).toBe(1);

        // Verificamos el mensaje de éxito en consola
        expect(console.log).toHaveBeenCalledWith('✅ Libro: El Aleph prestado a: Beto Pérez.');
    });

    test('debe devolver false si el libro no está disponible', () => {
        const resultado = prestarLibro(3, 20); // Libro "Duna", no disponible

        expect(resultado).toBe(false);
        // Verificamos que el estado no cambió
        const usuario = usuarios.find(u => u.id === 20);
        expect(usuario.librosPrestados.length).toBe(0);
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No se pudo realizar el préstamo'));
    });

    test('debe devolver false si el ID del libro no existe', () => {
        const resultado = prestarLibro(99, 20);
        expect(resultado).toBe(false);
    });

    test('debe devolver false si el ID del usuario no existe', () => {
        const resultado = prestarLibro(1, 99);
        expect(resultado).toBe(false);
    });
});


// ==========================================================================================
// === Tests para devolverLibro                                                         ===
// ==========================================================================================

describe('devolverLibro', () => {

    test('debe devolver un libro prestado y devolver true', () => {
        const idLibroDevuelto = 3; // "Duna", que está prestado
        const idUsuarioDevolucion = 10; // "Ana García", quien lo tiene

        const resultado = devolverLibro(idLibroDevuelto, idUsuarioDevolucion);
        
        // Verificamos el valor de retorno
        expect(resultado).toBe(true);

        // Verificamos los efectos secundarios
        const libroDevuelto = biblioteca.find(l => l.id === idLibroDevuelto);
        const usuarioDevolucion = usuarios.find(u => u.id === idUsuarioDevolucion);

        expect(libroDevuelto.disponible).toBe(true); // El libro vuelve a estar disponible
        expect(usuarioDevolucion.librosPrestados).not.toContain(idLibroDevuelto); // El usuario ya no tiene el libro
        expect(usuarioDevolucion.librosPrestados.length).toBe(0);

        // Verificamos el mensaje de éxito en consola
        expect(console.log).toHaveBeenCalledWith(' ✅ Libro: Duna devuelto por: Ana García correctamente.');
    });

    test('debe devolver false si se intenta devolver un libro que no está prestado', () => {
        const resultado = devolverLibro(1, 10); // Libro "El Aleph", que está disponible
        expect(resultado).toBe(false);
    });

    test('debe devolver false si el ID del libro no existe', () => {
        const resultado = devolverLibro(99, 10);
        expect(resultado).toBe(false);
    });

    test('debe devolver false si el ID del usuario no existe', () => {
        const resultado = devolverLibro(3, 99);
        expect(resultado).toBe(false);
    });
});


// ==========================================================================================
// === Tests para mostrarLibrosDisponibles                                              ===
// ==========================================================================================

describe('mostrarLibrosDisponibles', () => {
    
    test('debe devolver un array solo con los libros que están disponibles', () => {
        const disponibles = mostrarLibrosDisponibles(biblioteca);

        expect(disponibles.length).toBe(2);
        // Verificamos que todos los libros en el resultado tienen 'disponible: true'
        disponibles.forEach(libro => {
            expect(libro.disponible).toBe(true);
        });

        // Verificamos que los títulos son los correctos
        const titulosDisponibles = disponibles.map(l => l.titulo);
        expect(titulosDisponibles).toContain('El Aleph');
        expect(titulosDisponibles).toContain('1984');
        expect(titulosDisponibles).not.toContain('Duna');
    });

    test('debe devolver un array vacío si no hay libros disponibles', () => {
        // Modificamos el estado para este test específico
        biblioteca.forEach(l => l.disponible = false);
        
        const disponibles = mostrarLibrosDisponibles(biblioteca);
        expect(disponibles.length).toBe(0);
    });
});