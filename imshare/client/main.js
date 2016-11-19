/*jslint browser: true, devel: true, white: true, eqeq: true, plusplus: true, vars: true*/
/*global $, FileReader, moment*/


var username = "";

/* INTERFACE STUFF */

/**
    Shows or hide the loading animation
    @param show {boolean} Determines if one should make it appear on screen, or hide it.
*/
function showHideLoading(show){
    "use strict";
    
    if(show == true){
        var mainDot = document.createElement("div");
        mainDot.setAttribute("class","spinner");
        
        var dot1 = document.createElement("div");
        dot1.setAttribute("class","dot1");
        
        var dot2 = document.createElement("div");
        dot2.setAttribute("class","dot2");
        
        mainDot.appendChild(dot1);
        mainDot.appendChild(dot2);
        
        document.body.appendChild(mainDot);
    }
    else{
        $(".spinner").remove();
    }
}



/**
    Generates a picture element with the provided stuff
    @param imgObject {Object}
    @return {DOM} Element with picture and info
*/
function generatePictureElement(imgObject){
    "use strict";
    
    var imgContainer = document.createElement("div");
    imgContainer.setAttribute("class","imgElement");
    
    var imgItself = document.createElement("img");
    imgItself.setAttribute("src",imgObject.imgUri);
    
    var imgInfo = document.createElement("p");
    imgInfo.innerHTML = "Added on " + moment(imgObject.id).format("YYYY-MM-DD HH-mm") + " by <b>" + imgObject.user + "</b>";
    
    imgContainer.appendChild(imgItself);
    imgContainer.appendChild(imgInfo);
    
    return imgContainer;
}


/* HTTP REQUESTS */



/**
    Go get everything
*/
function fetchEverything(){
    "use strict";
    
    showHideLoading(true);
    
    $.ajax({
        url: "/fetch"
    }).done(function(data){
        if(typeof data == "string"){
            $("#nothingToShow").css("display","block");
        }
        else{
            $("#nothingToShow").css("display","none");
            var i;
            for(i=0;i<=data.length-1;i++){
                $(document.body).prepend(generatePictureElement(data[i]));
            }
        }
    });
}



function addPicture(imgUri){
    "use strict";
    
    showHideLoading(true);
    
    $.ajax({
        method: "POST",
        url: "/add",
        data: {
            imgUri: imgUri,
            user: username
        }
    }).done(function(data){
        console.log(data);
    });
}


/* EVENTS */



/**
    Makes the loading animation disappear automatically when there's nothing happening
*/
function autoDisappearOnAjaxStop(){
    "use strict";
    
    $(document).ajaxStop(function(){
        showHideLoading(false);
    });
}



/**
    Instantiates all drag events
*/
function dragEvents(){
    "use strict";
    
    $(document).on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    
    $(document).on('dragenter',function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    
    $(document).on('drop',function(e){
        if(e.originalEvent.dataTransfer){
            if(e.originalEvent.dataTransfer.files.length) {
                e.preventDefault();
                e.stopPropagation();
                
                var fr = new FileReader();
                
                fr.onload = function(e){
                    addPicture(fr.result);
                };
                
                fr.readAsDataURL(e.originalEvent.dataTransfer.files[0]);
                
                /*UPLOAD FILES HERE*/
                console.log(e.originalEvent.dataTransfer.files[0]);
            }   
        }
    });
}



/**
    Make the username box disappear and then instantiate events
*/
function launch(){
    "use strict";
    
    if(document.querySelector("#usernameBox").value == ""){
        alert("One must enter a username");
    }
    else{
        
        username = document.querySelector("#usernameBox").value;
        
        $("#usernameContainer").addClass("animated fadeOutUpBig");

        // This is an event that will always make the loading hide when nothing is happening
        autoDisappearOnAjaxStop();

        //Instantiate drop events
        dragEvents();

        $('#usernameContainer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            fetchEverything();
        });
    }
}