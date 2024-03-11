const { Router } = require('express');
const userController = require('../controllers/userController.js');
var { expressjwt: jwt } = require("express-jwt");

const requireAuth = jwt({
    secret: process.env.JWTSECRET,
    algorithms: ['HS256']
})

const userRouter = Router();

// Login POST route
userRouter.post('/api/login', userController.login);

// Signup POST route
userRouter.post('/api/signup', userController.signup);

// User GET route
userRouter.get('/api/user', requireAuth, userController.get_user)

// User DELETE route
userRouter.delete('/api/user', requireAuth, userController.delete_user)

// Refresh Token POST route
userRouter.post('/api/refresh-token', userController.refresh_token);

// Forgot Password POST route
userRouter.post('/api/forgot-password', userController.forgot_password);

// Reset Password POST route
userRouter.post('/api/reset-password', userController.reset_password);

// Activity Template POST route
userRouter.post('/api/activity-template', requireAuth, userController.activity_template)

// Activity Template GET route
userRouter.get('/api/user-activity-templates', requireAuth, userController.get_user_activity_templates)

// Activity Template PUT route
userRouter.put('/api/activity-template/:id', requireAuth, userController.update_activity_template)

// Activity Template DELETE route
userRouter.put('/api/delete-activity-template/:id', requireAuth, userController.delete_activity_template)

module.exports = userRouter;