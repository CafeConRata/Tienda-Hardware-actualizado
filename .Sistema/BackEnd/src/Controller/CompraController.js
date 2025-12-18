const db = require('../DataBase/db');
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");



// Finalizar compra 
const finalizarCompra = async (req, res) => {
    try {
        const fecha = new Date().toISOString().split("T")[0];

        // 1. Traer todos los productos del carrito
        const carrito = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM Carrito", [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        // Si el carrito está vacío, devolvemos error
        if (carrito.length === 0) {
            return res.status(400).json({ error: "Carrito vacío" });
        }

        // 2. Calcular el total de la compra
        const total = carrito.reduce(
            (sum, item) => sum + item.Total * item.Cantidad,
            0
        );
        console.log("Carrito recuperado:", carrito);
        console.log("Total calculado:", total);
        // 3. Insertar la compra en la tabla Compra
        const compraId = await new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO Compra (Fecha, Total, Estado) VALUES (?, ?, ?)",
                [fecha, total, "Finalizada"],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID); // ID autoincrement generado
                }
            );
        });

        // 4. Insertar cada producto del carrito en DetalleCompra
        for (const item of carrito) {
            await new Promise((resolve, reject) => {
                db.run(
                    "INSERT INTO DetalleCompra (Id_compra, Id_producto, Cantidad, Precio_unitario, Subtotal) VALUES (?, ?, ?, ?, ?)",
                    [
                        compraId,
                        item.Id_producto,
                        item.Cantidad,
                        item.Total,
                        item.Total * item.Cantidad,
                    ],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }

        // 5. Vaciar el carrito (borrar todos los registros)
        await new Promise((resolve, reject) => {
            db.run("DELETE FROM Carrito", [], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // 6. Generar factura PDF
        const facturaPath = generarFacturaPDF(compraId, carrito, total);

        // 7. Registrar compra en Excel
        await registrarCompraExcel(compraId, carrito, total);

        // Respuesta final al frontend
        res.json({ mensaje: "Compra finalizada ✅", id: compraId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al finalizar compra" });
    }
};

const generarFacturaPDF = (compraId, items, total) => {
    const doc = new PDFDocument({ margin: 50 });

    // Carpeta de facturas
    const facturasDir = path.join(__dirname, "../facturas");
    if (!fs.existsSync(facturasDir)) {
        fs.mkdirSync(facturasDir, { recursive: true });
    }

    const filePath = path.join(facturasDir, `factura_${compraId}.pdf`);
    doc.pipe(fs.createWriteStream(filePath));


    doc.fontSize(22).fillColor("#333").text("Factura de Compra", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).fillColor("#555").text(`Compra N°: ${compraId}`);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

  
    doc.fontSize(12).fillColor("#000");
    doc.text("Producto", 50, doc.y, { continued: true });
    doc.text("Cantidad", 200, doc.y, { continued: true });
    doc.text("Precio Unitario", 300, doc.y, { continued: true });
    doc.text("Subtotal", 430, doc.y);
    doc.moveDown();


    items.forEach((item) => {
        const precioUnitario = item.Precio || ((Number(item.Total) || 0) / (Number(item.Cantidad) || 1));
        const subtotal = precioUnitario * (item.Cantidad || 1);

        doc.text(item.Nombre, 50, doc.y, { continued: true });
        doc.text(item.Cantidad.toString(), 200, doc.y, { continued: true });
        doc.text(`$${precioUnitario}`, 300, doc.y, { continued: true });
        doc.text(`$${subtotal}`, 430, doc.y);
    });

    doc.moveDown();
    doc.moveDown();


    doc.fontSize(14).fillColor("#000").text(`TOTAL: $${total}`, { align: "right" });

    doc.moveDown();
    doc.fontSize(10).fillColor("#777").text("Gracias por su compra", { align: "center" });
    doc.text("Tienda Hardware - contacto@tienda.com", { align: "center" });

    doc.end();
    return filePath;
};

// Servir el PDF generado
const obtenerFactura = (req, res) => {
    const facturaNombre = `factura_${req.params.id}.pdf`;
    const facturaDir = path.resolve(__dirname, "../facturas");
    const facturaPath = path.join(facturaDir, facturaNombre);

    console.log("Buscando factura en:", facturaPath);

    if (fs.existsSync(facturaPath)) {

        res.sendFile(facturaNombre, { root: facturaDir }, (err) => {
            if (err) {
                console.error("Error al enviar la factura:", err);
                res.status(500).json({ error: "Error al enviar la factura" });
            }
        });
    } else {
        res.status(404).json({ error: `Factura ${req.params.id} no encontrada` });
    }
};
// Registrar compra en Excel
const registrarCompraExcel = async (compraId, items, total) => {
    const workbook = new ExcelJS.Workbook();
    const reportesDir = path.join(__dirname, "../reports");
    const filePath = path.join(reportesDir, "compras_diarias.xlsx");

    // Crear carpeta si no existe
    if (!fs.existsSync(reportesDir)) {
        fs.mkdirSync(reportesDir, { recursive: true });
    }

    // Si el archivo existe, lo leemos
    if (fs.existsSync(filePath)) {
        await workbook.xlsx.readFile(filePath);
    }

    // Obtener o crear hoja
    let sheet = workbook.getWorksheet("Compras");
    if (!sheet) {
        sheet = workbook.addWorksheet("Compras");
        sheet.addRow(["Fecha", "ID Compra", "Producto", "Cantidad", "Precio", "Total"]);
    }

    // Agregar filas
    items.forEach(item => {
        sheet.addRow([
            new Date().toLocaleDateString(),
            compraId,
            item.Nombre,
            item.Cantidad,
            item.Total,
            item.Total * item.Cantidad
        ]);
    });

    // Guardar archivo
    await workbook.xlsx.writeFile(filePath);
};

// Servir el Excel de compras diarias
const obtenerExcelCompras = (req, res) => {
    const filePath = path.join(__dirname, "../reports/compras_diarias.xlsx");

    console.log("Descargando Excel desde:", filePath);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Archivo de compras no encontrado" });
    }

    res.sendFile(
        "compras_diarias.xlsx",
        { root: path.join(__dirname, "../reports") },
        (err) => {
            if (err) {
                console.error("Error real al enviar Excel:", err);
                res.status(500).json({ error: "Error al enviar el Excel" });
            }
        }
    );
};
module.exports = { finalizarCompra, obtenerFactura, obtenerExcelCompras };
