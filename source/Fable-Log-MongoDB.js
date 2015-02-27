/**
* The Fable MongoDB MongoDB Log Stream Provider
*
* @class FableLogMongoDB
* @constructor
*/

var libBunyanMongo = require('bunyan-mongo');
var MongoClient = require('mongodb').MongoClient;

var _BunyanMongoStream = new libBunyanMongo();

var _MongoDBURL = 'mongodb://127.0.0.1:27017/Headlight'

console.log("Attempting to connect to MongoDB...");
MongoClient.connect
(
	"mongodb://localhost:27017/Headlight", 
	function(pError, pDatabase)
	{
		console.log("...Checking Connection...");
		if (pError === null)
			console.log("Connected correctly to server");
		else			
			console.log("Error connecting to MongoDB: "+pError);
		//console.log(JSON.stringify(pDatabase))
		//_BunyanMongoStream.setDB(pDatabase);
	}
);

console.log("Returning stream object...");

module.exports = _BunyanMongoStream;
