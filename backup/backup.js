var azure = require('azure'),
    pool =  require('../server/database'),
    async =  require('async');

var ACCOUNT_NAME = 'systemavailability',
	ACCOUNT_KEY = "9b1f0llemHSPl32ettGuMw5XHohJGFHJJBLsESaTJd5kdsnRLhtA50f370TEwIfUNQ7q7O18Ou0DNXuT/+wmcg==",
	CONTAINER_NAME = 'backup';

var blobService = azure.createBlobService(ACCOUNT_NAME, ACCOUNT_KEY),
    data = [];


var getBackupSetName = function() {
    var date  = new Date();
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = date.getDate().toString();
    return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); 

} 

var writeDataToStorage = function(backupSetIndex) {

    blobService.createContainerIfNotExists(CONTAINER_NAME, function(error){
        if(!error){
            blobService.createBlockBlobFromText(CONTAINER_NAME
        , getBackupSetName()
        , JSON.stringify(data)
        , function(error){
            if(!error){
                console.log("Backup created");
                process.exit(code=0);
            }
        });
        }
    });
}


var getResourceFromDB = function(resource, callback){
    pool.acquire(function(err, db) {
        if(err) {console.log("Error connecting to DB " + err)} 
        db.collection(resource, function(err, collection) {
            collection.find().toArray(function(err, items) {
                var obj = {};
                obj[resource] = items;
                data.push(obj);                        
                pool.release(db);
                callback(null, resource);
            });
        });
    });
};


// Get data and write to blob
async.series([
    function(callback) {
        getResourceFromDB("systemgroups", callback);
    },
    function(callback) {
        getResourceFromDB("systems", callback);
    },
    function(callback) {
        getResourceFromDB("alerts", callback);
    },
    function(callback) {
        getResourceFromDB("systemnames", callback);
    },
    function(callback) {
        getResourceFromDB("systemstatuses", callback);
    },
    function(callback) {
        getResourceFromDB("users", callback);
    }


] , function(err, results) {writeDataToStorage()});

