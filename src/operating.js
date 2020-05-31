// @flow
import React, { Component } from 'react';
import type {Payment, OperatingRound, Company} from './logic';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Table from 'react-bootstrap/Table';
import OperatingEntry from './operatingEntry';

export default class Operating extends Component<{
  round: OperatingRound,
  onSetPayment: (string, Payment) => void
}> {

  setPayment(c: Company): (payment: Payment) => void{
    return (payment: Payment) => this.props.onSetPayment(c.name, payment);
  }

  paymentAmount(payment: Payment): number{
    if(payment == null)
      return undefined;
    const withhold = payment.withhold ? ' (W)' : '';
    return payment.total.toString().concat(withhold);
  }

  renderPopover(company: Company, payment: Payment){
    payment = payment || {kind: 'goods', unitPrice: company.basePrice};
    return (
      <Popover>
        <Popover.Content>
          <OperatingEntry
            payment={payment}
            onSetPayment={this.setPayment(company)}
          />
        </Popover.Content>
      </Popover>
    );
  }

  render(){
    let {companies, payments} = this.props.round;
    const hideZero = (num?: number) => {
      if (num === 0 || num == null || isNaN(num))
        return null;
      return Math.floor(num);
    };
    return (
        <Table size="sm" striped bordered>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>2x</th>
              <th>3x</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(company => 
              <tr key={company.name.concat('-1')}>
                <td>{company.name}</td>
                <OverlayTrigger
                  key={company.name}
                  trigger="click"
                  rootClose={true}
                  overlay={this.renderPopover(company, payments[company.name])}>
                    <td>{this.paymentAmount(payments[company.name])}</td>
                </OverlayTrigger>
                <td>{hideZero(this.paymentAmount(payments[company.name]) / 2)}</td>
                <td>{hideZero(this.paymentAmount(payments[company.name]) / 3)}</td>
              </tr>
            )}
          </tbody>
        </Table>
    );
  }
}
