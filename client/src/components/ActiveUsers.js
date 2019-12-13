import React, { Component } from "react";
import ActiveUser from "./ActiveUser";
import { BASEURL } from "../constants";
import axios from "axios";
axios.defaults.withCredentials = true;

export default class ActiveUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null
    };
  }
  componentDidMount() {
    axios.get(`${BASEURL}/usersOnServer`).then(resp => {
      this.setState({ users: resp.data.users });
      console.log("AUUUU", resp.data);
    });
  }
  render() {
    if (!this.state.users) {
      return (
        <div>
          <h5>Loading users</h5>
        </div>
      );
    }
    return (
      <div>
        {this.state.users.map(u => {
          return <p>{u.fname}</p>;
        })}
      </div>
    );
  }
}