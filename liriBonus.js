// Setting up our Dependencies for use...
// =========================================

// Read and set up our env variables
require("dotenv").config();

// Imports the request NPM package.
let request = require("request");

// Importing the API keys
let keys = require("./keys");

// Import Twitter NPM Package
let Twitter = require("twitter");

// Imports node-sportify-api NPM Package.
let Spotify = require("node-spotify-api");

// Import fs for reading and writing files
let fs = require("fs");

// Init the Spotify API client is using ID and Secret
let spotify = new Spotify(keys.spotify);

// ****** WRITE TO LOG.TXT FILES FOR BONUS - DO THIS LAST 
// CHECK LINE 60 for writeToLog()!!!!!

var writeToLog = function (data) {
    // Append the JSON data and add a newline character to the end of the log.txt file
    fs.appendFile("log.txt", JSON.stringify(data) + "\n", function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("log.txt was updated!");
    });
};

// Setting Up basic functions for searching
// =========================================

// SPOTIFY - Search
// =========================================

// This getArtistName() does just that!
let getArtistName = (artist) => {
    return artist.name;
};

// This spotifySearch() runs a search by songTitle
let spotifySearch = (songTitle) => {
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

// Function for determining which command is executed
var searchChoices = (useCaseData, functionsData) => {
    switch (useCaseData) {
        case "my-tweets":
            getMyTweets();
            break;
        case "spotify-this-song":
            spotifySearch(functionsData);
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
var runThis = (argOne, argTwo) => {
    searchChoices(argOne, argTwo);
};

// MAIN PROCESS
// =====================================
runThis(process.argv[2], process.argv[3]);

