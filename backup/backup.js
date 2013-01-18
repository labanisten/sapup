var azure = require('azure');

var accountName = 'systemavailability',
	accountKey = "9b1f0llemHSPl32ettGuMw5XHohJGFHJJBLsESaTJd5kdsnRLhtA50f370TEwIfUNQ7q7O18Ou0DNXuT/+wmcg==",
	containerName = 'backup';


var blobService = azure.createBlobService(accountName, accountKey);
var someData = {field1:"data1", field2:"data2"} ;

blobService.createContainerIfNotExists(containerName, function(error){
    if(!error){
        blobService.createBlockBlobFromText(containerName
    , '20130117'
    , JSON.stringify(someData)
    , function(error){
        if(!error){
            console.log("Blob created");
        }
    });
    }
});
