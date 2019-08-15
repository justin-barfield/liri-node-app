require("dotenv").config();

var fs = require("fs");

var keys = require("./keys.js");

var Spotify = require("node-spotify-api")

var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var moment = require("moment");

moment().format();

// var inquirer = require("inquirer");

var switchVar = process.argv;

// var searchTerm = switchVar[3];

var searchTerm = process.argv.slice(3).join(" ");

console.log(searchTerm);

// console.log(proc)

switch(switchVar[2]) {

    case "concert-this":

        concertThis();
        
        break


    case "spotify-this-song":

        spotifyThisSong();

        break


    case "movie-this":
        
        movieThis();

        break


    case "do-what-it-says":

        doWhatItSays();

        break

        
    default:

        console.log( "No valid parameters entered" );

}

function concertThis() {

    var bandsUrl = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp"

    console.log(bandsUrl);

    if( searchTerm === "" ){

        console.log( "Enter valid search term!");

        return
    }

    axios.get(bandsUrl).then( (resp) => {
        
        // Checks if the search returns a valid response
        if( resp.data.length == 0 || resp.data === undefined ){
            
            console.log("\n-------------");
            console.log("\nNothing to report.")
            console.log("\n-------------");
            
            return
        };

        // Logs the response data
        console.log("\n-------------");
        console.log("\n-------------");
        console.log("\n", resp.data);
        console.log("\n-------------");
        console.log("\n-------------");

        // Logs each of the search criteria
        for( i = 0; i < resp.data.length; i++ ) {

            console.log(resp.data[i].venue.name);
            console.log(resp.data[i].venue.city);
            console.log(resp.data[i].venue.region);
            console.log(resp.data[i].datetime);

        }

        // Variable to hold all data in an array
        var gatheredData = [

            "Venue: " + resp.data[i].venue.name,
            "Location: " + resp.data[i].venue.city + ", " + resp.data[i].venue.region,
            "Event Date: " + moment(JSON.stringify(resp.data[i].datetime)).format("MM/DD/YYYY"),

        ].join("\n\n")

        // Writes the logged search criteria to the log file
        fs.appendFileSync("log.txt", gatheredData, (err) => {

            // if( err ){

            //     console.log("-------------");
            //     console.log("-------------");
            //     return console.log(err);
            // }

            console.log("\n-------------");
            console.log("\nlog.txt updated");

        } );


    })
    .catch(function(error) {
        if (error.response) {
            
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);

        } else if (error.request) {

            console.log(error.request);

        } else {

            console.log("-------------");
            console.log("-------------");
            console.log("Error", error.message);

        }

        console.log(error.config);
    });

}

function spotifyThisSong() {

    console.log("Start Spotify search")

    if( searchTerm === "" ){

        searchTerm = "The Sign"

    }

    spotify.search({

        type: "track",
        query: searchTerm

    }, function(err, data) {

        // Checks if the search returns a valid response
        if( data.length == 0 || data === undefined ){
            
            console.log("\n-------------");
            console.log("\nNothing to report.")
            console.log("\n-------------");
            
            return
        };

        if (err) {
            return console.log('Error occurred: ' + err);
        };

        var jsonData = data.tracks.items;
        console.log("tracks")
        // console.log(data.tracks)
        console.log("\n-------------");
        console.log("album")
        console.log("\n", data.tracks.items[1].album.name);
        console.log("\n-------------");
        console.log("artists")
        console.log("\n", data.tracks.items[1].artists[0].name);

        console.log("\n-------------");
        console.log("\n-------------");

        for( i = 0; i < jsonData.length; i ++ ){

            // Set wanted search results to a variable
            var artists = jsonData[i].artists[0].name;
            var songName = jsonData[i].name;
            var previewUrl = jsonData[i].preview_url;
            var album = jsonData[i].album.name;

            // console log the wanted results
            console.log( artists );
            console.log( songName );
            console.log( previewUrl );
            console.log( album );

            // Set preview url to not available if nothing is returned.
            if( previewUrl === null ){

                previewUrl = "Not available."
            }
            
            // Variable to hold all data in an array
            var gatheredData = [
                
                "\n-------------",
                "Arist(s): " + artists,
                "Song Name: " + songName,
                "Preview: " + previewUrl,
                "Album: " + album,
                
            ].join("\n\n")
            
            fs.appendFileSync("log.txt", gatheredData, (err) => {
                
                if( err ){
                    
                    console.log("-------------");
                    console.log("-------------");
                    return console.log("\n" + err);
                    
                }
                
                console.log("\n-------------");
                console.log("\nlog.txt updated");
            } );
        }
    });
}

function movieThis() {

    // Sets the default value of search tearm to mr nobody if no parameter was given
    if( searchTerm === "" ){
            
        searchTerm = "Mr. Nobody"
    }
    
    // Sets the movie search url
    var movieUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy";
    
    // logs the movie url
    console.log("-------------");
    console.log( movieUrl );
    console.log("-------------");

    // axios pull
    axios.get( movieUrl ).then( (resp) => {

        // logs the response
        // console.log("\n-------------");
        // console.log("\n-------------");
        // console.log("\n", resp);
        // console.log("\n-------------");
        // console.log("\n-------------");

        // variable for response data
        var respData = resp.data;

        console.log( resp.data.Title );
        console.log( respData.Year );
        console.log( respData.imdbRating );
        console.log( respData.Ratings[1].Source );
        console.log( respData.Ratings[1].Value );
        console.log( respData.Country );
        console.log( respData.Language );
        console.log( respData.Plot );
        console.log( respData.Actors );

        // Variable to hold all data in an array
        var gatheredData = [

            "---------------------------", 
            // "\n" +
            "Movie Search!", 
            // "\n" +
            "Title: " + resp.data.Title,
            // "\n" +
            "Release Year: " + respData.Year,
            // "\n" +
            "IMDB Rating: " + respData.imdbRating,
            // "\n" +
            "Rotten Tomatoes Rating: " + respData.Ratings[1].Value,
            // "\n" +
            "Country Produced: " + respData.Country,
            // "\n" +
            "Language: " + respData.Language,
            // "\n" +
            "Plot: " + respData.Plot,
            // "\n" +
            "Actors: " + respData.Actors,
            // "\n" +
            "---------------------------"

        ].join("\n\n")

        // Write logged data to the log file
        fs.appendFileSync("log.txt", gatheredData, "utf8", (err) => {

            if( err ){

                console.log("\n-------------");
                console.log("\n-------------");
                return console.log("\n" + err);
            }

            console.log("\n-------------");
            console.log("\nlog.txt updated");
        } );

    });
}

function doWhatItSays() {

    fs.readFile( "random.txt", "utf8", ( err, data ) => {

        if (err) {
            return err;
        }

        textSplit = data.split(",");

        searchTerm = textSplit[1];

        spotifyThisSong();

    })
}

