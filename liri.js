require("dotenv").config();
var Twitter =require("twitter");
 var spotify = require("spotify");
// var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");

tweetsArray = [];
var thirdInput = process.argv[2];
var forthInput = process.argv[3];






 
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  //-----------------------------------------------------------------
  function commandProcess(thirdInput,forthInput){
if (thirdInput==="my-tweets"){
    getTweets();
}
if(thirdInput==="spotify-song"){
  spotifySong(forthInput);
}
if(thirdInput==="movie"){
  if(forthInput===undefined){
    forthInput= 'Mr. Nobody.';
  }
  movieThis(forthInput);
}
  }
 //---------------------------------------------------------------

 function getTweets(){
var params = {screen_name: 'Gaghusoon',count:20};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
    console.log(response);
  }

});
 };

//------------------------------------------------------------------------
function spotifySong(song){
  if(song===""){
    song ="dancing in the moonlight";
  }
 
spotify.search({ type: 'track', query: song }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
 
    var song = data.tracks.items[0];
    console.log("------Artists-----");
    for(i=0; i<song.artists.length; i++){
    	console.log(song.artists[i].name);
    }

    console.log("------Song Name-----");
    console.log(song.name);

	console.log("-------Preview Link-----");
    console.log(song.preview_url);

    console.log("-------Album-----");
    console.log(song.album.name);
});
}

//-------------------------------------------------------
function movieThis(movieName){

	console.log(movieName);

	request("https://api.themoviedb.org/3/search/movie?api_key=" + tmdbKey + "&query=" + movieName, function(error, response, body) {

  	// If there were no errors and the response code was 200 (i.e. the request was successful)...
  	if (!error && response.statusCode === 200) {

	    //console.log(JSON.parse(body));
	    
	    //Get the Movie ID
	    var movieID =  JSON.parse(body).results[0].id;
	    //console.log(movieID);

	    //Create new query using the movie ID
	    var queryURL = "https://api.themoviedb.org/3/movie/" + movieID + "?api_key=" + tmdbKey + "&append_to_response=credits,releases";

	    request(queryURL, function(error, response, body) {
	    	var movieObj = JSON.parse(body);

	    	console.log("--------Title-----------");
	    	console.log(movieObj.original_title);

	    	console.log("--------Year -----------");
	    	console.log(movieObj.release_date.substring(0,4));

	   		console.log("--------Rating-----------");
	   		console.log(movieObj.releases.countries[0].certification);

	   		console.log("--------Country Produced-----------");
	   		for(i=0, j = movieObj.production_countries.length; i<j; i++){
	   			console.log(movieObj.production_countries[i].name);
	   		}
	   		console.log("--------Languages-----------");
	   		for(i=0, j = movieObj.spoken_languages.length; i<j; i++){
	   			console.log(movieObj.spoken_languages[i].name);
	   		}
	   		console.log("--------Plot----------------");
	   		console.log(movieObj.overview);

	   		console.log("--------Actors-----------");
	   		for(i=0, j = movieObj.credits.cast.length; i<j; i++){
	   			console.log(movieObj.credits.cast[i].name);
	   		}
	    	
	    });


  	}else{
  		console.log(error);
  	}

	});
}
function doWhatItSays(){
	fs.readFile('random.txt', 'utf8', function(err, data){

		if (err){ 
			return console.log(err);
		}

		var dataArr = data.split(',');

		processCommands(dataArr[0], dataArr[1]);
	});
}

//==============================================
commandProcess(thirdInput,forthInput);