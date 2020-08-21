const { postgres } = require('../../Libs/postgres')
const { waterfall } = require('async')
const validator = require('validator');
const jwt = require('jsonwebtoken');

module.exports = (req, res) => {

    // Payload validator
    if (!req.body.email || !validator.isEmail(req.body.email)) return res.status(400).json({ success: false, error: "valid email required" });
    if (!req.body.password || req.body.password.length < 5) return res.status(400).json({ success: false, error: "valid password required" });


    waterfall([

        // Login
        (callback) => {
            req.session.destroy((err) => {
                if (err) return callback(err)
                return callback();
            });
        }
        
    ], (error) => {
        if (error) {
            console.error(error);
            return res.status(400).json({ success: false, error: error })
        }
        return res.json({ success: true})
    })
}