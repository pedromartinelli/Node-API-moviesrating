require('express-async-errors');

const express = require('express');
const sqliteConnection = require('./database/sqlite');
const routes = require('./routes');
const AppError = require('./utils/AppError');
const uploadConfig = require('./configs/upload');

sqliteConnection();

const app = express();
app.use(express.json());

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  };

  console.error(error);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });

});

const PORT = 3333;
app.listen(PORT, () => console.log(`This server is running on Port: ${PORT}`))