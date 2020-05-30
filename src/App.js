import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Modal from 'react-bootstrap/Modal';
import Shares from './shares';
import Operating from './operating';
import Report from './report';
import type {Game} from './logic';
import {newGame, newCompany, setShares, clearAlert, setPayment, changeBasePrice, nextRound, prevRound} from './logic';

class App extends Component<{}, {game: Game, showNewCompany: boolean, newName?: string}>{

  constructor(props){
    super(props);
    let game = newGame();
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
    game.alert = 'Foobar alert';
    this.state = {game: game, showNewCompany: false};
    let storedGame = localStorage.getItem('cotbsGame');
    if (storedGame != null)
      this.state = JSON.parse(storedGame);
  }

  writeState = (partialState: State) => {
    const newState = {...this.state, ...partialState};
    this.setState(newState);
    // Write to local
    localStorage.setItem('cotbsGame', JSON.stringify(newState));
  }

  doThing(fn: (Game, ...args: Array<any>) => Game): (...args: Array<any>) => void{
    return (...args: Array<any>) => {
      const newGame = fn(this.state.game, ...args);
      this.writeState({game: newGame});
    };
  }

  newGame = () => {
    if(confirm('Are you sure? This will erase all data')){
      this.writeState({showNewCompany: false, game: newGame()});
    }
  };

  toggleNewCompany = () => {
    this.writeState({showNewCompany: !this.state.showNewCompany});
  };

  setNewCompanyName = (evnt) => {
    this.writeState({newCompanyName: evnt.target.value});
  };

  setNewCompanyBasePrice = (evnt) => {
    this.writeState({newCompanyBasePrice: evnt.target.value});
  };

  makeNewCompany = () => {
    const {game, newCompanyName, newCompanyBasePrice} = this.state;
    const newGame = newCompany(game, {
      name: newCompanyName,
      basePrice: newCompanyBasePrice,
    });
    this.writeState({game: newGame,
      newCompanyName: null,
      showNewCompany: false
    });
  };

  renderNavbar = () => {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home">COTBS</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Nav>
            <NavDropdown title="Menu" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#" onClick={this.newGame}>New Game</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#">About</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>        
    );
  }

  renderAlert = () => {
    const alrt = this.state.game.alert;
    if(alrt == null)
      return null;
    return (
      <div> 
        <Toast show={alrt} onClose={this.doThing(clearAlert)}>
          <Toast.Header>
            <strong className="mr-auto">FYI</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>{alrt}</Toast.Body>
        </Toast>
      </div>
    );
  };

  renderNewCompanyModal = () => {
    const {newCompanyName, newCompanyBasePrice, showNewCompany} = this.state;
    return (
      <Modal
        show={showNewCompany}
        onHide={this.toggleNewCompany}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            New Company
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={newCompanyName} onChange={this.setNewCompanyName}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Base Price</Form.Label>
              <Form.Control type="number" pattern="[0-9]*" value={newCompanyBasePrice} onChange={this.setNewCompanyBasePrice}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Form>
            <Button onClick={this.makeNewCompany}>Add</Button>
          </Form>
        </Modal.Footer>
      </Modal>
    );
  };


  render() {
    const {game} = this.state;
    return (
      <div className="App">
        {this.renderNavbar()}
        {this.renderAlert()}
        {this.renderNewCompanyModal()}
        <Accordion defaultActiveKey="0">
          <Card>
            <Card.Header>
              <ButtonToolbar>
                <ButtonGroup>
                  <Button onClick={this.doThing(prevRound)}>Prev</Button>
                </ButtonGroup>
                <ButtonGroup>
                  <Button disabled>Round {game.currentRound}</Button>
                </ButtonGroup>
                <ButtonGroup>
                  <Button onClick={this.doThing(nextRound)}>Next</Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Card.Header>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              Shares
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Shares
                  players={game.players}
                  companies={game.rounds[game.currentRound-1].companies}
                  shares={game.rounds[game.currentRound-1].shares}
                  onChange={this.doThing(setShares)}
                />
                <Button onClick={this.toggleNewCompany}>New Company</Button>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="1">
              Operating
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <Operating
                  round={game.rounds[game.currentRound-1]}
                  onChangeBasePrice={this.doThing(changeBasePrice)}
                  onSetPayment={this.doThing(setPayment)}
                />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="2">
              Payouts
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <Report
                  round={game.rounds[game.currentRound-1]}
                />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
}

export default App;
