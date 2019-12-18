const io = require('./index.js').io

const { USER_CONNECTED, GROUP_CHAT, MESSAGE_RECIEVED, 
    MESSAGE_SENT, PRIVATE_MESSAGE, LOAD_MESSAGE} = require('./client/src/Events');

const { createUser, createMessage, createChat } = require('./client/src/Functions');
let onlineUsers = {};
let chats = {};
let groupChat = createChat()

module.exports = function(socket) {
    console.log("Socket Id" + socket.id);

    let sendFromUser;

    //Connect the users
    socket.on(USER_CONNECTED, (user) => {
        //Set the user to its own unique socket.id
        user.socketId = socket.id;
        //Keep track of online users through helper function
        onlineUsers = addUser(onlineUsers, user);
        socket.user = user;
        sendFromUser = sendMessageToChat(user.fname);
        //Connect all the online users online
        io.emit(USER_CONNECTED, onlineUsers);
    });

    //Load data from the database
    socket.on(LOAD_MESSAGE, (chat) => {
        //Comes in as an array of all the chats for the currently logged in user
        chats = chat;
        var i = 0;
        do {
          let from = chat[i].from;
          let to = chat[i].to;
          const receiverSocket = onlineUsers[from].socketId;
          //Create the private chats according to what was on the database
          const newChat = createChat({ name:`${from} and ${to}`, users:[from, to] });
          socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat);
          socket.emit(PRIVATE_MESSAGE, newChat);
        }
        while (i < chat.length);

    });

    //Get the group chat of everyone
    socket.on(GROUP_CHAT, function (callback) {
        callback(groupChat);
    });

    //Get the message sent
    socket.on(MESSAGE_SENT, ({chatId, message}) => {
        sendFromUser(chatId, message);
    })

    //Create a private message
    socket.on(PRIVATE_MESSAGE, ({receiver, sender, activeChat})=>{
        //Check to see if the receiver is online in the chatroom
		if(receiver in onlineUsers){
            const receiverSocket = onlineUsers[receiver].socketId;
            if (activeChat === null || activeChat.id === groupChat.id) {
                //Create a private message with someone
                const newChat = createChat({ name:`${receiver} and ${sender}`, users:[receiver, sender] });
                socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat);
                socket.emit(PRIVATE_MESSAGE, newChat);
            } else {
                //Adding another person to a group chat
                socket.to(receiverSocket).emit(PRIVATE_MESSAGE, activeChat);
            }
		}
	})
}

//Add a user to the online users list
function addUser(list, user){
	let output = Object.assign({}, list);
	output[user.fname] = user;
	return output;
}

//Send a message to the current chat
function sendMessageToChat(sender) {
    return (chatId, message) => {
        io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}));
    }
}