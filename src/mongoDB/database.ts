import mongoose from "mongoose"
import config from "../config/config"
import ConnectMongoDBSession from "connect-mongodb-session"
import session from 'express-session'

const connectMongoose = mongoose
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
export { mongoDBStore }
export { connectMongoose }
