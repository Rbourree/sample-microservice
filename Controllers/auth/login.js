const { postgres } = require('../../Libs/postgres')
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { HttpError } = require('../../Libs/handleError');

module.exports = async (req) => {
    const payload = req.body;
    
    // Payload validator
    if (!payload.email || !validator.isEmail(payload.email)) throw new HttpError(400, "valid email required");
    if (!payload.password || payload.password.length < 5) throw new HttpError(400, "password required");

    try {
        // Find user
        let user = await postgres.users.findOne({ where: { email: payload.email } });
        if (!user) throw new HttpError(401, "Account not found")
        if (!user.validPassword(payload.password)) throw new HttpError(400, "Wrong password");
        

        // Generate new token
        const token = jwt.sign({ id_user: user.id }, process.env.TOKEN_SECRET, { expiresIn: '7d' });
        user = await user.update({ token: token })

        // End
        return user;
    } catch (error) {
        throw error;
    }
}