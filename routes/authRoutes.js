const router=require('express').Router();
const {isAuthenticated}=require('../helpers/authentication')
router.get('/', isAuthenticated,(req, res) => {
    res.render('dashboard', { title: 'dashboard-page' });
});


module.exports = router;