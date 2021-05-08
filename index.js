const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieSession = require('cookie-session');
const passport = require('passport');

require('./services/passport');

dotenv.config();
mongoose.connect(process.env.CONNECT_DB || 'mongodb://localhost/picexchange', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
   useCreateIndex: true,
});

/* Import routes */
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');

/* Middleware */
app.use(express.json());
app.use(express.static(__dirname + '/public/uploads'));
app.use(
   cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [process.env.COOKIE_KEY],
   })
);
app.use(passport.initialize());
app.use(passport.session());

/* Route middleware */
app.use('/auth', authRoutes);
app.use('/images', imageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
