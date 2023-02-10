
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_TOKEN_SECRET;

const fetchUser = function (req, res, next) {
    const authToken = req.header('auth-token');
    if(!authToken) {
        return res.status(401).json({'error':'token is not valid'});
    }
    
    const data = jwt.verify(authToken, jwtSecret);
    req.user = data.user;
    next();
}

module.exports = fetchUser;
