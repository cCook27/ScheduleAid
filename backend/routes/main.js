const User = require('../models/User-Model');
const axios = require('axios');
const _ = require('lodash');
require('dotenv').config();
const apiKey = process.env.MAPS_API_KEY;
const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
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
   
    res.status(200).json({ _id: user._id, name: user.name, workingDays: user.workingDays });
    

  } catch(error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for the User.');
  }

});

router.get('/patients/:user', async (req, res) => {
  try{
    const userId = req.params.user;    
    const user = await User.findOne({_id: userId});

    if(!userId) {
      return res.status(400).send('Bad request, User Id not sent.');
    } else if(!user) {
      return res.status(404).send('User not found');
    }

    const userPatients = user.patients.map((patient) => {
      if (patient.hasOwnProperty('groupNumber')) {
        // Remove the property
        delete patient['groupNumber'];
      }
      return patient;
    });

    user.save();
    
    if(userPatients.length === 0) {
      return res.send([]);
    }

    res.send(userPatients);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for patients.');
  }
});

router.get('/patient/:user/:patient', async (req, res) => {
  try {
    const userId = req.params.user;
    const patientId = req.params.patient;

    const user = await User.findOne({_id: userId});

    if(!userId) {
      return res.status(400).send('Bad request, User Id not sent.');
    } else if(!user) {
      return res.status(404).send('User not found');
    } else if(!patientId) {
      return res.status(400).send('Bad request, Patient Id not sent.');
    }

    const patientToReturn = user.patients.find((patient) => {
      return patient._id === patientId;
    });

    if(!patientToReturn) {
      return res.status(404).send('Patient not found');
    };

    res.send(patientToReturn);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for patients.');
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

router.post('/grouping/auto/:user', async (req, res) => {
  try {
    const userId = req.params.user;
    let user = await User.findOne({ _id: userId });
    // therapist info needs to done differently
    const therapistHome = {lat: 33.269950, lng: -111.736540};
    const patients = user.patients;
    let workingDays;

    const activePatients = patients.filter((patient) => patient.active);

    const fulfillAllFrequecies = activePatients.map((patient) => {
      const patientFrequency = patient.frequency;
      if(patientFrequency > 1) {
        let frequencyArray = [];
        for (let i = 0; i < patientFrequency; ++i) {
          frequencyArray.push(patient);
        }
        return frequencyArray;
      } else {
        return [patient];
      }
    });

    const patientVisits = [].concat(...fulfillAllFrequecies);

    const checkSameness = (current, saved, overflow) => {
      const sortedCurrent = current.sort((a, b) => a.lastName.localeCompare(b.lastName));

      const sortedSaved = saved.flat().concat(overflow).sort((a, b) => a.lastName.localeCompare(b.lastName));

      return _.isEqual(sortedCurrent, sortedSaved);;
    };

    if(
      user.workingDays === parseInt(req.body.workingDays) && 
      checkSameness(patientVisits, user.autoGroups.visits, user.autoGroups.visitOverflow)
    ) {
      return res.status(201).json(user.autoGroups);
    };

    if(req.body.workingDays) {
      workingDays =  isNaN(parseInt(req.body.workingDays)) ? user.workingDays : parseInt(req.body.workingDays);
    } else {
      workingDays = 5;
    }

    const k = workingDays;
    const maxVisits = Math.ceil(patientVisits.length/workingDays);

    function haversine(point1, point2) {
      const lat1 = point1.lat;
      const lon1 = point1.lng;
      const lat2 = point2.lat;
      const lon2 = point2.lng;
    
      const R = 6371; 
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    };

    function kMeansClustering(patients, activePatients, k) {
      let centroids = [];
      
      
      for (let i = 0; i < k; i++) {
        const centroidIndex = Math.floor(Math.random() * activePatients.length);

        centroids.push(activePatients[centroidIndex].coordinates);
      };
    
      let prevCentroids = [];
      let iterations = 0;
      let clusters;
      let clusterOverflow;
    
      while (!arraysEqual(centroids, prevCentroids) && iterations < 100) {
          clusters = new Array(k).fill(0).map(() => []);
          clusterOverflow = [];
    
          patients.forEach(patient => {
              let minDistance = Infinity;
              let clusterIndex = -1;
              let name = patient.firstName;
    
              centroids.forEach((centroid, index) => {
                  const distance = haversine(patient.coordinates, centroid);
                  if (distance < minDistance) {

                      const isDuplicate = clusters[index].find((element) => {
                        return element._id === patient._id;
                      });

                      if(!isDuplicate && clusters[index].length < maxVisits) {
                        minDistance = distance;
                        clusterIndex = index;
                      };  
                  }
              });

              if(clusterIndex < 0 && workingDays < Number(patient.frequency)) {
                clusterOverflow.push(patient);
              } else if(clusterIndex < 0) {
                clusters.forEach((cluster, index) => {
                  const isDuplicate = cluster.find((element) => {
                    return element._id === patient._id;
                  });

                  if(!isDuplicate) {
                    clusters[index].push(patient);
                  }
                });
              } else {
                clusters[clusterIndex].push(patient);
              }

              
          });
    
          prevCentroids = [...centroids];
          centroids = clusters.map(cluster => calculateCentroid(cluster));
          iterations++;
      };
    
      return {clusters, clusterOverflow};
    };

    function calculateCentroid(cluster) {
      const sumLat = cluster.reduce((acc, point) => acc + point.coordinates.lat, 0);
      const sumLng = cluster.reduce((acc, point) => acc + point.coordinates.lng, 0);
      const centroidLat = sumLat / cluster.length;
      const centroidLng = sumLng / cluster.length;
      return { lat: centroidLat, lng: centroidLng };
    };

    function arraysEqual(arr1, arr2) {
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    };

    const clusterPatients = kMeansClustering(patientVisits, activePatients, k);

    user.autoGroups = {
      visits: clusterPatients.clusters, 
      visitOverflow: clusterPatients.clusterOverflow
    };
    
    user.workingDays = workingDays;
    await user.save();

    res.status(201).json(user.autoGroups);
  } catch (error) {
    console.error('Error:', error);
  }
});

router.post('/grouping/retrieve/manual/:user', async (req, res) => {
  try {
    const userId = req.params.user
    const user = await User.findOne({_id: userId});

    if(!userId) {
      return res.status(400).send('Bad request, User Id not sent.');
    } else if(!user) {
      return res.status(404).send('User not found');
    }

    const manualGroups = user.manualGroups;

    res.status(200).json(manualGroups);
   
  } catch(error) {
   console.error('Error:', error);
   res.status(500).send('An error occurred while trying to save your groups, try again.');
 }
});
 
router.post('/grouping/saveGroupSet/:user', async (req, res) => {
  try {
    const userId = req.params.user;
    const newSet = req.body;

    if(newSet.groups.length === 0) {
      return res.status(200).send({message: "No Saving Needed"});
    }

    let updatedUser;

    updatedUser = await User.findOneAndUpdate(
      { _id: userId, "manualGroups.setId": newSet.setId },
      { $set: { "manualGroups.$": newSet } },
      { new: true }
    );

    if(!updatedUser) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { manualGroups: newSet } },
        { new: true }
      );

      if(!updatedUser) {
        return res.status(404).send('User not found');
      };
    }

    console.log(updatedUser.manualGroups);

    return res.status(200).send({message: "New Set Established!"});

  } catch(error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while trying to save your groups, try again.');
  }
});

