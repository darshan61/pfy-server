require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const errorHandler = require('./handlers/error');
const userRoutes = require('./routes/user');
const authMiddleWare = require('./middleware/auth');

const app = express();

// config strategies
authMiddleWare.config();

app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(passport.initialize());
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleWare.authenticate, userRoutes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
