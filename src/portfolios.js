// @flow
import React, { Component } from 'react';
import type {Company, CompanyName, Shareholder} from './logic';
import {getPortfolioValues} from './logic';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';


export class StockLine extends Component<{
  company: Company,
  stock: number,
  onChange: (number) => void,
}> {

  setStock(): (evnt) => void{
    return (evnt) => this.props.onChange(parseInt(evnt.target.value, 10));
  }

  renderPopover(num?: number){
    const displayNum = num || 0;
    return (
      <Popover>
        <Popover.Content>
          <InputGroup>
            <Form.Control type="number" pattern="[0-9]*" value={displayNum} 
              onChange={this.setStock()}/>
          </InputGroup>
        </Popover.Content>
      </Popover>
    );
  }

  render(){
    let {company, stock} = this.props;
    const hideZero = (num?: number) => num === 0 ? null : num;
    return (
      <tr>
        <td>{company.name}</td>
        <OverlayTrigger 
          trigger="click" 
          rootClose={true}
          overlay={this.renderPopover(stock)}>
            <td>{hideZero(stock)}</td>
        </OverlayTrigger>
      </tr>
    );
  }
}

export default class Portfolios extends Component<{
  players: Player[],
  companies: Company[],
  shares: {[CompanyName]: {[Shareholder]: number}},
  stocks: {[CompanyName]: number},
  onChange: (CompanyName, number) => void,
}> {


  setStock(company: CompanyName): (number) => void {
    return (num: number) => {
      this.props.onChange(company, num);
    }
  }

  render(){
    const {players, companies, shares, stocks} = this.props;
    const portfolioValues = getPortfolioValues(players, stocks, shares);
    return (
      <div>
        <Table size="sm" striped bordered>
          <thead>
          </thead>
          <tbody>
            {companies.map(company => 
              <StockLine key={company.name}
                company={company} 
                stock={stocks[company.name]} 
                onChange={this.setStock(company.name)}
              />
            )}
          </tbody>
        </Table>

        <Table size="sm" striped bordered>
          <thead>
          </thead>
          <tbody>
            {players.map(player => 
              <tr key={player}>
                <td>{player}</td>
                <td>{portfolioValues[player]}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  }
}
