const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel'); // Adjust the path as necessary
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findOne({ _id: id });
        done(null, user);   
} catch (err) {
        done(err);  
    }
});