require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
const multer = require('multer');
const { sequelize } = require('./models');

const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString() + '-' + file.originalname.replace(/\s/g, '-')
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors());
app.use(express.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

app.listen({ port: 5000 }, async () => {
  console.log('Server up on http://localhost:5000');
  await sequelize.authenticate();
  console.log('Database Connected!');
});
