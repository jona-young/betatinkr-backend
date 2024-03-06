require('dotenv').config();
const { generateToken, checkPassword, getRefreshToken } = require('../helpers/helperTokens');
const { jwtDecode } = require('jwt-decode')
const User = require('../models/user.js');
const Token = require('../models/token.js')
const { handleUserErrors } = require('../helpers/handleErrors.js')
const { resetPasswordEmail } = require('../helpers/resetPasswordEmail.js')
const bcrypt = require('bcrypt')
const { floatGetter } = require('../helpers/floatGetter.js')

module.exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        
        if (!user) {
            return res.status(401).send({
                email: 'User not found!',
                password: ''
            })
        }

        const isPasswordValid = await checkPassword(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).send({
                email: '',
                password: 'Incorrect password!'
            })
        }

        const accessToken = generateToken(user)
        const decodedAccessToken = jwtDecode(accessToken)
        const accessTokenExpiry = decodedAccessToken.exp
        const refreshToken = getRefreshToken(user)

        const storedRefreshToken = new Token({ refreshToken, user: user._id})
        await storedRefreshToken.save()

        res.json({
            accessToken,
            expiresAt: accessTokenExpiry,
            refreshToken
        })
    } catch (err) {
        const errors = handleUserErrors(err)
        res.status(400).json({ errors });
    }
}

module.exports.signup = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body

        const userExists = await User.find({ email: email }).lean()
    
        if (userExists.length > 0) {
            return res.status(400).send({
                firstName: '',
                lastName: '',
                password: '',
                email: 'Email already exists'
            })
        }
    
        const newUser = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password,
            privilige: 1
        }
    
        const user = new User(newUser)
        const savedUser = await user.save()
    
        if (savedUser) {
            const accessToken = generateToken(savedUser)
            const decodedToken = jwtDecode(accessToken)
            const accessTokenExpiry = decodedToken.exp
            const refreshToken = getRefreshToken(savedUser)
    
            return res.status(200).json({
                message: 'User created successfully',
                accessToken,
                expiresAt: accessTokenExpiry,
                refreshToken
            })
        }
    } catch (err) {
        const errors = handleUserErrors(err)
        res.status(400).json({ errors });
    }
    
}

module.exports.refresh_token = async (req, res) => {
    const { refreshToken } = req.body

    try {
        const user = await Token.findOne({refreshToken}).select('user')

        if (!user) {
            return res.status(401).json({
                message: 'Invalid token'
            })
        }

        const existingUser = await User.findOne({ _id: user.user })

        if (!existingUser) {
            return res.status(401).json({
                message: 'Invalid token'
            })
        }

        const token = generateToken(existingUser)
        
        return res.status(200).json({ accessToken: token })
    } catch(err) {
        return res.status(500).json({message: 'Could not refresh token'})
    }
}

module.exports.forgot_password = async (req, res) => {
    const { email } = req.body

    try {
        const resetCode = Math.floor(100000 + Math.random() * 900000)
        const resetCodeExpiration = Date.now() + 15 * 60 * 1000 //min * sec per min * sec per ms
        const body = { resetCode: resetCode, resetCodeExpiration: resetCodeExpiration}

        User.findOneAndUpdate({email: email}, body)
        .then(async (result) => {
            await resetPasswordEmail(result.email, result.firstName, result.lastName, resetCode)

            return res.status(200).send({ email: 'If the user exists, an email was sent'})
        }).catch((err) => {
            return res.status(400).send({ email: 'If the user exists, an email was sent'})
        })
    } catch(err) {
        return res.send({ email: 'If the user exists, an email was sent'})
    }
}

