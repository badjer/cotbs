// @flow
import React, { Component } from 'react';
import type {Company, CompanyName, Shareholder} from './logic';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

export default class ExtraDividends extends Component<{
  players: Player[],
  companies: Company[],
  shares: {[CompanyName]: {[Shareholder]: number}},
}> {

  constructor(props){
    super(props);
    this.state = {amount: 100};
  }

  setAmount = (evnt) => {
    let val = parseInt(evnt.target.value, 10);
    this.setState({amount: val});
  }

  render(){
    let {shares, players, companies} = this.props;
    let {amount} = this.state;
    const shareholders = players.concat('Bank');
    const hideZero = (num?: number) => num === 0 ? null : num;
    return (
      <div>
        <Form.Group>
          <Form.Label>Amount</Form.Label>
          <Form.Control type="number" pattern="[0-9]*" value={amount} 
            onChange={this.setAmount}/>
        </Form.Group>
        <Table size="sm" striped bordered>
          <thead>
            <tr>
              <th></th>
              {shareholders.map(sh => <td key={sh}>{sh}</td>)}
            </tr>
          </thead>
          <tbody>
            {companies.map(company => 
              <tr key={company.name}>
                <td>{company.name}</td>
                {shareholders.map(sh =>
                  <td key={sh}>{hideZero(((amount || 0) / 10) * (shares[company.name][sh] || 0))}</td>
                )}
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  }
}
