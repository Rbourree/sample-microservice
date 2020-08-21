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
            postgres.users.findOne({ where: { email: req.body.email } })
                .then((user) => {
                    if (!user) return callback("Account not found");
                    if (!user.validPassword(req.body.password)) return callback("Wrong password");
                    return callback(null, user)
                })
                .catch((error) => {
                    console.log(error)
                    return callback(error)
                })
        },

        // Generate new token
        (user, callback) => {
            const token = jwt.sign({ id_user: user.id }, process.env.TOKEN_SECRET, { expiresIn: '7d' });
            user.update({ token: token })
                .then((user) => {
                    return callback(null, user.get())
                })
                .catch((error) => {
                    return callback(error)
                })
        },

        // Make session
        (user, callback) => {
            delete user.password;
            req.session.key = user.id;
            return callback(null, user);
        }
        
    ], (error, user) => {
        if (error) {
            console.error("Error:", error);
            return res.status(401).json({ success: false, error: error })
        }
        return res.json({ success: true, data: user })
    })
}