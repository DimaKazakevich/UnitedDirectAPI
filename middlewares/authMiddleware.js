const jwt = require('jsonwebtoken');
const {AUTHORIZATION_SCHEMA, JWT_SECRET_KEY} = require('../config/envConfig');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).end();
    }
    try {
        req.user = jwt.verify(
            authHeader.replace(AUTHORIZATION_SCHEMA, '').replace(' ', ''),
            JWT_SECRET_KEY
        );
    } catch (error) {
        res.status(401).end();
    }

    next();
};

module.exports = authMiddleware;