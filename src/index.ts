import express from "express"
import { connectMongoose } from "./server/server"
import payRoutes from "./routes/pay"
import itemRoutes from "./routes/item"
import exhibitionRoutes from "./routes/exhibition"
import myPageRoutes from "./routes/myPage"
import adminRoutes from "./routes/admin"
import session from 'express-session'
import passportModule from 'passport'
import config from "./config/config"
import passportHandler from './controllers/user'
import userRoutes from './routes/user'


const app = express()
app.use(express.json())
app.set("trust proxy", 1)
connectMongoose

// cors 지정
app.use((req: any, res: any, next: any) => {
  const corsWhitelist: string[] = config.corsWhitelist
  if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  }

  next()
})

//세션 설정
app.use(session(config.sessionConfig))

//passport 실행
app.use(passportModule.initialize())
app.use(passportModule.session())

passportHandler(passportModule)

app.get(
  "/",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.send("hi")
  }
)
app.use("/user", userRoutes)
// app.use("/userinfo", userInfoRoutes)
app.use("/pay", payRoutes)
app.use("/item", itemRoutes)
app.use("/exhibition", exhibitionRoutes)
app.use("/mypage", myPageRoutes)
app.use("/admin", adminRoutes)

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const error = new Error("Not Found")
    res.status(404).json({
      message: error.message,
    })
  }
)

const port = process.env.PORT || 5000
app.listen(port, () => console.log("start" + port))
