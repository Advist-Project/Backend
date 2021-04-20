import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import config from "./config/config"
import payRoutes from "./routes/pay"
import itemRoutes from "./routes/item"
import session from 'express-session'
import ConnectMongoDBSession from "connect-mongodb-session"

// cors 등록

const app = express()
app.use(express.json())
mongoose.connect(config.mongo.url, config.mongo.options)
  .then((result) => {
    // console.log(result)
    console.log("connected")
  })
  .catch((error) => {
    console.log(error.message)
  });

//세션 저장을 위해 몽고db에 로그인
const MongoDBStore = ConnectMongoDBSession(session);
const mongoDBStore = new MongoDBStore({
  uri: config.mongo.url,
  databaseName: 'advist',
  collection: "sessions"
});

mongoDBStore.on("error", () => {
  // Error's here!
});

// cors 지정
// app.use(cors({ origin: "https://frontend-git-develop-advi33.vercel.app", credentials: true }))
app.use(cors())
//세션 설정
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    store: mongoDBStore, //세션을 데이터베이스에 저장
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }
  }))

//app을 인자로 보내서 passport를 return 값으로 받음
var passport = require('./controllers/user')(app) // 받은 passport를 passort라는 변수에 저장
var userRoutes = require('./routes/user')(passport) //import가 아닌 require 함수로 가져옴

app.get(
  "/",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.send("hi")
  }
);
app.use("/user", userRoutes)
app.use("/pay", payRoutes)
app.use("/item", itemRoutes)
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
