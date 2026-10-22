const authservsi=require('./servsi')
const {Encrypt,Decrypt}=require('../common/encrep')
const {Hash,CompareHash}=require('../common/hash')
const { compare, hash } = require('bcrypt')
const {OAuth2Client} = require('google-auth-library');
const { decode } = require('jsonwebtoken');
const { deleteKey, keys } = require('./redis.res');
const { password } = require('../common/gen.rule');
const client = new OAuth2Client();
const signup=async(req,res,next)=>{
    try{
        const paths=[]
        for (const file of req.files.atthments) {
            paths.push(file.path)
        }
        
        const{email,fName,lName,password,age,gender,phone}=req.body
        const user=await authservsi.signup({email,fName,lName,password:await Hash(password,10),age,gender,phone:Encrypt(phone),coverImage:paths,profileImage:req.files.atthment[0].path})
        res.json({
            message:"user add successfully",
            data:user, 
            
        })
    }catch(err){
        next(err)
    }
}
const signin=async(req,res,next)=>{
    try{
        const{email,password}=req.body
        const user=await authservsi.signin(email,password)
        res.json({
            message:"user signin",
            tokens:{
        accessToken: user.accessToken,
        refreshToken: user.refreshToken
            }
        })
    }catch(err){
        next(err)
    }
}
const signupeWithGmail=async(req,res,next)=>{
    try{
        const{idToken}=req.body
        const decode = await client.verifyIdToken({
        idToken,
        audience: "419188861713-6pj8ssf3cfb8e37o94mqfm07uj5hfok9.apps.googleusercontent.com",
    });
        const {email,given_name,family_name,picture,email_verified} = decode.getPayload();
        user=await authservsi.signupeWithGmail({email,given_name,family_name,picture,email_verified},idToken)
    }catch(err){
        next(err)
    }
}
const getProfile=async(req,res,next)=>{
    try{
        res.json({
            message:"user signin",
            data:req.user
        })
    }catch(err){
        next(err)
    }
}
const refreshToken=async(req,res,next)=>{
    try{
        const {token} = req.headers
        const user=await authservsi.refreshToken(token)
        res.json({
            message:"user signin",
            accessToken:user.accessToken
        })
    }catch(err){
        next(err)
    }
}
const shareProfile=async(req,res,next)=>{
    try{
        const id=req.params.id
        const user= await authservsi.shareProfile(id)
        res.json({
            message:"user signin",
            data:user
        })
    }catch(err){
        next(err)
    }
}
const updateProfile=async(req,res,next)=>{
    try{
        const id=req.user._id
        const { fName, lName, age, gender, phone }=req.body
        const user= await authservsi.updateProfile(id,{ fName, lName, age, gender, phone })
        res.json({
            message:"user update",
            data:user
        })
    }catch(err){
        next(err)
    }
}

const updatePassword = async (req, res, next) => {
    try {
        const { newPassword, oldPassword } = req.body;

        if (!await CompareHash(oldPassword, req.user.password)) {
            throw new Error("Old password is incorrect");
        }

        req.user.password = await Hash(newPassword);

        await req.user.save();

        res.status(200).json({
            message: "User password updated successfully"
        });

    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        const { flag } = req.query;

        if (flag == "all") {
            req.user.changecredital = new Date();
            await req.user.save();
            await deleteKey(await keys(`revoke-token::${req.user.id}`))
        }

        await authservsi.logout({
            key: `revoke-token::${req.user.id}::${req.decoded.jti}`,
            value: `${req.decoded.jti}`,
            ttl: req.decoded.exp - Math.floor(Date.now() / 1000)
        });

        res.status(200).json({
            message: "done"
        });
    } catch (err) {
        next(err);
    }
};

const isConfrim=async(req,res,next)=>{
    try{
        const value={isConfirmed: true}
        const{email,otp}=req.body
        const user=await authservsi.isConfrim(email,otp,value)
        res.json({
            message:"done",
            
        })
    }catch(err){
        next(err)
    }
}
const resendOtp=async(req,res,next)=>{
    try{
        const{email}=req.body
        const user=await authservsi.resendOtp(email)
        res.json({
            message:"done",
            
        })
    }catch(err){
        next(err)
    }
}
const forgetPassword=async(req,res,next)=>{
    try{
        const{email}=req.body
        const user=await authservsi.forgetPassword(email)
        res.json({
            message:"done",
            
        })
    }catch(err){
        next(err)
    }
}
const reseatPassword=async(req,res,next)=>{
    try{

        const{email,code,password}=req.body
        const user=await authservsi.reseatPassword(email,code,password)
        res.json({
            message:"done",
            
        })
    }catch(err){
        next(err)
    }
}
module.exports={signup,signin,getProfile,signupeWithGmail,refreshToken,shareProfile,updateProfile,updatePassword,logout,isConfrim,resendOtp,forgetPassword,reseatPassword}