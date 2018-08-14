const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
// const { mysecret } = require('../config');

const authenticate = (req, res , next) => {
    const token = req.get('Authorization');
    console.log("token:",token);
    const newToken = token.split(" ");
    if (newToken[1]) {
        jwt.verify(newToken[1], process.env.MY_SECRET, (error, decoded) => {
            if (error) {
                return res.status(422).json(error);
            }
            req.decoded = decoded;
            next();
        });
    } else {
        return res.status(403).json({error: 'No token provided, must be set on Authorization Header'});
    }
};

module.exports = {
    authenticate
};