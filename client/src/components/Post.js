import React, { Component } from "react";
import { Redirect } from "react-router";
import uuid from "uuid-random";
import Comments from "./Comments";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { BASEURL } from "../../src/constants";
axios.defaults.withCredentials = true;

export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      showCommentBox: false,
      redirectTo: null,
      comments: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.toggleCommentBox = this.toggleCommentBox.bind(this);
    this.handleClickNameFrom = this.handleClickNameFrom.bind(this);
    this.handleClickNameTo = this.handleClickNameTo.bind(this);
    this.addComment = this.addComment.bind(this);
    this.getComments = this.getComments.bind(this);
  }
  componentDidMount() {
    this.getComments();
    setInterval(this.getComments, 3000);
  }
  handleChange(e) {
    this.setState({ comment: e.target.value });
  }
  handleCommentSubmit() {
    //make a post req
  }
  toggleCommentBox() {
    this.setState({ showCommentBox: !this.state.showCommentBox });
  }
  handleClickNameFrom() {
    this.setState({ redirectTo: this.props.post.fromUser });
  }
  handleClickNameTo() {
    this.setState({ redirectTo: this.props.post.toUser });
  }
  getComments() {
    //get the comments
    let postID = this.props.post.id;
    let userLoggedIn = this.props.userLoggedIn;
    axios.get(`${BASEURL}/getPostComments`, { params: { postID } }).then(resp => {
      if (resp.data.error) {
        return;
      }
      this.setState({ comments: resp.data.comments });
    });
  }
  addComment(e) {
    e.preventDefault();
    let postID = this.props.post.id;
    let userLoggedIn = this.props.userLoggedIn;
    let info = {
      postID,
      userLoggedIn,
      content: this.state.comment,
      id: uuid(),
      date: new Date()
    };
    axios.post(`${BASEURL}/addComment`, info).then(resp => {
      console.log("RESP", resp);
      if (resp.error) {
        //
      } else {
        this.setState({ comment: "" });
      }
    });
  }
  render() {
    // if (this.state.redirectTo) {
    //   return (
    //     <Redirect
    //       to={{
    //         pathname: `/profile/${this.state.redirectTo.email.replace("@", "")}`,
    //         state: { userID: this.state.redirectTo.email.replace("@", "") }
    //       }}
    //     />
    //   );
    //   //   return <Redirect to={`/profile/${this.state.redirectTo.email.replace("@", "")}`} />;
    // }
    let post = this.props.post;
    return (
      <div style={postStyle}>
        {post.fromUser.email.replace("@", "") === post.toUser.email.replace("@", "") ? (
          <p className="postText">
            {" "}
            <span onClick={this.handleClickNameFrom}>
              {post.fromUser.fname} {post.fromUser.lname}
            </span>
          </p>
        ) : (
          <p className="postText">
            <span onClick={this.handleClickNameFrom}>
              {post.fromUser.fname + " " + post.fromUser.lname}
            </span>{" "}
            to{" "}
            <span onClick={this.handleClickNameTo}>
              {post.toUser.fname + " " + post.toUser.lname}
            </span>
          </p>
        )}
        <p className="postText postDate">{new Date(post.date).toUTCString()}</p>
        <p style={contentBox} className="postContent">
          {post.content}
        </p>
        {this.state.showCommentBox ? (
          <div>
            <Comments id={post.id} items={this.state.comments} />
            <form style={commentBox} onSubmit={this.handleCommentSubmit}>
              <input
                // className="postBox"
                placeholder="Add a comment"
                onChange={this.handleChange}
                value={this.state.comment}
              ></input>
              <button type="submit" onClick={this.addComment}>
                Post
              </button>
            </form>
            <p className="pBtn" onClick={this.toggleCommentBox}>
              Hide comment box
            </p>
          </div>
        ) : (
          <button style={btnSm} onClick={this.toggleCommentBox}>
            show comments
          </button>
        )}
      </div>
    );
  }
}
const postStyle = {
  backgroundColor: "#b5c6cf",
  padding: "10px",
  marginTop: "10px"
};
const commentBox = {
  margin: "0px",
  padding: "0px"
  //   dislay: "flex",
  //   flexDirection: "row"
};
const btnSm = {
  fontSize: "10px"
};
const contentBox = {
  backgroundColor: "white",
  padding: "10px"
};