// router.post('/grouping/groupSet/:user', async (req, res) => {
//   try {
//     const userId = req.params.user;
//     const setId = '328bd4dd-358b-4cb6-ad50-26787ffb0cb8';
//     const blablah = req.body;

//     User.findOne({ 
//       _id: userId, 
//       'manualGroups': { $elemMatch: { manualGroupId: setId } }
//     }, { 'manualGroups.$': 1 })
//     .then(user => {
//         if (user && user.manualGroups.length > 0) {
//             const manualGroup = user.manualGroups[0];
//             console.log(manualGroup);
//         } else {
//             console.log('No matching manualGroup found');
//         }
//     })
//     .catch(err => {
//         return res.status(404).send({message: `${err}`});
//     });

//     return res.status(200).send({message: "New Set Established!"});

//   } catch(error) {
//     console.error('Error:', error);
//     res.status(500).send('An error occurred while trying to save your groups, try again.');
//   }
// });

// router.post('/grouping/retrieveGroupSets/:user', async (req, res) => {
//   try {
//     const userId = req.params.user;
//     const user = await User.findOne({ _id: userId });

//     if (!userId) {
//       return res.status(400).send('Bad request, User Id not sent.');
//     } else if (!user) {
//       return res.status(404).send('User not found');
//     }

//     return res.status(200).json(user.manualGroups);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('An error occurred while trying to retrieve your Group Sets, try again.');
//   }
// });

