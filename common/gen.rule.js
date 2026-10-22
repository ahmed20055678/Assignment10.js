
const joi=require('joi')
const { Types } = require('mongoose')
const genralRule={
    email:joi.string(),
    password:joi.string(),
    file:joi.object({
                    fieldname: joi.string().required(),
                    originalname: joi.string().required(),
                    encoding: joi.string().required(),
                    mimetype: joi.string().required(),
                    path: joi.string(),
                    destination: joi.string(),
                    filename: joi.string(),
                    size: joi.number().required()
                }),
    id:joi.string().custom((value,helper)=>{
        return Types.ObjectId.isValid(value)?value:helper.message("invalid id")
    })
}
module.exports=genralRule