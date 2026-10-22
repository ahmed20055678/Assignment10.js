const mauthres=require('./message.res')
const authres=require('../app/res')
const redis=require('./message.redis.res')
const jwt=require('jsonwebtoken')
const {Hash,CompareHash}=require('../common/hash')
const { Decrypt,Encrypt } = require('../common/encrep')
const { compare, hash } = require('bcrypt')
const {randomUUID}=require('crypto')
const { create } = require('../common/revoke.model')



const createMessage = async (content, userId, files, data) => {
    if (!content && !files.length) {
        throw new Error("content is required");
    }

    const exiestUser = await authres.findById(userId);

    if (!exiestUser) {
        throw new Error("user not found");
    }

    let urls = [];

    if (files.length) {
        for (const file of files) {
            urls.push(file.path);
        }
    }

    data.attachments = urls;

    return await mauthres.createMessage(data);
};

module.exports = { createMessage };
