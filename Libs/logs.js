const { postgres } = require('./postgres')

module.exports = async (req, error) => {

    try {
        // Create log
        let log = await postgres.logs.create({
            method: req.method,
            status: error.HttpStatus,
            request: req.path,
            payload: req.body,
            response: error.message
        });

        // End
        return log;
    } catch (error) {
        throw error;
    }
}