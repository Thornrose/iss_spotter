const { nextISSTimesForMyLocation } = require('./iss_promised');

const printPassTimes = function(rawDate) {
  for (const date of rawDate) {
    const dateTime = new Date(0); //
    dateTime.setUTCSeconds(date.risetime);
    const duration = date.duration;
    console.log(`Next pass at ${dateTime} for ${duration} seconds.`);
  }
};

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });