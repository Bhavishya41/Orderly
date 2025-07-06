const jwt = require('jsonwebtoken');

const tempTokenAuthMiddleware = (req, res, next) => {
    // Try to get token from Authorization header first (for user frontend)
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
        token = token.substring(7);
    } else {
        // Fallback to cookie (for admin frontend)
        token = req.cookies.temp_token;
    }
    
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
