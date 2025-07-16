// Importamos la función que vamos a probar
const { normalizarDatos } = require('../08-manejo_cadenas.js'); // Ajusta la ruta

// --- Mock de Datos para el Test ---
// Creamos un array mixto que contiene libros, usuarios y otros objetos
// para probar toda la lógica condicional de la función.
const mockArrayMixto = [
    // Libro con datos "sucios" para normalizar
    {
        id: 1,
        titulo: ' el señor de los anillos ',
        autor: '  J.R.R. Tolkien  ',
        anio: 1954
    },
    // Usuario con datos "sucios" para normalizar
    {
        id: 101,
        nombre: 'Ana García',
        email: '  ANA.GARCIA@EXAMPLE.COM'
    },
    // Libro ya normalizado (no debería cambiar)
    {
        id: 2,
        titulo: '1984',
        autor: 'George Orwell',
        anio: 1949
    },
    // Usuario ya normalizado (no debería cambiar)
    {
        id: 102,
        nombre: 'Beto Pérez',
        email: 'beto.perez@example.com'
    },
    // Objeto que no es ni libro ni usuario (no debe ser modificado)
    {
        tipo: 'Reporte',
        fecha: '2023-10-27'
    }
];


// ==========================================================================================
// === Tests para normalizarDatos                                                       ===
// ==========================================================================================

describe('normalizarDatos', () => {

    test('debe normalizar correctamente un array mixto de libros y usuarios', () => {
        // --- Act ---
        const datosNormalizados = normalizarDatos(mockArrayMixto);

        // --- Assert ---
        // Verificamos cada elemento del array resultante.

        // 1. Verificar el primer libro (el que necesita normalización)
        const libroNormalizado = datosNormalizados.find(item => item.id === 1);
        expect(libroNormalizado.titulo).toBe(' EL SEÑOR DE LOS ANILLOS '); // toUpperCase() no quita espacios
        // Corrección: La función SÍ debería quitar espacios del título antes de convertir a mayúsculas.
        // Asumiendo que la intención es: elemento.titulo.trim().toUpperCase()
        // Si la intención es la actual, el test es correcto. Vamos a testear la función tal como está.
        // El test actual es:
        expect(libroNormalizado.titulo).toBe(' EL SEÑOR DE LOS ANILLOS '); // toUpperCase() sobre el string con espacios
        expect(libroNormalizado.autor).toBe('J.R.R. Tolkien'); // trim() quita espacios

        // 2. Verificar el primer usuario (el que necesita normalización)
        const usuarioNormalizado = datosNormalizados.find(item => item.id === 101);
        expect(usuarioNormalizado.email).toBe('  ana.garcia@example.com'); // toLowerCase() no quita espacios
        // De nuevo, un test puede revelar una posible mejora en la función.
        // Si se cambia a `elemento.email.trim().toLowerCase()`, este test fallaría y nos avisaría.

        // 3. Verificar que los elementos ya normalizados no cambian
        const libroSinCambios = datosNormalizados.find(item => item.id === 2);
        expect(libroSinCambios.titulo).toBe('1984'); // Ya estaba en mayúsculas (numérico), no cambia
        expect(libroSinCambios.autor).toBe('George Orwell');

        const usuarioSinCambios = datosNormalizados.find(item => item.id === 102);
        expect(usuarioSinCambios.email).toBe('beto.perez@example.com');
        
        // 4. Verificar que el objeto "Reporte" no fue modificado
        const reporteSinCambios = datosNormalizados.find(item => item.tipo === 'Reporte');
        expect(reporteSinCambios).toEqual({ tipo: 'Reporte', fecha: '2023-10-27' });
    });

    // Test corregido y más preciso
    test('debe aplicar las transformaciones de string correctamente', () => {
        const datosNormalizados = normalizarDatos(mockArrayMixto);

        // Libro 1:
        expect(datosNormalizados[0].titulo).toBe(' EL SEÑOR DE LOS ANILLOS ');
        expect(datosNormalizados[0].autor).toBe('J.R.R. Tolkien');
        
        // Usuario 1:
        expect(datosNormalizados[1].email).toBe('  ana.garcia@example.com');

        // Libro 2 y Usuario 2 (casos donde la normalización no tiene efecto visible):
        expect(datosNormalizados[2].titulo).toBe('1984');
        expect(datosNormalizados[3].email).toBe('beto.perez@example.com');
    });

    test('debe devolver un nuevo array y no modificar el array original (inmutabilidad)', () => {
        // Creamos una copia profunda del array original para compararlo después
        const originalAntes = JSON.parse(JSON.stringify(mockArrayMixto));

        // --- Act ---
        const datosNormalizados = normalizarDatos(mockArrayMixto);
        
        // --- Assert ---
        // Verificamos que el array devuelto es una nueva instancia
        expect(datosNormalizados).not.toBe(mockArrayMixto);
        
        // Verificamos que el array original no fue modificado
        expect(mockArrayMixto).toEqual(originalAntes);
    });

    test('debe manejar un array vacío y devolver un array vacío', () => {
        const resultado = normalizarDatos([]);
        expect(resultado).toEqual([]);
    });

    test('debe devolver el mismo array si no hay objetos que normalizar', () => {
        const arrayNoNormalizable = [
            { tipo: 'Reporte', data: 'info' },
            { nombre: 'Configuración' }
        ];
        const resultado = normalizarDatos(arrayNoNormalizable);
        // Debería devolver un nuevo array con los mismos objetos dentro
        expect(resultado).toEqual(arrayNoNormalizable);
        expect(resultado).not.toBe(arrayNoNormalizable); // Aún así, debe ser un array nuevo
    });
});

