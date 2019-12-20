import React, {Component} from 'react';
import Layout from '../components/ChatLayout';
import './chat.css'

class App extends Component {

  render() {

    return (
      <div className="container">
        <Layout title="Sadbook Chatroom"/>
      </div>
    );
  }
}

export default App;
