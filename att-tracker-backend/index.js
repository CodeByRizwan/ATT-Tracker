require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

const userRouter = require('./routes/user');
const attendanceRouter = require('./routes/attendance');

const connectMongoDb = require('./connectDb');
connectMongoDb(MONGO_URI);

const checkForAuthentication = require('./middlewares/auth');

app.use(helmet());

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/attendance', attendanceRouter);

app.get('/api/check-auth', checkForAuthentication);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log('App running on port', PORT);
});
