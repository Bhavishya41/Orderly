const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware, generateToken } = require("./../middlewares/jwt");
const { mongo } = require("mongoose");
const Category = require("./../models/category");
const User = require("./../models/user"); 

const checkAdminRole = async (userId) => {
    try{
        const user = await User.findById(userId);
        return user.role === "admin";
    }catch(err){
        return false;
    }
}

router.post("/", jwtAuthMiddleware, async(req,res) => {
    let userId = req.user.id;
    if(! await checkAdminRole(userId)){
        return res.status(401).json({message:"only admin is allowed to add products"});
    }
    try{
        let category = await Category.findOne({name:req.body.name});
        if(category){
            return res.status(400).json({message:"category already exists"});
        }
        let result = await new Category(req.body);

        console.log(result);
        await result.save();

        res.status(201).json({result});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"internal server error"});
    }
});

router.get("/", async(req,res) => {
    try{
        let result = await Category.find();

        console.log(result);
        res.status(200).json(result);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"internlal server error"});
    }
})

router.delete('/:categoryId', jwtAuthMiddleware, async (req, res) => {
    let userId = req.user.id;
    if (!await checkAdminRole(userId)) {
        return res.status(401).json({ message: "only admin is allowed to delete categories" });
    }
    try {
        const categoryId = req.params.categoryId;
        const result = await Category.findByIdAndDelete(categoryId);
        if (!result) {
            return res.status(404).json({ error: 'category not found' });
        }
        res.status(200).json({ message: "category deleted", result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;