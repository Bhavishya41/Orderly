const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware, generateToken } = require("./../middlewares/jwt");
const { mongo } = require("mongoose");
const User = require("./../models/user");
const Product = require("./../models/products");
const Order = require("./../models/orders");
const Category = require("./../models/category");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { tempTokenAuthMiddleware } = require("./../middlewares/temp-token");
const { validateEmailDomain, sendVerificationEmail } = require("./../utils/emailValidator");
const crypto = require("crypto");
let admincount = 0;

// Google OAuth routes
router.get("/api/auth/google", (req, res, next) => {
    // Store the 'from' parameter in the OAuth state
    const from = req.query.from;
    const prompt = req.query.prompt;
    console.log("OAuth Init - from parameter:", from);
    console.log("OAuth Init - prompt parameter:", prompt);
    
    const state = from ? Buffer.from(JSON.stringify({ from })).toString('base64') : undefined;
    console.log("OAuth Init - state:", state);
    
    passport.authenticate("google", { 
        scope: ["profile", "email"],
        state: state,
        prompt: prompt === 'select_account' ? 'select_account' : undefined
    })(req, res, next);
});

router.get("/api/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
        try {
            // Check if user already has a password set
            let user = await User.findById(req.user.id);
            
            console.log("OAuth Callback - User:", user.email);
            console.log("OAuth Callback - Has password:", !!user.password);
            console.log("OAuth Callback - State:", req.query.state);
            
            // Parse the state parameter
            let isFromSignup = false;
            if (req.query.state) {
                try {
                    const stateData = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
                    isFromSignup = stateData.from === 'signup';
                    console.log("OAuth Callback - Parsed state:", stateData);
                } catch (error) {
                    console.log("OAuth Callback - Failed to parse state:", error);
                }
            }
            
            console.log("OAuth Callback - Is from signup:", isFromSignup);
            
            // Send verification email for Google OAuth users (even though they're pre-verified)
            // This ensures they have a verification email for any edge cases
            if (!user.verificationToken) {
                const verificationToken = crypto.randomBytes(32).toString('hex');
                const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
                
                user.verificationToken = verificationToken;
                user.verificationExpires = verificationExpires;
                await user.save();
                
                // Send verification email
                const emailResult = await sendVerificationEmail(user.email, verificationToken);
                if (emailResult.success) {
                    console.log("Verification email sent to Google OAuth user:", user.email);
                } else {
                    console.error("Failed to send verification email to Google OAuth user:", emailResult.error);
                }
            }
            
            if (!user.password) {
                // User doesn't have a password, redirect to password setup
                console.log("Redirecting to password setup");
                let payload = { id: req.user.id };
                let tempToken = generateToken(payload);
                
                res.cookie("temp_token", tempToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 10 * 60 * 1000, // 10 minutes
                });
                
                res.redirect(`http://localhost:3000/auth/setup-password?email=${user.email}`);
            } else {
                if (isFromSignup) {
                    // User tried to sign up but already has account, redirect to login with message
                    console.log("Redirecting to login with account exists message");
                    res.redirect("http://localhost:3000/auth/login?error=account_exists&email=" + encodeURIComponent(user.email));
                } else {
                    // Normal login flow
                    console.log("Normal login flow");
                    let payload = { id: req.user.id };
                    let token = generateToken(payload);
                    
                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: false,
                        sameSite: "lax",
                        path: "/",
                        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
                    });

                    // Redirect to home page without token in URL
                    res.redirect("http://localhost:3000/");
                }
            }
        } catch (error) {
            console.error("Google OAuth callback error:", error);
            res.redirect("http://localhost:3000/auth/login?error=oauth_failed");
        }
    }
);

