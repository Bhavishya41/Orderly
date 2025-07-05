const express = require("express");
const mongo = require("mongoose");
const Product = require("./products");

const categorySchema = new mongo.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: String
    }
)

const Category = new mongo.model("category",categorySchema);

module.exports = Category;