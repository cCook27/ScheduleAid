const User = require('../models/User-Model');
const axios = require('axios');
require('dotenv').config();
const apiKey = process.env.GOOGLE_MAPS_API_KEY;
const router = require("express").Router();

router.get('/user/:user', async (req, res) => {
  try {
    const userId = req.params.user;

    if(!userId) {
      return res.status(400).send('Bad request, User Id not sent.');
    }

    const user = await User.findOne({_id: userId});

    if(!user) {
      return res.status(404).send('User not found');
    };
   
    res.status(200).json({ _id: user._id, name: user.name });
    

  } catch(error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for the User.');
  }

});

router.get('/homes/:user', async (req, res) => {
  try{
    const userId = req.params.user;    
    const user = await User.findOne({_id: userId});

    if(!userId) {
      return res.status(400).send('Bad request, User Id not sent.');
    } else if(!user) {
      return res.status(404).send('User not found');
    }

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

router.get('/schedule/:user', async (req, res) => {
  try {
    const userId = req.params.user
    const user = await User.findOne({_id: userId});

    if(!userId) {
      return res.status(400).send('Bad request, User Id not sent.');
    } else if(!user) {
      return res.status(404).send('User not found');
    }

    const schedule = user.schedule;

    res.status(200).json(schedule);

  } catch {
      console.log('Error getting documents');
      res.status(500).send('An error occurred while fetching documents.');
  }
});

router.get('/routing/:user', async (req, res) => {
  const userId = req.params.user;
  let user = await User.findOne({ _id: userId });
  const userAddress = '19609 South Greenfield Road, Gilbert Az, 85297';
  const homes = user.homes;

  const groupSchedule = async () => {

    let clonedHomes = [...homes];
    let groups = [];
   
    for (let i = 0; i < 5; i++) {
     let starter = undefined;
     let greatestTime = {time: 0};
     let sixClosest;

     clonedHomes.forEach((cHome) => {
      cHome.time = 0;
     });
  
      const getTimeDistance = async (home, start) => {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${home}&origins=${start}&units=imperial&key=${apiKey}`);
        const distanceData = response.data.rows[0].elements[0].duration.value;
    
        return distanceData;
      };
  
      const determineStartingPoint = async () => {
        for (let j = 0; j < clonedHomes.length; j++) {
          const home = clonedHomes[j];
        
          const distanceData = await getTimeDistance(home.address, userAddress);
          home.time = distanceData;
      
          if(home.time > greatestTime.time) {
            greatestTime = home;
          }
        }
    
        starter = greatestTime;
        clonedHomes = clonedHomes.filter((cloneHome) => cloneHome._id !== starter._id);
      };
  
      const find6Closest = async () => {
        for (let i = 0; i < clonedHomes.length; i++) {
          const home = clonedHomes[i];
        
          const distanceData = await getTimeDistance(home.address, starter.address);
          home.time = distanceData;
        }
  
        clonedHomes.sort((a, b) => a.time - b.time);
  
        const closest6 = clonedHomes.splice(0, 6);
  
        sixClosest = closest6;
        
      };
  
      const determineGroup = async () => {
        let closest4 = sixClosest
        const furthest2 = closest4.splice(-2);
        let firstH = [];
        let secondH = [];
        for (let j = 0; j < furthest2.length; j++) {
          const fHome = furthest2[j];
    
          for (let i = 0; i < clonedHomes.length; i++) {
            const home = clonedHomes[i];
          
            const distanceData = await getTimeDistance(home.address, fHome.address);
            
            if(j === 0) {
              firstH.push(distanceData);
            } else {
              secondH.push(distanceData);
            }
          };
        };
    
        firstH.sort((a, b) => a - b);
        secondH.sort((a, b) => a - b);
    
        const firstHTop2 = firstH.slice(0,3);
        const secondHTop2 = secondH.slice(0,3);
    
        if(firstHTop2[0] < secondHTop2[0]) {
          closest4.push(furthest2[0]);
          clonedHomes.push(furthest2[1])
        } else if(firstHTop2[0] > secondHTop2[0]) {
          closest4.push(furthest2[1]);
          clonedHomes.push(furthest2[0])
        } else if(firstHTop2[0] === secondHTop2[0]) {
            if(firstHTop2[1] < secondHTop2[1]) {
              closest4.push(furthest2[0]);
              clonedHomes.push(furthest2[1])
            } else if(firstHTop2[1] > secondHTop2[1]) {
              closest4.push(furthest2[1]);
              clonedHomes.push(furthest2[0])
            }
        };
    
      
        closest4.push(starter);
        groups.push(closest4);
      };

      await determineStartingPoint();
      await find6Closest();
      await determineGroup();
    }

    console.log(groups)
  
  };

  groupSchedule();

});


router.post('/user', async (req, res) => {
  try{
    const newUser = req.body;

    if(!newUser || !newUser.name || !newUser._id || !newUser.email) {
      return res.status(400).send('Bad request, User data not sent.');
    }

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

router.post('/homes/distanceMatrix', async (req, res) => {
  try {
    const weeklySchedule = Object.values(req.body);

    if(weeklySchedule.length === 0 || !weeklySchedule) {
      return res.status(400).send('No schedule body sent, no testing required');
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
            const origin = event.address;
            const destination = day[i+1].address;

            const endTime = convertToSeconds(event.end);
            const startTime = convertToSeconds(day[i+1].start);

            try {
              const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&units=imperial&key=${apiKey}`);

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
            } catch (error) {
              console.error("Error making the request:", error);

              if (error.response) {
                if (error.response.status === 404) {
                  res.status(404).send("Resource not found");
                } else if (error.response.status === 401) {
                  res.status(401).send("Unauthorized");
                } else {
                  res.status(error.response.status).send("An error occurred during the request");
                }
              } else if (error.request) {
                res.status(500).send("No response received from the server");
              } else {
                res.status(500).send(`Request setup error: ${error.message}`);
              }
            };
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

    if(!newHomeInfo || !userId) {
      return res.status(400).send('Bad request, Data not sent.');
    } else if(!user) {
      return res.status(404).send('User not found');
    };

    Object.getOwnPropertyNames(newHomeInfo).forEach((property) => {
      if(!newHomeInfo[property]) {
        return res.status(400).send('All fields are required when saving a new client home.');
      }
    });

    const homeAdded = user.homes.push(newHomeInfo);
    const save = user.save();

    res.status(201).json(newHomeInfo);

  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while saving the client home.');
  }
});

router.post('/schedule/:user', async (req, res) => {
  try {
    const newSchedule = req.body;
    const userId = req.params.user;

    if(!newSchedule || !userId) {
      return res.status(400).send('Bad request, Data not sent.');
    } 

    const updatedSchedule = await User.findOneAndUpdate(
      {_id: userId},
      {$set: {schedule: newSchedule}},
      {new: true}
    );

    if(!updatedSchedule) {
      return res.status(404).send('User not found');
    }

    res.status(201).json(updatedSchedule);
    
  } catch {
      console.log('Error inserting document:');
      res.status(500).json({ error: 'Failed to save in database' });
  }
});

router.delete('/homes/:home/:user', async (req,res) => {
  try {
    const userId = req.params.user;
    const homeId = req.params.home;

    if(!homeId || !userId) {
      return res.status(400).send('Bad request, User information not sent.');
    } 

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

router.delete('/schedule/:user', async (req, res) => {
  try {
    const userId = req.params.user;

    if(!userId) {
      return res.status(400).send('Bad request, User information not sent.');
    } 

    const deletedSchedule = await User.findOneAndUpdate(
      {_id: userId},
      {$set: {schedule: []}},
      {new: true}
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.status(204).json(deletedSchedule);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for client homes.');
  }
})


module.exports = router;


  // const patientAvailability = homes.reduce((accum, home) => {
  //   const days = home.prefDays
  //   for (const day in days) {
  //     if (days.hasOwnProperty(day)) {
  //       const value = days[day];

  //       if(value) {
  //         accum[day].push(home);
  //       }
  //     }
  //   };

  //   return accum;
  // }, 
  //   {sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: []}
  // );


  // const mondayStart = patientAvailability.monday.map(async (home) => {
  //   const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${home.address}&origins=${userAddress}&units=imperial&key=${apiKey}`);

  //   const distanceData = response.data.rows[0].elements[0].duration.value;

  //   home.time = distanceData;

  //   return home
  // });

  // const mondayData = await Promise.all(monday);

  // const starter = (dayData) => {
  //   const startHome = dayData.reduce((min, home) => {
  //     return home.time < min.time ? home : min;
  //   }, dayData[0]);

  //   return startHome;
  // }

  // for(let i = 0; i <= 6; i++) {
    
  // }