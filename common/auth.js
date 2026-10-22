
const jwt = require('jsonwebtoken');
const authres = require('../app/res');
const redis = require('../app/redis.res');

const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            throw new Error('Token not exists');
        }

        const decoded = jwt.verify(token, 'ahmed123');

        const user = await authres.findById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        if (user?.changecredital && user.changecredital.getTime() > decoded.iat * 1000) {
            throw new Error("token expier must login again");
        }

        if (await redis.ttl(`revoke-token::${user.id}::${decoded.jti}`) > 0) {
            throw new Error("invalid revoke-token");
        }

        req.user = user;
        req.decoded = decoded;

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { authentication };