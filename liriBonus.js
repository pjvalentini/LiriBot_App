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


