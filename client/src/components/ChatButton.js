import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import { BASEURL } from "../constants";
axios.defaults.withCredentials = true;

export default class ChatButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.setState({ redirect: true });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/chat" />;
    }
    return (
      <div>
        <button style={chatBtn} className="chatBtn" onClick={this.handleClick}>
          Enter Chatroom
        </button>
      </div>
    );
  }
}
const chatBtn = {
  margin: "20px",
  borderRadius: "8px",
  color: "white",
  backgroundColor: "#c7e0de",
  padding: "10px"
};
