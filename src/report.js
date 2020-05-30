// @flow
import React, { Component } from 'react';
import type {Company} from './logic';
import Table from 'react-bootstrap/Table';

export class ReportLine extends Component<{
  shareholders: Shareholder[],
  company: Company,
  shares: {[Shareholder]: number},
}>{

  render() {
    const {shareholders, company, shares} = this.props;
    const hideZero = (num?: number) => num === 0 ? null : num;
    return (
      <tr>
        <td>{company.name}</td>
        {shareholders.map(sh => 
          <td key={sh}>{hideZero(shares[sh])}</td>
        )}
      </tr>
    );
  }
}

export default class Report extends Component<{
  players: Player[],
  companies: Company[],
  shares: {[CompanyName]: {[Shareholder]: number}},
}> {

  render(){
    console.log(this.props)
    const {players, companies, shares} = this.props;
    const shareholders = players.concat('Bank');
    return (
        <Table size="sm" striped bordered>
          <thead>
            <tr>
              <th></th>
              {shareholders.map(sh => <td key={sh}>{sh}</td>)}
            </tr>
          </thead>
          <tbody>
            {companies.map(company => 
                <ReportLine key={company.name}
                  shareholders={shareholders} 
                  company={company} 
                  shares={shares[company.name]} 
                />
            )}
          </tbody>
        </Table>
    );
  }
}
