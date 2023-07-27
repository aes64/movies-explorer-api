require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const cors = require('cors');
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { rateLimiter } = require('./middlewares/rateLimiter');
const { validateSignin, validateSignup } = require('./routes/validation');

const { NODE_ENV, MONGO_URL } = process.env;
const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', true);
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/bitfilmsdb');

app.use(cors());

app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/signin',
  validateSignin(),
  login,
);

app.post(
  '/signup',
  validateSignup(),
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
