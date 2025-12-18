const SQLite3 = require('sqlite3')
const Ruta = require('path')
const SQLite3_Ubicacion = Ruta.resolve(__dirname, './BaseDeDatos.db')

const db_crear = new SQLite3.Database(SQLite3_Ubicacion, (Error) => {
    if (Error) {
        console.error('No se pudo crear correctamente la base de datos')
    }
    else {
        console.log('Se creo correctamente la base de datos')
        // ----> Tabla para los datos de los usuarios que se registren
        db_crear.run(
            `
                CREATE TABLE IF NOT EXISTS Usuarios(

                     Id INTEGER PRIMARY KEY AUTOINCREMENT,
                     User TEXT UNIQUE,
                     Name TEXT,
                     Email TEXT,
                     Password TEXT,
                     Id_rol INTEGER NOT NULL,
                     FOREIGN KEY (Id_rol) REFERENCES Roles(Id_rol)
                     
                )`, (Error) => {
            if (Error) {
                console.error('Error al crear la tabla debido a:', Error)
            }
            else {
                console.log('Tabla creada correctamente')
            }

             }

        )

        // ----> Tabla para los datos de los productos

        db_crear.run(
            `
            CREATE TABLE IF NOT EXISTS Productos(
                 Id INTEGER PRIMARY KEY AUTOINCREMENT,
                 Nombre TEXT NOT NULL,
                 Descripcion TEXT,
                 Precio REAL NOT NULL,
                 Stock INTEGER NOT NULL,
                 Imagen TEXT
            )`, (Error) => {
                if (Error) {
                    console.error('Error al crear la tabla debido a:', Error)
                }
                else {
                    console.log('Tabla Productos creada con Exito')
                }
               

            }
        )

        // ----> Tabla para diferencias los productos por categoria

        db_crear.run(
            `
            CREATE TABLE IF NOT EXISTS Categorias(
                 Id INTEGER PRIMARY KEY AUTOINCREMENT,
                 Nombre TEXT UNIQUE NOT NULL,
                 Descripcion TEXT
            )`, (Error) => {
                if (Error) {
                    console.error('Error al crear la tabla debido a:', Error)
                }
                else {
                    console.log('Tabla Categorias creada con Exito')
                }
               

            }
        )

        db_crear.run(
            `
            CREATE TABLE IF NOT EXISTS Inventario(
                 Id_inventario INTEGER PRIMARY KEY AUTOINCREMENT,
                 Id_producto INTEGER,
                 Cantidad_Disponible INTEGER NOT NULL,
                 Ubicacion TEXT,
                 Fecha_Actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                 Stock_minimo INTEGER,
                 FOREIGN KEY (Id_producto) REFERENCES Productos(Id)

            )`, (Error) => {
                if (Error) {
                    console.error('Error al crear la tabla debido a:', Error)
                }
                else {
                    console.log('Tabla Inventario creada con Exito')
                }
               

            }
        )

            db_crear.run(
            `
            CREATE TABLE IF NOT EXISTS Carrito(
                 Id_carrito INTEGER PRIMARY KEY AUTOINCREMENT,
                 Id_producto INTEGER,
                 Fecha_Creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                 Cantidad INTEGER NOT NULL,
                 Total REAL,
                 Nombre TEXT,
                 FOREIGN KEY (Id_producto) REFERENCES Productos(Id)

            )`, (Error) => {
                if (Error) {
                    console.error('Error al crear la tabla debido a:', Error)
                }
                else {
                    console.log('Tabla Carrito creada con Exito')
                }
               

            }
        )

        db_crear.run(
            `
            CREATE TABLE IF NOT EXISTS Detalles_del_Carrito(
                 Id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
                 Id_carrito INTEGER,
                 Id_producto INTEGER,
                 Cantidad INTEGER NOT NULL,
                 FOREIGN KEY (Id_carrito) REFERENCES Carrito(Id_carrito),
                 FOREIGN KEY (Id_producto) REFERENCES Productos(Id_producto)
            )`, (Error) => {
                if (Error) {
                    console.error('Error al crear la tabla debido a:', Error)
                }
                else {
                    console.log('Tabla Detalles_del_Carrito creada con Exito')
                }
               

            }
        )

        db_crear.run(
            `
            CREATE TABLE IF NOT EXISTS Email(
                 Id_email INTEGER PRIMARY KEY AUTOINCREMENT,
                 Email TEXT,
                 Asunto TEXT,
                 Cuerpo TEXT
 
            )`, (Error) => {
                if (Error) {
                    console.error('Error al crear la tabla debido a:', Error)
                }
                else {
                    console.log('Tabla creada con Exito')
                }
               

            }
        )

        db_crear.run(
            `
            CREATE TABLE IF NOT EXISTS Roles(
                 Id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
                 Rol TEXT NOT NULL UNIQUE
            )`, (Error) => {
                if (Error) {
                    console.error('Error al crear la tabla debido a:', Error)
                }
                else {
                    console.log('Tabla Roles creada con Exito')
                }
               

            }
        )
        
        db_crear.run(`
            CREATE TABLE IF NOT EXISTS Compra(
                 Id_compra INTEGER PRIMARY KEY AUTOINCREMENT,
                 Fecha TEXT NOT NULL,
                 Total REAL NOT NULL,
                 Estado TEXT DEFAULT 'Finalizada'
            )`, (Error) => {
                if (Error) console.error('Error al crear Compra:', Error);
                else console.log('Tabla Compra creada con éxito');
        });

        db_crear.run(`
            CREATE TABLE IF NOT EXISTS DetalleCompra(
                 Id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
                 Id_compra INTEGER NOT NULL,
                 Id_producto INTEGER NOT NULL,
                 Cantidad INTEGER NOT NULL,
                 Precio_unitario REAL NOT NULL,
                 Subtotal REAL NOT NULL,
                 FOREIGN KEY (Id_compra) REFERENCES Compra(Id_compra),
                 FOREIGN KEY (Id_producto) REFERENCES Productos(Id)
            )`, (Error) => {
            if (Error) console.error('Error al crear DetalleCompra:', Error);
            else console.log('Tabla DetalleCompra creada con éxito');
        });
    }
})


module.exports= db_crear;