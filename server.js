require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// imported routes
const trainingRoutes = require('./routes/trainingRoutes')

// Express app
const app = express();

// connect to MongoDB
mongoose.connect(process.env.DBURI)
.then(() => app.listen(process.env.BACKENDPORT))
.catch((err) => console.log(err))
mongoose.set('strictQuery', true);

// middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

//routes
app.use(trainingRoutes);

module.exports = app;