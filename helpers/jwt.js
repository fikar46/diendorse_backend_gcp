const jwt = require ('jsonwebtoken');

var config = require ('../config');

module.exports = {
    createJWTToken(payload, time){
        // console.log(payload)
        if(time){
            duration = time
        }
        return jwt.sign(payload, config.jwtKey)
    },
    auth : (req, res, next) => {
        // console.log(req.method)
        // console.log(req.token)
        if (req.method !== "OPTIONS") {
            // let success = true;
            jwt.verify(req.token, config.jwtKey, (error, decoded) => {
                if (error) {
                    // success = false;
                    return res.status(401).json({ message: "User not authorized.", error: "User not authorized." });
                }
                // console.log(decoded)
                req.user = decoded;
                next();
            });
        } else {
            next();
        }
    }
}