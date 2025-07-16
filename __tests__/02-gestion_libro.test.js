const {
    agregarLibro,
    buscarLibro,
    ordenarLibros,
    borrarLibro,
    biblioteca
} = require('../02-gestion_libro.js');

const funcionesAuxiliares = require('../00-funciones_auxiliares.js');

// --- Datos Mock para las pruebas ---
const mockLibros = [
    { id: 1, titulo: 'Cien años de soledad', autor: 'Gabriel Garcia Marquez', anio: 1967, genero: 'Realismo mágico' },
    { id: 2, titulo: 'El Hobbit', autor: 'J.R.R. Tolkien', anio: 1937, genero: 'Fantasía' },
    { id: 3, titulo: '1984', autor: 'George Orwell', anio: 1949, genero: 'Distopía' },
];

// ==========================================================================================
// === Configuración del Entorno de Test                                                  ===
// ==========================================================================================

// Antes de cada test, reseteamos el estado de la biblioteca y los mocks.
// Esto es CRUCIAL para que los tests no se afecten entre sí.
beforeEach(() => {
    // Reseteamos el contenido de la biblioteca a su estado original
    biblioteca.length = 0; // Vaciamos el array
    biblioteca.push(...JSON.parse(JSON.stringify(mockLibros))); // Lo llenamos con una copia profunda

    // Espiamos los 'console.log' para que no ensucien la salida del test y podamos verificarlos
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    // Espiamos la función de impresión para verificar que se llama, sin que imprima la tabla
    jest.spyOn(funcionesAuxiliares, 'impresionTablaLibro').mockImplementation(() => {});
});

// Después de todos los tests, restauramos las funciones originales de console
afterAll(() => {
    jest.restoreAllMocks();
});

// ==========================================================================================
// === Tests para agregarLibro                                                          ===
// ==========================================================================================

describe('agregarLibro', () => {

    test('debe agregar un libro nuevo correctamente y devolver el libro creado', () => {
        const titulo = 'Ficciones';
        const autor = 'Jorge Luis Borges';
        const anio = 1944;
        const genero = 'Cuentos';

        const nuevoLibro = agregarLibro(titulo, autor, anio, genero);

        expect(nuevoLibro).not.toBeNull();
        expect(nuevoLibro.titulo).toBe(titulo);
        expect(nuevoLibro.id).toBe(4); // El ID más alto era 3, así que el nuevo es 4
        expect(biblioteca.length).toBe(4); // La biblioteca ahora tiene un libro más
        expect(biblioteca.find(l => l.id === 4)).toBe(nuevoLibro);
    });

    test('debe devolver null si el libro ya existe en la biblioteca', () => {
        const resultado = agregarLibro('El Aleph', 'Jorge Luis Borges', 1949, 'Cuentos');
        
        expect(resultado).toBeNull();
        expect(biblioteca.length).toBe(3); // La biblioteca no debe cambiar de tamaño
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('ya se encuentra en la biblioteca'));
    });


    test('debe devolver null si el año no es un número de 4 cifras', () => {
        const resultado = agregarLibro('Libro Corto', 'Autor', 123, 'Genero');
        
        expect(resultado).toBeNull();
        expect(biblioteca.length).toBe(3);
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Ingresa un número de 4 cifras'));
    });

    test('debe devolver null si el año es mayor al actual', () => {
        const anioFuturo = new Date().getFullYear() + 1;
        const resultado = agregarLibro('Viaje al Futuro', 'Autor', anioFuturo, 'Ciencia Ficción');

        expect(resultado).toBeNull();
        expect(biblioteca.length).toBe(3);
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('menor al año actual'));
    });
});

// ==========================================================================================
// === Tests para buscarLibro                                                           ===
// ==========================================================================================

