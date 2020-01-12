// @flow
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

class RawEntry extends Component<{
  payment: RawPayment,
  onSetPayment: (Payment) => void
}> {

  setPayment = (evnt) => {
    let val = parseInt(evnt.target.value, 10);
    this.props.onSetPayment({
      kind: 'raw', 
      total: val,
    });
  }

  render(){
    let {total} = this.props.payment || {};
    return (
      <InputGroup>
        <Form.Control type="number" value={total} 
          onChange={this.setPayment}/>
      </InputGroup>
    );
  }
}

class GoodsEntry extends Component {
  render(){
    return <p>Goods</p>;
  }
}

export default class OperatingEntry extends Component<{
  payment: Payment,
  onSetPayment: (Payment) => void
},{
  rawMode: boolean
}> {

  setRawMode(val: boolean): () => void{
    return () => this.setState({rawMode: val});
  }

  render(){
    let {payment, onSetPayment} = this.props;
    let rawMode = false;
    if (payment != null)
      rawMode = payment.kind === 'raw';
    if(this.state != null && this.state.rawMode != null)
      rawMode = this.state.rawMode;
    return (
      <Form>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Raw number" 
            checked={rawMode}
            onChange={this.setRawMode(!rawMode)}
          />
        </Form.Group>
        <Form.Group>
          {rawMode && <RawEntry payment={payment} onSetPayment={onSetPayment}/>}
          {!rawMode && <GoodsEntry payment={payment} onSetPayment={onSetPayment} />}
        </Form.Group>
      </Form>
    );
  }
}