router.post('/user', async (req, res) => {
  try{
    const newUser = req.body;

    if(!newUser || !newUser.name || !newUser._id || !newUser.email) {
      return res.status(400).send('Bad request, User data not sent.');
    }

    const userToAdd = new User({
      name: newUser.name,
      _id: newUser._id,
      patients: [],
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

router.post('/patients/distanceMatrix', async (req, res) => {
  try {
    const selectedDaySchedule = Object.values(req.body);

    if(selectedDaySchedule.length === 0 || !selectedDaySchedule) {
      return res.status(400).send('No schedule body sent, no visiting required');
    };

    const convertToSeconds = (timeStamp) => {
      const date = new Date(timeStamp);
      const totalSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
      
      return totalSeconds
    };

    const timeChecker = async () => {
      let scheduleViability = [];

      
      for (let i = 0; i < selectedDaySchedule.length; i++) {
        const event = selectedDaySchedule[i];

        if(selectedDaySchedule[i+1]) {

          const origin = event.coordinates;
          const destination = selectedDaySchedule[i+1].coordinates;

          const endTime = convertToSeconds(event.end);
          const startTime = convertToSeconds(selectedDaySchedule[i+1].start);

          try {
            const response = await axios.get(`https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${origin.lng},${origin.lat};${origin.lng},${origin.lat};${destination.lng},${destination.lat}?approaches=curb;curb;curb&access_token=${apiKey}`);

            const distanceData = response.data;

            if((startTime - endTime) > distanceData.durations[0][2]) {
              scheduleViability.push( 
                {
                  isViable: true,
                  originId: event.id,
                  destinationId: selectedDaySchedule[i+1].id
                });
              } else {
                  scheduleViability.push( 
                    {
                      isViable: false,
                      originId: event.id,
                      destinationId: selectedDaySchedule[i+1].id
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
     

      return scheduleViability;
    };

    const scheduleViability = await timeChecker();

    res.status(200).json(scheduleViability);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`An error occurred while trying to get your information. Try again later. ${error.message}`);
  }

});

router.post('/patients/:user', async (req, res) => {
  try {
    const newPatientInfo = req.body;
    const userId = req.params.user;
    let user = await User.findOne({_id: userId}); 

    if(!newPatientInfo || !userId) {
      return res.status(400).send('Bad request, Data not sent.');
    } else if(!user) {
      return res.status(404).send('User not found');
    };

    const address = newPatientInfo.address;

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: googleApiKey
      }
    });

    newPatientInfo['coordinates'] = response.data.results[0].geometry.location;

    user.patients = [newPatientInfo, ...user.patients];
    const save = user.save();

    res.status(201).json(newPatientInfo);

  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while saving the patient.');
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

router.put('/grouping/manual/:user', async (req, res) => {
  try {
    const userId = req.params.user;
    const updatedFolder = req.body.groupFolder;
  
    const updateManualGroups = await User.findByIdAndUpdate(
      { _id: userId, 'manualGroups.folderId': updatedFolder.id },
      { $set: { 'manualGroups.$': updatedFolder } },
      { new: true }
    );
  
    if(!updateManualGroups) {
      return res.status(404).send('Group not found');
    };
  
    return res.status(200).send('Group Successfully Updated!');
  } catch(error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while trying to save your groups, try again.');
  }
});

router.put('/updatePatient/:user', async (req, res) => {
  try {
    const patientInfo = req.body;
    const userId = req.params.user;
    const user = await User.findOne({_id: userId});

    const updatedPatientList = user.patients.map((patient) => {
      if(patient._id === patientInfo._id) {
        return patientInfo;
      };

      return patient;
    });

    user.patients = updatedPatientList;

    await user.save();

    return res.status(201).json(user);

  } catch(error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for the User.');
  }
});

router.put('/user/:user', async (req, res) => {
  try{
    const userInfo = req.body;
    const userId = req.params.user;
    const user = await User.findOne({_id: userId});

    user.workingDays = userInfo.workingDays;

    await user.save();

    return res.status(201).json(user);

  } catch(error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for the User.');
  }
  
});

router.delete('/patients/:patient/:user', async (req,res) => {
  try {
    const userId = req.params.user;
    const patientId = req.params.patient;

    if(!patientId || !userId) {
      return res.status(400).send('Bad request, User information not sent.');
    } 

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { patients: { _id: patientId } } },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    };

    res.status(204).send();
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for your patient.');
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

    res.status(204).json(deletedSchedule);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for patients.');
  }
});

router.delete('/schedule/patient/:user/', async (req, res) => {
  try {
    const userId = req.params.user;
    const newSchedule = req.body;

    if(!userId) {
      return res.status(400).send('Bad request, User information not sent.');
    } 

    const deletedSchedule = await User.findOneAndUpdate(
      {_id: userId},
      {$set: {schedule: newSchedule}},
      {new: true}
    );

    res.status(204).json(deletedSchedule);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while looking for patients.');
  }
});

module.exports = router;
  
  
    
  



    
      