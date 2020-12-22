const { object } = require('joi');
const fetch = require('node-fetch');

// API
const { API_URL } = process.env;

async function getGot(req, res) {
  try {
    const response = await fetch(`${API_URL}/books/1`);
    const JSON = await response.json();

    res.send(JSON);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.code = 400;
    }
    console.log(err);
    res.status(err.code || 500);
    res.send({ error: err.message });
  }
}

async function getCategory(req, res) {
  try {
    const { category } = req.params;

    const query = req.query;
    let response;

    if (query.length > 0) {
      let searchQuery = '';

      for (let param in query) {
        searchQuery += `${param}=${query[param]}&`;
      }
      response = await fetch(`${API_URL}/${category}?` + searchQuery);
    } else {
      response = await fetch(`${API_URL}/${category}`);
    }

    const JSON = await response.json();

    res.send(JSON);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.code = 400;
    }
    console.log(err);
    res.status(err.code || 500);
    res.send({ error: err.message });
  }
}

async function getCategoryId(req, res) {
  try {
    const { category, id } = req.params;
    const response = await fetch(`${API_URL}/${category}/${id}`);
    const JSON = await response.json();
    res.send(JSON);
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
  getGot,
  getCategory,
  getCategoryId,
};
