const express = require('express');
const { port, database } = require('./config/config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { body, validationResult } = require('express-validator'); 
const defaultRoutes = require('./routes/defaultRoutes');
const flash = require('connect-flash');
const expressMessages = require('express-messages');

const dashboardRoutes = require('./routes/authRoutes'); 
const bcrypt = require('bcrypt');
const app = express();

// Connect to MongoDB
mongoose.connect(database.uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });

// View engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public')); // optional for static files
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));
require('./config/passport'); 
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});

// Routes
app.use('/', defaultRoutes);
app.use('/dashboard', dashboardRoutes);
// Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
