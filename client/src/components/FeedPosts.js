import React, { Component, useRef } from "react";
import axios from "axios";
import PostDisplay from "./PostDisplay";
import Post from "./Post";
import { BASEURL, DEFAULTNUMPOSTS } from "../../src/constants";
import InfiniteScroll from "react-infinite-scroller";
axios.defaults.withCredentials = true;

//takes in posts
export default class FeedPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      loading: false,
      hasMore: true,
      numItems: DEFAULTNUMPOSTS
    };
    this.getPosts = this.getPosts.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.showItems = this.showItems.bind(this);
  }
  componentDidMount() {
    //make an api req
    this.setState({ loading: true });
    this.getPosts();
    setInterval(this.getPosts, 3000);
  }
  getPosts() {
    // console.log("Props", this.props);

    let user = this.props.userID;
    // console.log(user);
    if (user) {
      axios.get(`${BASEURL}/userPosts`, { params: { user: user } }).then(resp => {
        this.setState({ posts: resp.data.posts });
        // this.setState({posts: [...this.state.posts, ...resp.data.posts]})
        // this.setState({hasMore: false})
        // console.log(resp.data);
      });
    } else {
      axios.get(`${BASEURL}/allPosts`).then(resp => {
        // console.log(resp.data);
        this.setState({ posts: resp.data.items });
      });
    }
  }
  loadMore() {
    if (this.state.posts.length <= this.state.numItems) {
      this.setState({ hasMore: false });
    } else if (this.state.hasMore) {
      setTimeout(() => {
        this.setState({ numItems: this.state.numItems + DEFAULTNUMPOSTS });
      }, 2000);
    }
  }

  showItems() {
    let items = [];
    let { posts, numItems } = this.state;
    let upperBound = posts.length < numItems ? posts.length : numItems;
    for (let i = 0; i < upperBound; i++) {
      // console.log("POST", this.state.posts[i]);
      items.push(
        <Post post={this.state.posts[i]} userLoggedIn={this.props.userLoggedIn} />
      );
    }
    return items;
  }
  render() {
    if (!this.state.posts) {
      return <h3>Loading...</h3>;
    }
    let posts = this.state.posts;
    // console.log(posts);
    // return <PostDisplay posts={posts} userLoggedIn={this.props.userLoggedIn} />;
    return (
      <div>
        <InfiniteScroll
          loadMore={this.loadMore.bind(this)}
          hasMore={this.state.hasMore}
          loader={
            <div className="loader" key={0}>
              Loading...
            </div>
          }
        >
          {this.showItems()}{" "}
        </InfiniteScroll>{" "}
      </div>
    );
  }
}
