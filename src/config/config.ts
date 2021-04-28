import dotenv from 'dotenv'
import _ from 'lodash'

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

config = {
    mongo: MONGO,
    server: SERVER,
    bootpay: BOOTPAY,
    google: GOOGLE,
    kakao: KAKAO,
    naver: NAVER,
}

export default config