const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const Category = require("../models/category");
const User = require("./../models/user"); 
const { jwtAuthMiddleware } = require("../middlewares/jwt");
const multer = require("multer");
const path = require("path");

// Set up storage engine
const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage });

const checkAdminRole = async (userId) => {
    try{
        const user = await User.findById(userId);
        return user.role === "admin";
    }catch(err){
        return false;
    }
}

router.post("/", jwtAuthMiddleware, upload.single("image"), async (req, res) => {
    let userId = req.user.id;
    if(! await checkAdminRole(userId)){
        return res.status(401).json({message:"only admin is allowed to add products"});
    }
    try {
        const { name, description, price, category, stock, orderedBy } = req.body;

        let categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            return res.status(400).json({ message: "Category not found" });
        }

        // Convert image buffer to base64 string
        let image = "";
        if (req.file) {
            image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        }

        const product = new Product({
            name,
            description,
            price,
            category: categoryDoc._id,
            stock,
            orderedBy,
            image, // base64 string or empty
        });

        console.log(product);
        await product.save();

        res.status(201).json({ message: "Product added", product });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error"});
    }
});

router.put("/:productId", jwtAuthMiddleware, upload.single("image"), async (req, res) => {
    let userId = req.user.id;
    if (!await checkAdminRole(userId)) {
        return res.status(401).json({ message: "only admin is allowed to add products" });
    }
    try {
        const productId = req.params.productId;
        const updatedProductData = req.body;

        // If category is a name, convert it to ObjectId
        if (updatedProductData.category) {
            const categoryDoc = await Category.findOne({ name: updatedProductData.category });
            if (!categoryDoc) {
                return res.status(400).json({ message: "Category not found" });
            }
            updatedProductData.category = categoryDoc._id;
        }

        // Handle image update
        if (req.file) {
            updatedProductData.image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        }

        const result = await Product.findByIdAndUpdate(productId, updatedProductData, {
            new: true,
            runValidators: true,
        });

        if (!result) {
            return res.status(404).json({ error: 'product not found' });
        }

        console.log('data updated');
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:productId', jwtAuthMiddleware, async (req, res)=>{
    let userId = req.user.id;
    if(! await checkAdminRole(userId)){
        return res.status(401).json({message:"only admin is allowed to add products"});
    }
    try{
        const productId = req.params.productId; 

        const result = await Product.findByIdAndDelete(productId);

        if (!result) {
            return res.status(404).json({ error: 'product not found' });
        }

        console.log(result);
        res.status(200).json({message:"product deleted",result});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
}); 

router.get("/", async (req, res) => {
    try {
        let result = await Product.find().populate("category");
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.get("/details/:productId", async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).populate("category");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.get("/:categoryId", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await Product.find({ category: categoryId });
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for this category" });
        }

        console.log(products)
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
});

module.exports = router;