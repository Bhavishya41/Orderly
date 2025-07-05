const jwt = require('jsonwebtoken');

const tempTokenAuthMiddleware = (req, res, next) => {
    let token = req.cookies.temp_token;
    
    if (!token) {
        return res.status(401).json({ error: 'Temp token not found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid temp token' });
    }
};

module.exports = { tempTokenAuthMiddleware };
