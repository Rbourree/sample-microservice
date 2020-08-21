const { postgres } = require('../../Libs/postgres')
const validator = require('validator');

module.exports = (req, res) => {

    // Payload validator
    if (!req.body.email || !validator.isEmail(req.body.email)) return res.status(400).json({ success: false, error: "valid email required" });
    if (!req.body.password || req.body.password.length < 5) return res.status(400).json({ success: false, error: "valid password required" });


    // Create user
    postgres.users.create(req.body)
        .then((user) => {
            return res.json({ success: true, data: user });
        })
        .catch((error) => {
            console.log(error)
            if (error.name === "SequelizeUniqueConstraintError") return res.status(400).json({ success: false, error: "Account already exist" });
            return res.status(400).json({ success: false, error: error });
        })

}   