require("dotenv").config()

const mongoose = require("mongoose")
const request = require("supertest")
const app = require("../server.js")

beforeEach(async () => {
    await mongoose.connect(process.env.DBURI)
})

afterEach(async () => {
    await mongoose.connection.close()
})

describe("SINGLE API routes /api/training-plan", () => {
    let tpID;
    let putName = 'Saitama TRAINING PLAN'
    let endDate = new Date()
    endDate.setDate(endDate.getDate() + 1)
    let tpName = '2024 Climbing Training Plan 3'

    let dummyData = {
        name: tpName,
        startDate: new Date(),
        endDate: endDate,
        activityType: 'Climbing',
        author: 'JY Money$',
        blocks: [{
            name: 'Meso Block 1',
            startDate: new Date(),
            endDate: endDate,
            deload: 1,
            weeks: [{
                name: 'Week 1',
                workouts: [{
                    name: 'Workout 1',
                    activities: [
                        {
                            name: 'Warm Up',
                            exercises: [{
                                name: 'Deep Squat Stretch',
                                reps: 5,
                                sets: 3,
                                intesity: 0.00,
                                units: 'BW',
                                rest: 30.00
                            }]
                        },
                        {
                            name: 'Climbing',
                            exercises: [{
                                name: 'Project Climbing',
                                reps: 3,
                                sets: 3,
                                intesity: 100.00,
                                units: '%',
                                rest: 300.00
                            }
                        ]  
                    }]                          
                }]
            },
            {
                name: 'Week 2',
                workouts: [{
                    name: 'Workout 1',
                    activities: [
                        {
                            name: 'Warm Up',
                            exercises: [{
                                name: 'Deep Squat Stretch',
                                reps: 5,
                                sets: 3,
                                intesity: 0.00,
                                units: 'BW',
                                rest: 30.00
                            }]
                        },
                        {
                            name: 'Climbing',
                            exercises: [{
                                name: 'Project Climbing',
                                reps: 3,
                                sets: 3,
                                intesity: 100.00,
                                units: '%',
                                rest: 300.00
                            }
                        ]  
                    }]                          
                }]
            }]
        },
        {
            name: 'Meso Block 2',
            startDate: new Date(),
            endDate: endDate,
            deload: 1,
            weeks: [{
                name: 'Week 1',
                workouts: [{
                    name: 'Workout 1',
                    activities: [
                        {
                            name: 'Warm Up',
                            exercises: [{
                                name: 'Deep Squat Stretch',
                                reps: 5,
                                sets: 3,
                                intesity: 0.00,
                                units: 'BW',
                                rest: 30.00
                            }]
                        },
                        {
                            name: 'Climbing',
                            exercises: [{
                                name: 'Project Climbing',
                                reps: 3,
                                sets: 3,
                                intesity: 100.00,
                                units: '%',
                                rest: 300.00
                            }
                        ]  
                    }]                          
                }]
            },
            {
                name: 'Week 2',
                workouts: [{
                    name: 'Workout 1',
                    activities: [
                        {
                            name: 'Warm Up',
                            exercises: [{
                                name: 'Deep Squat Stretch',
                                reps: 5,
                                sets: 3,
                                intesity: 0.00,
                                units: 'BW',
                                rest: 30.00
                            }]
                        },
                        {
                            name: 'Climbing',
                            exercises: [{
                                name: 'Project Climbing',
                                reps: 3,
                                sets: 3,
                                intesity: 100.00,
                                units: '%',
                                rest: 300.00
                            }
                        ]  
                    }]                          
                }]
            }]
        }]
    }

    it("POST - should save the training plan to MongoDB", async () => {
        const res = await request(app).post('/api/training-plan').send(dummyData)
        expect(res.statusCode).toBe(200)
        expect(res.body.name).toBe(tpName)
        tpID = res.body._id
    })

    it("PUT - should update the individual training plan", async () => {
        let fullUpdatedData = {
            name: putName,
            startDate: new Date(),
            endDate: endDate,
            activityType: 'Climbing',
            author: 'JY Money$',
            blocks: [{
                name: 'Meso Block 1',
                startDate: new Date(),
                endDate: endDate,
                deload: 1,
                weeks: [{
                    name: 'Week 1',
                    workouts: [{
                        name: 'Workout 1',
                        activities: [
                            {
                                name: 'Warm Up',
                                exercises: [{
                                    name: 'Deep Squat Stretch',
                                    reps: 5,
                                    sets: 3,
                                    intesity: 0.00,
                                    units: 'BW',
                                    rest: 30.00
                                }]
                            },
                            {
                                name: 'Climbing',
                                exercises: [{
                                    name: 'Project Climbing',
                                    reps: 3,
                                    sets: 3,
                                    intesity: 100.00,
                                    units: '%',
                                    rest: 300.00
                                }
                            ]  
                        }]                          
                    }]
                },
                {
                    name: 'Week 2',
                    workouts: [{
                        name: 'Workout 1',
                        activities: [
                            {
                                name: 'Warm Up',
                                exercises: [{
                                    name: 'Deep Squat Stretch',
                                    reps: 5,
                                    sets: 3,
                                    intesity: 0.00,
                                    units: 'BW',
                                    rest: 30.00
                                }]
                            },
                            {
                                name: 'Climbing',
                                exercises: [{
                                    name: 'Project Climbing',
                                    reps: 3,
                                    sets: 3,
                                    intesity: 100.00,
                                    units: '%',
                                    rest: 300.00
                                }
                            ]  
                        }]                          
                    }]
                }]
            },
            {
                name: 'Meso Block 2',
                startDate: new Date(),
                endDate: endDate,
                deload: 1,
                weeks: [{
                    name: 'Week 1',
                    workouts: [{
                        name: 'Workout 1',
                        activities: [
                            {
                                name: 'Warm Up',
                                exercises: [{
                                    name: 'Deep Squat Stretch',
                                    reps: 5,
                                    sets: 3,
                                    intesity: 0.00,
                                    units: 'BW',
                                    rest: 30.00
                                }]
                            },
                            {
                                name: 'Climbing',
                                exercises: [{
                                    name: 'Project Climbing',
                                    reps: 3,
                                    sets: 3,
                                    intesity: 100.00,
                                    units: '%',
                                    rest: 300.00
                                }
                            ]  
                        }]                          
                    }]
                },
                {
                    name: 'Week 2',
                    workouts: [{
                        name: 'Workout 1',
                        activities: [
                            {
                                name: 'Warm Up',
                                exercises: [{
                                    name: 'Deep Squat Stretch',
                                    reps: 5,
                                    sets: 3,
                                    intesity: 0.00,
                                    units: 'BW',
                                    rest: 30.00
                                }]
                            },
                            {
                                name: 'Climbing',
                                exercises: [{
                                    name: 'Project Climbing',
                                    reps: 3,
                                    sets: 3,
                                    intesity: 100.00,
                                    units: '%',
                                    rest: 300.00
                                }
                            ]  
                        }]                          
                    }]
                }]
            }]
        }
        const res = await request(app).put('/api/training-plan/' + tpID).send(fullUpdatedData)
        expect(res.statusCode).toBe(200)
    })

    it("GET - should return the individual training plan", async () => {
        const res = await request(app).get('/api/training-plan/' + tpID)
        expect(res.statusCode).toBe(200)
        expect(res.body._id).toBe(tpID)
        expect(res.body.name).toBe(putName)
    })

    it("DELETE - should delete the individual training plan", async () => {
        const res = await request(app).delete('/api/training-plan/' + tpID)
        expect(res.statusCode).toBe(200)
        expect(res.body._id).toBe(tpID)
    })
})

describe("GET /api/all-training-plans", () => {
    it("should return all training plans", async () => {
        const res = await request(app).get("/api/all-training-plans")
        expect(res.statusCode).toBe(200)
        expect(res.body[0].name).toBe('2024 Climbing Training Plan 1');
    })
})