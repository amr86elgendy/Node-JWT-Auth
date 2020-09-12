const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRou');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMidd');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI =
  'mongodb+srv://amr-elgendy:amr135795@mydb.1kizy.mongodb.net/node-js';
mongoose
  .connect(
    dbURI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => console.log('db is connected')
  )
  .then((result) =>
    app.listen(3000, () => console.log('server running on port 3000'))
  )
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);


