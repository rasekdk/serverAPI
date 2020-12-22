const jwt = require('jsonwebtoken');

async function home(req, res) {
  res.send('Hola, estas en la Home');
}

module.exports = { home };
