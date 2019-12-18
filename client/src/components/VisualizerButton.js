import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import { BASEURL } from "../constants";
axios.defaults.withCredentials = true;

export default class VisualizerButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false
      // redirect: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    axios.post(`${BASEURL}/logout`).then(resp => {
      if (!resp.data.error || resp.data.redirect) {
        this.setState({ success: true });
      } else {
        alert(resp.data.error);
      }
    });
  }
  render() {
    if (this.state.success) {
      return <Redirect to="/friendvisualizer" />;
    }
    return (
      <div>
        <p style={visualBtn} className="visualBtn" onClick={this.handleClick}>
          Friend Visualizer
        </p>
      </div>
    );
  }
}
const visualBtn = {
  margin: "20px",
  borderRadius: "8px",
  color: "white",
  backgroundColor: "#c7e0de",
  padding: "10px"
};