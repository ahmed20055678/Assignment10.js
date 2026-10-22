const bcrypt = require("bcrypt");

async function Hash(password, SALT_ROUNDS = 10) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

async function CompareHash(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
    Hash,
    CompareHash
};