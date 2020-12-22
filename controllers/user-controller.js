const Joi = require('joi');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const bcrypt = require('bcryptjs');

const { JWT_SECRET } = process.env;

async function register(req, res) {
  try {
    // Get users data
    const usersData = require('../data/users.json');

    // Validate input Data
    const registerSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      repeatPassword: Joi.ref('password'),
    });

    await registerSchema.validateAsync(req.body);

    const { name, email, password } = req.body;

    // default role
    const role = 'normal';

    // user ID
    const userId = usersData.users.length + 1;

    // check for user
    const userExists = usersData.users.find((user) => user.email === email);

    if (userExists) {
      const error = new Error('Ya existe un usuario con ese email');
      error.code = 409;
      throw error;
    }

    // crypt password
    const hashPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = { userId, name, email, hashPassword, role };

    // Push new user
    usersData.users.push(newUser);

    // overwrite usersData
    await fsPromises.writeFile('./data/users.json', JSON.stringify(usersData));

    // send response
    res.send(`Creaste la cuenta con email: ${email}`);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.code = 400;
    }
    console.log(err);
    res.status(err.code || 500);
    res.send({ error: err.message });
  }
}

async function login(req, res) {
  try {
    // Get users data
    const usersData = require('../data/users.json');

    // Validate input Data
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { email, password } = req.body;

    loginSchema.validateAsync({ email, password });

    // check for user
    const userExists = usersData.users.find((user) => user.email === email);

    if (!userExists) {
      const error = new Error('No existe un usuario con ese email');
      error.code = 409;
      throw error;
    }

    // current user data
    const user = usersData.users.find((user) => user.email === email);

    // validate password
    const isValidPassword = bcrypt.compare(user.hashPassword, password);

    if (!isValidPassword) {
      const error = new Error('La contraseña es incorrecta');
      error.code = 401;
      throw error;
    }

    // create token
    const tokenPayload = { id: user.id, name: user.name, role: 'normal' };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.send(token);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.code = 400;
    }
    console.log(err);
    res.status(err.code || 500);
    res.send({ error: err.message });
  }
}

module.exports = {
  register,
  login,
};
