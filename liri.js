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

            // Writes the logged search criteria to the log file
            fs.appendFileSync("log.txt",

            "\nVenue: " + resp.data[i].venue.name +
            "\nLocation: " + resp.data[i].venue.city + ", " + resp.data[i].venue.region +
            "\nEvent Date: " + moment(JSON.stringify(resp.data[i].datetime)).format("MM/DD/YYYY"),

            (err) => {

                if( err ){

                    console.log("-------------");
                    console.log("-------------");
                    return console.log(err);
                }

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

        break


    case "spotify-this-song":

        spotify.search({

            type: "track",
            query: searchTerm

        }, (err, resp, data) => {

            console.log("\n-------------");
            console.log("\n-------------");
            console.log("\n", resp.data);
            console.log("\n-------------");
            console.log("\n-------------");


        })

        fs.appendFileSync("log.txt", 

        "\nArist(s): " + "resp.artist",
        "\nSong Name: " + "resp.song",
        "\nPreview: " + "resp.preview",
        "\nAlbum: " + "resp.album",

        (err) => {

            if( err ){

                console.log("-------------");
                console.log("-------------");
                return console.log("\n" + err);
                
            }

            console.log("\n-------------");
            console.log("\nlog.txt updated");
        } );

        break


    case "movie-this":
        
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
            console.log("\n-------------");
            console.log("\n-------------");
            console.log("\n", resp);
            console.log("\n-------------");
            console.log("\n-------------");

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

            // Variable to hold all data in a sting form
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

        break


    case "do-what-it-says":


        break

        
    default:

        console.log( "No valid parameters entered" );

}