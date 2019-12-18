var express = require('express');
var app = express();

app.use(express.bodyParser());
app.use(express.logger("default"));
app.use(express.cookieParser());
app.use(express.session({secret: "secretSession"}));
app.use('/friendvisualizer', express.static(__dirname + "/public",{maxAge:1}));

app.get('/friendvisualizer', function(req, res) {
res.render('friendvisualizer.ejs');
});

let layer1 = new Map()
let firstfriends = []
let friends = ["mariatu", "julielee"]

/*
function getFriendData(){
    let friends = ["jleeupenn", "mtuupenn"]
    
    friends.get(userID, function(err, data){
        if(err){
            console.log("Error", err);
        } else{
            for(var i = 0; i < data.length; i++){
                firstfriends.push(JSON.parse(data[i].value));
            }
        }
    })
}*/

/*
const getFriendVis = function(req, res){
    let userID = req.session.userID
    let ans = {}
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
                        if(data2[j].affiliation == )
                        secondfriends += data2[j].value
                        secondfriends += ","
                    }
                    secondfriends = secondfriends.slice(0, -1); 
                    layer1.set(f, secondfriends);
                     
                }
            }) 
        } 

    }

    return res.send({ans: ans})

}
*/


app.get('/friendvisualization', async function(req, res) {
    let json = {}
    let userID = "chaoupenn" 
    json["id"] = userID
    json["name"] = userID

    for(var i = 0; i < friends.length; i++){
        let json = {}
        json["id"] = friends[i]
        json["name"] = friends[i]
        json["children"] = []
        firstfriends.push(json);
    }

    json["children"] = firstfriends

    res.send(json);
});



app.get('/getFriends/:user', function(req, res) {
    console.log(req.params.user);
    var newFriends = {"id": "alice","name": "Alice","children": [{
        "id": "james",
            "name": "James",
            "data": {},
            "children": [{
                "id": "arnold",
                "name": "Arnold",
                "data": {},
                "children": []
            }, {
                "id": "elvis",
                "name": "Elvis",
                "data": {},
                "children": []
            }]
        }, {
            "id": "craig",
            "name": "Craig",
            "data": {},
            "children": [{
                "id":"arnold"
            }]
        }, {
            "id": "amanda",
            "name": "Amanda",
            "data": {},
            "children": []
        }, {
            "id": "phoebe",
            "name": "Phoebe",
            "data": {},
            "children": []
        }, {
            "id": "spock",
            "name": "Spock",
            "data": {},
            "children": []
        }, {
            "id": "matt",
            "name": "Matthe",
            "data": {},
            "children": []
        }],
        "data": []
    };
    res.send(newFriends);
});

/* Run the server */
console.log('Running friend visualization on 127.0.0.1:8080');
app.listen(3000);