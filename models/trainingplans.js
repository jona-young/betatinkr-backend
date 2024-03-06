const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { dateGetter } = require('../helpers/dateGetter')
const { dateSetter} = require('../helpers/dateSetter')
const { floatGetter } = require('../helpers/floatGetter')


const trainingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        get: dateGetter,
        set: dateSetter
    },
    endDate: {
        type: Date,
        required: true,
        get: dateGetter,
        set: dateSetter
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
            required: true,
            get: dateGetter,
            set: dateSetter
        },
        endDate: {
            type: Date,
            required: true,
            get: dateGetter,
            set: dateSetter
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
                notes: {
                    type: String,
                    required: false
                },
                activities: [{
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
                }]
            }]
        }]
    }]
}, { toJSON: { getters: true } })

const Trainingplans = mongoose.model('trainingplan', trainingSchema);
module.exports = Trainingplans;