const keyvaluestore = require("./keyvaluestore");
const chat = new keyvaluestore("chat");
const SHA3 = require("crypto-js/sha3");
const session = require("express-session");
chat.init(function(err, data) {});

//Get the chat data in an array
const get_chat = function(req, res) {
  let userID = req.session.userID;
  console.log(userID);
  if (userID) {
    chat.scanKeys(function(err, data) {
        if (err) {
          return res.send({ err: err.message });
        } else {
          let items = [];
          for (let i = 0; i < data.length; i++) {
            items.push(JSON.parse(data[i].value));
          }
          items.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
          });
          return res.send({ chat: items });
        }
      });
  } else {
    return res.send({ chat: null });
  }
};

const chatdb = {
    getChat: get_chat
};
module.exports = chatdb;