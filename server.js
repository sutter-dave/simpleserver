//This is a static file web server, based of the apogee server code
//note - add some sort of mime types? Now I just leave it blank
var http = require("http");
var parser = require('url');
var fs = require('fs');
var filehandler = require("./filehandler");

const CONFIG_FILE = "config.json";



//--------------------------------
// start server
//--------------------------------

function onLoadConfig(err,configText) {
    if(err) {
        console.log(err.msg);
        response.writeHead(500, {"Content-Type":"text/plain"});
        response.write("Error!");
    }
    else {
        //start the server
        var config = JSON.parse(configText);

        //create a static file handler
        var fileHandler = filehandler.createInstance(config.fileRoot);

        route = function(request,response) {
            var url = parser.parse(request.url,true);

            var pathname = url.pathname;

            //make sure the context root matches
            if(!pathname.startsWith(config.contextRoot)) {
                response.writeHead(code, {"Content-Type":"text/plain"});
                response.write(msg);
                response.end();
                return;
            }

            //path for handle should not include leading '/'
            var childPath = pathname.substring(config.contextRoot.length);
            var queryString = url.search;

            fileHandler.process(childPath,queryString,request,response);
        }

        //create listener
        http.createServer(route).listen(config.port);
    }
}

fs.readFile(CONFIG_FILE,onLoadConfig);
