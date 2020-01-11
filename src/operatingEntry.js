// @flow
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';

class RawEntry extends Component {
  render(){
    return <p>Raw</p>;
  }
}

class GoodsEntry extends Component {
  render(){
    return <p>Goods</p>;
  }
}

export default class OperatingEntry extends Component<{
  company: Company,
  onSetPayment: (Payment) => void
},{
  rawMode: boolean
}> {

  state = {rawMode: false};

  toggleRawMode = () => {
    this.setState({rawMode: !this.state.rawMode});
  }

  render(){
    let {rawMode} = this.state;
    return (
      <Form>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Raw number" 
            checked={rawMode}
            onChange={this.toggleRawMode}
          />
        </Form.Group>
        <Form.Group>
          {rawMode && <RawEntry />}
          {!rawMode && <GoodsEntry />}
        </Form.Group>
      </Form>
    );
  }
}
