const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

const keys = require('./config/keys');
require('./services/passport');

mongoose.connect(keys.mongoURI || 'mongodb://localhost/picexchange', {
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
      keys: [keys.cookieKey],
   })
);
app.use(passport.initialize());
app.use(passport.session());

/* Route middleware */
app.use('/auth', authRoutes);
app.use('/images', imageRoutes);

if (process.env.NODE_ENV === 'production') {
   app.use(express.static('client/build'));
   // If unknown route, serve index.html
   app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
   });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
