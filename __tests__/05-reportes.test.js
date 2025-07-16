// Importamos la función que vamos a probar
const { generarReporteLibros } = require('../05-reportes.js'); 

// Importamos el array biblioteca para poder controlarlo en nuestros tests
const { biblioteca } = require("./02-gestion_libro.js");

// --- Mock de Datos para el Test ---
// Creamos un estado de biblioteca predecible y variado para probar todos los cálculos.
const mockBiblioteca = [
    { id: 1, titulo: 'Don Quijote', anio: 1605, genero: 'Novela', disponible: true },
    { id: 2, titulo: 'Project Hail Mary', anio: 2021, genero: 'Ciencia Ficción', disponible: false },
    { id: 3, titulo: 'Duna', anio: 1965, genero: 'Ciencia Ficción', disponible: true },
    { id: 4, titulo: 'El Aleph', anio: 1949, genero: 'Cuentos', disponible: false },
    { id: 5, titulo: 'Libro Misterioso', anio: 2000, disponible: true }, // Libro sin género definido
];

// ==========================================================================================
// === Configuración del Entorno de Test                                                  ===
// ==========================================================================================

beforeEach(() => {
    // Antes de cada test, reseteamos la biblioteca a nuestro estado mock controlado.
    biblioteca.length = 0;
    biblioteca.push(...JSON.parse(JSON.stringify(mockBiblioteca)));

    // Espiamos console.log y console.table para que no impriman y podamos verificar sus llamadas.
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'table').mockImplementation(() => {});
});

afterAll(() => {
    // Restauramos los mocks al final de todos los tests.
    jest.restoreAllMocks();
});


// ==========================================================================================
// === Tests para generarReporteLibros                                                  ===
// ==========================================================================================

describe('generarReporteLibros', () => {

    test('debe calcular y mostrar correctamente todas las estadísticas del reporte', () => {
        // --- Act ---
        // Ejecutamos la función que queremos probar.
        generarReporteLibros();

        // --- Assert ---
        // Verificamos que los cálculos de las estadísticas (mostrados con console.log) son correctos.
        // Usamos expect.stringContaining para no depender del formato exacto (emojis, etc.).
        
        // 1. Verificar total de libros
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Cantidad Total de libros: 5'));

        // 2. Verificar libros prestados
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Cantidad de libros Prestados: 2'));

        // 3. Verificar libro más antiguo
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Libro más Antiguo: Don Quijote , 📅 Año: 1605'));
        
        // 4. Verificar libro más nuevo
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Libro más Nuevo: Project Hail Mary, 📅 Año: 2021'));
        
        // 5. Verificar la tabla de géneros (la parte más compleja)
        // Replicamos la lógica de la función para saber qué datos exactos debería recibir console.table.
        const expectedTableData = [
            { "Género": "Ciencia Ficción", "Cantidad de Libros": 2 },
            { "Género": "Novela", "Cantidad de Libros": 1 },
            { "Género": "Cuentos", "Cantidad de Libros": 1 },
            { "Género": "Sin Género", "Cantidad de Libros": 1 },
        ];
        
        // Verificamos que console.table fue llamado con la estructura y datos correctos, ya ordenados.
        expect(console.table).toHaveBeenCalledWith(expectedTableData);
    });

    test('debe manejar una biblioteca vacía sin lanzar errores', () => {
        // --- Arrange ---
        // Forzamos un estado de biblioteca vacía para probar el caso límite.
        biblioteca.length = 0;

        // --- Act ---
        // Usamos una función anónima para que Jest pueda capturar el error si ocurre.
        const action = () => generarReporteLibros();

        // --- Assert ---
        // La implementación actual de la función con .reduce() en un array vacío SIN valor inicial lanzaría un TypeError.
        // Un buen test debe detectar esto. Lo ideal sería que la función no se rompiera.
        // Este test verifica que la función NO lanza un error (asumiendo que se ha hecho robusta).
        // Si la función SÍ se rompe, este test fallará, indicándonos que debemos mejorarla.
        
        // Para que este test pase, la función original debe ser refactorizada para manejar el caso vacío.
        // Por ejemplo, añadiendo al principio:
        // if (biblioteca.length === 0) { console.log("No hay libros para generar un reporte."); return; }
        
        expect(action).not.toThrow();
        
        // Y podemos verificar que se muestra un mensaje informativo.
        // Esto depende de cómo se refactorice la función.
        // Por ahora, solo comprobamos que no se rompa.
    });

});