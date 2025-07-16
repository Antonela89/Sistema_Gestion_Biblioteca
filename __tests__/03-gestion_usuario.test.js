// Importamos las funciones que vamos a probar
const {
    registrarUsuario,
    mostrarTodosLosUsuarios,
    buscarUsuario,
    solicitarEmailExistente,
    borrarUsuario,
    esEmailValido
} = require('../03-gestion_usuario.js'); 

// Importamos el array de usuarios para poder controlarlo
const usuarios = require('../01-lista_usuarios.js');
const libros = require('../01-lista_libros.js'); // Necesario para el test de borrarUsuario

// Importamos el módulo de funciones auxiliares para espiarlo
const funcionesAuxiliares = require('../00-funciones_auxiliares.js');

// --- Mock de Datos Inicial ---
const usuariosOriginales = [
    { id: 1, nombre: 'Ana García', email: 'ana.garcia@example.com', librosPrestados: [1] },
    { id: 2, nombre: 'Beto Pérez', email: 'beto.perez@example.com', librosPrestados: [] },
    { id: 3, nombre: 'Carla López', email: 'carla.lopez@example.com', librosPrestados: [2, 3] },
];

const librosOriginales = [
    { id: 1, titulo: 'El Aleph', disponible: false },
    { id: 2, titulo: '1984', disponible: false },
    { id: 3, titulo: 'Duna', disponible: false },
];

// ==========================================================================================
// === Configuración del Entorno de Test                                                  ===
// ==========================================================================================

beforeEach(() => {
    // Reseteamos el contenido de los arrays a su estado original
    usuarios.length = 0;
    libros.length = 0;
    usuarios.push(...JSON.parse(JSON.stringify(usuariosOriginales)));
    libros.push(...JSON.parse(JSON.stringify(librosOriginales)));

    // Espiamos console.log y las funciones de impresión para mantener limpia la consola
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(funcionesAuxiliares, 'impresionTablaUsuario').mockImplementation(() => {});
});

afterAll(() => {
    jest.restoreAllMocks();
});

// ==========================================================================================
// === Tests para registrarUsuario                                                      ===
// ==========================================================================================

describe('registrarUsuario', () => {
    test('debe registrar un nuevo usuario y devolver true', () => {
        const resultado = registrarUsuario('David Mora', 'david.mora@example.com');

        expect(resultado).toBe(true);
        expect(usuarios.length).toBe(4);
        const nuevoUsuario = usuarios.find(u => u.email === 'david.mora@example.com');
        expect(nuevoUsuario).toBeDefined();
        expect(nuevoUsuario.id).toBe(4); // El ID más alto era 3
        expect(funcionesAuxiliares.impresionTablaUsuario).toHaveBeenCalledWith(nuevoUsuario);
    });

    test('debe devolver false si el nombre está vacío', () => {
        const resultado = registrarUsuario('', 'test@example.com');
        
        expect(resultado).toBe(false);
        expect(usuarios.length).toBe(3); // No se debe agregar el usuario
        expect(console.log).toHaveBeenCalledWith('❌ Error: El nombre no puede quedar vacío.');
    });

    test('debe devolver false si el nombre solo contiene espacios', () => {
        const resultado = registrarUsuario('   ', 'test@example.com');
        
        expect(resultado).toBe(false);
        expect(usuarios.length).toBe(3);
        expect(console.log).toHaveBeenCalledWith('❌ Error: El nombre no puede quedar vacío.');
    });
});

// ==========================================================================================
// === Tests para buscarUsuario                                                         ===
// ==========================================================================================

describe('buscarUsuario', () => {
    test('debe encontrar un usuario por su email (insensible a mayúsculas)', () => {
        const usuarioEncontrado = buscarUsuario('BETO.PEREZ@EXAMPLE.COM');
        
        expect(usuarioEncontrado).toBeDefined();
        expect(usuarioEncontrado.id).toBe(2);
        expect(usuarioEncontrado.nombre).toBe('Beto Pérez');
    });

    test('debe devolver undefined si el email no existe', () => {
        const usuarioEncontrado = buscarUsuario('noexiste@example.com');
        expect(usuarioEncontrado).toBeUndefined();
    });
});

// ==========================================================================================
// === Tests para borrarUsuario                                                         ===
// ==========================================================================================

