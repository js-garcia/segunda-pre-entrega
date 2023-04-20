import { Router } from "express";
import { getManagerProducts } from "../dao/daoManager.js";

const routerViews = Router()

const PRODUCTS_URL = 'http://localhost:8080/api/products'
const CARTS_URL = 'http://localhost:8080/api/carts'

const prodManagerData = await getManagerProducts()
const prodManager = new prodManagerData()

routerViews.get('/', async (req, res) => {

    const promise = await fetch(PRODUCTS_URL)
    const response = await promise.json()

    const { status, payload, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink } = response

    res.render('products', {
        status,
        payload,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink
    })
})

routerViews.get('/carts/:cid', async (req, res) => {
    const response = await fetch(`${CARTS_URL}/${req.params.cid}`)
    const data = await response.json()
    console.log(data)

    const { status, payload } = data
    console.log("pl:", payload.products)

    let products = []
    for (const item of payload.products) {
        products.push({
            title: item.productId.title,
            description: item.productId.description,
            price: item.productId.price,
            quantity: item.quantity
        })
    }

    res.render('carts', {
        status,
        products
    })

})

export default routerViews