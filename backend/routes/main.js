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
   
    res.status(200).json({ _id: user._id, name: user.name, workingDays: user.workingDays });
    

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

router.post('/checkGroups/:user', async (req, res) => {
  try {
    const userId = req.params.user;
    let user = await User.findOne({ _id: userId });
    const homes = user.homes;
    const workingDays = isNaN(parseInt(req.body.workingDays)) ? user.workingDays : parseInt(req.body.workingDays);

    const activePatients = homes.filter((home) => home.active);
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

    const abbrevationFix = (address) => {

      const abbreviationMap = {
        "S": "South",
        "N": "North",
        "E": "East",
        "W": "West",
        "St": "Street",
        "Ct": "Court",
        "Rd": "Road",
        "Ave": "Avenue",
        "Blvd": "Boulevard",
        "Pkwy": "Parkway",
        "Pl": "Place",
        "Ln": "Lane",
        "Aly": "Alley",
        "Anx": "Anex",
        "Arc": "Arcade",
        "Bnd": "Bend",
        "Bch": "Beach",
        "Blf": "Bluff",
        "Blfs": "Bluffs",
        "Btm": "Bottom",
        "Br": "Branch",
        "Brg": "Bridge",
        "Brk": "Brook",
        "Brks": "Brooks",
        "Byp": "Bypass",
        "Cp": "Camp",
        "Cyn": "Canyon",
        "Cpe": "Cape",
        "Cswy": "Causeway",
        "Ctr": "Center",
        "Ctrs": "Centers",
        "Cir": "Circle",
        "Cirs": "Circles",
        "Clf": "Cliff",
        "Clfs": "Cliffs",
        "Clb": "Club",
        "Cmn": "Common",
        "Cmns": "Commons",
        "Cor": "Corner",
        "Cors": "Corners",
        "Crse": "Course",
        "Cts": "Courts",
        "Cv": "Cove",
        "Cvs": "Coves",
        "Crk": "Creek",
        "Cres": "Crescent",
        "Crst": "Crest",
        "Xing": "Crossing",
        "Xrd": "Crossroad",
        "Xrds": "Crossroads",
        "Curv": "Curve",
        "Dl": "Dale",
        "Dm": "Dam",
        "Dv": "Divide",
        "Dr": "Drive",
        "Drs": "Drives",
        "Est": "Estate",
        "Ests": "Estates",
        "Expy": "Expressway",
        "Ext": "Extension",
        "Exts": "Extensions",
        "Fls": "Falls",
        "Fry": "Ferry",
        "Fld": "Field",
        "Flds": "Fields",
        "Flt": "Flat",
        "Flts": "Flats",
        "Frd": "Ford",
        "Frds": "Fords",
        "Frst": "Forest",
        "Frg": "Forge",
        "Frgs": "Forges",
        "Frk": "Fork",
        "Frks": "Forks",
        "Ft": "Fort",
        "Fwy": "Freeway",
        "Gdn": "Garden",
        "Gdns": "Gardens",
        "Gtwy": "Gateway",
        "Gln": "Glen",
        "Glns": "Glens",
        "Grn": "Green",
        "Grns": "Greens",
        "Grv": "Grove",
        "Grvs": "Groves",
        "Hbr": "Harbor",
        "Hbrs": "Harbors",
        "Hvn": "Haven",
        "Hts": "Heights",
        "Hwy": "Highway",
        "Hl": "Hill",
        "Hls": "Hills",
        "Holw": "Hollow",
        "Inlt": "Inlet",
        "Is": "Island",
        "Iss": "Islands",
        "Jct": "Junction",
        "Jcts": "Junctions",
        "Ky": "Key",
        "Kys": "Keys",
        "Knl": "Knoll",
        "Knls": "Knolls",
        "Lk": "Lake",
        "Lks": "Lakes",
        "Lndg": "Landing",
        "Lgts": "Lights",
        "Lf": "Loaf",
        "Lck": "Lock",
        "Lcks": "Locks",
        "Ldg": "Lodge",
        "Mnr": "Manor",
        "Mnrs": "Manors",
        "Mdw": "Meadow",
        "Mdws": "Meadows",
        "Ml": "Mill",
        "Mls": "Mills",
        "Msn": "Mission",
        "Mtwy": "Motorway",
        "Mt": "Mount",
        "Mtn": "Mountain",
        "Mtns": "Mountains",
        "Nck": "Neck",
        "Orch": "Orchard",
        "Psge": "Passage",
        "Plz": "Plaza",
        "Pln": "Plain",
        "Pt": "Point",
        "Prt": "Port",
        "Pr": "Prairie",
        "Radl": "Radial",
        "Rnch": "Ranch",
        "Rpds": "Rapids",
        "Rst": "Rest",
        "Rdg": "Ridge",
        "Rte": "Route",
        "Shls": "Shoals",
        "Shr": "Shore",
        "Skwy": "Skyway",
        "Spg": "Spring",
        "Spgs": "Springs",
        "Sq": "Square",
        "Sta": "Station",
        "Strm": "Stream",
        "Smt": "Summit",
        "Ter": "Terrace",
        "Trak": "Track",
        "Trfy": "Trafficway",
        "Trl": "Trail",
        "Trlr": "Trailer",
        "Tunl": "Tunnel",
        "Tpke": "Turnpike",
        "Upas": "Underpass",
        "Un": "Union",
        "Vly": "Valley",
        "Vw": "View",
        "Vlg": "Village",
        "Vis": "Vista",
        "Wy": "Way",
      };

      const words = address.split(/[ ,]+/);

      const fullWords = words.map(word => {
        const abbreviationToFull = abbreviationMap[word];
        return abbreviationToFull ? abbreviationToFull : word;
      });
    
      const fullAddress = fullWords.join(" ");
    
      return fullAddress;

    };
    const visits = [].concat(...fulfillAllFrequecies).map((visit) => {
      visit.address = abbrevationFix(visit.address);
      return visit;
    });
  
    const currentGroupList = [].concat(...user.groups);

    const sortPatients = (patients) => {
      const sortedArray = patients.sort((a, b) => a.name.localeCompare(b.name));

      return sortedArray;
    }

    if(currentGroupList.length === visits.length && user.workingDays === workingDays && user.groups.length === workingDays) {
      const sortedGroupList = sortPatients(currentGroupList)
      const sortedVisitList = sortPatients(visits)

      const groupandVisitMatch = sortedVisitList.map((visit, index) => {
        if(visit._id === sortedGroupList[index]._id) {
          return true
        }
      });

      if(groupandVisitMatch.length === sortedVisitList.length) {
        return res.status(200).json(user.groups);
      } else {
        // return a warning and the prior 
      }

    } else if(workingDays === 1) {
      user.groups = visits;
      user.save();
      console.log(user.groups)
      return res.status(200).json(user.groups);
    } else if( workingDays === 2) {
      let returnVisits = [...visits];
      const firstHalf = returnVisits.splice(0, Math.ceil(returnVisits.length/2))
      user.groups = [firstHalf, returnVisits];
      await user.save()
      console.log(user.groups)
      return res.status(200).json(user.groups);
    } else {
      return res.status(200).json(false);
    }

  } catch {
    console.log('Error getting documents');
    res.status(500).send('An error occurred while fetching documents.');
  }
});

