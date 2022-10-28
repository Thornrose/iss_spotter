// will require and run main fetch function
// REMEMBER TO LINT

const { nextISSTimesForMyLocation } = require("./iss");


const printPassTimes = function(rawDate) {
  for (const date of rawDate) {
    const dateTime = new Date(0); //
    dateTime.setUTCSeconds(date.risetime);
    const duration = date.duration;
    console.log(`Next pass at ${dateTime} for ${duration} seconds.`);
  }
};


nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("Step 4 didn't work!", error);
  }
  //success - happy path
  printPassTimes(passTimes);


});

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }
  
//   console.log("It worked! Returned IP:", ip);
// });

// fetchCoordsByIP("142.162.113.175", (error, data) => {
//   console.log(error);
//   console.log(data);
// });


// fetchISSFlyOverTimes({ latitude: 44.6488625, longitude: -63.5753196 }, (error, flyOvers) => {
//   if (error) {
//     console.log(error);
//     return;
//   }

//   console.log(flyOvers);
// });
