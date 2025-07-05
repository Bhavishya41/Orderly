const express = require("express");
const mongo = require("mongoose");
const User = require("./user");
const Category = require("./category");

const productSchema = new mongo.Schema(
    {
        name: String,
        description: String,
        price: Number,
        category: { type: mongo.Schema.Types.ObjectId, ref: 'category', required: true },
        stock: Number,
        orderedBy: {
            type: [mongo.Schema.Types.ObjectId],
            ref: "User",
            default: []
        },
        image: { type: String, default: "" }
    }
);

const Product = new mongo.model("product", productSchema);

module.exports = Product;