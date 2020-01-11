import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Modal from 'react-bootstrap/Modal';
import Shares from './shares'
import type {Game} from './logic';
import {newGame, newCompany, setShares, clearAlert} from './logic';

class App extends Component<{}, {game: Game, showNew: boolean, newName?: string}>{

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
    this.state = {game: game, showNew: false};
  }

  writeState = (partialState: State) => {
    const newState = {...this.state, ...partialState};
    console.log(newState);
    this.setState(newState);
    // Write to local
  }

  doThing(fn: (Game, ...args: Array<any>) => Game): (...args: Array<any>) => void{
    return (...args: Array<any>) => {
      const newGame = fn(this.state.game, ...args);
      this.writeState({game: newGame});
    };
  }

  toggleNew = () => {
    this.writeState({showNew: !this.state.showNew});
  };

  setNewName = (evnt) => {
    this.writeState({newName: evnt.target.value});
  };

  setNewBasePrice = (evnt) => {
    this.writeState({newBasePrice: evnt.target.value});
  };

  makeNew = () => {
    const {game, newName, newBasePrice} = this.state;
    const newGame = newCompany(game, {
      name: newName,
      basePrice: newBasePrice,
    });
    this.writeState({game: newGame,
      newName: null,
      showNew: false
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
              <NavDropdown.Item href="#">New Game</NavDropdown.Item>
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
    const {newName, newBasePrice, showNew} = this.state;
    return (
      <Modal
        show={showNew}
        onHide={this.toggleNew}
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
              <Form.Control type="text" value={newName} onChange={this.setNewName}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Base Price</Form.Label>
              <Form.Control type="number" value={newBasePrice} onChange={this.setNewBasePrice}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Form>
            <Button onClick={this.makeNew}>Add</Button>
          </Form>
        </Modal.Footer>
      </Modal>
    );
  };


  render() {
    const {game} = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {this.renderNavbar()}
        {this.renderAlert()}
        {this.renderNewCompanyModal()}
        <Accordion defaultActiveKey="0">
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
                <Button onClick={this.toggleNew}>New</Button>
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
