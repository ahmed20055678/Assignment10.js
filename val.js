const joi=require('joi')
const genralRule=require('./common/gen.rule')
const { refreshToken } = require('./app/servsi')
const { query, param } = require('./app/route')
const signupschma={
        body:joi.object({
            fName:joi.string().required(),
            lName:joi.string().required(),
            email:genralRule.email.required(),
            password:genralRule.password.required(),
            age: joi.number().required(),
            phone: joi.string().required()
        }).required(),
        files: joi.object({
    atthments: joi.array()
        .items(
            genralRule.file.required()
        )
        .min(1)
        .max(2)
        .required()
        .messages({
            "any.required": "Attachments are required",
            "array.min": "At least one attachment is required",
            "array.max": "Maximum 2 attachments allowed"
        }),

    atthment: joi.array()
        .items(
            genralRule.file.required()
        )
        .length(1)
        .required()
        .messages({
            "any.required": "Profile image is required",
            "array.length": "Exactly one profile image is required"
        })
}).required()
    }
const refreshTokenSchema={
    headers:joi.object({
        token:joi.string().required(),
        connection: joi.string(),
        "accept-encoding": joi.string(),
        accept: joi.string(),
        "user-agent": joi.string(),
        host: joi.string(),
        "content-length": joi.string(),
        "postman-token": joi.string(),
        "cache-control": joi.string()
    }).required()
}
const shareProfileschema={
    params:joi.object({
        id:genralRule.id.required()
    }).required()
}
const updateProfileSchema={
    body:joi.object({
        fName:joi.string(),
        lName:joi.string(),
        password:genralRule.password,
        age: joi.number(),
        phone: joi.string()
        }).required()
}
const updatePasswordSchema={
    body:joi.object({
        oldPassword:joi.string().required(),
        newPassword:joi.string().required()
    })
}
const confirmEmailSchema = {
    body: joi.object({
        email: joi.string().required(),
        otp: joi.string().pattern(/^[0-9]{6}$/).required()
    }).required()
};
const reseatPasswordSchema = {
    body: joi.object({
        email: joi.string().required(),
        code: joi.string().pattern(/^[0-9]{6}$/).required(),
        password:genralRule.password.required()
    }).required()
};
const createMessageSchema = {
    body: joi.object({
    content: joi.string(),
    userId: genralRule.id.required(),
    }).required(),

    files: joi.array().items(genralRule.file)
}
module.exports={signupschma,refreshTokenSchema,shareProfileschema,updateProfileSchema,updatePasswordSchema,confirmEmailSchema,reseatPasswordSchema,createMessageSchema}