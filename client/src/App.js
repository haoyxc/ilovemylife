import React from "react";
import { BrowserRouter } from "react-router-dom";
import { BrowserRouter as Switch, Route } from "react-router-dom";
import Home from "./views/Home";
import ProfilePage from "./views/ProfilePage";
import Feed from "./views/Feed";
import Chat from "./views/ChatPage";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/profile" exact component={ProfilePage} />
        <Route path="/profile/:userID" exact component={ProfilePage} />
        <Route path="/feed" exact component={Feed} />
        <Route path="/chat" exact component={Chat} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
