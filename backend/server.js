require('dotenv').config();
const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const connectDB = require("./middlewares/db");
connectDB();
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const bodyParser = require("body-parser");
const mongo = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const passport = require("passport");

// Initialize passport and session
app.use(session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Import Google OAuth middleware
require('./middlewares/googleOAuth');

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000", 
    process.env.FRONTEND_ADMIN_URL || "http://localhost:3001"
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/order", orderRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
    console.log(`listening on port: ${port}`);
})