const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config()
function auth(req, res, next) {
    //Our logic to check token is provided
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access Denied! No token provided');

    //Our logic to check token is valid
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch {
        res.status(400).send('Invalid token');
    }
}

module.exports = auth;