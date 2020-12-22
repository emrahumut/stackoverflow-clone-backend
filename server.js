const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require("./helpers/database/connectDatabase");
const routers = require("./routers");
const costumErrorHandler = require("./middlewares/errors/customErrorHandler");
const path = require('path');
const cors = require('cors');


// Enviroment Variables
dotenv.config({
    path:"./config/env/config.env"
});

// MongoDB CONNECTIONS
connectDatabase();
const app = express();


app.use(express.static('public'));
app.use(cors());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Express - Body Middleware
app.use(express.json());

// routers middleware
app.use("/api",routers);

// error handler
app.use(costumErrorHandler);

// static files
app.use(express.static(path.join(__dirname,"public"))); // dirname ile publici birleştirip expresse söylemektir.

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`App started on ${PORT} : ${process.env.NODE_ENV}`);
});