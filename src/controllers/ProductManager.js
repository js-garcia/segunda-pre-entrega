import {promises as fs} from 'fs'

class Product {
    constructor(title, description, price, code, stock, category, status, thumbnail) {
        this.id = Product.addId()
        this.title = title;
        this.description = description;
        this.price = price;
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.status = status;
        this.thumbnail = thumbnail;
    }

    static addId(){
        if (this.idIncrement) {
            this.idIncrement++
        } else {
            this.idIncrement = 1
        }
        return this.idIncrement
    }
}

//Creamos los productos de base
const product1 = new Product(
    "Sirena Tejida",
    "Muñeca Tejida",
    1900,
    "#121",
    5,
    "M/Mi",
    true,
    []
  );
  
  const product2 = new Product(
    "Dragon",
    "Muñeco Tejido",
    2300,
    "#122",
    8,
    "M/M",
    true,
    []
  );
  
  const product3 = new Product(
    "Jirafa",
    "Animalito Tejido",
    2800,
    "#123",
    7,
    "M/G",
    true,
    []
  );
  
  const product4 = new Product(
    "Sailor Moon",
    "Muñeca Tejida",
    3500,
    "#124",
    6,
    "M/XL",
    true,
    []
  );
  

export class ProductManager {
    constructor(path) {
        this.path = path
    }

    addProduct = async (product,imgPath) => {
        //Validar que todos los campos sean completados que la propiedad "code" no esté repetida.
        const read = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(read);
        const prodCode = data.map((prod) => prod.code);
        const prodExist = prodCode.includes(product.code); 
        if (prodExist) {
            return console.log (`El código ${product.code} ya existe. Ingrese uno diferente.`)
        } else if (Object.values(product).includes("") || Object.values(product).includes(null)) {
            return console.log("Todos los campos deben ser completados.");
        } else {
            if (imgPath) {
                product.thumbnail = imgPath;
            }            
            const nuevoProducto = {id: Product.addId(), ...product};
            data.push(nuevoProducto);
            await fs.writeFile(this.path, JSON.stringify(data), 'utf-8')
            return console.log(`El producto con id: ${nuevoProducto.id} ha sido agregado.`) 
        }
    }

    getProducts = async () => {
        try {
            const read = await fs.readFile(this.path, 'utf-8')
            const prods = await JSON.parse(read)
            if (prods.length != 0) {
                console.log("Listado de productos:");
                return prods
            } 
        } catch {
            await this.createJson();
            await this.createProducts();
            return "Productos iniciales creados."
        }
    }

    getProductById = async (id) => {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const findProduct = prods.find((prod) => prod.id === parseInt(id));
        if (findProduct) {
            console.log("Se ha encontrado el siguiente producto:")
            return findProduct;
        } else {
            return console.log("Product Not found");
        }
    }

    updateProduct = async (id, {title, description, price, thumbnail, code, stock, category, status}) => {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(prods.some(prod => prod.id === parseInt(id))) {
            let index= prods.findIndex(prod => prod.id === parseInt(id))
            prods[index].title = title
            prods[index].description = description
            prods[index].price = price
            prods[index].thumbnail = thumbnail
            prods[index].code = code
            prods[index].stock = stock
            prods[index].category = category
            prods[index].status = status
            await fs.writeFile(this.path, JSON.stringify(prods))
            return "Producto actualizado" 
        } else {
            return "Producto no encontrado"
        }
    }

    deleteProduct = async (id) => {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(prods.some(prod => prod.id === parseInt(id))) {
            const prodsFiltrados = prods.filter(prod => prod.id !== parseInt(id))
            await fs.writeFile(this.path, JSON.stringify(prodsFiltrados))
            return "Producto eliminado"
        } else {
            return "Producto no encontrado"
        }
    }

    
    async createJson() {
        //Creamos archivo JSON de productos.
        await fs.writeFile(this.path, "[]");
    }

    async createProducts() {
    // Agregamos los productos.
    await this.addProduct(p1, ['../public/img/dragon.jpg']);
    await this.addProduct(p2, ['../public/img/gatito.jpg']);
    await this.addProduct(p3, ['../public/img/jirafa.jpg']);
    await this.addProduct(p4, ['../public/img/oso.jpg']);
    }
}