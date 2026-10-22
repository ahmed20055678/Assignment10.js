
const authorization = (roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            throw new Error('authorization not correct')
        }

        next()
    }
}

module.exports = { authorization }