router.post('/grouping/:user', async (req, res) => {
  try {
    const userId = req.params.user;
    let user = await User.findOne({ _id: userId });
    const therapistHome = '19609 South Greenfield Road, Gilbert Az, 85297';
    const homes = user.homes;
    const workingDays = isNaN(parseInt(req.body.workingDays)) ? user.workingDays : parseInt(req.body.workingDays);

    const activePatients = homes.filter((home) => home.active);
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
    const abbrevationFix = (address) => {

      const abbreviationMap = {
        "S": "South",
        "N": "North",
        "E": "East",
        "W": "West",
        "St": "Street",
        "Ct": "Court",
        "Rd": "Road",
        "Ave": "Avenue",
        "Blvd": "Boulevard",
        "Pkwy": "Parkway",
        "Pl": "Place",
        "Ln": "Lane",
        "Aly": "Alley",
        "Anx": "Anex",
        "Arc": "Arcade",
        "Bnd": "Bend",
        "Bch": "Beach",
        "Blf": "Bluff",
        "Blfs": "Bluffs",
        "Btm": "Bottom",
        "Br": "Branch",
        "Brg": "Bridge",
        "Brk": "Brook",
        "Brks": "Brooks",
        "Byp": "Bypass",
        "Cp": "Camp",
        "Cyn": "Canyon",
        "Cpe": "Cape",
        "Cswy": "Causeway",
        "Ctr": "Center",
        "Ctrs": "Centers",
        "Cir": "Circle",
        "Cirs": "Circles",
        "Clf": "Cliff",
        "Clfs": "Cliffs",
        "Clb": "Club",
        "Cmn": "Common",
        "Cmns": "Commons",
        "Cor": "Corner",
        "Cors": "Corners",
        "Crse": "Course",
        "Cts": "Courts",
        "Cv": "Cove",
        "Cvs": "Coves",
        "Crk": "Creek",
        "Cres": "Crescent",
        "Crst": "Crest",
        "Xing": "Crossing",
        "Xrd": "Crossroad",
        "Xrds": "Crossroads",
        "Curv": "Curve",
        "Dl": "Dale",
        "Dm": "Dam",
        "Dv": "Divide",
        "Dr": "Drive",
        "Drs": "Drives",
        "Est": "Estate",
        "Ests": "Estates",
        "Expy": "Expressway",
        "Ext": "Extension",
        "Exts": "Extensions",
        "Fls": "Falls",
        "Fry": "Ferry",
        "Fld": "Field",
        "Flds": "Fields",
        "Flt": "Flat",
        "Flts": "Flats",
        "Frd": "Ford",
        "Frds": "Fords",
        "Frst": "Forest",
        "Frg": "Forge",
        "Frgs": "Forges",
        "Frk": "Fork",
        "Frks": "Forks",
        "Ft": "Fort",
        "Fwy": "Freeway",
        "Gdn": "Garden",
        "Gdns": "Gardens",
        "Gtwy": "Gateway",
        "Gln": "Glen",
        "Glns": "Glens",
        "Grn": "Green",
        "Grns": "Greens",
        "Grv": "Grove",
        "Grvs": "Groves",
        "Hbr": "Harbor",
        "Hbrs": "Harbors",
        "Hvn": "Haven",
        "Hts": "Heights",
        "Hwy": "Highway",
        "Hl": "Hill",
        "Hls": "Hills",
        "Holw": "Hollow",
        "Inlt": "Inlet",
        "Is": "Island",
        "Iss": "Islands",
        "Jct": "Junction",
        "Jcts": "Junctions",
        "Ky": "Key",
        "Kys": "Keys",
        "Knl": "Knoll",
        "Knls": "Knolls",
        "Lk": "Lake",
        "Lks": "Lakes",
        "Lndg": "Landing",
        "Lgts": "Lights",
        "Lf": "Loaf",
        "Lck": "Lock",
        "Lcks": "Locks",
        "Ldg": "Lodge",
        "Mnr": "Manor",
        "Mnrs": "Manors",
        "Mdw": "Meadow",
        "Mdws": "Meadows",
        "Ml": "Mill",
        "Mls": "Mills",
        "Msn": "Mission",
        "Mtwy": "Motorway",
        "Mt": "Mount",
        "Mtn": "Mountain",
        "Mtns": "Mountains",
        "Nck": "Neck",
        "Orch": "Orchard",
        "Psge": "Passage",
        "Plz": "Plaza",
        "Pln": "Plain",
        "Pt": "Point",
        "Prt": "Port",
        "Pr": "Prairie",
        "Radl": "Radial",
        "Rnch": "Ranch",
        "Rpds": "Rapids",
        "Rst": "Rest",
        "Rdg": "Ridge",
        "Rte": "Route",
        "Shls": "Shoals",
        "Shr": "Shore",
        "Skwy": "Skyway",
        "Spg": "Spring",
        "Spgs": "Springs",
        "Sq": "Square",
        "Sta": "Station",
        "Strm": "Stream",
        "Smt": "Summit",
        "Ter": "Terrace",
        "Trak": "Track",
        "Trfy": "Trafficway",
        "Trl": "Trail",
        "Trlr": "Trailer",
        "Tunl": "Tunnel",
        "Tpke": "Turnpike",
        "Upas": "Underpass",
        "Un": "Union",
        "Vly": "Valley",
        "Vw": "View",
        "Vlg": "Village",
        "Vis": "Vista",
        "Wy": "Way",
      };

      const words = address.split(/[ ,]+/);

      const fullWords = words.map(word => {
        const abbreviationToFull = abbreviationMap[word];
        return abbreviationToFull ? abbreviationToFull : word;
      });
    
      const fullAddress = fullWords.join(" ");
    
      return fullAddress;

    };
    const visits = [].concat(...fulfillAllFrequecies).map((visit) => {
      visit.address = abbrevationFix(visit.address);
      return visit;
    });

    const averageVisits = Math.ceil(visits.length/workingDays);

    const currentGroupList = [].concat(...user.groups);

    const sortPatients = (patients) => {
      const sortedArray = patients.sort((a, b) => a.name.localeCompare(b.name));

      return sortedArray;
    }

    if(currentGroupList.length === visits.length && user.groups.length === workingDays) {
      const sortedGroupList = sortPatients(currentGroupList)
      const sortedVisitList = sortPatients(visits)
  
      const groupandVisitMatch = sortedVisitList.map((visit, index) => {
        if(visit._id === sortedGroupList[index]._id && visit.name === sortedGroupList[index].name) {
          return 'match'
        } else {
          return 'noMatch'
        }
      });

      const findGroupFailure = groupandVisitMatch.find((element) => element === 'noMatch');

      if(!findGroupFailure) {
        return res.status(200).json(user.groups);
      }

    } else if(workingDays === 1) {
      user.groups = visits;
      user.save();
      console.log(user.groups)
      return res.status(200).json(user.groups);
    } else if( workingDays === 2) {
      let returnVisits = [...visits];
      const firstHalf = returnVisits.splice(0, Math.ceil(returnVisits.length/2))
      user.groups = [firstHalf, returnVisits];
      await user.save()
      console.log(user.groups)
      return res.status(200).json(user.groups);
    }
    
    let groups = [];
    let visitsRemaining = [...visits];

   const returnDistanceData = async (origin) => {
    const loopsNeeded = Math.ceil(visitsRemaining.length / 25);
    let visitsToTest = visitsRemaining.filter((visit) => visit.address !== origin); 
    let distanceData = []

    for (let i = 0; i < loopsNeeded; i++) {
      if(visitsToTest.length >= 25) {
        let destinations = visitsToTest.splice(0, 25).map((visit) => visit.address.split(', ')).map((splitAddress) => encodeURIComponent(splitAddress)).join('|');

        const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destinations}&origins=${origin}&units=imperial&key=${apiKey}`);
        response.data.rows[0].elements.forEach((element, index) => {
          distanceData.push({value: element.duration.value, address: abbrevationFix(response.data.destination_addresses[index])});
        });
      } else {
        let destinations = visitsToTest.splice(0, visitsToTest.length).map((visit) => visit.address.split(', ')).map((splitAddress) => encodeURIComponent(splitAddress)).join('|');
        const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destinations}&origins=${origin}&units=imperial&key=${apiKey}`);
        response.data.rows[0].elements.forEach((element, index) => {
          distanceData.push({value: element.duration.value, address: abbrevationFix(response.data.destination_addresses[index])});
        });
      }  
    };

    return distanceData;

   };
    
    const findFurthestPoint = async () => {
      const origin = therapistHome;
      
      const distanceData = await returnDistanceData(origin);
      
      const sortedDistance = distanceData.sort((a, b) => b.value - a.value);

      const furthestPatient = visits.find((visit) => {
        const sortedAddress = sortedDistance[0].address.split(' ');
        const visitAddress = visit.address.split(' ')
        return sortedAddress[0] === visitAddress[0] && sortedAddress[1] === visitAddress[1] && sortedAddress[2] === visitAddress[2] && sortedAddress[3] === visitAddress[3]; 
      });

      return furthestPatient

    };

    const createGroup = async (origin, day) => { 
      const distanceData = await returnDistanceData(origin);

      const sortedDistance = distanceData.sort((a, b) => a.value - b.value);
      const uniqueSortedDistance = [];
      
      for (let index = 0; index < sortedDistance.length; index++) {
        const element = sortedDistance[index];

        const isDuplicate = uniqueSortedDistance.find((dist) => {
          return dist.address == element.address
        });

        if(!isDuplicate) {
          uniqueSortedDistance.push(element)
        }
        
      };

      // const determineBottomResults = async (topResults) => {
      //   let bottomResults;
      //   let currentDay = day + 1

      //   if(currentDay === workingDays) {
      //     return topResults;
      //   } else if(topResults.length > 4) {
      //     bottomResults = topResults.splice((topResults.length - 4), 3);
      //   } else if(topResults.length <= 4) {
      //     bottomResults = topResults.splice((topResults.length - 1), 1);
      //   }

      //   return bottomResults;
      // };

      if(uniqueSortedDistance.length >= averageVisits || (workingDays === day+1 && visitsRemaining.length > uniqueSortedDistance.length)) {
        let topResults;

        if(workingDays === day+1 && visitsRemaining.length > uniqueSortedDistance.length) {
          topResults = sortedDistance.splice(0, visitsRemaining.length);
        } else {
          topResults = uniqueSortedDistance.splice(0, averageVisits - 1);
        }
         
        
        // const bottomResults = await determineBottomResults(topResults);

        // if(bottomResults === topResults) {
        //   return topResults;
        // } 

        // let bottomVisitsToCompare = [];

        // for (let i = 0; i < bottomResults.length; i++) {
        //   const origin = bottomResults[i].address;

        //   const bottomDistData = await returnDistanceData(origin);

        //   const sortedBottomDistance = bottomDistData.sort((a, b) => a.value - b.value);

        //   const top4Distances = sortedBottomDistance.splice(0, 4).reduce((accum, visit) => {
        //     return {
        //       value: accum.value + visit.value,
        //       address: origin
        //     };
        //   }, { value: 0, address: origin });
          

        //   bottomVisitsToCompare.push(top4Distances);
          
        // }

        // const sortBottomVisits = bottomVisitsToCompare.sort((a, b) => a.value - b.value);

        // topResults.push(sortBottomVisits[0]);

        return topResults;
      } else {
        const topResults = uniqueSortedDistance.splice(0, uniqueSortedDistance.length);
        return topResults;
      }      
    };

    for (let day = 0; day < workingDays; day++) {
      if(visitsRemaining.length === 0) {
        user.groups = groups;

        console.log(user.groups);
        await user.save();
        return res.status(201).json(user.groups);
      }
      const furthestPointRes = await findFurthestPoint();
      const furthestPoint = visitsRemaining.splice(visitsRemaining.findIndex((visit) => visit === furthestPointRes), 1);

      groups.push(furthestPoint);
      let finalGroup = await createGroup(furthestPoint[0].address, day);

      

      for (let i = 0; i < finalGroup.length; i++) {
        const element = finalGroup[i].address;

        const visitIndex = visitsRemaining.findIndex((visit) => {
          const elementAddress = element. split(' ');
          const visitAddress = visit.address.split(' ')
          return elementAddress[0] === visitAddress[0] && elementAddress[1] === visitAddress[1] && elementAddress[2] === visitAddress[2] && elementAddress[3] === visitAddress[3];
        });
        const visitToAdd = visitsRemaining.splice(visitIndex, 1);

        groups[day].push(visitToAdd[0]);
      }
    }

    user.groups = groups;
    await user.save();

    res.status(201).json(user.groups);
  } catch (error) {
    console.error('Error:', error);
  }
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

    // Object.getOwnPropertyNames(newHomeInfo).forEach((property) => {
    //   if(!newHomeInfo[property]) {
    //     return res.status(400).send('All fields are required when saving a new client home.');
    //   }
    // });

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
  
  
    
  