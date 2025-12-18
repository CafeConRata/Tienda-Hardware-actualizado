const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // guardamos el usuario para usarlo después
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token no válido' });
    }
};

module.exports = auth;