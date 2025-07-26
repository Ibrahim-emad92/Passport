const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/userModel'); // Assuming you have a User model defined
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const passport = require('passport');

router.get('/', (req, res) => {
    res.render('home', { title: 'Passport-Local' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

router.post('/register', [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('pass').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('repass').custom((value, { req }) => {
    if (value !== req.body.pass) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], async (req, res) => {
  const { username, email, pass, repass } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('register', {
      title: 'Register',
      errors: errors.array()
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(pass, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/login');

  } catch (err) {
    console.error('Error saving user:', err);
    res.render('register', {
      title: 'Register',
      errors: [{ msg: 'Error saving user' }]
    });
  }
});

router.post('/login',(req,res,next)=>{
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res);
})
module.exports = router;