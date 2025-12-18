const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../../Upload/productos'); 
        cb(null, dir); // usar la ruta absoluta
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const Upload = multer({ storage });

module.exports = Upload;
