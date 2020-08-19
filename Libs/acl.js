
const jwt = require('jsonwebtoken');

module.exports = function (policies, token) {

    return function (req, res, next) {
        if (token === 'required') {
            if (req.headers.authorization) {
                jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET, (err, decoded) => {
                    if (err) return res.status(401).json({ success: false, error: "Wrong token" });
                    if (decoded && decoded.id && decoded.level) {
                        if(policies.includes(decoded.level) || policies.includes('all')){
                            next();
                        }
                        else{
                            return res.status(401).json({ success: false, error: "Insufficient permissions to access resource" });
                        }
                    }
                    else{
                        return res.status(401).json({ success: false, error: "Wrong token" })
                    }

                });

            }
            else {
                return res.status(401).json({ success: false, error: "Token required" })
            }

        }
        else {
            next();
        }
    }
}