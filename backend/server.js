const express =require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const { auth } = require('express-oauth2-jwt-bearer');
const passport = require('./authentication/passport-config');
const port = process.env.PORT || 8080;

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/products", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//checks to make sure that every request has a token for aud from issuer
const jwtCheck = auth({
  audience: 'https://www.home2home-api.com',
  issuerBaseURL: 'https://dev-uhybzq8zwt4f7tgf.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});


// Middleware

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(jwtCheck);

app.use(passport.initialize());

const mainRoutes = require('./routes/main');

app.use(mainRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


module.exports = app;






