import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Shares from './shares'
import type {Game} from './logic';
import {newGame, newCompany, setShares} from './logic';

class App extends Component<{}, {game: Game}>{
  state: {game: Game};

  constructor(props){
    super(props);
    this.state = {game: newGame()};
  }

  doThing(fn: (Game, ...args: Array<any>) => Game): (...args: Array<any>) => void{
    return (...args: Array<any>) => {
      console.log('Calling doThing.fn ', args);
      const newGame = fn(this.state.game, ...args);
      this.setState({...this.state, ...{game: newGame}});
    };
  }

  render() {
    let {game} = this.state;
    game = newCompany(game, {name: 'A', basePrice: 20});
    game = newCompany(game, {name: 'B', basePrice: 20});
    game = newCompany(game, {name: 'C', basePrice: 20});
    game = newCompany(game, {name: 'D', basePrice: 20});
    game = newCompany(game, {name: 'E', basePrice: 20});
    game = newCompany(game, {name: 'F', basePrice: 20});
    game = newCompany(game, {name: 'G', basePrice: 20});
    game = setShares(game, 'B', 'Red', 3);
    game = setShares(game, 'B', 'Green', 3);
    game = setShares(game, 'B', 'Blue', 3);
    game = setShares(game, 'B', 'Yellow', 3);
    game = setShares(game, 'C', 'Red', 3);
    game = setShares(game, 'C', 'Green', 3);
    game = setShares(game, 'C', 'Blue', 3);
    game = setShares(game, 'C', 'Yellow', 3);
    game = setShares(game, 'A', 'Red', 3);
    game = setShares(game, 'A', 'Green', 3);
    game = setShares(game, 'A', 'Blue', 3);
    game = setShares(game, 'A', 'Yellow', 3);
    console.log(game);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              Shares
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <h1>Contents of shares</h1>
                <Shares
                  players={game.players}
                  companies={game.rounds[game.currentRound-1].companies}
                  shares={game.rounds[game.currentRound-1].shares}
                  onChange={this.doThing(setShares)}
                />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="1">
              Payouts
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>Contents of payouts</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
}

export default App;
