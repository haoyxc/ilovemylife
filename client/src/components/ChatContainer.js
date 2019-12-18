import React, { Component } from 'react';
import SideBar from './Sidebar';
import ChatHeading from './ChatHeading';
import Messages from './Messages';
import MessageInput from './MessageInput';
import { GROUP_CHAT, MESSAGE_SENT, MESSAGE_RECIEVED, TYPING, PRIVATE_MESSAGE, LOAD_MESSAGE} from '../Events';
import axios from "axios";
import { BASEURL } from "../constants";
axios.defaults.withCredentials = true;

export default class ChatContainer extends Component {


    constructor(props) {
        super(props);

        this.state = {
            chats:[],
            activeChat:null
        };
    }

    componentDidMount() {
        const { socket } = this.props;
        this.initSocket(socket);
    }

    initSocket(socket) {
        let user;
        axios.get(`${BASEURL}/session`).then(resp => {
            if (resp.data.error || !resp.data) {
              return;
            } else {
              user = resp.data.user;
              console.log("who is the user", user);
              socket.emit(GROUP_CHAT, this.resetChat);
              socket.on(PRIVATE_MESSAGE, this.addChat);
              socket.on('connect', () => {
                  socket.emit(GROUP_CHAT, this.resetChat);
              });
            }
          });

        axios.get(`${BASEURL}/getChat`).then(resp => {
            console.log("hello");
            if (resp.data.error || !resp.data) {
                console.log("error in here?");
              return;
            } else {
              let chat = resp.data.chat;
              console.log("chat:", chat);
              //socket.emit(LOAD_MESSAGE, chat);
            }
        });
    }

    sendPrivateMessage = (receiver) => {
        const { socket, user } = this.props;
        const { activeChat } = this.state;
		socket.emit(PRIVATE_MESSAGE, {receiver, sender: user.fname, activeChat})
	}

    resetChat = (chat) => {
        return this.addChat(chat, true);
    }
    
    sendMessageToChat = (chatId) => {
        return message => {
			const { chats } = this.state
			let newChats = chats.map((chat)=>{
				if(chat.id === chatId)
					chat.messages.push(message)
				return chat
			})
			this.setState({chats:newChats})
		}
    }

    updateTypingInChat = (chatId) =>{
		return ({isTyping, user})=>{
			if(user !== this.props.user.name){

				const { chats } = this.state

				let newChats = chats.map((chat)=>{
					if(chat.id === chatId){
						if(isTyping && !chat.typingUsers.includes(user)){
							chat.typingUsers.push(user)
						}else if(!isTyping && chat.typingUsers.includes(user)){
							chat.typingUsers = chat.typingUsers.filter(u => u !== user)
						}
					}
					return chat
				})
				this.setState({chats:newChats})
			}
		}
    }
    
    addChat = (chat, reset = false) => {
        const { socket } = this.props;
        const { chats } = this.state;
        const newChats = reset ? [chat] : [...chats, chat];
        console.log("new chat", newChats);
        this.setState({chats:newChats, activeChat:reset ? chat : this.state.activeChat});

        const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`;
		const typingEvent = `${TYPING}-${chat.id}`;

        //Set the event listeners
		socket.on(typingEvent, this.updateTypingInChat(chat.id));
		socket.on(messageEvent, this.sendMessageToChat(chat.id));
    }

    sendMessage = (chatId, message) => {
        const { socket } = this.props;
        socket.emit(MESSAGE_SENT, {chatId, message});
    }

    sendTyping = (chatId, isTyping) => {
        const { socket } = this.props;
        socket.emit(TYPING, {chatId, isTyping});
    }

    setActiveChat = (activeChat) => {
        this.setState({activeChat});
    }

	render() {
        const{ user } = this.props;
        const { chats, activeChat } = this.state
        return (
            <div className = "container">
                <SideBar
                    chats = {chats}
                    user = {user}
                    activeChat = {activeChat}
                    setActiveChat = {this.setActiveChat} 
                    sendPrivateMessage = {this.sendPrivateMessage}
                    />
                <div className="chat-room-container">
                    {
                        activeChat !== null ? (
                            
                            <div className="chat-room">
                                <ChatHeading name={activeChat.name} />
                                <Messages 
                                    messages = {activeChat.messages}
                                    user = {user}
                                    typingUser = {activeChat.typingUsers} />
                                <MessageInput 
                                    sendMessage = {
                                        (message) => {
                                            this.sendMessage(activeChat.id, message);
                                        }
                                    }
                                    sendTyping = {
                                        (isTyping)=> {
                                            this.sendTyping(activeChat.id, isTyping);
                                        }
                                    }
                                />
                            </div>
                        ):
                        <div className="chat-room choose">
							<h3>Who do you want to chat with today?</h3>
						</div>
                    }
                </div>
            </div>
        );
    }


}