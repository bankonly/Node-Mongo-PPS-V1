const dotenv = require("dotenv");
const mongoose = require("mongoose");
const _InitDatabase = require("starter-model-mongo");


// Load .env files
dotenv.config();

const env = process.env;
const db = env.MONGODB_URI;

const InitialDatabase = () =>
    _InitDatabase({ uri: db }, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        replicaSet: "rs",
    })

exports.InitialDatabase = InitialDatabase;
