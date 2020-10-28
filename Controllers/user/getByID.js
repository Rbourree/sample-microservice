const { postgres } = require('../../Libs/postgres')
const validator = require('validator');
const { HttpError } = require('../../Libs/handleError');

module.exports = async (req) => {
    const id_user = req.params.id_user;

    // Params validator
    if (!id_user || !validator.isInt(id_user)) throw new HttpError(400, "Valid param id_user required");

    try {
        let user = await postgres.users.findOne({ where: { id: id_user } });
        if(!user) throw new HttpError(400, "User not found");

        return user;
    } catch (error) {
        throw error;
    }
}