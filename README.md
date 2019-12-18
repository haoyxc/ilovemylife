## Team members and Login

- Cindy Hao: cindyhao
- Julie Lee: yuylee
- Maria Tu: mariatu

## Features Implemented:

### Cindy:

- Login Page
  - Requires email and password
- Signup page
  - Input from user to create a profile
- Home Page
  - Can post, see active users, see friends list, see friend recommendations, see friend requests, remove existing friends, search for users
  - Posts are displayed 5 at a time and user can scroll
  - friends and posts dynamically reload
- Profile page
  - post on other people's timeline, view posts to each person, check friend status
- Post features
  - Can be public/friend only, can like/view likes (by clicking on the likes button), add comments (dynamically reloads)
- Backend routes (interact with frontend functionality) that read and write to database. Models for:  
  - friends
  - users
  - posts
  - postLikes
  - postComments

###### Bonus:

- Like feature (can view number of likes and who has liked it)
- Infinite Scrolling
- Linked in style confirmation friend requests
- Post privacy - by default only visible to friends but can be public to everyone

### Julie:
- Script to read in necessary data from DynamoDB tables (friends, interests, affiliations)
  - Format accordingly for the MapReduce input file
- Hadoop Adsorption Algorithm that will generate friend recommendations for each node in the form of a text file
-Static friendship visualizer (see your friends)

### Maria:
- Chat Server
  - Frontend and backend
  - Access to Chat Server from the home page
  - Ability to chat with everyone on the server in a Community Group Chat
  - Private Messaging between two people
  - Group chats with three or more people
  - Chat messages have time stamps and sender
  - Can see your chats on a sidebar

### Files

- ActiveUser.js
- ActiverUsers.js
- AddFriend.js
- ChatButton.js
- ChatContainer.js
- ChatHeader.js
- ChatLayout.js
- Comment.js
- Comments.js
- CreatePost.js
- Events.js
- Functions.js
- FeedPost.js
- FileUpload.js
- Friend.js
- FriendList.js
- FriendRecs.js
- FriendReq.js
- FriendsDisplay.js
- Header.js
- LikeModal.js
- LikeOption.js
- Login.js
- LogoutButton.js
- Post.js
- Search.js
- SearchResults.js
- SearchResultUser.js
- Sidebar.js
- Signup.js
- UserProfile.js
- UsersSameAff.js
- ChatPage.js
- Feed.js
- Home.js
- ProfilePage.js
- App.js
- index.css
- chat.css
- friend.js
- post.js
- postComments.js
- postLikes.js
- user.js
- routes.js
- getRecs.js
- index.js
- socket.js
- InitMapper.java
- InitReducer.java
- IterMapper.java
- IterReducer.java
- DiffMapper.java
- DiffReducer.java
- SortMapper.java
- SortReducer.java
- FinishMapper.java
- FinishReducer.java
- RecommendationDriver.java
- getMRData.js


### Declaration

All of the content written was by us.

### Instructions to run

Make sure credentials are filled in in config.json file.
Run:

```
npm install
```

to get all of the dependencies
Run:

```
npm run dev
```

to run the server and client concurrently.
