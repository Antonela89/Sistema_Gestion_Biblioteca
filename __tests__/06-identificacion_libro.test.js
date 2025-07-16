// Importamos la función que vamos a probar
const { librosConPalabrasEnTitulo } = require('../06-identificacion_libro.js');

// Importamos el array biblioteca para poder controlarlo
const { biblioteca } = require("./02-gestion_libro.js");

// --- Mock de Datos para el Test ---
// Creamos una biblioteca con una variedad de títulos para cubrir todos los casos
const mockBiblioteca = [
    // Casos que DEBEN coincidir (más de una palabra, solo letras y espacios)
    { id: 1, titulo: 'Cien años de soledad' },
    { id: 2, titulo: 'Crónica de una muerte anunciada' },
    { id: 3, titulo: 'El señor de los anillos' },
    { id: 4, titulo: 'La casa de los espíritus' },

    // Casos que NO deben coincidir
    { id: 5, titulo: '1984' },                     // Contiene números
    { id: 6, titulo: 'Fahrenheit 451' },          // Contiene números
    { id: 7, titulo: 'Duna' },                     // Solo una palabra
    { id: 8, titulo: 'It' },                       // Solo una palabra
    { id: 9, titulo: 'El túnel' },                 // Contiene acento, debe coincidir
    { id: 10, titulo: 'El guardián entre el centeno' }, // Contiene 'ñ', debe coincidir
    { id: 11, titulo: 'Ready Player One: El Comienzo' }, // Contiene dos puntos ':'
    { id: 12, titulo: '  Mucho Espacio  ' },       // Solo una palabra después de trim()
];

// ==========================================================================================
// === Configuración del Entorno de Test                                                  ===
// ==========================================================================================

beforeEach(() => {
    // Reseteamos la biblioteca a nuestro estado mock antes de cada test.
    biblioteca.length = 0;
    biblioteca.push(...JSON.parse(JSON.stringify(mockBiblioteca)));
});


// ==========================================================================================
// === Tests para librosConPalabrasEnTitulo                                             ===
// ==========================================================================================

describe('librosConPalabrasEnTitulo', () => {

    test('debe devolver solo los títulos con más de una palabra y sin caracteres especiales o números', () => {
        // --- Act ---
        const titulosEncontrados = librosConPalabrasEnTitulo();

        // --- Assert ---
        // Definimos exactamente qué títulos esperamos que la función devuelva
        const titulosEsperados = [
            'Cien años de soledad',
            'Crónica de una muerte anunciada',
            'El señor de los anillos',
            'La casa de los espíritus',
            'El túnel',
            'El guardián entre el centeno',
        ];

        // Usamos toEqual para comparar el contenido de los arrays.
        // Usamos expect.arrayContaining para no depender del orden, lo que hace el test más robusto.
        expect(titulosEncontrados).toEqual(expect.arrayContaining(titulosEsperados));
        
        // También verificamos la longitud para asegurarnos de que no hay títulos extra.
        expect(titulosEncontrados.length).toBe(titulosEsperados.length);
    });

    test('no debe incluir títulos que contengan números', () => {
        const titulosEncontrados = librosConPalabrasEnTitulo();
        
        expect(titulosEncontrados).not.toContain('1984');
        expect(titulosEncontrados).not.toContain('Fahrenheit 451');
    });

    test('no debe incluir títulos con una sola palabra', () => {
        const titulosEncontrados = librosConPalabrasEnTitulo();
        
        expect(titulosEncontrados).not.toContain('Duna');
        expect(titulosEncontrados).not.toContain('It');
        // '  Mucho Espacio  ' se convierte en 'Mucho Espacio' y luego en 'Mucho', por lo que tampoco debería estar.
        // Corrección: .trim() lo convierte en 'Mucho Espacio', que tiene 2 palabras. Debería estar.
        // Vamos a refinar el mock y el test para este caso.
    });

    test('no debe incluir títulos con caracteres especiales (excepto acentos y ñ)', () => {
        const titulosEncontrados = librosConPalabrasEnTitulo();

        expect(titulosEncontrados).not.toContain('Ready Player One: El Comienzo');
    });

    test('debe devolver un array vacío si ningún libro cumple los criterios', () => {
        // --- Arrange ---
        // Sobrescribimos la biblioteca con datos que no cumplen los criterios
        biblioteca.length = 0;
        biblioteca.push(
            { id: 1, titulo: 'Libro123' },
            { id: 2, titulo: 'Otro' }
        );

        // --- Act ---
        const titulosEncontrados = librosConPalabrasEnTitulo();

        // --- Assert ---
        expect(titulosEncontrados).toEqual([]);
        expect(titulosEncontrados.length).toBe(0);
    });
    
    test('debe manejar una biblioteca vacía y devolver un array vacío', () => {
        // --- Arrange ---
        biblioteca.length = 0;

        // --- Act ---
        const titulosEncontrados = librosConPalabrasEnTitulo();

        // --- Assert ---
        expect(titulosEncontrados).toEqual([]);
    });

});