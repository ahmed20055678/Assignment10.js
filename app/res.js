
const revokeTokenModel=require('../common/revoke.model')
const {User}=require('../common/model')

const findByEmail=async(email)=>{
    return await User.findOne({
        email: email,
        provider: "system"
    });
}
const createUser=async(data)=>{
    return await User.create(data)
}
const findById=async(id)=>{
    return await User.findById(id)
}
const findByIdwithoutpassword=async(id)=>{
    return await User.findById(id).select("-password")
}
const findAndUpdate = async (id, updateQuery) => {
    return await User.findByIdAndUpdate(
        id,
        { $set: updateQuery },
        { new: true, runValidators: true }
    );
};
const create=async(data)=>{
    return await revokeTokenModel.create(data)
}
const findWithEmailAndUpdate = async (email, value) => {
    return await User.findOneAndUpdate(
        {email},
        { $set: value },
        { new: true, runValidators: true }
    );
};
module.exports={findByEmail,createUser,findById,findAndUpdate,findByIdwithoutpassword,create,findWithEmailAndUpdate}