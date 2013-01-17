var pool =  require('./database');

function hashCode(str){
    var hash = 0, i, char;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

var rssServices = {

	get: function(req, res){
		var alerts;
		var i;

		var feed = new RSS({
			title: 'SAP system availability',
			description: 'SAP system uptime overview',
			feed_url: 'http://systemavailability.azurewebsites.net/messages.rss',
			site_url: 'http://systemavailability.azurewebsites.net',
			author: 'Statoil ASA'
		});

		pool.acquire(function(err, db) {
			if(err) {return res.end("At connection, " + err);}

			db.collection('alerts', function(err, collection) {
				collection.find().toArray(function(err, items) {
					alerts = items;
					pool.release(db);

					for(i = 0; i < items.length; i++) {
						var feedItem = {
						title:  items[i].title,
						description: items[i].comment,
						url: 'http://systemavailability.azurewebsites.net/', // link to the item
						guid: Math.abs(hashCode(items[i].title + items[i].comment)),
						author: 'System availability messages',
						date: items[i].timestamp // any format that js Date can parse.
						};

						feed.item(feedItem);
					}
					res.contentType('rss');
					res.send(feed.xml());
				});
			});
		});
	}
};

exports.rss = rssServices;