describe('borrarUsuario', () => {
    test('debe borrar un usuario sin libros prestados y devolver true', () => {
        const resultado = borrarUsuario('Beto Pérez', 'beto.perez@example.com');

        expect(resultado).toBe(true);
        expect(usuarios.length).toBe(2);
        expect(buscarUsuario('beto.perez@example.com')).toBeUndefined();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('✅✅ Usuario borrado correctamente:✅✅'));
    });

    test('debe normalizar el nombre para encontrar y borrar al usuario (con acentos)', () => {
        const resultado = borrarUsuario('ana garcia', 'ana.garcia@example.com'); // Buscamos sin acento
        
        // Asumiendo que Ana tiene libros prestados, el test debe verificar que no se borra.
        expect(resultado).toBe(false);
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No se puede borrar el usuario: "Ana García" porque tiene libros prestados.'));
    });

    test('no debe borrar un usuario que tiene libros prestados y debe devolver false', () => {
        const resultado = borrarUsuario('Carla López', 'carla.lopez@example.com');

        expect(resultado).toBe(false);
        expect(usuarios.length).toBe(3); // El usuario no debe ser borrado
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No se puede borrar el usuario'));
        // Verificamos que se muestran los títulos de los libros prestados
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Libros prestados: "1984, Duna"'));
    });

    test('debe devolver false si el usuario no es encontrado', () => {
        const resultado = borrarUsuario('Usuario Inexistente', 'noexiste@example.com');
        
        expect(resultado).toBe(false);
        expect(usuarios.length).toBe(3);
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Usuario no encontrado'));
    });
});

// ==========================================================================================
// === Tests para Funciones de Ayuda y con Efectos Secundarios                          ===
// ==========================================================================================

describe('Otras Funciones de Gestión', () => {
    
    describe('esEmailValido', () => {
        test('debe devolver true para un email válido', () => {
            expect(esEmailValido('usuario.valido@dominio.com')).toBe(true);
        });
        test('debe devolver false si no tiene @', () => {
            expect(esEmailValido('emailinvalido.com')).toBe(false);
        });
        test('debe devolver false si no tiene punto en el dominio', () => {
            expect(esEmailValido('usuario@dominio-sin-punto')).toBe(false);
        });
        test('debe devolver false si la parte local es menor a 8 caracteres', () => {
            expect(esEmailValido('usr@dom.com')).toBe(false);
        });
    });

    describe('solicitarEmailExistente', () => {
        // Para esta función, necesitamos mockear el prompt que se le pasa como dependencia
        test('debe devolver el usuario si se ingresa un email existente al primer intento', () => {
            const mockPrompt = jest.fn().mockReturnValueOnce('ana.garcia@example.com');
            const usuario = solicitarEmailExistente(mockPrompt);
            
            expect(mockPrompt).toHaveBeenCalledTimes(1);
            expect(usuario).toBeDefined();
            expect(usuario.id).toBe(1);
        });

        test('debe volver a pedir el email si el primero no existe, y luego encontrarlo', () => {
            const mockPrompt = jest.fn()
                .mockReturnValueOnce('noexiste@example.com') // Primer intento fallido
                .mockReturnValueOnce('carla.lopez@example.com'); // Segundo intento exitoso
            
            const usuario = solicitarEmailExistente(mockPrompt);
            
            expect(mockPrompt).toHaveBeenCalledTimes(2);
            expect(console.log).toHaveBeenCalledWith('❌ Email no registrado.');
            expect(usuario).toBeDefined();
            expect(usuario.id).toBe(3);
        });

        test('debe devolver null si el usuario escribe "salir"', () => {
            const mockPrompt = jest.fn()
                .mockReturnValueOnce('noexiste@example.com')
                .mockReturnValueOnce('salir');
            
            const usuario = solicitarEmailExistente(mockPrompt);
            
            expect(mockPrompt).toHaveBeenCalledTimes(2);
            expect(usuario).toBeNull();
        });
    });

    describe('mostrarTodosLosUsuarios', () => {
        test('debe llamar a impresionTablaUsuario con el array de usuarios', () => {
            mostrarTodosLosUsuarios(libros);
            
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('=== USUARIOS DE LA BIBLIOTECA ==='));
            expect(funcionesAuxiliares.impresionTablaUsuario).toHaveBeenCalledWith(usuarios, libros);
        });
    });
});

