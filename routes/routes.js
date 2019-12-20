const session = require("express-session");
const express = require("express");
const userdb = require("../models/user");
const postdb = require("../models/post");
const postCommentsdb = require("../models/postComments");
const postLikesdb = require("../models/postLikes");
const userPicsdb = require("../models/userPics");
const router = express.Router();
const chatdb = require("../models/chat");
const friendsdb = require("../models/friend");
const getRecs = require("../getRecs");
const friendVis = require("../models/friendVis")

//MIDDLEWARE
// router.use(userdb.manageSession);

//USER functions
//logins in
router.post("/login", userdb.checkLogin);
//signs up
router.post("/signup", userdb.signup);
//gets the logged in user
router.get("/session", userdb.getSession);
//logs the user out
router.post("/logout", userdb.logout);
router.get("/getUser", userdb.getUserPage);
router.post("/uploadPicProfile", userPicsdb.upload);

//POST functions
router.get("/userPosts", postdb.getUserPosts);
router.post("/addPost", postdb.addPost);
router.get("/allPosts", postdb.getPosts);

//POSTCOMMENTS functions
router.get("/getPostComments", postCommentsdb.getPostComments);
router.post("/addComment", postCommentsdb.addCommentToPost);

//POSTLIKES
router.get("/checkIfLiked", postLikesdb.checkLike);
router.post("/likePost", postLikesdb.addLike);
router.get("/addLikesOfPost", postLikesdb.getLikes);
router.post("/unlikePost", postLikesdb.unlike);

//Users of different sorts
router.get("/usersOnServer", userdb.getAllUsersOnServer);
router.get("/usersWithAff", userdb.getUsersWithSameAff);

//Friends
router.get("/allFriends", friendsdb.getFriends);
router.post("/sendReq", friendsdb.sendReq);
router.get("/getReqs", friendsdb.getReqs);
router.get("/checkIfFriend", friendsdb.isFriend);
router.post("/respondToReq", friendsdb.respondToReq);

//misc functionality
router.get("/searchUsers/:input", userdb.userSearchSuggestions);
router.get("/friendReqSent", friendsdb.hasSentFriendReq);


//chat
router.get("/getChat", chatdb.getChat);

router.post("/removeFriend", friendsdb.removeFriend);
router.get("/friendReqs", friendsdb.getFriendRequests);
router.get("/configHome", userdb.configHome);

module.exports = router;
