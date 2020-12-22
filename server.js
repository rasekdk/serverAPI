// Requires
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

// env
const { SERVER_PORT } = process.env;

const app = express();

app.use(bodyParser.json());

const {
  usersController,
  pageController,
  gotController,
} = require('./controllers');

const validateAuth = require('./middlewares/validateAuth');

// Rutes

// Login/Register

app.post('/register', usersController.register);
app.post('/login', usersController.login);

// Home
app.post('/', validateAuth, pageController.home);

// GoT
app.get('/got', validateAuth, gotController.getGot);

// get all books or characters (limited to 50) cna add parameters like ?gender=Male&culture=Northmen
app.get('/got/:category', validateAuth, gotController.getCategory);

// get books or characters by number
app.get('/got/:category/:id', validateAuth, gotController.getCategoryId);

// Listener
app.listen(SERVER_PORT, () => console.log(`Escuchando ${SERVER_PORT}`));
