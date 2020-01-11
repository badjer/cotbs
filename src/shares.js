// @flow
import React, { Component } from 'react';
import type {Company, CompanyName, Shareholder} from './logic';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export class ShareLine extends Component<{
  shareholders: Shareholder[],
  company: Company,
  shares: {[Shareholder]: number},
  onChange: (Shareholder, number) => void,
}>{

  setShares(sh: Shareholder): (evnt) => void{
    return (evnt) => this.props.onChange(sh, parseInt(evnt.target.value, 10));
  }

  increment(sh: Shareholder): () => void {
    return () => {
      const cur = this.props.shares[sh] || 0;
      this.props.onChange(sh, cur + 1);
    };
  }

  decrement(sh: Shareholder): () => void {
    return () => {
      const cur = this.props.shares[sh] || 0;
      this.props.onChange(sh, cur - 1);
    };
  }

  renderPopover(sh: Shareholder, num?: number){
    const displayNum = num || 0;
    return (
      <Popover>
        <Popover.Content>
          <InputGroup>
            <InputGroup.Prepend>
              <Button onClick={this.decrement(sh)}>-</Button>
            </InputGroup.Prepend>
            <Form.Control type="number" value={displayNum} 
              onChange={this.setShares(sh)}/>
            <InputGroup.Append>
              <Button onClick={this.increment(sh)}>+</Button>
            </InputGroup.Append>
          </InputGroup>
        </Popover.Content>
      </Popover>
    );
  }

  render() {
    const {shareholders, company, shares} = this.props;
    const hideZero = (num?: number) => num === 0 ? null : num;
    return (
      <tr>
        <td>{company.name}</td>
        {shareholders.map(sh => 
          <OverlayTrigger 
            key={sh}
            trigger="click" 
            rootClose={true}
            overlay={this.renderPopover(sh, shares[sh])}>
            <td>{hideZero(shares[sh])}</td>
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
    return (sh: Shareholder, num: number) => {
      this.props.onChange(company, sh, num);
    }
  }

  onDragEnd = result => {
    const { destination, source, reason } = result;

    // Not a thing to do...
    if (!destination || reason === 'CANCEL') {
      this.setState({
      });
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    this.setState({
    });
  }

  render(){
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
