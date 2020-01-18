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

class GoodsEntry extends Component<{
  payment: GoodsPayment,
  onSetPayment: (Payment) => void
}> {

  goodifyPayment(payment): GoodsPayment{
    payment.kind = 'goods';
    let {goodsSold, unitPrice, halfPriceGoodsSold, bonusTwenty, bonusFifty} = {...{goodsSold: 0, unitPrice: 0, halfPriceGoodsSold: 0, bonusFifty: false, bonusTwenty: false}, ...payment};
    payment.total = Math.round((goodsSold * unitPrice) + (halfPriceGoodsSold * unitPrice * 0.5) + (bonusFifty? 50: 0) + (bonusTwenty? 20: 0));
    return payment;
  }

  setPaymentNumber(payment, field): (evnt) => void{
    return (evnt) => {
      payment = payment || {kind: 'goods', unitPrice: 0, goodsSold: 0, halfPriceGoodsSold: 0, bonusTwenty: false, bonusFifty: false};
      payment[field] = parseInt(evnt.target.value, 10);
      this.props.onSetPayment(this.goodifyPayment(payment));
    }
  }

  setPaymentFlag(payment, field, value): () => void{
    return () => {
      payment = payment || {kind: 'goods', unitPrice: 0, goodsSold: 0, halfPriceGoodsSold: 0, bonusTwenty: false, bonusFifty: false};
      payment[field] = value;
      this.props.onSetPayment(this.goodifyPayment(payment));
    }
  }

  renderField(label, payment, field){
    return (
      <Form.Group>
        <Form.Label>{label}</Form.Label>
        <Form.Control type="number" value={payment[field]} onChange={this.setPaymentNumber(payment, field)} />
      </Form.Group>
    );
  }

  renderCheck(label, payment, field){
    let checked = payment[field] === true;
    return (
      <Form.Group>
        <Form.Check
          type="checkbox"
          label={label}
          checked={checked}
          onChange={this.setPaymentFlag(payment, field, !checked)}
        />
      </Form.Group>
    );
  }

  render(){
    let payment = this.props.payment || {};
    return (
      <React.Fragment>
        {this.renderField('Goods sold', payment, 'goodsSold')}
        {this.renderField('1/2 Price Goods sold', payment, 'halfPriceGoodsSold')}
        {this.renderField('Price', payment, 'unitPrice')}
        {this.renderCheck('$50 Bonus', payment, 'bonusFifty')}
        {this.renderCheck('$20 Bonus', payment, 'bonusTwenty')}
      </React.Fragment>
    );
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
