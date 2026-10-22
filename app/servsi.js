const authres=require('./res')
const redis=require('./redis.res')
const eventEmaitter=require('../common/events')
const jwt=require('jsonwebtoken')
const {Hash,CompareHash}=require('../common/hash')
const { Decrypt,Encrypt } = require('../common/encrep')
const { compare, hash } = require('bcrypt')
const {randomUUID}=require('crypto')
const{ sendEmail,generateOtp}=require('../common/servcie')
const signup=async(data)=>{
    const {email}=data
    const user=await authres.findByEmail(email)
    if(user){
        throw new Error("user already exiest")
    }
    const otp = await generateOtp();
    const otpHash = await Hash(otp);
    await redis.setValue({
        key: `otp:${email}`,
        value: otpHash,
        ttl: 60 * 5
    });
    eventEmaitter.emit("confirm-email",async()=>{
        await sendEmail({
            to: email,
            subject: "Confirm Email",
            html: `<h1>otp:${otp}</h1>`
        });
    })
    await redis.setValue({
        key: `otp::max::${email}`,
        value: 1,
        ttl: 60 * 7
    });
 

    return await authres.createUser(data)
}
const resendOtp=async(email,supject="confirm email")=>{

    const blocked_ttl=await redis.ttl(`otp::block::${email}`)
    if(blocked_ttl>0){
        throw new Error(`you block you can resend otp after ${blocked_ttl}` )
    }
    const otpTti=await redis.ttl(`otp:${email}`)
    if(otpTti>0){
        throw new Error(`you can resend otp after ${otpTti}` )
    }
    const maxOtp=await redis.getvalue(`otp::max::${email}`)
    if (maxOtp>=5){
        await redis.setValue({
            key: `otp::block::${email}`,
            value: "1",
            ttl: 60 * 10
        })
        throw new Error(`you have excuded the maximum number of tries` )
    }

    const user=await authres.findByEmail(email,{isConfirmed:false})
    if(!user){
        throw new Error("user not exiest or isConfirmed")
    }
    const otp = await generateOtp();
    const otpHash = await Hash(otp);
    await redis.setValue({
        key: `otp:${email}`,
        value: otpHash,
        ttl: 60 * 5
    });
    eventEmaitter.emit("confirm-email",async()=>{
        await sendEmail({
            to: email,
            subject: supject,
            html: `<h1>otp:${otp}</h1>`
        });
    })
    
return await redis.incr(`otp::max::${email}`)

}
const signin=async(email,password)=>{
    user=await authres.findByEmail(email)
    if(!user){
        throw new Error("user not found")
    }
    if(! await CompareHash(password,user.password)){
        throw new Error("password not correct")
    }
    const token=randomUUID()
    const accessToken=jwt.sign({id:user._id,email:user.email,role: user.role},"ahmed123",{
        expiresIn:60*2,
        notBefore:0,
        jwtid:token

    })
    const refreshToken=jwt.sign({id:user._id,email:user.email},"ahmed12345",{
        expiresIn:60*60,
        jwtid:token
    })

    return {user,accessToken,refreshToken}
}
const getProfile=async(token)=>{
    if(!token){
        throw new Error("token not send")
    }
    const decode=jwt.verify(token,"ahmed123")
    const user=await authres.findByEmail(decode.email)
    if(!user){
        throw new Error("user not found")
    }
    return decode

}
const signupeWithGmail=async(data,idToken)=>{
    let user=await authres.findByEmail(data.email)
    if(!user){
        user= await authres.createUser({
            email:data.email,
            fName:data.given_name,
            lName:data.family_name,
            profileImage:data.picture,
            isConfirmed:data.email_verified,
            role:data.role,
            provider:"google"
        })
        if(user.provider=="system"){
            throw new Error("user already exiest")
        }
        const accessToken=jwt.sign({id:user._id,email:user.email},"ahmed123",{
        expiresIn:60*2,
        notBefore:30,
        
        })
        const refreshToken=jwt.sign({id:user._id,email:user.email},"ahmed12345")
    }
    return {user}
}
const refreshToken=async(token)=>{
    if(!token){
        throw new Error("token not send")
    }
    
    const decode=jwt.verify(token,"ahmed12345")
    console.log("Decoded token:", decode)
    const user=await authres.findByEmail(decode.email)
    if(!user){
        throw new Error("user not found")
    }
    const accessToken=jwt.sign({id:user._id,email:user.email},"ahmed123",{
        expiresIn:60*2,
        notBefore:30
    })
    return {decode,accessToken}
}
const shareProfile=async(id)=>{
    const user=await authres.findByIdwithoutpassword(id)
    if(!user){
        throw new Error("user not found")
    }
    user.phone=Decrypt(user.phone)
    return user
}

