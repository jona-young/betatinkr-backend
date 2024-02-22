const mongoose = require('mongoose');
const Schema = mongoose.Schema


const tokenSchema = new Schema({
    refreshToken: {
        type: String,
        required: true
    },
    user: { 
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'User'
    }
});

const tokens = mongoose.model('token', tokenSchema);
module.exports = tokens;