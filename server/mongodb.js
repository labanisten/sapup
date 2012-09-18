var mongodb = require('mongodb'),
    dbServer = new mongodb.Server("127.0.0.1", 27017, {}),
    db = new mongodb.Db('saa_test', dbServer, {});

exports.index = function(req, res){
  db.open(function(err, db) {
    db.collection("system", function(err, collection) {
      collection.find().toArray(function(err, items) {
        res.send(items);
        db.close();
      });
    });
  });
};

exports.show = function(req, res){    
  db.open(function(err, db) {
    db.collection("systems", function(err, collection) {
      collection.find({group:req.params.system}).toArray(function(err, items) {
        res.send(items);
        db.close();
      });
    });
  });

};
