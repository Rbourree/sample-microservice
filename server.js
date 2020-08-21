const express = require('express');
const bodyParser = require('body-parser');
const routing = require('./Libs/routing');
const postgres = require('./Libs/postgres');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const app = express();
const client = require("redis").createClient();
const cors = require('cors')

// ***** Environment variables *****
require('dotenv').config();
const port = process.env.PORT || 3000;

// ***** Errors Environment Variables *****
let envRequired = ["SERVICE_NAME", "PORT", "TOKEN_SECRET", "SESSION_SECRET", "POSTGRES_URL", "REDIS_URL"]
let errors = [];

for (let i = 0; i < envRequired.length; i++) {
    if (!process.env[envRequired[i]]) errors.push("Environment variable " + envRequired[i] + " required !");
}

if (errors.length > 0) {
    for (let i = 0; i < errors.length; i++) {
        console.error(errors[i]);
    }
    return process.kill(process.pid);
}


// ***** Config Server *****
const day = 24 * 60 * 60 * 1000; // 24h
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260 }),
    saveUninitialized: false,
    resave: false,
    maxAge: day,
    expires: day,
    cookie: { secure: false, maxAge: day },
}));

// ***** Start Server *****
module.exports = app.listen(port, () => {
    routing.run(app);
    console.log('Microservice %s listening on', process.env.SERVICE_NAME, port)
    postgres.authenticate();
});