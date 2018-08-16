// Setting up our Dependencies for use...
// =========================================

// Read and set up our env variables
require("dotenv").config();

// Importing the API keys
let keys = require("./keys");

// Imports the request NPM package.
let request = require("request");

// Import the moment npm package.
var moment = require("moment");

// Import Twitter NPM Package
// let Twitter = require("twitter");

// Imports node-sportify-api NPM Package.
let Spotify = require("node-spotify-api");

// Import fs for reading and writing files
let fs = require("fs");

// Init the Spotify API client is using ID and Secret
let spotify = new Spotify(keys.spotify);


// This function logs a queries to log.txt file
var writeToLog = (data) => {
    // Append the JSON data and add a newline character to the end of the log.txt file
    fs.appendFile("log.txt", JSON.stringify(data) + "\n", function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("log.txt was updated!");
    });
};

// Setting Up basic functions for searching
// =========================================

// SPOTIFY - SEARCH
// =========================================

// This getArtistName() does just that!
var getArtistName = (artist) => {
    return artist.name;
};

// This spotifySearch() runs a search by songTitle
var getArtistsByName = (songTitle) => {
    if (songTitle === undefined) {
        songTitle = "Hangar 18";
    };
    spotify.search({ type: "track", query: songTitle }, (err, data) => {
        if(err) {
            console.log("Error has occured: " + err);
            return;
        }

        var songs = data.tracks.items;
        var data = [];

        for (var i = 0; i < songs.length; i++) {
            data.push({
                "artist(s)": songs[i].artists.map(getArtistName),
                "song name: ": songs[i].name,
                "preview song: ": songs[i].preview_url,
                "album: ": songs[i].album.name
            });
        };
        console.log(data)
        writeToLog(data);
    });
};

// Function for concert dates search
var getMyBands = (artist) => {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryURL, (error, res, body) => {
        if(!error && res.statusCode === 200) {
            let jsonData = JSON.parse(body);

            if(!jsonData.length) {
                console.log("No Results Found for " + artist); 
                return;
            }

            let logData = []
            logData.push("Upcoming shows for " + artist + ":");

            for (var i = 0; i < jsonData.length; i++) {
                var show = jsonData[i];
            
            // Here we can push each line of concert data to logData  
            // If a concert doesn't have a region, display the country instead
            // Use moment to format the date properly
                logData.push(
                    show.venue.city + 
                    "," + 
                    (show.venue.region || show.venue.country) + 
                    " at " + 
                    show.venue.name + 
                    " " + 
                    moment(show.datetime).format("MM/DD/YY")
                );
            }
              // Print and write the concert data as a string joined by a newline character
              console.log(logData.join("\n"));
              writeToLog(logData.join("\n"));
        };
    });
};


// Function for determining which command is executed
var searchChoices = (useCaseData, functionsData) => {
    switch (useCaseData) {
        case "concert-this":
            getMyBands(functionsData);
            break;
        case "spotify-this-song":
            getArtistsByName(functionsData);
            break;
        case "movie-this":
            getMeMovie(functionsData);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("LIRI doesn't know that");
    }
};

// Function which takes in command line arguments and executes correct function accordingly
let runThis = (argOne, argTwo) => {
    searchChoices(argOne, argTwo);
};

// MAIN PROCESS
// =====================================
runThis(process.argv[2], process.argv.slice(3).join(" "));

