// @flow
import React, { Component } from 'react';
import type {Company, CompanyName, Shareholder} from './logic';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

export class ShareLine extends Component<{
  shareholders: Shareholder[],
  company: Company,
  shares: {[Shareholder]: number},
  onChange: (Shareholder, number) => void,
}>{

  setShares(sh: Shareholder): (number) => void {
    console.log('Calling Shareline.setShares', sh);
    return (num) => this.props.onChange(sh, num);
  }

  renderPopover(num: number, onChange: (string) => void){
    return (
      <Popover>
        <Popover.Content>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>-</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type="number" value={num} 
              onChange={(e) => onChange(e.target.value)}/>
            <InputGroup.Append>
              <InputGroup.Text>+</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Popover.Content>
      </Popover>
    );
  }

  render() {
    const {shareholders, company, shares} = this.props;
    return (
      <tr>
        <td>{company.name}</td>
        {shareholders.map(sh => 
          <OverlayTrigger 
            trigger="click" 
            rootClose={true}
            overlay={this.renderPopover(shares[sh], this.setShares(sh))}>
            <td>{shares[sh]}</td>
          </OverlayTrigger>
        )}
      </tr>
    );
  }
}

export default class Shares extends Component<{
  players: Player[],
  companies: Company[],
  shares: {[CompanyName]: {[Shareholder]: number}},
  onChange: (CompanyName, Shareholder, number) => void,
}> {

  setShares(company: CompanyName): (Shareholder,number) => void {
    console.log('Calling Shares.setShares', company);
    return (sh: Shareholder, num: number) => {
      this.props.onChange(company, sh, num);
    }
  }

  render(){
    const {players, companies, shares} = this.props;
    const shareholders = players.concat('Bank');
    return (
      <Table size="sm" striped>
        <thead>
          <tr>
            <th></th>
            {shareholders.map(sh => <td>{sh}</td>)}
          </tr>
        </thead>
        <tbody>
          {companies.map(company => 
            <ShareLine key={company.name}
              shareholders={shareholders} 
              company={company} 
              shares={shares[company.name]} 
              onChange={this.setShares(company.name)}
            />
          )}
        </tbody>
      </Table>
    );
  }
}
