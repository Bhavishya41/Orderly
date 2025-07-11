const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../middlewares/jwt");
const Order = require("./../models/orders");
const User = require("./../models/user");
const Product = require("./../models/products"); // Added Product model import
const { generateOTP, sendOrderOTP, verifyOTP } = require("../utils/otpUtils");

// Request OTP for order placement
router.post("/request-otp", jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Allow Google OAuth users and admin users to request OTP even if email not verified
        // (they'll get verification email in the callback)
        if (!user.emailVerified && !user.googleId && user.role !== "admin") {
            return res.status(400).json({ 
                message: "Please verify your email first. Check your inbox for verification email or use Google OAuth to sign in." 
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to user
        user.orderOtp = otp;
        user.orderOtpExpires = otpExpiry;
        await user.save();

        // Send OTP email
        const emailResult = await sendOrderOTP(user.email, otp);
        
        if (!emailResult.success) {
            return res.status(500).json({ message: "Failed to send OTP", error: emailResult.error });
        }

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Place order with OTP verification
router.post("/", jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { products, otp } = req.body; 
        
        const user = await User.findById(userId);
        if (!user){
            return res.status(404).json({ message: "User not found" });
        } 

        // Verify OTP (skip for admin users)
        if (user.role !== "admin") {
            if (!verifyOTP(user.orderOtp, user.orderOtpExpires, otp)) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }

            // Clear OTP after successful verification
            user.orderOtp = null;
            user.orderOtpExpires = null;
            await user.save();
        }

        const order = new Order({
            username: user.name,
            products,
            orderDate: new Date()
        });
        await order.save();

        // Decrement product quantity in the DB when an order is placed.
        const updatedProducts = [];
        for (const item of products) {
            const product = await Product.findById(item._id);
            if (product) {
                product.stock = Math.max(0, product.stock - item.quantity);
                await product.save();
                updatedProducts.push(product);
            }
        }

        user.orders.push(order._id);
        await user.save();

        res.status(201).json({ message: "Order placed successfully", order, updatedProducts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.get("/", jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let result;
        if (user.role === "admin") {
            // Return all orders for admin
            result = await Order.find();
        } else {
            // Return only this user's orders
            await user.populate("orders");
            result = user.orders;
        }

        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.delete("/:orderId", jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.orderId;

        await User.findByIdAndUpdate(userId, { $pull: { orders: orderId } });

        const result = await Order.findByIdAndDelete(orderId);
        if (!result){
            return res.status(404).json({ message: "Order not found" });
        } 
        res.status(200).json({ message: "Order deleted", result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
});

module.exports = router;