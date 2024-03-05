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
userRouter.put('/api/delete-activity-template', requireAuth, userController.delete_activity_template)

// // Delete user DELETE route
// userRouter.delete('/api/delete/:id', userController.user_delete)

// // User GET single route
// userRouter.get('/api/user/:id', userController.get_user);

// // User PUT route
// userRouter.put('/api/user/:id', userController.put_user);

// // Forgot Password POST route
// userRouter.post('/api/forgot-password', userController.forgot_password);

// // Forgot Password GET route
// userRouter.get('/api/forgot-password/:id/:token', userController.forgot_password_check);

// // Forgot Password POST route
// userRouter.post('/api/reset-password', userController.reset_password);

// // Forgot Password POST route
// userRouter.post('/api/contact-us', userController.contactus_post);

module.exports = userRouter;