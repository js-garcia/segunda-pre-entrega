import 'dotenv/config'
import express from 'express'
import * as path from 'path'
import { __dirname } from "./path.js"
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import { getManagerMessages } from './dao/daoManager.js'
import routerProducts from './routes/products.routes.js'
import routerSocket from './routes/socket.routes.js'
import routerCart from './routes/carts.routes.js'
import routerViews from './routes/views.routes.js'
import MongoStore from 'connect-mongo'

//Express Server
const app = express()

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//Port
app.set("port", process.env.PORT || 8080)

//Handlebars
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}))
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, "./views"))

//Routes
app.use('/', express.static(__dirname + '/public'))
app.use('/', routerSocket)
app.use('/realtimeproducts', routerSocket)
app.use('/api/products', routerProducts)
app.use('/api/carts', routerCart)
app.use('/chat', routerSocket)
app.use('/', routerViews)
// app.use(session({
//     store: MongoStore.create({
//         mongoUrl: process.env.MONGODBURL,
//         mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
//         ttl: 30
//     }),
//     secret: process.env.SESSION_SECRET,
//     resave: true,
//     saveUninitialized: true
// }))

//Launch
const server = app.listen(app.get("port"), ()=> console.log(`Server on port ${app.get("port")}`))

//Socket.io
const io = new Server(server);

const data = await getManagerMessages();
const managerMessages = new data();

io.on("connection", async (socket) => {
    console.log("Client connected");
    socket.on("message", async (info) => {
        console.log(info)
        await managerMessages.addElements([info])
        const messages = await managerMessages.getElements()
        console.log(messages)
        socket.emit("allMessages", messages)
    })

    socket.on("load messages", async () => {
        const messages = await managerMessages.getElements()
        console.log(messages)
        socket.emit("allMessages", messages)
    })
})
