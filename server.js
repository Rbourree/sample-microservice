const express = require('express');
const bodyParser = require('body-parser');
const routing = require('./Libs/routing');
const postgres = require('./Libs/postgres');
const app = express();
const session = require('express-session');

const cors = require('cors')

// ***** Environment variables *****
require('dotenv').config();
const port = process.env.PORT || 3000;

// ***** Errors Environment Variables *****
let envRequired = ["SERVICE_NAME", "PORT", "TOKEN_SECRET", "SESSION_SECRET", "POSTGRES_URL"]
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
// const day = 24 * 60 * 60 * 1000; // 24h
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET,
}));

// ***** Start Server *****
module.exports = app.listen(port, () => {
    routing.run(app);
    console.log('Microservice %s listening on', process.env.SERVICE_NAME, port)
    postgres.authenticate();
});