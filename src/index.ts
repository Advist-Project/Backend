import express from 'express'
import cors from "cors"
import mongoose from "mongoose"
import config from './config/config'
import payRoutes from './routes/pay';
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
})

app.use(cors())
app.get("/", (req : express.Request , res : express.Response, next : express.NextFunction) => {
       res.send("hi")
})
app.use('/pay', payRoutes);
app.use((req : express.Request , res : express.Response, next : express.NextFunction) => {
       const error = new Error('Not Found');
       res.status(404).json({
              message : error.message
       });
});
 

const port = process.env.PORT || 5000
app.listen(port,()=>console.log("start"+port))