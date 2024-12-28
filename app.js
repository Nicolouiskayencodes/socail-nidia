const express = require('express');
const routes = require('./routes');
require('dotenv').config();
const cors = require('cors');
require('./config/passport')

const app = express();
app.options('/*', cors())

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(' Message Board - listening on port '+PORT+'!'));