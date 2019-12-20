const keyvaluestore = require("./keyvaluestore");
const friendReqs = new keyvaluestore("friendReqs");
const friends = new keyvaluestore("friends");
const users = new keyvaluestore("users");
users.init(function(err, data) {});
friendReqs.init(function(err, data) {});
friends.init(function(err, data) {});

//add imports here
const getFriendVis = function(req, res){
    let userID = req.session.userID
    let ans = {}
    let layer1 = new Map()
    let firstfriends = []
    friends.scanKeys(function(err, data){
        if(err){
            console.log("Error", err);
        }else {
            for(let i = 0; i < data.length; i++){
                if(data[i].key == userID){
                    console.log("pushing first friends" + data[i].value);
                    firstfriends.push(data[i].value)
                } 
    
            }
    
        }
    })

    for (var i = 0; i < firstfriends.length; i++) {
        let f = firstfriends[i]
        if(!layer1.has(f)){
            friends.get(f, function(err2, data2){
                if(err2){
                    console.log("idk error", err2);
                } else {
                    let secondfriends = "";
                    for (var j = 0; j < data2.length; j++){
                        secondfriends += data2[j].value
                        secondfriends += ","
                    }
                    secondfriends = secondfriends.slice(0, -1); 
                    layer1.set(f, secondfriends);
                     
                }
            }) 
        } 

    }



    //get friends of userID
    //add to map --layer 1
    //for each of the friends in layer 1: if not already in map, make a layer 2
    //repeat for layer 3
    return res.send({ans: ans})

}
const vis = {
    getFriendVis
}
module.exports = vis