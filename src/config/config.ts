import dotenv from 'dotenv'
import _ from 'lodash'
import { mongoDBStore } from '../mongoDB/database'

const envFound = dotenv.config()

let config

if (!('error' in envFound)) {
    config = envFound.parsed
} else {
    config = {}
    _.each(process.env, (value, key) => envFound[key] = value)
}

const mongo_user = process.env.MONGO_USERNAME
const mongo_pass = process.env.MONGO_PASSWORD
const mongo_host = process.env.MONGO_HOST
const google_client = process.env.GOOGLE_CLIENT_ID
const google_secret = process.env.GOOGLE_CLIENT_SECRET
const kakao_client = process.env.KAKAO_CLIENT_ID
const kakao_secret = process.env.KAKAO_CLIENT_SECRET
const naver_client = process.env.NAVER_CLIENT_ID
const naver_secret = process.env.NAVER_CLIENT_SECRET

const MONGO_OPTIONS = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}
const MONGO = {
    host: mongo_host,
    username: mongo_user,
    password: mongo_pass,
    options: MONGO_OPTIONS,
    url: `mongodb+srv://${mongo_user}:${mongo_pass}@${mongo_host}`
}
const restApplicationID = process.env.RESTAPPLICATIONID
const privateKey = process.env.PRIVATEKEY
const BOOTPAY = {
    restApplicationID: restApplicationID,
    privateKey: privateKey
}

const server_host = process.env.SERVER_HOSTNAME

const SERVER = {
    hostname: server_host
}
const GOOGLE = {
    client: google_client,
    secret: google_secret
}
const KAKAO = {
    client: kakao_client,
    secret: kakao_secret
}
const NAVER = {
    client: naver_client,
    secret: naver_secret
}

const corsWhitelist = [
    'https://frontend-git-develop-advi33.vercel.app',
    'https://frontend-git-ympark-advi33.vercel.app',
    'https://localhost:3000',
    'http://localhost:3000',
    'https://advist.vercel.app',
    'https://advist.co.kr',
    'https://www.advist.co.kr',
    'https://advist-admin.vercel.app',
    'https://localhost:8081',
    'http://localhost:8081'
]

const sessionConfig = {
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
}
config = {
    mongo: MONGO,
    server: SERVER,
    bootpay: BOOTPAY,
    google: GOOGLE,
    kakao: KAKAO,
    naver: NAVER,
    corsWhitelist: corsWhitelist,
    sessionConfig: sessionConfig
}

export default config