var express = require('express');
var app = express();

app.use(express.bodyParser());
app.use(express.logger("default"));
app.use(express.cookieParser());
app.use(express.session({secret: "secretSession"}));
app.use('/', express.static(__dirname + "/public",{maxAge:1}));

app.get('/', function(req, res) {
	res.render('friendvisualizer.ejs');
});

let layer1 = new Map()
let firstfriends = []
let friends = req.session.friends




app.get('/friendvisualization', async function(req, res) {
    let json = {}
    let userID = req.session.userID 
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
app.listen(8080);