module.exports.reset_password = async (req, res) => {
    const { email, resetCode, password } = req.body

    try {
        User.findOne({email: email})
        .then(async (result) => {
            if (!result || result.resetCode != resetCode) {
                return res.status(401).send({ resetCode: 'Incorrect verification code!', password: '', confirmPassword: ''})
            }

            if (result.resetCodeExpiration < new Date()) {
                return res.status(402).send({ resetCode: 'Token has expired, please try again!', password: '', confirmPassword: ''})
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            
            User.findOneAndUpdate({email: email}, {password: hashedPassword, resetCode: '', resetCodeExpiration: null})
            .then(async (result) => {
                return res.status(200).send({ result: true, message: 'Password reset!'})
            }).catch((err) => {
                return res.status(403).send({ resetCode: 'An error occured resetting your password. Please try again!', password: '', confirmPassword: ''})
            })
        }).catch((err) => {
            res.status(400).send({ resetCode: 'No user with that email', password: '', confirmPassword: ''})
        })
    } catch (err) {
        return res.status(500).send({resetCode: 'An error occured resetting your password. Please try again!', password: '', confirmPassword: ''})
    }
}

module.exports.activity_template = async (req, res) => {
    const body = req.body
    const uid = req.auth.uid

    try {
        User.findById(uid)
        .then((result) => {
            let updatedTemplates = [ ...result.activityTemplates ]
    
            updatedTemplates = updatedTemplates.concat(body)

            User.findByIdAndUpdate(uid, { activityTemplates: updatedTemplates }, {new: true})
            .then((result) => {
                res.status(200).json(result.activityTemplates)
            })
            .catch((err) => {
                res.status(err)
            })
        }).catch((err) => {
            res.status(err)
        })
    } catch (err) {
        res.status(400).json({ errors });
    }
}

module.exports.get_user_activity_templates = async (req, res) => {
    const uid = req.auth.uid

    User.findById(uid)
    .then((result) => {
        res.status(200).json(result.activityTemplates)
    }).catch((err) => {
        res.status(err)
    })
}

module.exports.update_activity_template = async (req, res) => {
    const uid = req.auth.uid
    const templateId = req.params.id
    const body = req.body

    User.findById(uid)
    .then((result) => {
        let updatedTemplates = result.activityTemplates.map((activity, idx) => {
            if (idx == templateId) {
                return body
            } else {
                return activity
            }
        })

        User.findByIdAndUpdate(uid, {activityTemplates: updatedTemplates})
        .then((updateResult) => {
            res.status(200).send({ message: 'success'})
        }).catch((err) => {
            res.status(err)
        })
    }).catch((err) => {
        res.status(err)
    })
}

//issue with receiving a response
module.exports.delete_activity_template = async (req, res) => {
    const uid = req.auth.uid
    const templateId = req.params.id

    User.findById(uid)
    .then((result) => {
        let updatedTemplates = result.activityTemplates.filter((activity) => {
            return activity._id.toString() !== templateId
        })

        if (updatedTemplates.length == 1 && updatedTemplates[0] == null) {
            updatedTemplates = []
        }

        User.findByIdAndUpdate(uid, {activityTemplates: updatedTemplates},  {new: true})
        .then((updateResult) => {
            res.status(200).json(updateResult.activityTemplates)
        }).catch((err) => {
            res.status(err)
        })
    }).catch((err) => {
        res.status(err)
    })
}

// // DELETE :id
// module.exports.user_delete = (req, res) => {
//     const token = req.cookies.jwt;
//     const id = req.params.id;

//      // Check jwt validation
//      if (token) {
//          jwt.verify(token, process.env.JWTSECRET, (err, decodedToken) => {
//              if (err) {
//                  res.status(400).send({ errors: {jwt: "Invalid JWT token"}})
//              } else {
//                 User.findByIdAndDelete(id)
//                 .then((result) => {
//                     res.status(200).cookie('jwt', '', { httpOnly: true, maxAge: 1 }).send(result);
//                 }).catch((err) => {
//                     res.status(400)
//                 })
//              }
//          })
//      }    
// }

// module.exports.get_user = (req, res) => {
//     const id = req.params.id
//     const token = req.cookies.jwt;

//     // Check jwt validation
//     if (token) {
//         jwt.verify(token, process.env.JWTSECRET, async (err, decodedToken) => {
//             if (err) {
//                 res.status(400).send({ errors: {jwt: "Invalid JWT token"}})
//             } else {
//                 User.findById(id)
//                 .then((result) => {
//                     res.status(200).json({ firstName: firstName, lastName: lastName, token: token, _id: user._id });
//                 }).catch((err) => {
//                     res.status(err);
//                 })  
//             }
//         })
//     }  
// }

// module.exports.put_user = (req, res) => {
//     const id = req.params.id;
//     const body = req.body;
//     const token = req.cookies.jwt;

//      // Check jwt validation
//      if (token)
//      {
//          jwt.verify(token, process.env.JWTSECRET, async (err, decodedToken) => {
//              if (err) {
//                  res.status(400).send({ errors: {jwt: "Invalid JWT token"}})
//              } else {
//                 User.findByIdAndUpdate(id, body)
//                 .then((result) => {
//                     res.status(200).send({ result: 'Updated!'})
//                 }).catch((err) => {
//                     res.status(400);
//                 })
//              }
//          })
//      }   
// }

// module.exports.forgot_password = async (req, res) => {
//     if (req.body.email !== undefined)
//     {
//         let emailAddress = req.body.email

//         User.findOne({ email: emailAddress})
//         .then(async (userAcc) => {
//             let payload = {
//                 id: userAcc._id,
//                 email: emailAddress
//             }

//             const token = createToken(payload,  userAcc.password + '-' + userAcc.privilige)

//             // send email out
//             await resetPasswordEmail(emailAddress, userAcc.firstName, userAcc.lastName, userAcc._id, token)

//             res.status(200).send({response: { email: 'Password reset email sent!'}})
//         }).catch((err) => {
//             res.status(400).send({response: { email: 'User not found!'}})
//         })
//     }
//     else { res.status(400).send({ response: {email: 'Email address not associated with an account'}})}
// }

// module.exports.forgot_password_check = (req, res) => {
//     const id = req.params.id
//     const _token = req.params.token

//     User.findOne({ _id: id})
//     .then((userAcc) => {
//         let payload = jwt.decode(_token, userAcc.password + '-' + userAcc.createdAt.getTime())

//         res.status(200).send({
//             id: payload.id,
//             token: _token
//         })
//     }).catch((err) => {
//         res.send(400)
//     })
// }

// module.exports.reset_password = (req, res) => {
//     const id = req.body.id
//     const _token = req.body.token
//     const { password1, password2 } = req.body

//     if ( password1 !== password2)
//     {
//         res.status(400).send({ errors: { password: "Passwords do not match!"}})
//     }
//     else
//     {
//         User.findOne({ _id: id})
//         .then(async (userAcc) => {
//             let payload = jwt.decode(_token, userAcc.password + '-' + userAcc.privilige)
    
//             const salt = await bcrypt.genSalt();
//             const hashedPW = await bcrypt.hash(password1, salt);

//             User.findByIdAndUpdate({ _id: payload.id.id }, { password: hashedPW})
//             .then(() => {
//                 res.status(200).send({ result: "Password updated!"})
//             }).catch((err) => {
//                 res.status(400).send({ errors: { password: "User profile updating was not successful!" }})
//             })
//         }).catch((err) => {
//             res.status(400).send({ errors: { password: "User not found!" }})
//         })
//     }
// }

// module.exports.contactus_post = async (req, res) => {
//     const body = req.body;
    
//     const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false,
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PW
//         }
//     })

//     const info = await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: process.env.EMAIL_USER,
//         subject: "Request - SUGGESTION",
//         html: `
//         <html>
//             <head>
//             </head>
//             <body>
//                 <p>
//                     You have received a suggestion from  ${body.firstName + " " + body.lastName},
//                     <br>
//                     <br>
//                     The message is as follows!
//                     <br>
//                     <br>
//                     ${body.message}
//                     <br>
//                     <br>
//                     Regards,
//                     <br>
//                     <br>
//                     <b>Scrapn Support(AUTOMATED)</b>
//                     <br>
//                     E: <a href="mailto:scrapn.services@gmail.com">scrapn.services@gmail.com</a>
//                 </p>
//             </body>
//         </html>
//         `
//     })

//     if (info)
//     {
//         res.status(200).send({ result: "message received!"})
//     }

// }