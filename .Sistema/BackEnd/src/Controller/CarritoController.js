const db = require('../DataBase/db');

const AgregarAlCarrito = (req, res) => {
    const { Id_producto, Cantidad, Nombre, Total } = req.body;
    console.log("BODY RECIBIDO:", req.body);

    if (!Id_producto || !Cantidad) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    // const TotalCalculado = Cantidad * producto.Precio;

    db.run(
        "INSERT INTO Carrito (Id_producto, Cantidad, Nombre, Total, Fecha_Creacion) VALUES (?, ?, ?, ?, datetime('now'))",
        [Id_producto, Cantidad, Nombre, Total],
        (error) => {
            if (error) {
                console.error("ERROR SQL:", error);
                return res.status(500).json({ error: "Error al agregar producto al carrito" });
            }
            return res.json({ mensaje: "Producto agregado al carrito ✅" });
        }
    );


    function agregarDetalle(Id_carrito) {
        db.get(
            "SELECT * FROM detalles_de_Carrito WHERE Id_carrito = ? AND Id_producto = ?",
            [Id_carrito, Id_producto],
            (error, detalle) => {
                if (error) return res.status(500).json({ error: "Error servidor" });

                if (detalle) {
                    db.run(
                        "UPDATE detalles_de_Carrito SET Cantidad = Cantidad + ? WHERE Id_carrito = ? AND Id_producto = ?",
                        [Cantidad, Id_carrito, Id_producto],
                        () => res.json({ mensaje: "Cantidad actualizada" })
                    );
                } else {
                    db.run(
                        "INSERT INTO detalles_de_Carrito (Id_carrito, Id_productos, Cantidad) VALUES (?, ?, ?)",
                        [Id_carrito, Id_producto, Cantidad],
                        () => res.json({ mensaje: "Producto agregado al carrito" })
                    );
                }
            }
        );
    }
};

const verCarrito = (req, res) => {
    const sql = `
        SELECT 
            Carrito.Id_carrito,
            Carrito.Id_producto,
            Carrito.Cantidad,
            Carrito.Total,
            Carrito.Nombre,
            Productos.Precio,
            Productos.Imagen
        FROM Carrito
        JOIN Productos ON Carrito.Id_producto = Productos.Id
    `;

    db.all(sql, [], (error, rows) => {
        if (error) {
            console.error("Error al obtener carrito:", error);
            return res.status(500).json({ error: "Error al obtener carrito" });
        }
        console.log("ROWS DEL CARRITO:", rows);
        return res.json({ carrito: rows });
    });
};

// Eliminar Producto del carrito
const EliminarProducto = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Carrito WHERE Id_carrito = ?";
    db.run(sql, [id], (error) => {
        if (error) return res.status(500).json({ error: "Error al eliminar producto" });
        res.json({ mensaje: "Producto eliminado ✅" });
    });
};

// Vaciar el carrito
const VaciarCarrito = (req, res) => {
    const sql = "DELETE FROM Carrito";
    db.run(sql, [], (error) => {
        if (error) return res.status(500).json({ error: "Error al vaciar carrito" });
        res.json({ mensaje: "Carrito vaciado ✅" });
    });
};

// Calcula el total de todos los prodctos que se agregaron
const CalcularTotal = (req, res) => {
    const sql = "SELECT SUM(Total) AS totalGeneral FROM Carrito";
    db.get(sql, [], (error, row) => {
        if (error) return res.status(500).json({ error: "Error al calcular total" });
        res.json({ totalGeneral: row.totalGeneral || 0 });
    });
};


module.exports = { AgregarAlCarrito, verCarrito, EliminarProducto, VaciarCarrito, CalcularTotal  };