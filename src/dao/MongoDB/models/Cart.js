import { ManagerMongoDB } from "../../../db/mongoDBManager.js";
import mongoose, { Schema } from "mongoose";
import ManagerProductsMongoDB from "./Product.js";

const url = process.env.URLMONGODB

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


class ManagerCartMongoDB extends ManagerMongoDB {
    constructor() {
        super(url, "carts", cartSchema)
        this.productModel = ManagerProductsMongoDB.model
    }
    async addProductToCart(idCart, idProduct) {
        await this._setConnection()
        try {
            console.log("esto es el cart", idCart, " y esto es el prod", idProduct)
            const cart = await this.model.findById(idCart);
            cart.products.push({
                productId: idProduct,
                //quantity: quantity
            })
            await cart.save()
            return cart.products
        } catch(error) {
            return error
        }
    }
    async updateProdQty(idCart, idProduct, prodQty) {
        await this._setConnection() // con el _ se pasa a protected
        //Get cart and check if product exists
        const cart = await this.model.findById(idCart).populate('products.productId');
        console.log("Cart actual: ", cart)
        const productIndex = cart.products.findIndex(
            product => {
                //console.log(product.productId.id)
                //console.log(idProduct)
                return product.productId.id === idProduct}) 
        if (productIndex === -1) throw new Error("Product not found in cart")

        try {
            let product = cart.products[productIndex];
            product.quantity = prodQty;
            await cart.save()
            return product;
        } catch(error) {
            return error
        }
    }

    async updateAllProducts(idCart, prodArray) {
        await this._setConnection()
        try {
            const cart = await this.model.findById(idCart)//.populate('products.productId');
            cart.products = prodArray
            await cart.save()
            return cart.products
        } catch(error) {
            return error
        }
    }

    async deleteProductFromCart(idCart, idProduct) {
        await this._setConnection();
        
        const cart = await this.model.findById(idCart).populate('products.productId');
        const productIndex = cart.products.findIndex(
            product => {
                return product.productId.id === idProduct})

        try {
            cart.products.splice(productIndex, 1);
            await cart.save();
            return cart.products;
        } catch(error) {
            return error
        }
    }

    async deleteAllProducts(idCart) {
        await this._setConnection();
        
        const cart = await this.model.findById(idCart);
        try {
            cart.products = [];
            await cart.save();
            return cart.products;
        } catch(error) {
            return error
        }
    }
}

export default ManagerCartMongoDB
