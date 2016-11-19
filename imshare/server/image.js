/*jslint devel: true, node: true, white: true, eqeq: true, plusplus: true, vars: true*/

module.exports = {
    storage: [],
    
    // stores a new image
    newImg: function(imgUri, username){
        "use strict";
        
        var imgObj = {
            "imgUri": imgUri,
            "user": username,
            "id": Date.now()
        };
        
        this.storage.push(imgObj);
    },
    
    // checks if there actually are images loaded
    emptyOrNot: function(){
        "use strict";
        
        if(this.storage.length == 0){
            return false;
        }
        else{
            return true;
        }
    },
    
    // get an image info from a specified ID
    fetchImageFromID: function(imgID){
        "use strict";
        
        if(this.emptyOrNot()){
            var i;
            for(i=0;i<this.storage.length;i++){
                if(this.storage[i].id == imgID){
                    var imgToReturn = {
                        "imgUri":this.storage[i].imgUri,
                        "user":this.storage[i].user
                    };
                    return imgToReturn;
                }
            }
            return false;
        }
        else{
            return false;
        }
    },
    
    //Get ID of last image
    lastID: function(){
        "use strict";
        if(this.emptyOrNot()){
            return this.storage[this.storage.length -1].id;
        }
        else{
            return false;
        }
    },
    
    // Return all images (if any)
    returnAll: function(){
        "use strict";
        if(this.emptyOrNot()){
            return this.storage;
        }
        else{
            return false;
        }
    }
};