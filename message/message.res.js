const message = require("../common/message.model");

const findById = async (id) => {
    return await message.findById(id);
};

const createMessage = async (data) => {
    return await message.create(data);
};

const findByIdwithoutpassword = async (id) => {
    return await message.findById(id);
};

const findAndUpdate = async (id, updateQuery) => {
    return await message.findByIdAndUpdate(
        id,
        { $set: updateQuery },
        { new: true, runValidators: true }
    );
};

module.exports = {
    createMessage,
    findById,
    findByIdwithoutpassword,
    findAndUpdate
};