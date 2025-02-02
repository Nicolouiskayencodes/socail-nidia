const express = require('express');
const routes = require('./routes');
require('dotenv').config();
const cors = require('cors');
require('./config/passport')

const app = express();
const corsOptions ={
  origin: 'https://socialnidia.netlify.app', 
  optionSuccessStatus:200,
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(' Message Board - listening on port '+PORT+'!'));