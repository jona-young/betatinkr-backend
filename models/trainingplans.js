const mongoose = require('mongoose')
const Schema = mongoose.Schema

const trainingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    activityType: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    blocks: [{
        name: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        deload: {
          type: Boolean,
          required: true 
        },
        weeks: [{
            name: {
                type: String,
                required: true
            },
            workouts: [{
                name: {
                    type: String,
                    required: true
                },
                activities: [{
                    name: {
                        type: String,
                        required: true
                    },
                    exercises: [{
                        name: {
                            type: String,
                            required: true
                        },
                        reps: {
                            type: Number,
                            required: true
                        },
                        sets: {
                            type: Number,
                            required: true
                        },
                        intesity: {
                            type: mongoose.Types.Decimal128,
                            required: true,
                        },
                        units: {
                            type: String,
                            required: true
                        },
                        rest: {
                            type: mongoose.Types.Decimal128,
                            required: true
                        }
                    }]
                }]
            }]
        }]
    }]
})

const Trainingplans = mongoose.model('trainingplan', trainingSchema);
module.exports = Trainingplans;