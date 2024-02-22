require ('dotenv').config();
const express = require('express');
const cors = require('cors')
const morgan = require('morgan');
const mongoose = require('mongoose');
const { attachUser } = require('./middleware/authMiddleware.js')

// imported routes
const trainingRoutes = require('./routes/trainingRoutes')
const userRoutes = require('./routes/userRoutes')


// Express app
const app = express();

// connect to MongoDB
mongoose.connect(process.env.DBURI)
.then(() => app.listen(process.env.BACKENDPORT))
.catch((err) => console.log(err))
mongoose.set('strictQuery', true);

// middleware
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use(trainingRoutes);
app.use(userRoutes);

app.use(attachUser);


module.exports = app;