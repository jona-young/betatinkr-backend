const nodemailer = require("nodemailer");
require('dotenv').config();

const resetPasswordEmail = async (toAddress, firstName, lastName, token) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PW
        }
    })

    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toAddress,
        subject: "betaTinkr - Password Reset Confirmation",
        html: `
        <html>
            <head>
            </head>
            <body>
                <p>
                    Dear ${firstName + ' ' + lastName},
                    <br>
                    <br>
                    You recently requested a new password for your betaTinkr account. Enter this 6-digit code on the password
                    reset page in the mobile application:
                    <br>
                    ${token}
                    <br>
                    <br>
                    Regards,
                    <br>
                    <br>
                    <b>betaTinkr Support(AUTOMATED)</b>
                    <br>
                    E: <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>
                </p>
            </body>
        </html>
        `
    })

    if (info)
    {
        return "Forgot password email sent!"
    }
}

module.exports = {resetPasswordEmail};