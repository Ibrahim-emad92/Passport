module.exports={
    isAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'You need to log in to access this page');
        res.redirect('/login');
    }
}