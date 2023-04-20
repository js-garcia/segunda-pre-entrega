import { Router } from "express";
import { getManagerMessages, getManagerProducts } from "../dao/daoManager.js";


const routerSocket = Router()
//const productManager = new ProductManager('src/models/productos.json')
const selectedDB = process.env.DBSELECTION
const prodManagerData = await getManagerProducts()
const prodManager = new prodManagerData()

const msgManagerData = await getManagerMessages()
const msgManager = new msgManagerData()


routerSocket.get('/', async (req, res) => {
    
    
    let { limit } = req.query;
    if (selectedDB == 1) {
        let products
        !limit
            ? products = await prodManager.getElements(0)
            : products = await prodManager.getElements(limit)
        res.render("index", { products })
    } else {
        // Postgres
    }
})

routerSocket.get("/realtimeproducts", async (req,res) => {
    if (selectedDB == 1) {
        const products = await prodManager.getElements(0)
        res.render("realTimeProducts", { products: products })
    } else {
        console.log("No SQL Database")
    }
})

routerSocket.get("/chat", async (req, res) => {
    const messages = await msgManager.getElements(0)
    res.render("chat", { messages: messages})
})


export default routerSocket;