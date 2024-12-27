const express = require('express');
const routes = require('./routes');
require('dotenv').config();


const app = express();
require('./config/passport')

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(' Message Board - listening on port '+PORT+'!'));