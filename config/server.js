'use strict'

import { dbConnection } from "./mongo.js"
import express from 'express'
import cors from 'cors'
import helmet from "helmet" 
import morgan from "morgan"
import userRoutes from "../src/user/user.routes.js"
import loginRoutes from "../src/auth/auth.routes.js"
class Server{
    constructor(){
        this.app = express()
        this.port = process.env.PORT || 3000
        this.userPath = '/ebc/v1/user'
        this.loginPath = '/ebc/v1/login'
        
        this.conectarDB()
        this.middlewares()
        this.routes()
    }

    async conectarDB(){
        await dbConnection()
    }

    middlewares(){
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.json())
        this.app.use(cors())
        this.app.use(helmet())
        this.app.use(morgan('dev'))
    }

    routes(){
        this.app.get('/', (req, res) => {
            res.send('Hello World')
        })
        this.app.use(this.userPath, userRoutes)
        this.app.use(this.loginPath, loginRoutes)
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`)
        })
    }
}

export default Server