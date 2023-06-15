const router = require("express").Router();
const Pair = require('../models/pairs');
const Home = require('../models/home');

// Get all of the client homes

router.get('/homes', async (req, res) => {
  try{
    const homes = await Home.find({});
    
    if(homes.length === 0) {
      return res.status(404).send('Oops looks like there are no client homes in the db');
    }

    res.send(homes);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for client homes.');
  }
});

// Get distanceMatrix Data for a pair

// Post a new client home

router.post('/homes', async (req, res) => {
  try {
    const newHomeInfo = req.body;

    Object.getOwnPropertyNames(newHomeInfo).forEach((property) => {
      if(!newHomeInfo[property]) {
        res.status(400).send('All fields are required when saving a new client home.');
      }
    });

    const homeToAdd = new Home({
      adress: {
        number: newHomeInfo.adress.number,
        street: newHomeInfo.adress.street,
        city: newHomeInfo.adress.city,
        state: newHomeInfo.adress.state,
        zip: newHomeInfo.adress.zip,
      }
    });

    const savedHome = await homeToAdd.save();

    res.status(201).json(homeToAdd);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while saving the client home.');
  }
})