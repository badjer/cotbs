// @flow
import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';


class RawEntry extends Component {
}

export default class OperatingEntry extends Component {
  render(){
    return (
      <Form>
        <Form.Group>
          <Form.Check
            type="switch"
            label="Raw number" 
          />
        </Form.Group>
        <FormGroup>
          {rawMode && <RawEntry />}
          {!rawMode && <OperatingEntry />}
        </FormGroup>
      </Form>
    );
  }
}
