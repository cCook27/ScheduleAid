const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3001;

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/products", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


//'https://maps.googleapis.com/maps/api/distancematrix/json?origins=Washington%2C%20DC&destinations=New%20York%20City%2C%20NY&units=imperial&key=APIKEY'

// Middleware
// Enable CORS for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors());
app.use(bodyParser.json());

const mainRoutes = require('./routes/main');

app.use(mainRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


module.exports = app;



// AIzaSyAWH9MKNEKtg2LMmFtGyj9xxkrPH5pdOxQ