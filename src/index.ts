import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import config from "./config/config"
import payRoutes from "./routes/pay"
import itemRoutes from "./routes/item"
import exhibitionRoutes from "./routes/exhibition"
import myPageRoutes from "./routes/myPage"
import adminRoutes from "./routes/admin"
import userInfoRoutes from "./routes/userInfo"
import session from 'express-session'
import ConnectMongoDBSession from "connect-mongodb-session"
import cookieParser from "cookie-parser"

// cors 등록

const app = express()
app.use(express.json())
app.use(cookieParser())

app.set("trust proxy", 1)
mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then((result) => {
    // console.log(result)
    console.log("connected")
  })
  .catch((error) => {
    console.log(error.message)
  })

//세션 저장을 위해 몽고db에 로그인
const MongoDBStore = ConnectMongoDBSession(session)
const mongoDBStore = new MongoDBStore({
  uri: config.mongo.url,
  databaseName: 'advist',
  collection: "sessions"
})

mongoDBStore.on("error", () => {
  // Error's here!
})

// cors 지정
// app.use(cors({ origin: "https://frontend-git-develop-advi33.vercel.app", credentials: true }))
app.use((req: any, res: any, next: any) => {
  const corsWhitelist = [
    'https://frontend-git-develop-advi33.vercel.app',
    'https://frontend-git-ympark-advi33.vercel.app',
    'https://localhost:3000',
    'http://localhost:3000',
    'https://advist.vercel.app',
    'https://advist.kr',
    'https://www.advist.kr',
    'https://advist-admin.vercel.app',
    'http://localhost:8081'
  ]
  if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  }

  next()
})

//세션 설정
app.use(
  session({
    secret: "secretcode",
    // 모든 request마다 기존에 있던 session에 아무런 변경사항이 없을 시에도 그 session을 다시 저장하는 옵션
    // (매 request 마다 세션을 계속 다시 저장하는 것)
    resave: false,
    // request가 들어오면 해당 request에서 새로 생성된 session에 아무런 작업이 이루어지지 않은 상황 
    // false -> 아무런 작업이 이루워지지 않은 경우 저장 X
    saveUninitialized: false,
    store: mongoDBStore, //세션을 데이터베이스에 저장
    cookie: {
      sameSite: "none",
      secure: true,
      // 모든 범위에서 이 쿠키 사용 가능 "/"
      // default일 경우 쿠키가 생성된 해당 페이지에서만 가능
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }
  }))

//passport 실행
app.use(passport.initialize())
app.use(passport.session())


//app을 인자로 보내서 passport를 return 값으로 받음
var passport = require('./controllers/user')(app) // 받은 passport를 passort라는 변수에 저장
var userRoutes = require('./routes/user')(passport) //import가 아닌 require 함수로 가져옴

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
