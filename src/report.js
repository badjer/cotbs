// @flow
import React, { Component } from 'react';
import type {OperatingRound} from './logic';
import Table from 'react-bootstrap/Table';
import {getPayouts} from './logic';

export default class Report extends Component<{
  round: OperatingRound,
}> {

  render(){
    const {round} = this.props;
    const payouts = getPayouts(round);
    const payees = Object.keys(payouts);
    return (
        <Table size="sm" striped bordered>
          <thead>
            <tr>
            </tr>
          </thead>
          <tbody>
            {payees.map(payee => 
              <tr key={payee}>
                <td>{payee}</td>
                <td>{payouts[payee]}</td>
              </tr>
            )}
          </tbody>
        </Table>
    );
  }
}
