const db = require('../DataBase/db');

const CargarProductos = async (req, res) => {
    try {
        const { Nombre, Descripcion, Precio, Stock } = req.body;
        const imagen = req.file ? req.file.filename : null;

        // 1. Validar campos obligatorios
        if (!Nombre || !Descripcion || !Precio || !Stock || !imagen ) {
            return res.status(400).json({
                Error: 'Todos los campos son obligatorios'
            });
        }

        // 2. Validar tipos de datos
        if (isNaN(Precio) || Precio <= 0) {
            return res.status(400).json({
                Error: 'El precio debe ser un número mayor a 0'
            });
        }

        if (isNaN(Stock) || Stock < 0) {
            return res.status(400).json({
                Error: 'El stock debe ser un número mayor o igual a 0'
            });
        }

        // 3. Verificar si ya existe un producto con el mismo nombre
        const queryBuscar = 'SELECT * FROM Productos WHERE Nombre = ?';
        db.get(queryBuscar, [Nombre], (Error, productoExistente) => {

            if (Error) {
                console.log('Error al buscar el producto:', Error);
                return res.status(500).json({
                    message: 'Error Interno: Server'
                });
            }

            if (productoExistente) {
                return res.status(409).json({
                    message: 'El producto ya existe'
                });
            }

            // 4. Insertar producto si no existe
            const query2 ='INSERT INTO Productos (Nombre, Descripcion, Precio, Stock, Imagen) VALUES (?,?,?,?,?)';

            db.run(query2,
                [Nombre, Descripcion, Precio, Stock, imagen],
                function (Error) {

                    if (Error) {
                        console.error('Error al insertar el producto:', Error);
                        return res.status(500).json({
                            message: 'Error interno del servidor'
                        });
                    }

                    return res.status(201).json({
                        message: 'Producto cargado exitosamente',
                        ID: this.lastID,
                        Nombre,
                        Descripcion,
                        Precio,
                        Stock
                    });
                }
            );
        });

    } catch (error) {
        console.error('Error en la carga del producto:', error);
        return res.status(500).json({
            Error: 'Error Interno: Server'
        });
    }
};

const ActualizarProducto = (req, res) => {
    const { id } = req.params;
    const { Nombre, Descripcion, Precio, Stock } = req.body;
    const imagen = req.file ? req.file.filename : null;

    const query = `
        UPDATE Productos
        SET Nombre = ?, Descripcion = ?, Precio = ?, Stock = ?, imagen = COALESCE(?, imagen)
        WHERE Id = ?
    `;

    db.run(query, [Nombre, Descripcion, Precio, Stock, imagen, id], function(error) {
        if (error) return res.status(500).json({ error: "Error al actualizar producto" });

        if (this.changes === 0)
            return res.status(404).json({ error: "Producto no encontrado" });

        res.json({ mensaje: "Producto actualizado correctamente" });
    });
};

const EliminarProducto = (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM Productos WHERE Id = ?`;

    db.run(query, [id], function(error) {
        if (error) return res.status(500).json({ error: "Error al eliminar producto" });

        if (this.changes === 0)
            return res.status(404).json({ error: "Producto no encontrado" });

        res.json({ mensaje: "Producto eliminado correctamente" });
    });
};

const ObtenerProductos = (req, res) => {
    const sql = `
        SELECT 
            Id,
            Nombre,
            Descripcion,
            Precio,
            Stock,
            Imagen
        FROM Productos
    `;

    db.all(sql, [], (error, rows) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al obtener productos" });
        }

        res.json(rows);
    });
};

module.exports = { 
     CargarProductos,
     ActualizarProducto,
     EliminarProducto,
     ObtenerProductos
    };