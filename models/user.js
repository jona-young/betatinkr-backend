const mongoose = require('mongoose');
const Schema = mongoose.Schema
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const { floatGetter } = require('../helpers/floatGetter')


const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter your firstname'],
    },
    lastName: {
        type: String,
        required: [true, 'Please enter your lastname'],
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'Minimum password length is 6 characters']
    },
    privilige: {
        type: Number,
        required: true
    },
    trainingplans: [{
        type: String,
        required: false
    }],
    activityTemplates: [{
        name: {
            type: String,
            required: true
        },
        exercises: [{
            name: {
                type: String,
                required: false
            },
            reps: {
                type: Number,
                required: false
            },
            sets: {
                type: Number,
                required: false
            },
            intensity: {
                type: mongoose.Types.Decimal128,
                required: false,
                get: floatGetter
            },
            units: {
                type: String,
                required: false
            },
            rest: {
                type: mongoose.Types.Decimal128,
                required: false,
                get: floatGetter
            },
            restUnits: {
                type: String,
                required: false
            },
        }]
    }],
    resetCode: {
        type: String,
        required: false
    },
    resetCodeExpiration: {
        type: Date,
        required: false
    }
}, {timestamps: true, toJSON: { getters: true }});

// Before user created
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
})

// After user created
userSchema.post('save', function(doc, next) {
    next();
})

const Users = mongoose.model('user', userSchema);
module.exports = Users;