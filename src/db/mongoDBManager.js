import mongoose from "mongoose";

export class ManagerMongoDB {
    #url
    constructor(url, collection, schema) {
        this.#url = url //Private attribute
        this.collection = collection
        //this.schema = new mongoose.Schema(schema)
        //console.log("esquema por parametro", schema)
        //console.log("esquema instanciado", this.schema)
        this.schema = schema
        this.model = mongoose.model(this.collection, this.schema)
    }

    async _setConnection() { //Se usa # para convertirlo en método privado y _ para protected.
        try {
            await mongoose.connect(this.#url)
            console.log("MongoDB connected")
        } catch(error) {
            return error
        }
    }

    async addElements(elements) { //Agrego 1 o varios elementos
        this._setConnection()
        try {
            const insertar = await this.model.insertMany(elements)
            console.log("llegué a insertar", insertar)
            return insertar
        } catch(error) {
            return error
        }
    }
    
    async getElements(limit) {
        this._setConnection()
        try {
            return await this.model.find().limit(limit)
        } catch(error) {
            return error
        }
    }

    async getElementById(id) {
        this._setConnection()
        try {
            return await this.model.findById(id)
        } catch(error) {
            return error
        }
    }

    async updateElement(id, info) {
        this._setConnection()
        try {
            return await this.model.findByIdAndUpdate(id, info)
        } catch(error) {
            return error
        }
    }

    async deleteElement(id) {
        this._setConnection()
        try {
            return await this.model.findByIdAndDelete(id)
        } catch(error) {
            return error
        }
    }
}