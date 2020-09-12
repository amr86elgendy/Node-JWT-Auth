const { Router } = require('express');
const router = Router();
const authCon = require('../controllers/authCon');

router.get('/signup', authCon.signup_get);
router.post('/signup', authCon.signup_post);
router.get('/login', authCon.login_get);
router.post('/login', authCon.login_post);
router.get('/logout', authCon.logout_get);

module.exports = router;
