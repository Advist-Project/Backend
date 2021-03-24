import dotenv from 'dotenv'
import _ from 'lodash'

const envFound  = dotenv.config()
// ¼Õº¸±â
let config

if (!('error' in envFound)) {
    config = envFound.parsed;
  } else {
    config = {}
    _.each(process.env, (value, key) => envFound[key] = value)
}

const mongo_user = process.env.MONGO_USERNAME;
const mongo_pass = process.env.MONGO_PASSWORD;
const mongo_host = process.env.MONGO_HOST;
const MONGO_OPTIONS = {
    useNewUrlParser : true,    
    useFindAndModify : false,  
    useCreateIndex : true,     
    useUnifiedTopology : true
};
const MONGO = {
    host : mongo_host,
    username : mongo_user,
    password : mongo_pass,
    options : MONGO_OPTIONS,
    url : `mongodb+srv://${mongo_user}:${mongo_pass}@${mongo_host}`
};

const server_host = process.env.SERVER_HOSTNAME;

const SERVER = {
    hostname : server_host
};

config = {
    mongo : MONGO,
    server : SERVER

};

export default config;