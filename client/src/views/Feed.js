import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import UserProfile from "../components/UserProfile";
import Header from "../components/Header";
import FriendRecs from "../components/FriendRecs";
import CreatePost from "../components/CreatePost";
import { BASEURL } from "../constants";
import FeedPosts from "../components/FeedPosts";
import ActiveUsers from "../components/ActiveUsers";
import Search from "../components/Search";
import UsersSameAff from "../components/UsersSameAff";
import FriendRequests from "../components/FriendRequests";
import FriendList from "../components/FriendList";
import ChatButton from "../components/ChatButton";
import VisualizerButton from "../components/VisualizerButton";
axios.defaults.withCredentials = true;

export default class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      redirectHome: false,
      posts: null,
      redirectProfile: false
    };
    this.getPosts = this.getPosts.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
  }
  componentDidMount() {
    //get the user if any
    //gets user
    axios.get(`${BASEURL}/session`).then(resp => {
      //do something with the response
      let user = resp.data.user;
      if (!user || resp.data.redirect) {
        this.setState({ redirectHome: true });
      } else {
        this.setState({ user: user });
      }
    });
    this.getPosts();
    setInterval(this.getPosts, 1000);
  }
  getPosts() {
    axios.get(`${BASEURL}/allPosts`).then(resp => {
      if (resp.data.err) {
        this.setState({ redirectHome: true });
      } else if (resp.data.redirect) {
        this.setState({ redirectHome: true });
      } else {
        this.setState({ posts: resp.data.items });
      }
    });
  }
  handleProfileClick() {
    this.setState({ redirectProfile: true });
  }
  // componentWillUnmount() {
  //   // clearInterval(this.state.intervalID);
  // }
  render() {
    if (this.state.redirectHome) {
      return <Redirect to="/" />;
    }
    if (!this.state.user || !this.state.posts) {
      return <h3>Loading...</h3>;
    }
    if (this.state.redirectProfile) {
      return (
        <Redirect
          to={{
            pathname: `/profile/${this.state.user.email.replace("@", "")}`
            // state: { userID: id }
          }}
        />
      );
    }
    return (
      <div>
        <Header
          user={this.state.user}
          isProf={false}
          redirect={this.handleProfileClick}
        />
        <div style={innerContainer}>
          <div>
            <UserProfile user={this.state.user} />
            {/* Active users is really friends sorry i changed it really late */}
            {/* <ActiveUsers /> */}
            <ChatButton />
            <Search />
          </div>
          <div>
            <CreatePost userTo={this.state.user} userFrom={this.state.user} />
            <FeedPosts userLoggedIn={this.state.user} />
            {/* <PostDisplay posts={this.state.posts} userLoggedIn={this.state.user} /> */}
          </div>
          <div>
            <FriendRequests userLoggedIn={this.state.user} />
            <UsersSameAff userLoggedIn={this.state.user} />
            <FriendRecs />
          </div>
          <div>
            <VisualizerButton/>
            <FriendList />
            <ActiveUsers />
          </div>

          {/* <div>insert friend recs here</div> */}
        </div>
      </div>
    );
  }
}
const innerContainer = {
  display: "grid",
  gridTemplateColumns: "1fr 2fr 1fr 1fr",
  margin: "20px"
};
