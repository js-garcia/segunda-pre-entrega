import { Router } from "express";
import { getManagerProducts } from "../dao/daoManager.js";

const routerProducts = Router()

const managerData = await getManagerProducts()
const productManager = new managerData()



routerProducts.get('/', async (req, res) => {
    try {
      let { limit = 10, page = 1, category = undefined, stock = undefined, sort = undefined } = req.query;
  
      // Validación de parámetros
      if (limit !== undefined && (isNaN(Number(limit)) || limit < 1 || limit > 100)) {
        throw new Error("Parameter 'limit' must be a number between 1 and 100");
      }
      if (page !== undefined && (isNaN(Number(page)) || page < 1)) {
        throw new Error("Parameter 'page' must be a positive integer");
      }
      if (category !== undefined && typeof category !== 'string') {
        throw new Error("Parameter 'category' must be a string");
      }
      if (stock !== undefined && (isNaN(Number(stock)) || stock < 0)) {
        throw new Error("Parameter 'stock' must be a non-negative integer");
      }
      if (sort !== undefined && sort !== 'asc' && sort !== 'desc') {
        throw new Error("Parameter 'sort' must be either 'asc' or 'desc'");
      }
  
      // Construcción de filtro
      let filter = {};
      if (category !== undefined) {
        filter.category = category;
      }
      if (stock !== undefined) {
        filter.stock = { $gt: Number(stock) - 1 };
      }
  
      // Configuración de opciones de paginación y ordenamiento
      const options = {
        page: Number(page),
        limit: Number(limit),
        sort: undefined,
      };
      if (sort !== undefined) {
        options.sort = sort === 'asc' ? 'price' : '-price';
      }
  
      // Lógica de consulta a la base de datos
      const products = await Product.paginate(filter, options);
      res.json({ products });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  })


routerProducts.get('/:pid', async (req, res) => { 
    try {
        const product = await productManager.getElementById(req.params.pid)
        res.send({
            status: "success",
            payload: product
        });
    } catch (error) {
        res.send({
            status: "error",
            payload: error
        })
    }
})
  
routerProducts.post('/', async (req, res) => {
    try {
        const info = req.body;
        let response = await productManager.addElements(info);
        res.send({
            status: "success",
            payload: response,
        });
    } catch (error) {
        res.send({
            status: "error",
            payload: error,
        });
    }
});

routerProducts.put('/:pid', async (req, res) => { 
    try {
        const product = await productManager.updateElement(req.params.pid, req.body)
        res.send({
            status: "success",
            payload: `Producto ${JSON.stringify(product)} actualizado.`
        })
    } catch (error) {
        res.send({
            status: "error",
            payload: error
        })       
    }    
})
  
routerProducts.delete('/:pid', async (req, res) => {
    try {
        const product = await productManager.deleteElement(req.params.pid) 
        res.send({
            status: "success",
            payload: `Producto ${JSON.stringify(product)} eliminado.`
        })
    } catch (error) {
        res.send({
            status: "error",
            payload: error
        })
    }
});


export default routerProducts;