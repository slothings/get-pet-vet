/* eslint-disable no-unused-vars */
import React from "react";
import { Router, Route } from "react-router-dom";
import CalenderPage from "./CalenderPage";
import { createBrowserHistory as createHistory } from "history";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
// import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";

const history = createHistory();

function CalenderApp({ calendarStore }) {
  return (
    <div>
      <Router history={history}>
        <Navbar bg="primary" expand="lg" variant="dark">
          <Navbar.Brand href="#home">Calendar App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/">Home</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Route
          path="/scheduler"
          exact
          component={props => (
            <CalenderPage {...props} calendarStore={calendarStore} />
          )}
        />
      </Router>
    </div>
  );
}

export default CalenderApp;
