const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = 3001;

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/products", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Middleware

app.use(cors());
app.use(bodyParser.json());

const mainRoutes = require('./routes/main');

app.use(mainRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


module.exports = app;



