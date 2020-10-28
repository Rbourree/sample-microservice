const { postgres } = require('../../Libs/postgres')
const validator = require('validator');
const { HttpError } = require('../../Libs/handleError');

module.exports = async (req) => {
    const payload = req.body;

    // Payload validator
    if (!payload.email || !validator.isEmail(payload.email)) throw new HttpError(400, "valid email required");
    if (!payload.password || payload.password.length < 5) throw new HttpError(400, "password required");

    try {
        // Create user
        let user = await postgres.users.create(payload);
        
        // End
        return user;
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") throw new HttpError(400, "Account already exist");
        throw error;
    }
}   