const updateProfile = async (id, data) => {
    const updateQuery = {};

    const { fName, lName, age, gender, phone } = data;

    if (fName !== undefined) {
        updateQuery.fName = fName;
    }

    if (lName !== undefined) {
        updateQuery.lName = lName;
    }

    if (age !== undefined) {
        updateQuery.age = age;
    }

    if (gender !== undefined) {
        updateQuery.gender = gender;
    }

    if (phone !== undefined) {
        updateQuery.phone = Encrypt(phone);
    }

    const user = await authres.findAndUpdate(id, updateQuery);

    if (!user) {
        throw new Error("user not found");
    }

    return user;
};
const updatePassword = async () => {

}
const logout=async ({key,value,ttl})=>{
    const user=await redis.setValue({key,value,ttl})
    return user
}
const isConfrim=async(email,otp,value)=>{

    const otpvalue = await redis.getvalue(`otp:${email}`);

    if(!otpvalue){
        throw new Error('otp expiar')
    }
    if(! await CompareHash(otp,otpvalue)){
        throw new Error('otp not correct')
    }
    const user=await authres.findWithEmailAndUpdate(email,value)
    if(!user){
        throw new Error("user not exiest")
    }
    await redis.deleteKey(`otp:${email}`)
    return user
}
const forgetPassword=async(email)=>{

    const blocked_ttl=await redis.ttl(`otp::block::${email}`)
    if(blocked_ttl>0){
        throw new Error(`you block you can resend otp after ${blocked_ttl}` )
    }
    const otpTti=await redis.ttl(`otp:${email}`)
    if(otpTti>0){
        throw new Error(`you can resend otp after ${otpTti}` )
    }
    const maxOtp=await redis.getvalue(`otp::max::${email}`)
    if (maxOtp>=5){
        await redis.setValue({
            key: `otp::block::${email}`,
            value: "1",
            ttl: 60 * 10
        })
        throw new Error(`you have excuded the maximum number of tries` )
    }

    const user=await authres.findByEmail(email,{isConfirmed:true})
    if(!user){
        throw new Error("user not exiest or isConfirmed")
    }
    const otp = await generateOtp();
    const otpHash = await Hash(otp);
    await redis.setValue({
        key: `otp:${email}`,
        value: otpHash,
        ttl: 60 * 5
    });
    eventEmaitter.emit("confirm-email",async()=>{
        await sendEmail({
            to: email,
            subject: "Confirm Email",
            html: `<h1>otp:${otp}</h1>`
        });
    })
    
return await redis.incr(`otp::max::${email}`)

}
const reseatPassword=async(email,code,password)=>{

    const otp = await redis.getvalue(`otp:${email}`);

    if(!otp){
        throw new Error('otp expiar')
    }
    if(! await CompareHash(code,otp)){
        throw new Error('invaled otp')
    }
    const user=await authres.findWithEmailAndUpdate(email,{password:await Hash(password),changecredital:new Date()})
    if (!user){
        throw new Error("user not exiest or isConfirmed")
    }
    return await redis.deleteKey(`otp:${email}`)
}
module.exports={signup,signin,getProfile,signupeWithGmail,refreshToken,shareProfile,updateProfile,updatePassword,logout,isConfrim,resendOtp,forgetPassword,reseatPassword}