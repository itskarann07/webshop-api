const express = require('express');
const app= express();

app.use(express.json());

app.get('/hello', (req, res) => {
  res.send('Hello, world!');
});

const port =3000