describe('buscarLibro', () => {

    test('debe encontrar libros por título y llamar a impresionTablaLibro', () => {
        const resultados = buscarLibro('titulo', '1984');
        
        expect(resultados).not.toBeNull();
        expect(resultados.length).toBe(1);
        expect(resultados[0].autor).toBe('George Orwell');
        // Verificamos que se llamó a la función de impresión con los resultados
        expect(funcionesAuxiliares.impresionTablaLibro).toHaveBeenCalledWith(resultados);
    });

    test('debe devolver un array vacío si no se encuentra ningún libro', () => {
        const resultados = buscarLibro('autor', 'Autor Inexistente');

        expect(resultados).toEqual([]); // Devuelve un array vacío
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No se encontraron libros'));
    });

    test('debe devolver null si el criterio de búsqueda es inválido', () => {
        const resultados = buscarLibro('color', 'rojo');

        expect(resultados).toBeNull();
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Criterio de búsqueda inválido'));
    });
});

// ==========================================================================================
// === Tests para ordenarLibros                                                         ===
// ==========================================================================================

describe('ordenarLibros', () => {
    
    test('debe ordenar los libros por título (alfabéticamente)', () => {
        const librosOrdenados = ordenarLibros('titulo');
        
        expect(librosOrdenados[0].titulo).toBe('1984');
        expect(librosOrdenados[1].titulo).toBe('Cien años de soledad');
        expect(librosOrdenados[2].titulo).toBe('El Aleph');
        // Verificamos que la biblioteca original NO fue modificada
        expect(biblioteca[0].titulo).toBe('El Aleph');
    });

    test('debe ordenar los libros por año (ascendente)', () => {
        // Añadimos un libro más para hacer el ordenamiento por año más interesante
        agregarLibro('Duna', 'Frank Herbert', 1965, 'Ciencia Ficción');
        const librosOrdenados = ordenarLibros('año');

        expect(librosOrdenados[0].anio).toBe(1949);
        expect(librosOrdenados[1].anio).toBe(1949); // Los dos de 1949
        expect(librosOrdenados[2].anio).toBe(1965);
        expect(librosOrdenados[3].anio).toBe(1967);
    });

    test('debe devolver null si el criterio de ordenamiento es inválido', () => {
        const resultado = ordenarLibros('disponibilidad');
        expect(resultado).toBeNull();
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Criterio de ordenamiento inválido'));
    });
});


// ==========================================================================================
// === Tests para borrarLibro                                                           ===
// ==========================================================================================

describe('borrarLibro', () => {
    // Para esta función, necesitamos mockear el `prompt`
    let mockPrompt;

    beforeEach(() => {
        // Importamos dinámicamente el mock de prompt para poder controlarlo
        // Esta es una forma de hacerlo. La otra es inyectar la dependencia.
        mockPrompt = jest.fn();
        jest.mock('prompt-sync', () => () => mockPrompt, { virtual: true });
    });

    test('debe eliminar un libro si está disponible y el usuario confirma', () => {
        // Simulamos que el usuario escribe "si"
        // Este mock es un poco más complejo, ya que el require está dentro de la función.
        // La mejor práctica sería refactorizar borrarLibro para que reciba 'prompt' como parámetro.
        // Asumiendo refactorización: borrarLibro(id, promptFn)
        // Por ahora, este test es conceptual.
        test.todo('debe eliminar un libro si está disponible y el usuario confirma');
    });

    test('no debe eliminar el libro si el usuario responde "no"', () => {
        test.todo('no debe eliminar el libro si el usuario responde "no"');
    });
    
    test('no debe eliminar un libro si no está disponible (prestado)', () => {
        borrarLibro(2); // ID 2 = 'Cien años de soledad', disponible: false

        expect(biblioteca.length).toBe(3); // El tamaño no debe cambiar
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('El libro está prestado'));
    });

    test('debe devolver null si el ID del libro no existe', () => {
        const resultado = borrarLibro(999);
        
        expect(resultado).toBeNull();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('El ID ingresado no existe'));
    });
});