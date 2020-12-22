const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

function validateAuth(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      res.send('No tienes autorizacion');
      return;
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);

    const { id, nombre, role } = decodedToken;

    req.auth = { id, nombre, role };

    next();
  } catch (err) {
    res.status(401);
    res.send(err.message);
  }
}

module.exports = validateAuth;
