//This is a static file web server
//note -add some sort of mime types? Now I just leave it blank
var http = require("http");
var parser = require('url');
var filehandler = require("./filehandler");

//===========================================================
// SETTINGS
const FILE_ROOT = "../ApogeeJS/web/";
const CONTEXT_ROOT = "/"
const PORT = 8888;
//===========================================================

//create a static file handler
var fileHandler = filehandler.createInstance(FILE_ROOT);

//--------------------------------
// start server
//--------------------------------

route = function(request,response) {
    var url = parser.parse(request.url,true);

    var pathname = url.pathname;

    //make sure the context root matches
    if(!pathname.startsWith(CONTEXT_ROOT)) {
        response.writeHead(code, {"Content-Type":"text/plain"});
        response.write(msg);
        response.end();
        return;
    }

    //path for handle should not include leading '/'
    var childPath = pathname.substring(CONTEXT_ROOT.length);
    var queryString = url.search;

    fileHandler.process(childPath,queryString,request,response);
}

//create listener
http.createServer(route).listen(PORT);
