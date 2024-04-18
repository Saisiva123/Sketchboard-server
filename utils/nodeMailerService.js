const nodemailer = require('nodemailer');
const path = require("path");
require('dotenv').config({
    path: path.join(__dirname, '../' ,`.env.${process.env.NODE_ENV}`)
});


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'saisivadurgaprasad@gmail.com',
        pass: process.env.NODEMAILER_ACCNT_PASS, // set app password under security in gmail account
    },
});

const useEmailService = async (fromAddress, email_address, link) => {
    const mailOptions = {
        from: 'saisivadurgaprasadd@gmail.com',
        to: email_address,
        subject: 'Invitation to join the Sketchboard.',
        html: `<p>Hello, <b>Thanks for joining our Sketchboard </b>. Your friend ${fromAddress} has invited you to join the room.</p><br> <a href=${link}><button style="padding: 6px; border-radius:8px; background-color: #6c6c6c; color: white; font-size: 13px">Invitation Link</button></a>`,
    };

    return new Promise((res, rej) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                rej(error)
            } else {
                res(info.response)
            }
        });
    })

}

module.exports = useEmailService 