// @flow
import React, { Component } from 'react';
import type {OperatingRound, Player} from './logic';
import Table from 'react-bootstrap/Table';
import {getPayouts} from './logic';

export default class Report extends Component<{
  players: Player[],
  round: OperatingRound,
}> {

  render(){
    const {round, players} = this.props;
    const payouts = getPayouts(round);
    const payees = players.concat(round.companies.map(c => c.name));
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
