const nodemailer = require("nodemailer");
require('dotenv').config();

const resetPasswordEmail = async (toAddress, firstName, lastName, id, token) => {
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
        subject: "betatinkr - Password Reset Confirmation",
        html: `
        <html>
            <head>
            </head>
            <body>
                <p>
                    Dear ${firstName + ' ' + lastName},
                    <br>
                    <br>
                    You recently requested a new password for your betatinkr account.
                    If you made this request, please click the link below and follow the instructions.
                    <br>
                    <a href="${process.env.CLIENT_APP}/reset-password/${id}/${token}">Click Here!</a>
                    <br>
                    <br>
                    Regards,
                    <br>
                    <br>
                    <b>betatinkr Support(AUTOMATED)</b>
                    <br>
                    E: <a href="mailto:betatinkr.services@gmail.com">betatinkr.services@gmail.com</a>
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

module.exports = resetPasswordEmail;