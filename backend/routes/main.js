const Pair = require('../models/pair');
const Home = require('../models/home');
const axios = require('axios');

const router = require("express").Router();

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
      return res.status(404).send('Could not find home to delete')
    };

    res.status(204).json(deletedHome);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for client homes.');
  }
});

module.exports = router;



// router.post('/homes/distanceMatrix', async (req, res) => {
//   try {
//     const weeklySchedule = Object.values(req.body);

//     const formulateAddress = (address) => {
//       return `${address.street}, ${address.city}, ${address.state}, ${address.zip}`
//     };

//     const convertToSeconds = (timeStamp) => {
//       const date = new Date(timeStamp);
//       const totalSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
      
//       return totalSeconds
//     };

//     const timeChecker = async () => {
//       let scheduleViability = [];

//       for (let i = 0; i < weeklySchedule.length; i++) {
//         const day = weeklySchedule[i];

//         day.forEach(async (event, j) => {
//           if(day[j+1]) {
//             const origin = formulateAddress(event.address);
//             const destination = formulateAddress(day[j+1].address);

//             const endTime = convertToSeconds(event.end);
//             const startTime = convertToSeconds(day[j+1].start)

//             const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&units=imperial&key=AIzaSyAWH9MKNEKtg2LMmFtGyj9xxkrPH5pdOxQ`);

//             const distanceData = await response.data;

//             if((startTime - endTime) > distanceData.rows[0].elements[0].duration.value) {
//               scheduleViability.push( 
//                 {
//                   viability: true,
//                   originId: event.id,
//                   destinationId: day[j+1].id
//                 });
//             } else {
//               scheduleViability.push( 
//                 {
//                   viability: false,
//                   originId: event.id,
//                   destinationId: day[j+1].id
//                 });
//             }
//           } 
           
//         });
        
//       }
//       return scheduleViability;
//     };

//     const scheduleViability = await timeChecker();

//     res.status(200).json(scheduleViability);

//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send(`An error occurred while trying to get your information. Try again later. ${error.message}`);
//   }

// });