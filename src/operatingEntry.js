// @flow
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';

class GoodsEntry extends Component<{
  payment: Payment,
  onSetPayment: (Payment) => void
}> {

  goodifyPayment(payment): Payment{
    let {goodsSold, unitPrice, halfPriceGoodsSold, bonusTwenty, bonusFifty, extraAmt} = {...{goodsSold: 0, unitPrice: 0, halfPriceGoodsSold: 0, bonusFifty: false, bonusTwenty: false, extraAmt: 0}, ...payment};
    payment.total = Math.round(((goodsSold || 0) * (unitPrice || 0)) + ((halfPriceGoodsSold || 0) * (unitPrice || 0) * 0.5) + (bonusFifty? 50: 0) + (bonusTwenty? 20: 0) + (extraAmt || 0));
    return payment;
  }

  setPaymentNumber(payment, field): (evnt) => void{
    return (evnt) => {
      payment = payment || {unitPrice: 0, goodsSold: 0, halfPriceGoodsSold: 0, bonusTwenty: false, bonusFifty: false};
      payment[field] = parseInt(evnt.target.value, 10);
      this.props.onSetPayment(this.goodifyPayment(payment));
    }
  }

  setPaymentFlag(payment, field, value): () => void{
    return () => {
      payment = payment || {unitPrice: 0, goodsSold: 0, halfPriceGoodsSold: 0, bonusTwenty: false, bonusFifty: false};
      payment[field] = value;
      this.props.onSetPayment(this.goodifyPayment(payment));
    }
  }

  renderField(label, payment, field){
    return (
      <Form.Group>
        <Form.Label>{label}</Form.Label>
        <Form.Control type="number" pattern="[0-9]*" value={payment[field]} onChange={this.setPaymentNumber(payment, field)} />
      </Form.Group>
    );
  }

  renderCheck(label, payment, field){
    let checked = payment[field] === true;
    return (
      <Form.Group>
        <Form.Switch
          id={field}
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
        {this.renderCheck('Withhold', payment, 'withhold')}
        {this.renderField('Goods sold', payment, 'goodsSold')}
        {this.renderField('1/2 Price Goods sold', payment, 'halfPriceGoodsSold')}
        {this.renderField('Price', payment, 'unitPrice')}
        {this.renderCheck('$50 Bonus', payment, 'bonusFifty')}
        {this.renderCheck('$20 Bonus', payment, 'bonusTwenty')}
        {this.renderField('Extra Amount', payment, 'extraAmt')}
      </React.Fragment>
    );
  }
}

export default class OperatingEntry extends Component<{
  payment: Payment,
  onSetPayment: (Payment) => void
}> {

  render(){
    let {payment, onSetPayment} = this.props;
    return (
      <Form>
        <Form.Group>
          <GoodsEntry payment={payment} onSetPayment={onSetPayment} />
        </Form.Group>
      </Form>
    );
  }
}
