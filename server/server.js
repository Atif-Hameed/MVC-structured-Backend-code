import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import connectDb from "./config/db.js";


//env config
dotenv.config()

//database Connection
connectDb();

//rest objext
const app = express()

//middlewares
app.use(express.json())
app.use(cors())


//route
//routes import
import testRouter from './routes/testRoute.js'
import userRoute from './routes/userRoute.js'
app.use('/api/v1', testRouter)
app.use('/api/v1/user', userRoute)

app.get('/', (req, resp) => {
    return resp.status(200).send("<h1>Welcom to server</h1>")
})

//port
const PORT = process.env.PORT || 8000;

//listen
app.listen(PORT, () => {
    console.log(`Server is Running on Port ${process.env.PORT}`)
})