const { postgres } = require('../../Libs/postgres')

module.exports = async (req) => {

    try {
        let users = await postgres.users.findAll();
        return users;
    } catch (error) {
        throw error;
    }
}