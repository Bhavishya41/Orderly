const express = require("express");
const mongo = require("mongoose");
const bcrypt = require("bcrypt");
const Order  = require("./orders")

const userSchema = new mongo.Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true
        },
        password: String,
        googleId: String, 
        role: { 
            type: String,
            enum: ["user","admin"],
            default: "user"
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        verificationToken: String,
        verificationExpires: Date,
        orderOtp: String,
        orderOtpExpires: Date,
        orders: [
            {
                type: mongo.Schema.Types.ObjectId,
                ref: "order"
            }
        ]
    }
);

userSchema.pre('save', async function(next){
    const person = this;

    // Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();

    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);
        
        // Override the plain password with the hashed one
        person.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

const User = new mongo.model("user",userSchema);

module.exports = User;