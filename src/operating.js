// @flow
import React, { Component } from 'react';
import type {Payment} from './logic';
import ListGroup from 'react-bootstrap/ListGroup';

export default class Operating extends Component<{
  payments: Map<string,Payment>,
  changeBasePrice: (string, number): void,
  setPayment: (string, Payment?): void,
}> {
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
