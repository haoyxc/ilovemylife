var express = require('express');
var app = express();

app.use(express.bodyParser());
app.use(express.logger("default"));
app.use(express.cookieParser());
app.use(express.session({secret: "secretSession"}));

app.use('/friendvisualizer', express.static(__dirname + "/public",{maxAge:1}));

app.get('/friendvisualizer', function(req, res) {
res.render('friendvisualizer.ejs');


let layer1 = new Map()
let firstfriends = []

let friends = req.session.friends



//Display your friends
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


/* Run the server */
console.log('Running friend visualization on 127.0.0.1:8080');

app.listen(8080);

