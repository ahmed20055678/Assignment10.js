const authcontroller=require('./message.controller')
const auth=require('../common/auth')
const { signupschma,refreshTokenSchema,shareProfileschema,updateProfileSchema,updatePasswordSchema,confirmEmailSchema,reseatPasswordSchema,createMessageSchema } = require('../val')
const { signup } = require('../common/valdtion')
const authorization=require('../common/authrzation')
const {Router}=require('express')
const multerLocal=require('../common/multer')
const { Multer_Enum }=require('../common/multer.enum')
const messageRouter=Router()



messageRouter.post('/creat-message',multerLocal({custpath:"messages",custtype:Multer_Enum.images}).array([
    "atthments"
]),signup(createMessageSchema),authcontroller.createMessage)

module.exports=messageRouter