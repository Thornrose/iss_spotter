// will contain most of the logic for fetching the data from each API endpoint
// LINT AS YOU GO

const request = require("request");

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *  - A callback (to pass back an error or the IP string)
 * Returns:
 *  - An error, if any (nullable)
 *  - The IP address as a string (null if error). Example: "162.245.144.188"
 */


// use request to fetch IP address from JSON API
// IPify returns as object: {"ip":"142.162.133.175"}

const fetchMyIP = function(callback) {
  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const MyIP = JSON.parse(body).ip;
    callback(null, MyIP);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }
    
    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }

    const coords = {
      latitude: parsedBody.latitude,
      longitude: parsedBody.longitude
    };

    callback(null, coords);

  });

};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const message = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      callback(Error(message), null);
      return;
    }

    const parsedBody = JSON.parse(body);
    callback(null, parsedBody.response);


  });

};

/**
 * Orchestrates multiple API requests in order to determine next 5 upcoming ISS fly-overs for my current location
 * INPUT:
 *  - A callback with an error OR results.
 * RETURNS (via callback):
 *  - an error, if any (nullable);
 *  - the fly over times as an array (null if error)
 *    [ { risetime: <number>, duration: <number> }, ...]
 */

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("Step 1 didn't work!", error);
      return;
    }

    fetchCoordsByIP(ip, (error, coordData) => {
      if (error) {
        console.log("Step 2 didn't work!", error);
        return;
      }

      fetchISSFlyOverTimes(coordData, (error, flyOvers) => {
        if (error) {
          console.log("Step 3 didn't work!", error);
          return;
        }
        callback(null, flyOvers);
      });
      
    });
  });
};




module.exports = { nextISSTimesForMyLocation };