router.post("/signup", async(req, res) => {
    let user = req.body;
    try {
        // Validate email
        const emailValidation = await validateEmailDomain(user.email);
        if (!emailValidation.valid) {
            let errorMessage = "Please enter a valid email address.";
            if (emailValidation.reason === 'disposable_email') {
                errorMessage = "Please use a valid email address. Disposable email addresses are not allowed.";
            } else if (emailValidation.reason === 'invalid_format') {
                errorMessage = "Please enter a valid email address format.";
            }
            return res.status(400).json({ message: errorMessage });
        }
        
        // Check if email already exists
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }
        
        if(user.role === "admin"){
            let isAdmin = await User.findOne({role:"admin"});
            if(isAdmin){
                return res.status(401).json({message:"there can be more than one admin"});
            }
        }
        
        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        // Create user with verification fields
        user.emailVerified = false;
        user.verificationToken = verificationToken;
        user.verificationExpires = verificationExpires;
        
        let newUser = await new User(user);
        let result = await newUser.save();
        console.log("User saved:", result);

        // Send verification email
        const emailResult = await sendVerificationEmail(user.email, verificationToken);
        if (!emailResult.success) {
            console.error("Failed to send verification email:", emailResult.error);
            // Still create the user but log the email failure
        }

        res.status(201).json({ 
            message: "Account created successfully! Please check your email to verify your account.",
            emailSent: emailResult.success
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "internal server error" });
    }
});

// Email verification route
router.get("/verify-email", async (req, res) => {
    try {
        const { token } = req.query;
        
        if (!token) {
            return res.status(400).json({ message: "Verification token is required." });
        }
        
        const user = await User.findOne({ 
            verificationToken: token,
            verificationExpires: { $gt: new Date() }
        });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token." });
        }
        
        // Mark email as verified
        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save();
        
        res.status(200).json({ message: "Email verified successfully! You can now login." });
    } catch (error) {
        console.error("Email verification error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Resend verification email
router.post("/resend-verification", async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        if (user.emailVerified) {
            return res.status(400).json({ message: "Email is already verified." });
        }
        
        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        user.verificationToken = verificationToken;
        user.verificationExpires = verificationExpires;
        await user.save();
        
        // Send verification email
        const emailResult = await sendVerificationEmail(email, verificationToken);
        
        if (emailResult.success) {
            res.status(200).json({ message: "Verification email sent successfully!" });
        } else {
            res.status(500).json({ message: "Failed to send verification email." });
        }
    } catch (error) {
        console.error("Resend verification error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/login", async(req, res) => {
    let { email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "no user exists with this email" });
        }
        
        // Check if email is verified (only for non-Google OAuth users)
        if (!user.googleId && !user.emailVerified) {
            return res.status(401).json({ 
                message: "Please verify your email address before logging in. Check your inbox for the verification email.",
                needsVerification: true
            });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "incorrect password" });
        }
        let payload = { id: user.id };
        let token = generateToken(payload);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true if using HTTPS
            sameSite: "lax", // or "none" if using HTTPS and cross-site
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        });

        res.status(200).json({ token: token, role: user.role });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.put("/profile/password", jwtAuthMiddleware, async (req,res) => {
    let userId = req.user.id;
    let { currPassword, newPassword } = req.body;
    try{
        if(currPassword === newPassword){
            return res.status(400).json({message:"your new password can be your curr password"});
        }
        let user = await User.findById(userId);
        let isMatch = await user.comparePassword(currPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "incorrect current password" });
        }
        user.password = newPassword;
        user.save();

        res.status(200).json({message:"password updated successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"internal server error"});
    }
});

router.get("/profile", jwtAuthMiddleware, async(req,res) => {
    let userId = req.user.id;
    try{
        let user = await User.findById(userId);
        res.status(200).json(user);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"internal server error"});
    }
})

router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: false, // true if using HTTPS
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // Expire the cookie
  });
  res.status(200).json({ message: "Logged out" });
});

// Test route to check Google OAuth status
router.get("/auth/status", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ 
            authenticated: true, 
            user: req.user,
            message: "User is authenticated via Google OAuth" 
        });
    } else {
        res.json({ 
            authenticated: false, 
            message: "User is not authenticated" 
        });
    }
});

// Setup password for Google OAuth users
router.post("/setup-password", tempTokenAuthMiddleware, async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;
        
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Set the password (it will be hashed by the pre-save middleware)
        user.password = password;
        await user.save();
        
        // Generate permanent token
        let payload = { id: user.id };
        let token = generateToken(payload);
        
        // Set permanent token cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        });
        
        // Clear temp token
        res.cookie("temp_token", "", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            expires: new Date(0),
        });
        
        res.status(200).json({ 
            message: "Password set successfully",
            token: token 
        });
    } catch (error) {
        console.error("Password setup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;