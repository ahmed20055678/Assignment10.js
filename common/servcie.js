const nodemailer = require('nodemailer');
const {resolve}=require('node:path')
const {randomInt}=require('node:crypto')

const sendEmail = async ({ to, subject, html, attachments } = {}) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "ahmddyb349@gmail.com",
            pass: "dvbmuxcepargtnnt"
        }
    });

    const info = await transporter.sendMail({
        from: '"ahmed" <ahmddyb349@gmail.com>',
        to,
        subject,
        html: html || '',
        attachments:[{
            fileName:"ahmed.png",
            path:resolve('./uploads/user/4c30be73-2684-4fc5-912b-2f7991a1793c__Screenshot 2025-12-15 144425.png')
        }]
    });

    return info.accepted.lenght? true:false

};
const generateOtp=async()=>{
    return await randomInt(100000,1000000).toString()
}
module.exports = {
    sendEmail,
    generateOtp
};