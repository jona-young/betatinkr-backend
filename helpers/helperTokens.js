const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const randToken = require('rand-token')
require('dotenv').config();

const generateToken = (user) => {
    const token = JWT.sign({
        firstName: user.firstName,
        lastName: user.lastName,
        uid: user._id,
        email: user.email,
        privilige: user.privilege
    }, 
    process.env.JWTSECRET, 
    {
        expiresIn: '4h',
        algorithm: 'HS256'
    })

    return token
}

const checkPassword = (clientPW, serverPW) => {
    return bcrypt.compare(clientPW, serverPW)
}

const getRefreshToken = () => {
    return randToken.uid(256)
}

module.exports = { generateToken, checkPassword, getRefreshToken }