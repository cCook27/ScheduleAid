const express =require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const { auth } = require('express-oauth2-jwt-bearer');
const port = process.env.PORT || 8080;

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/home2home", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkJwt = auth({
  audience: 'https://www.Home2Home-api.com',
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






