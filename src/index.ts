import express from 'express'
import cors from "cors"
import mongoose from "mongoose"
import config from './config/config'

// cors 등록

const app = express()
app.use(express.json())
mongoose
.connect(config.mongo.url, config.mongo.options)
.then((result) => {
       console.log('connected')
})
.catch((error) => {
       console.log(error.message)
});

app.use(cors())
app.get("/", (req : express.Request , res : express.Response, next : express.NextFunction) => {
    res.send("hello")
})

const port = process.env.PORT || 5000
app.listen(port,()=>console.log("start"+port))