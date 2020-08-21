const { postgres } = require('../../Libs/postgres')
const async = require('async')
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { response } = require('express');
const session = require('express-session');
const client = require("redis").createClient();

module.exports = (req, res) => {

    // Payload validator
    if (!req.body.email || !validator.isEmail(req.body.email)) return res.status(400).json({ success: false, error: "valid email required" });
    if (!req.body.password || req.body.password.length < 5) return res.status(400).json({ success: false, error: "valid password required" });


    async.waterfall([

        // Login
        (callback) => {
            client.keys('*', (err, keys) => {
                if (err) return callback(err);
                return callback(null, keys)
            })
        },

        (keys, callback) => {
            async.map(keys, (key, cb) => {
                client.get(key, (error, value) => {
                    if (error) return cb(error);
                    var job = {};
                    job['jobId'] = key;
                    job['data'] = value;
                    cb(null, job);
                });
            }, (error, results) => {
                if (error) return callback(error)
                return callback(null, results);
            });
        },

        (sessions, callback) => {
            for (let i = 0; i < sessions.length; i++) {
                sessions[i].data = JSON.parse(sessions[i].data)
                sessions[i].cookie = sessions[i].data.cookie;
                sessions[i].id_user = sessions[i].data.key;
                delete sessions[i].data;
            }
            return callback(null, sessions)
        },

        (sessions, callback) => {
            let promises = [];
            for (let i = 0; i < sessions.length; i++) {
                promises.push(postgres.users.findOne({ where: { id: sessions[i].id_user }, raw: true}))
            }
            return callback(null, sessions, promises)
        },


        (sessions, promises, callback) => {
            Promise.all(promises)
                .then((responses) => {
                    for (let i = 0; i < responses.length; i++) {
                        sessions[i].user = responses[i];  
                    }
                    return callback(null, sessions)
                })
                .catch((errors) => {
                    return callback(null, errors)
                })
        }


    ], (error, user) => {
        if (error) {
            console.error(error);
            return res.status(400).json({ success: false, error: error })
        }
        return res.json({ success: true, data: user })
    })
}