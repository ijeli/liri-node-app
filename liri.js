var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var keys = require("./keys");
var fs = require('fs');

var nodeArgv = process.argv;
var command = process.argv[2];
var x = ""

for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    x = x + "+" + nodeArgv[i];
  } else{
    x = x + nodeArgv[i];
  }
}

switch(command){
  case "my-tweets":
    showMetheTweets();
  break;

  case "spotify-this-song":
    if(x){
      showMetheSpotify(x);
    } else{
      showMetheSpotify("Fluorescent Adolescent");
    }
  break;

  case "movie-this":
    if(x){
      showMetheMovie(x)
    } else{
      showMetheMovie("Mr. Nobody")
    }
  break;

  case "do-what-it-says":
    showMetheThing();
  break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function showMetheSpotify(x) {
  var spotify = new Spotify(keys.spotify);
  spotify.search({ type: 'track', query: x, limit: 5 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
      fs.appendFile('log.txt', "Error")
    }
    for (i = 0; i < data.tracks.items.length; i++) {
      var spotifyData = data.tracks.items[i];
      console.log(
        "Artist | " + spotifyData.artists[0].name +
        "\nSong | " + spotifyData.name +
        "\nAlbum | " + spotifyData.album.name +
        "\nAlbum Released | " + spotifyData.album.release_date +
        "\nPlay Track | " + spotifyData.external_urls.spotify + 
        "\n----------------------------------------------------------"
      )
      fs.appendFile('log.txt', "\n" + spotifyData.artists[0].name)
      fs.appendFile('log.txt', "\n" + spotifyData.name)
      fs.appendFile('log.txt', "\n" + spotifyData.album.name)
      fs.appendFile('log.txt', "\n" + spotifyData.album.release_date)
      fs.appendFile('log.txt', "\n" + spotifyData.external_urls.spotify)
      fs.appendFile('log.txt', "\n" + "--------------------------------------")

    }
    // console.log(JSON.stringify(data,null,2))
  });
}

function showMetheTweets (x) {
  var client = new Twitter(keys.twitter);

  var params = {screen_name: x};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@GWijeli: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-----------------------");
        fs.appendFile('log.txt', "\n" + tweets[i].text + " Created At: " + date.substring(0, 19))
      }
    }else{
      console.log('Error occurred');
      fs.appendFile('log.txt', "Error")
    }
  });
}

function showMetheMovie(x) {
  var queryURL = "https://www.omdbapi.com/?t=" + x + "&y=&plot=short&apikey=trilogy"

  request(queryURL, function (error, response, body) {
    if (!error) {
      var body = JSON.parse(body)
      console.log("Title | " + body.Title)
      console.log("Release Year | " + body.Year);
      console.log("IMdB Rating | " + body.imdbRating);
      console.log("Country | " + body.Country);
      console.log("Language | " + body.Language);
      console.log("Plot | " + body.Plot);
      console.log("Actors | " + body.Actors);
      console.log("Rotten Tomatoes Rating | " + body.tomatoRating);
      console.log("Rotten Tomatoes URL | " + body.tomatoURL);

      fs.appendFile('log.txt', body.Title)
      fs.appendFile('log.txt', body.Year);
      fs.appendFile('log.txt', body.imdbRating);
      fs.appendFile('log.txt', body.Country);
      fs.appendFile('log.txt', body.Language);
      fs.appendFile('log.txt', body.Plot);
      fs.appendFile('log.txt', body.Actors);
      fs.appendFile('log.txt', body.tomatoRating);
      fs.appendFile('log.txt', body.tomatoURL);
    }
    else {
      console.log('Error occurred');
      fs.appendFile('log.txt', "Error")
    }
  });
}

function showMetheThing() {
  fs.readFile('random.txt', "utf8", function(error, data){
    if (!error) {
      var txt = data.split(',');
      showMetheSpotify(txt[1]);
    }
    else {
      console.log("An error occured")
    }

  });
}
