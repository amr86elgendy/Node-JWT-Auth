const User = require('../models/User');
const jwt = require('jsonwebtoken');

const errorHandler = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  if (err.message === 'incorrect Email') {
    errors.email = 'That email is not registered';
  }

  if (err.message === 'incorrect Password') {
    errors.password = 'That password is incorrect'
  }

  if (err.code === 11000) {
    errors.email = 'this email is already registered';
    return errors;
  }
  
  if (err.message.includes('testUser validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

const maxAge = 2 * 24 * 60 * 60;  // 2 Days in Second
const createToken = (id) => {
  return jwt.sign({ id }, 'my secret', {
    expiresIn: maxAge
  });
};

module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email: email, password: password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ user: user._id })
  } catch (err) {
    const errors = errorHandler(err);
    res.status(400).json({ errors })
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(200).json({ user: user._id })
  } catch (err) {
    const errors = errorHandler(err);
    res.status(400).json({ errors })
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}