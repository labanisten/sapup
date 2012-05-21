var http = require('http'),
  	httpProxy = require('http-proxy');

var options = {
  router: {
    './resources': '127.0.0.1:3000',
  }
};

var proxyServer = httpProxy.createServer(options); 
proxyServer.listen(9000);

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Application server\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/, proxy on 9000');