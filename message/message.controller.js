const authservsi=require('./message.servsi')
const {Encrypt,Decrypt}=require('../common/encrep')
const {Hash,CompareHash}=require('../common/hash')
const { compare, hash } = require('bcrypt')
const {OAuth2Client} = require('google-auth-library');
const { decode } = require('jsonwebtoken');
const { deleteKey, keys } = require('./message.redis.res');
const { password } = require('../common/gen.rule');
const client = new OAuth2Client();

const createMessage = async (req, res, next) => {
    try {
        const files = req.files || [];
        const { content, userId } = req.body;

        const atthments = files.map(file => file.path);

        const message = await authservsi.createMessage(
            content,
            userId,
            files,
            { content, userId, attachments: atthments }
        );

        res.status(201).json({
            message: "done",
            data: message
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { createMessage };
