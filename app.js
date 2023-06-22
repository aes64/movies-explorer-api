require('dotenv').config();
const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV, MONGO_URL } = process.env;
const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', true);
mongoose.connect((NODE_ENV === 'production' && MONGO_URL) || 'mongodb://localhost:27017/bitfilmsdb');

app.use(cors());

app.use(express.json());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      })
      .unknown(true),
  }),
  createUser,
);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));
app.use('/', require('./routes/nonexistent'));

app.use(errorLogger);

app.use(errors());
app.use('/', require('./utils/errors/CentralError'));

app.listen(PORT);
