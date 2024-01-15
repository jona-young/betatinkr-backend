const { Router } = require('express');
const trainingController = require('../controllers/trainingController.js');

const trainingRouter = Router()

// GET - retrieve all training plans
trainingRouter.get('/api/all-training-plans', trainingController.get_all_trainingplans);

// GET - retrieve all user training plans

// GET - retrieve individual training plans based off :id
trainingRouter.get('/api/training-plan/:id', trainingController.get_trainingplan);

// POST - create a training plan
trainingRouter.post('/api/training-plan', trainingController.post_trainingplan);

// PUT - update training plan
trainingRouter.put('/api/training-plan/:id', trainingController.put_trainingplan);

// DELETE - delete training plan
trainingRouter.delete('/api/training-plan/:id', trainingController.delete_trainingplan);

module.exports = trainingRouter;