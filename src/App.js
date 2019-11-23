import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from 'react-bootstrap/ListGroup'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ListGroup>
          <ListGroup.Item>Item 1</ListGroup.Item>
          <ListGroup.Item>Item 2</ListGroup.Item>
          <ListGroup.Item>Item 3</ListGroup.Item>
          <ListGroup.Item>Item 4</ListGroup.Item>
        </ListGroup>
      </div>
    );
  }
}

export default App;
