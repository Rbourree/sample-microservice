const { postgres } = require('../../Libs/postgres')
const { HttpError } = require('../../Libs/handleError');

module.exports = async (req) => {
    const id_user = req.headers.id_user
    
    try {
        let user = await postgres.users.findOne({ where: { id: id_user}});
        if(!user) throw new HttpError(400, "user nor found");
        return user;
    } catch (error) {
        throw error;
    }
}