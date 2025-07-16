const { solicitarTextoValido,
    encontrado,
    ultimoElemento,
    resultadosParaVistaLibros,
    impresionTablaLibro,
    resultadosParaVistaUsuarios,
    impresionTablaUsuario,
    impresionUsuariosConDetalle,
    mapaCriterios} = require("../00-funciones_auxiliares.js");

// --- Datos Mock para las pruebas ---
// Es crucial tener datos de prueba consistentes y separados de tu "base de datos" real.

// Arrange - Preparar
// Se definen todas las variables y el estado inicial necesario para la prueba.
const mockLibros = [
    { id: 1, titulo: 'Cien años de soledad', autor: 'Gabriel Garcia Marquez', anio: 1967, genero: 'Realismo mágico' },
    { id: 2, titulo: 'El Hobbit', autor: 'J.R.R. Tolkien', anio: 1937, genero: 'Fantasía' },
    { id: 3, titulo: '1984', autor: 'George Orwell', anio: 1949, genero: 'Distopía' },
];

const mockUsuarios = [
    { id: 1, nombre: 'Ana', email: 'ana@mail.com', librosPrestados: [1, 3] },
    { id: 2, nombre: 'Beto', email: 'beto@mail.com', librosPrestados: [] },
    { id: 3, nombre: 'Carla', email: 'carla@mail.com', librosPrestados: [99] }, // Libro inexistente
];


// ==========================================================================================
// === Test para Funciones Puras y Simples (Helpers)                                      ===
// ==========================================================================================

// Se usa describe para agrupar por tipo de función.
describe('Helpers de Búsqueda y Selección', () => {
    
    // --- Test para encontrado() ---
    describe('encontrado', () => {
        test('debe encontrar un elemento por su ID si existe', () => {
            // Arrange (implicito) -> se usa el mock definido arriba

            // Act - Actuar
            // Se ejecuta la función que se está probando
            const resultado = encontrado(mockLibros, 2);
            // Assert - Verificar
            // Se verifica que el resultado sea el esperado
            expect(resultado).toBeDefined(); 
            expect(resultado.titulo).toBe('El Hobbit');
        });

        test('debe devolver undefined si el ID no existe', () => {
            const resultado = encontrado(mockLibros, 999);
            expect(resultado).toBeUndefined();
        });

        test('debe devolver undefined para un array vacío', () => {
            const resultado = encontrado([], 1);
            expect(resultado).toBeUndefined();
        });
    });
    
    // --- Test para ultimoElemento() ---
    describe('ultimoElemento', () => {
        test('debe devolver el último elemento de un array', () => {
            const resultado = ultimoElemento(mockLibros);
            expect(resultado.id).toBe(3); //toBe: compara referencias de objeto (si son el mismo objeto en memoria)
            expect(resultado.titulo).toBe('1984');
        });

        test('debe devolver undefined si el array está vacío', () => {
            const resultado = ultimoElemento([]);
            expect(resultado).toBeUndefined();
        });
    });

});


// ==========================================================================================
// === Test para Funciones de Formateo de Datos (Lógica de Transformación)                ===
// ==========================================================================================

