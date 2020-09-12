const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // Check token exist & is verified
  if (token) {
    jwt.verify(token, 'my secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    })
  } else {
    res.redirect('/login')
  }
}

// Check Current User
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'my secret', async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.currUser = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.currUser = user;
        next();
      }
    })
  } else {
    res.locals.currUser = null;
    next();
  }
}

module.exports = { requireAuth, checkUser };
