require('dotenv').config();
const { generateToken, checkPassword, getRefreshToken } = require('../helpers/helperTokens');
const { jwtDecode } = require('jwt-decode')
const User = require('../models/user.js');
const Token = require('../models/token.js')
const { handleUserErrors } = require('../helpers/handleErrors.js')
const { resetPasswordEmail } = require('../helpers/resetPasswordEmail.js')
const bcrypt = require('bcrypt')

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

module.exports.get_user = async (req, res) => {
    const uid = req.auth.uid

    try {
        User.findById(uid)
        .then((result) => {
            res.status(200).json({ firstName: result.firstName, lastName: result.lastName, email: result.email})
        }).catch((err) => {
            res.status(400).json({ err });
        })
    } catch (err) {
        return res.status(500).json({message: 'Could not get user information!'})
    }
}

module.exports.delete_user = async (req, res) => {
    const uid = req.auth.uid

    try {
        User.findByIdAndDelete(uid)
        .then((result) => {
            res.status(200).send({ message: 'User successfully deleted!'})
        }).catch((err) => {
            res.status(400).send({ message: 'User was not found!'})
        })
    } catch (err) {
        return res.status(500).json({message: 'Could not get user information!'})
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
        res.status(400).json({ err });
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