import React, {Component} from 'react';
import io from 'socket.io-client'
import axios from "axios";
import { USER_CONNECTED, LOGOUT, LOAD_MESSAGE } from '../Events';
import { BASEURL } from "../constants";
import ChatContainer from './ChatContainer';
axios.defaults.withCredentials = true;


const socketURL = "http://localhost:8000"
export default class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            socket:null,
            user:null
        };
    }
    componentWillMount() {
        this.initSocket()

        //Access the database to get the current user logged in
        axios.get(`${BASEURL}/session`).then(resp => {
            if (resp.data.error || !resp.data) {
              return;
            } else {
              let user = resp.data.user;
              this.setState({ user: user});

              const {socket} = this.state;
              socket.emit(USER_CONNECTED, user);
            }
          });

          //Access the database to get all the chats for the current user logged in
          axios.get(`${BASEURL}/getChat`).then(resp => {
            if (resp.data.error || !resp.data) {
                console.log("error in here?");
              return;
            } else {
              let chat = resp.data.chat;
              const {socket} = this.state;
              //socket.emit(LOAD_MESSAGE, chat);
            }
        });
    }

    //Initialize the socket
    initSocket = () => {
        const socket = io(socketURL);
        this.setState({socket})
    }

    //Render function
    render() {
        const { title } = this.props
        const { socket, user } = this.state
        return (
            <div className = "container">
                { 
                    <ChatContainer socket = {socket} user = {user} />
                }
            </div>
        );
  }
}
