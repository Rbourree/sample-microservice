const { postgres } = require('../../Libs/postgres')
const { waterfall } = require('async')
const validator = require('validator');
const jwt = require('jsonwebtoken');

module.exports = (req, res) => {

    waterfall([

        // Logout
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