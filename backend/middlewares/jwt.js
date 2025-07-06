const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");

const jwtAuthMiddleware = (req, res, next) => {
    // Check for token in Authorization header
    let token;
    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith("Bearer ")) {
        token = authorization.split(" ")[1];
    }

    // If not in header, check cookies
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ error: 'Token Not Found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT Auth - Token verification failed:", err);
        res.status(401).json({ error: 'Invalid token' });
    }
};


// Function to generate JWT token
const generateToken = (userData) => {
    // Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: '7d'}); // 7 days
}

module.exports = {jwtAuthMiddleware, generateToken};