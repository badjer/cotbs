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
    return payment.total;
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
    return (
        <Table size="sm" striped bordered>
          <thead></thead>
          <tbody>
            {companies.map(company => 
              <tr key={company.name}>
                <td>{company.name}</td>
                <OverlayTrigger
                  key={company.name}
                  trigger="click"
                  rootClose={true}
                  overlay={this.renderPopover(company, payments[company.name])}>
                    <td>{this.paymentAmount(payments[company.name])}</td>
                </OverlayTrigger>
              </tr>
            )}
          </tbody>
        </Table>
    );
  }
}
