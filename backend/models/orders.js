const express = require("express");
const mongo = require("mongoose");
const User = require("./user");
const Product = require("./products");

const orderSchema = new mongo.Schema(
    {
        username: { type: String, required: true }, 
        products: [
            {
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, default: 1 }
            }
        ],
        orderDate: { type: Date, default: Date.now }
    }
);

const Order = mongo.model("order", orderSchema);

module.exports = Order;