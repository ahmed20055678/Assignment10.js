const authcontroller=require('./controller')
const auth=require('../common/auth')
const { signupschma,refreshTokenSchema,shareProfileschema,updateProfileSchema,updatePasswordSchema,confirmEmailSchema,reseatPasswordSchema } = require('../val')
const { signup } = require('../common/valdtion')
const authorization=require('../common/authrzation')
const {Router}=require('express')
const multerLocal=require('../common/multer')

const authRouter=Router()



authRouter.post('/signup',multerLocal({custpath:"user",custtype:["image/png"]}).fields([
    {name:"atthments",maxCount:2},
    {name:"atthment",maxCount:1}
]),signup(signupschma),authcontroller.signup)
authRouter.post('/signup/gmail',authcontroller.signupeWithGmail)
authRouter.post('/signin',authcontroller.signin)
authRouter.get('/refresh-token',signup(refreshTokenSchema),authcontroller.refreshToken)
authRouter.get('/share-profile/:id',signup(shareProfileschema),authcontroller.shareProfile)
authRouter.patch('/update',auth.authentication,signup(updateProfileSchema),authcontroller.updateProfile)
authRouter.patch('/update-password',auth.authentication,signup(updatePasswordSchema),authcontroller.updatePassword)
authRouter.post('/logout',auth.authentication,authcontroller.logout)
authRouter.post('/getprofile',auth.authentication,authcontroller.getProfile)
authRouter.post('/confirm-otp',signup(confirmEmailSchema),authcontroller.isConfrim)
authRouter.post('/resend-otp',authcontroller.resendOtp)
authRouter.post('/forget-password',authcontroller.forgetPassword)
authRouter.post('/reseat-password',signup(reseatPasswordSchema),authcontroller.reseatPassword)
module.exports=authRouter