describe('Formateo de Datos para Vistas', () => {
    
    // --- Test para resultadosParaVistaLibros() ---
    describe('resultadosParaVistaLibros', () => {
        test('debe formatear un solo objeto libro correctamente', () => {
            const libro = mockLibros[0]; // Cien años de soledad
            const resultado = resultadosParaVistaLibros(libro);

            // Verificamos que las claves sean las esperadas para la vista
            expect(resultado).toEqual({ // toEqual: para comparar objetos - compara el contenido, = propiedades y valores
                ID: 1,
                Título: 'Cien años de soledad',
                Autor: 'Gabriel Garcia Marquez',
                Año: 1967,
                Género: 'Realismo mágico'
            });
        });

        test('debe formatear un array de libros correctamente', () => {
            const resultado = resultadosParaVistaLibros(mockLibros);
            expect(Array.isArray(resultado)).toBe(true);
            expect(resultado.length).toBe(3);
            expect(resultado[1].Título).toBe('El Hobbit'); // Verificamos un campo del segundo libro
        });
        
        test('debe devolver un mensaje si los datos son nulos', () => {
            const resultado = resultadosParaVistaLibros(null);
            expect(resultado).toBe('=== No hay información para mostrar ===');
        });
    });

    // --- Test para resultadosParaVistaUsuarios() ---
    describe('resultadosParaVistaUsuarios', () => {
        test('debe formatear un usuario con libros prestados', () => {
            const usuario = mockUsuarios[0]; // Ana
            const resultado = resultadosParaVistaUsuarios(usuario, mockLibros);
            
            expect(resultado.Nombre).toBe('Ana');
            // Verificamos que los títulos de los libros se hayan unido correctamente
            expect(resultado.LibrosPrestados).toBe('1: Cien años de soledad - 3: 1984');
        });

        test('debe formatear un usuario sin libros prestados', () => {
            const usuario = mockUsuarios[1]; // Beto
            const resultado = resultadosParaVistaUsuarios(usuario, mockLibros);
            
            expect(resultado.LibrosPrestados).toBe('Ninguno');
        });

        test('debe manejar el caso de un ID de libro prestado que no existe', () => {
            const usuario = mockUsuarios[2]; // Carla
            const resultado = resultadosParaVistaUsuarios(usuario, mockLibros);
            
            expect(resultado.LibrosPrestados).toBe('Libro ID 99 no encontrado');
        });

        test('debe formatear un array de usuarios', () => {
            const resultado = resultadosParaVistaUsuarios(mockUsuarios, mockLibros);
            expect(Array.isArray(resultado)).toBe(true);
            expect(resultado.length).toBe(3);
            expect(resultado[0].Nombre).toBe('Ana');
            expect(resultado[1].LibrosPrestados).toBe('Ninguno');
        });
    });
});


// ==========================================================================================
// === Test para Funciones con Efectos Secundarios (console.log, prompt)                  ===
// ==========================================================================================

describe('Funciones con Efectos Secundarios', () => {

    // Restauramos los mocks después de cada test para no interferir entre ellos
    afterEach(() => {
        jest.restoreAllMocks();
    });

    // --- Test para solicitarTextoValido() ---
    describe('solicitarTextoValido', () => {
        // Para probar esta función, necesitamos mockear 'prompt-sync'
        // Esto es más avanzado y requiere configurar Jest para que intercepte 'require'
        // Una forma más simple es REFACTORIZAR la función para inyectar la dependencia:
        // function solicitarTextoValido(mensaje, promptFn) { ... }
        // Y en el test, pasarle un mock: const mockPrompt = jest.fn()
        // Por ahora, lo dejaremos como un ejemplo de algo que requeriría un setup más complejo.
        test.todo('debe solicitar input hasta recibir un texto no vacío');
    });

    // --- Test para funciones de impresión ---
    describe('Funciones de Impresión', () => {
        test('impresionTablaLibro debe llamar a console.table con los datos formateados', () => {
            // jest.spyOn(console, 'table') -> Creamos un "espía" en console.table. 
            // .mockImplementation(() => {}) -> No hará nada, pero registrará si fue llamado.
            const consoleTableSpy = jest.spyOn(console, 'table').mockImplementation(() => {});

            impresionTablaLibro(mockLibros);
            
            // Verificamos que console.table fue llamado
            expect(consoleTableSpy).toHaveBeenCalled();
            // Verificamos que fue llamado UNA vez
            expect(consoleTableSpy).toHaveBeenCalledTimes(1);

            // Verificamos que se llamó CON los datos formateados correctamente
            const datosFormateados = resultadosParaVistaLibros(mockLibros);
            expect(consoleTableSpy).toHaveBeenCalledWith(datosFormateados);
        });

        test('impresionUsuariosConDetalle debe llamar a console.log con el formato correcto', () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const usuario = [mockUsuarios[0]]; // Ana

            impresionUsuariosConDetalle(usuario, mockLibros);

            // Verificamos que se llamó varias veces
            expect(consoleLogSpy).toHaveBeenCalled();
            // Verificamos que se llamó con una línea específica que esperamos
            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Nombre: Ana'));
            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Email: ana@mail.com'));
            // Usamos expect.stringContaining para no depender del espaciado exacto
            const librosFormateados = '    1: Cien años de soledad - 3: 1984'.replace(/\n/g, '\n    ');
            expect(consoleLogSpy).toHaveBeenCalledWith(librosFormateados);
        });
    });
});