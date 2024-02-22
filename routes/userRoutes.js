const { Router } = require('express');
const userController = require('../controllers/userController.js');

const userRouter = Router();

// Login POST route
userRouter.post('/api/login', userController.login);

// Signup POST route
userRouter.post('/api/signup', userController.signup);

// Refresh Token POST route
userRouter.post('/api/refresh-token', userController.refresh_token);

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