import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

export default class Shares extends Component {
  render(){
    return (
      <ListGroup>
        <ListGroup.Item>C 1</ListGroup.Item>
        <ListGroup.Item>C 2</ListGroup.Item>
        <ListGroup.Item>C 3</ListGroup.Item>
        <ListGroup.Item>C 4</ListGroup.Item>
      </ListGroup>
    );
  }
}
