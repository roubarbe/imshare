/*jslint devel: true, node: true, white: true, eqeq: true, plusplus: true, vars: true*/



//Lets require/import the HTTP module
var http = require('http');

// We also need to parse queries
var qs = require('querystring');

// And we need access to the filesystem to shoot client files
var fs = require('fs');

// We also need our image object class
var imgObj = require('./image');

//Lets define a port we want to listen to
var port=8080; 



//We need a function which handles requests and send response
function handleRequest(request, response){
    "use strict";
    
    // First of all, divide the URL and the query
    var accessURL = request.url.split("?");
    
    // Then we can check what was requested
    
    console.log(accessURL[0]);
    
    // fetch goes to get one or many images
    if(accessURL[0] == "/fetch"){
        
        // Then we parse any parameters specified
        var specParam = qs.parse(accessURL[1]);
        
        // OwO what's this, lastID was specified?
        if(specParam.lastID == "true"){
            
            // First we need to check if there's any saved images at all
            if(imgObj.lastID()){
                response.end("Last image returned.", "UTF-8");
            }
            else{
                response.end("No images to return.", "UTF-8");
            }
            
            
        }
        
        // if not, what else?
        else{
            
            // asking for a specific ID
            if(specParam.thisID){
                
                //if it exists and the report isn't false
                if(imgObj.fetchImageFromID(specParam.thisID)){
                    response.end("Your image exists", "UTF-8");
                }
                
                // if it's false
                else{
                    response.end("Your image doesn't exist", "UTF-8");
                }
            }
            else{
                
                var allPics = imgObj.returnAll();
                
                if(allPics == false){
                    response.end("No images to return.", "UTF-8");
                }
                else{
                    response.writeHead(200, {"Content-Type":"application/json"});
                    response.write(JSON.stringify(allPics));
                    response.end();
                }
            }
        }
    }
    
    // Say the user wants to add a new picture
    else if(accessURL[0] == "/add"){
        if(request.method == "POST"){
            var fullBody = '';
    
            request.on('data', function(chunk) {
                
                // append the current chunk of data to the fullBody variable
                fullBody += chunk.toString();
            });
            
            request.on('end', function() {

                // parse the received body data
                var decodedBody = qs.parse(fullBody);

                // Now we check if everything needed is specified
                if(decodedBody.imgUri && decodedBody.user){
                    
                    imgObj.newImg(decodedBody.imgUri, decodedBody.user);
                    
                    response.end("THANK YOU", "UTF-8");
                }
                else{
                    response.end("Please specify both image URI and username with imgUri and user.", "UTF-8");
                }
            });
            }
        else{
            response.end("It's POST or nothing.", "UTF-8");
        }
    }
    
    // If NOTHING is asked, serve the index.html file
    else if(accessURL[0] == "/"){
        fs.readFile('../client/index.html', function(err, data){
            if(err){
                console.log(err);
            }
            response.writeHead(200, {"Content-Type":'text/html'});
            response.write(data);
            response.end();
        });
    }
    
    // Nothing else was specified, just serve files from the ../client/ folder
    else{
        fs.readFile('../client'+accessURL[0], function(err, data){
            if(err){
                console.log(err);
            }
            
            var mimeType = "text/plain";
            var dataType = "UTF-8";
            
            switch(accessURL[0].split(".")[1]){
                case "html":
                    mimeType = 'text/html';
                    break;
                case "css":
                    mimeType = 'text/css';
                    break;
                case "js":
                    mimeType = 'text/javascript';
                    break;
                case "ico":
                    mimeType = 'image/x-icon';
                    dataType = "binary";
                    break;
                default:
                    mimeType = 'text/plain';
            }
            
            response.writeHead(200,{"Content-Type":mimeType});
            response.end(data, dataType);
        });
    }
}



//Create a server
var server = http.createServer(handleRequest);



//Lets start our server
server.listen(port, function(){
    "use strict";
    
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", port);
});