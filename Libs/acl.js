
const jwt = require('jsonwebtoken');

module.exports = function (policies, token) {

    return function (req, res, next) {
        if (token === 'required') {
            if (req.headers.authorization) {
                jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET, (err, decoded) => {
                    if (err) return res.status(401).send()
                    if (decoded && decoded.id_user){
                        req.headers.id_user = decoded.id_user;
                        return next();
                    }
                    return res.status(401).send()
                });
            }
            else {
                return res.status(401).send()
            }
        }
        else {
            next();
        }
    }
}