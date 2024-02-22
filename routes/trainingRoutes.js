const { Router } = require('express');
const trainingController = require('../controllers/trainingController.js');
var { expressjwt: jwt } = require("express-jwt");

const requireAuth = jwt({
    secret: process.env.JWTSECRET,
    algorithms: ['HS256']
})

const trainingRouter = Router()

// GET - retrieve all training plans
trainingRouter.get('/api/all-training-plans', requireAuth, trainingController.get_all_trainingplans);

// GET - retrieve all user training plans
trainingRouter.get('/api/user-training-plans', requireAuth, trainingController.get_user_trainingplans);

// POST - create a training plan
trainingRouter.post('/api/training-plan', requireAuth, trainingController.post_trainingplan);

// PUT - update training plan
trainingRouter.put('/api/training-plan/:id', requireAuth, trainingController.put_trainingplan);

// DELETE - delete training plan
trainingRouter.delete('/api/training-plan/:id', requireAuth, trainingController.delete_trainingplan);

module.exports = trainingRouter;