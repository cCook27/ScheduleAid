const router = require("express").Router();
const Pair = require('../models/pair');
const Home = require('../models/home');
const axios = require('axios');

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

router.get('/homes/distanceMatrix', async (req, res) => {
  try {
    const origin = req.query.origin;
    const destination = req.query.destination;

    if(!origin || !destination) {
      return res.status(400).send('An origin and a destination are required.');
    }

    const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&units=imperial&key=AIzaSyAWH9MKNEKtg2LMmFtGyj9xxkrPH5pdOxQ`)
        
    const distanceData = response.data;

    res.json(distanceData);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`An error occurred while trying to get your information. Try again later. ${error.message}`);
  }

});

router.post('/homes', async (req, res) => {
  try {
    const newHomeInfo = req.body;

    Object.getOwnPropertyNames(newHomeInfo).forEach((property) => {
      if(!newHomeInfo[property]) {
        return res.status(400).send('All fields are required when saving a new client home.');
      }
    });

    const homeToAdd = new Home({
      name: newHomeInfo.name,
      address: {
        street: newHomeInfo.street,
        city: newHomeInfo.city,
        state: newHomeInfo.state,
        zip: newHomeInfo.zip,
      },
      pairs: newHomeInfo.pairs
    });

    const savedHome = await homeToAdd.save();

    res.status(201).json(homeToAdd);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while saving the client home.');
  }
});

router.post('pair', async (req, res) => {
  try {
    const newPairInfo = req.body;

    Object.getOwnPropertyNames(newPairInfo).forEach((property) => {
      if(!newPairInfo[property]) {
        return res.status(400).send('All fields are required when saving a new pair.');
      }
    });

    const pairToAdd = new Pair({
      origin: {
        number: newPairInfo.origin.number,
        street: newPairInfo.origin.street,
        city: newPairInfo.origin.city,
        state: newPairInfo.origin.state,
        zip: newPairInfo.origin.zip,
      },
      destination: {
        number: newPairInfo.destination.number,
        street: newPairInfo.destination.street,
        city: newPairInfo.destination.city,
        state: newPairInfo.destination.state,
        zip: newPairInfo.destination.zip,
      },
      departureTime: newPairInfo.departureTime,
      ArrivalTime: newPairInfo.ArrivalTime,
    });

    const savedPair = await pairToAdd.save();

    await Home.findOneAndUpdate(
      {address: savedPair.origin},
      {$push: {pairs: savedPair._id}}
    );

    await Home.findOneAndUpdate(
      {address: savedPair.destination},
      {$push: {pairs: savedPair._id}}
    );

    res.status(201).json(savedPair);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while saving your pair for testing.');
  }
});

router.delete('/homes/:home', async (req,res) => {
  try {
    const homeId = req.params.home;
    
    const deletedHome = await Home.findOneAndDelete({_id: homeId});

    if(!deletedHome) {
      res.status(404).send('Could not find home to delete')
    };

    res.status(204).json(deletedHome);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for client homes.');
  }
});

module.exports = router;