// Setting up our Dependencies for use...
// =========================================

// Read and set environment variables
require("dotenv").config();

// Import the API keys
var keys = require("./keys");

// Import the node-spotify-api NPM package.
var Spotify = require("node-spotify-api");

// Import the request npm package.
var request = require("request");

// Import the moment npm package.
var moment = require("moment");

// Import the FS package for read/write.
var fs = require("fs");

// Initialize the spotify API client using our client id and secret
var spotify = new Spotify(keys.spotify);

// FUNCTIONS
// =====================================

// Writes to the log.txt file
var writeToLog =  (data) => {
    // Append the JSON data and add a newline character to the end of the log.txt file
    fs.appendFile("log.txt", JSON.stringify(data) + "\n", function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("log.txt was updated!");
    });
};

// Helper function that gets the artist name
var getArtistNames = (artist) => {
    return artist.name;
};

// Function for running a Spotify search
var getMeSpotify = (songName) => {
    if (songName === undefined) {
        songName = "What's my age again";
    }

    spotify.search({
        type: "track",
        query: songName
    }, function (err, data) {
        if (err) {
            console.log("Error occurred: " + err);
            return;
        }

        var songs = data.tracks.items;
        var data = [];

        for (var i = 0; i < songs.length; i++) {
            data.push({
                "artist(s)": songs[i].artists.map(getArtistNames),
                "song name: ": songs[i].name,
                "preview song: ": songs[i].preview_url,
                "album: ": songs[i].album.name
            });
            console.log(i);
            console.log("artist(s): " + songs[i].artists.map(getArtistNames));
            console.log("song name: " + songs[i].name);
            console.log("preview song: " + songs[i].preview_url);
            console.log("album: " + songs[i].album.name);
            console.log("-----------------------------------");
        }
        // console.log(data);
        writeToLog(data);
    });
};

// Function for concert search
var getMyBands = (artist) => {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var jsonData = JSON.parse(body);

            if (!jsonData.length) {
                console.log("No results found for " + artist);
                return;
            }

            var logData = [];

            logData.push("Upcoming concerts for " + artist + ":");

            for (var i = 0; i < jsonData.length; i++) {
                var show = jsonData[i];

                // Push each line of concert data to `logData`
                // If a concert doesn't have a region, display the country instead
                // Use moment to format the date
                logData.push(
                    show.venue.city + "," + (show.venue.region || show.venue.country) + " at " + show.venue.name + " " + moment(show.datetime).format("MM/DD/YYYY")
                );
            }

            // Print and write the concert data as a string joined by a newline character
            console.log(logData.join("\n"));
            writeToLog(logData.join("\n"));
        }
    });
};

// Function for running a Movie Search
var getMeMovie = (movieName) => {
    if (movieName === undefined) {
        movieName = "Mr Nobody";
    }

    var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

    request(urlHit, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var jsonData = JSON.parse(body);

            var data = {
                "Title:": jsonData.Title,
                "Year:": jsonData.Year,
                "Rated:": jsonData.Rated,
                "IMDB Rating:": jsonData.imdbRating,
                "Country:": jsonData.Country,
                "Language:": jsonData.Language,
                "Plot:": jsonData.Plot,
                "Actors:": jsonData.Actors,
                "Rotten Tomatoes Rating:": jsonData.Ratings[1].Value
            };
            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
            // console.log(data);
            writeToLog(data);
        }
    });
};

// Function for running a command based on text file
var doWhatItSays = () => {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            throw error;
        }
        console.log(data);

        var dataArr = data.split(",");

        if (dataArr.length === 2) {
            command(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            command(dataArr[0]);
        }
    });
};

// Function for determining which command is executed
var command = (useCaseData, functionsData) => {
    switch (useCaseData) {
        case "concert-this":
            getMyBands(functionsData);
            break;
        case "spotify-this-song":
            getMeSpotify(functionsData);
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
    command(argOne, argTwo);
};

// MAIN PROCESS
// =====================================
runThis(process.argv[2], process.argv.slice(3).join(" "));
