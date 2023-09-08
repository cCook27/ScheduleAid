const express =require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const { auth } = require('express-oauth2-jwt-bearer');
const port = process.env.PORT || 8080;

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/products", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkJwt = auth({
  audience: 'https://dev-uhybzq8zwt4f7tgf.us.auth0.com/api/v2/',
  issuerBaseURL: 'https://dev-uhybzq8zwt4f7tgf.us.auth0.com/',
});


// Middleware

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(checkJwt);


const mainRoutes = require('./routes/main');

app.use(mainRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


module.exports = app;






