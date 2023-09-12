const User = require('../models/User-Model');
const Home = require('../models/Home-Model');
const axios = require('axios');
const mongoose = require('mongoose')

const router = require("express").Router();

router.get('/user/:user', async (req, res) => {
  try {
    const userId = req.params.user;

    const user = await User.findOne({_id: userId});

    if(!user) {
      return res.status(404).send('User not found');
    };

    res.send(user);

  } catch(error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for the User.');
  }

});

router.post('/user', async (req, res) => {
  try{
    const newUser = req.body;

    const userToAdd = new User({
      name: newUser.name,
      _id: newUser._id,
      homes: [],
      schedule: [],
      buffer: 5,
      designation: newUser.designation,
      email: newUser.email
    });

    const savedUser = await userToAdd.save();
    res.status(201).json(savedUser);

  } catch(error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for the User.');
  }
  
});

router.get('/homes/:user', async (req, res) => {
  try{
    const userId = req.params.user;
    const user = await User.findOne({_id: userId});

    const userHomes = user.homes;
    
    if(userHomes.length === 0) {
      return res.send([]);
    }

    res.send(userHomes);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for client homes.');
  }
});

router.get('/schedule', async (req, res) => {
  try {

    const DID = mongoose.connection.useDb('D-I-D');
    const schedCollection = DID.collection('schedule');

    const schedule = await schedCollection. find({}).toArray();

    if(!schedule) {
      res.status.json([]);
    } else {
      res.status(200).json(schedule);
    }

    

  } catch {
      console.log('Error getting documents');
      res.status(500).send('An error occurred while fetching documents.');
  }
});

router.post('/homes/distanceMatrix', async (req, res) => {
  try {
    const weeklySchedule = Object.values(req.body);

    const formulateAddress = (address) => {
      return `${address.street}, ${address.city}, ${address.state}, ${address.zip}`
    };

    const convertToSeconds = (timeStamp) => {
      const date = new Date(timeStamp);
      const totalSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
      
      return totalSeconds
    };

    const timeChecker = async () => {
      let scheduleViability = [];

      await Promise.all(weeklySchedule.map(async (day) => {
        for (let i = 0; i < day.length; i++) {
          const event = day[i];

          if(day[i+1]) {
            const origin = formulateAddress(event.address);
            const destination = formulateAddress(day[i+1].address);

            const endTime = convertToSeconds(event.end);
            const startTime = convertToSeconds(day[i+1].start);

            const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&units=imperial&key=AIzaSyAWH9MKNEKtg2LMmFtGyj9xxkrPH5pdOxQ`);

            const distanceData = response.data;

            if((startTime - endTime) > distanceData.rows[0].elements[0].duration.value) {
              scheduleViability.push( 
                {
                  isViable: true,
                  originId: event.id,
                  destinationId: day[i+1].id
                });
              } else {
                  scheduleViability.push( 
                    {
                      isViable: false,
                      originId: event.id,
                      destinationId: day[i+1].id
                    });
                } 
          }
        }
      }));

      return scheduleViability;
    };

    const scheduleViability = await timeChecker();

    res.status(200).json(scheduleViability);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`An error occurred while trying to get your information. Try again later. ${error.message}`);
  }

});

router.post('/homes/:user', async (req, res) => {
  try {
    const newHomeInfo = req.body;
    const userId = req.params.user;
    const user = await User.findOne({_id: userId}); 

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
    });

    const homeAdded = user.homes.push(homeToAdd);
    const save = user.save();

    res.status(201).json(homeToAdd);

  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while saving the client home.');
  }
});

router.post('/schedule', async (req, res) => {
  try {
    const schedule = req.body;

    const currSchedule = await schedCollection.find({}).toArray();

    if(currSchedule.length > 0) {
      await schedCollection.drop();
    }

    const insertedSched = await schedCollection.insertMany(schedule);
    res.status(201).json({message: 'Schedule saved!', sched: insertedSched});

  } catch {
      console.log('Error inserting document:');
      res.status(500).json({ error: 'Failed to save in database' });
  }
});

router.delete('/homes/:home/:user', async (req,res) => {
  try {
    const userId = req.params.user;
    const homeId = new mongoose.Types.ObjectId(req.params.home);
    const user = await User.findOne({ _id: userId });

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { homes: { _id: homeId } } },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.status(204).send();
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for client homes.');
  }
});

router.delete('/schedule', async (req, res) => {
  try {
    const deletedSchedule = await schedCollection.drop();

    res.status(204).json(deletedSchedule);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for client homes.');
  }
})



module.exports = router;



