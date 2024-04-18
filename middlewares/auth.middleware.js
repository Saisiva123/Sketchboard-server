const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, "your_secret_key_1234", (err, decodedUser) => {
        if (err) { return res.status(401).json({ message: 'Unauthorized' }) }
        req.user = decodedUser
        next()
    })
}

module.exports = jwtAuthMiddleware