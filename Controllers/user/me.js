const { postgres } = require('../../Libs/postgres')
const { waterfall } = require('async')

module.exports = (req, res) => {

    waterfall([

        // Find user
        (callback) => {
            console.log(req.session)
            postgres.users.findOne({ where: { id: req.headers.id_user }, attributes: { exclude: ["password"] } })
                .then((user) => {
                    return callback(null, user.get());
                })
                .catch((error) => {
                    return callback(error);
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