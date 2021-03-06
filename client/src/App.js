/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
// components
import Signup from './components/Sign-up/Sign-up';
import LoginForm from './components/Login-form/Login-form';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import VideoChat from './components/VideoChat/VideoChat';
import Scheduler from './components/Scheduler/Scheduler';
import Profile from './components/Profile/Profile';
import AddPet from './components/AddPet/AddPet';
import Doctors from "./components/Doctors/Doctors";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { CalendarStore } from "../src/components/Scheduler/store";
const calendarStore = new CalendarStore();


class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      email: null,
      firstName: null,
      lastName: null,
      isDoctor: false
    };

    this.getUser = this.getUser.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    this.getUser();
  }

  updateUser(userObject) {
    this.setState(userObject);
  }

  getUser() {
    axios.get('/user/').then(response => {
      if (response.data.user) {

        this.setState({
          loggedIn: true,
          email: response.data.user.email,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          isDoctor: response.data.user.isDoctor
        });
      } else {
        this.setState({
          loggedIn: false,
          email: null,
          firstName: null
        });
      }
    });
  }

  render() {
    return (
      <div className="App">

        <Router>
          <Navbar isDoctor={this.state.isDoctor} updateUser={this.updateUser} loggedIn={this.state.loggedIn} />

          <Route
            exact path="/"
            render={() => {
              if (this.state.loggedIn) {
                return (
                  <Home
                    updateUser={this.updateUser}
                    firstName={this.state.firstName}
                  />
                );
              } else {
                return (
                  <Redirect to="/login" />
                );
              }
            }
            }
          />
          <Route
            exact path="/login"
            render={() => {

              if (!this.state.loggedIn) {
                return (
                  <LoginForm
                    updateUser={this.updateUser}
                  />
                );
              } else {
                return (
                  <Redirect to="/" />
                );
              }
            }
            }
          />
          <Route
            exact path="/signup"
            render={() => {
              if (!this.state.loggedIn) {
                return (
                  <Signup />
                );
              } else {
                return (
                  <Redirect to="/" />
                );
              }
            }
            }
          />
          <Route
            exact path="/scheduler"
            render={() => {
              if (this.state.loggedIn) {
                return (
                  <Scheduler
                    calendarStore={calendarStore}
                    isDoctor={this.state.isDoctor} />
                );
              } else {
                return (
                  <Redirect to="/login" />
                );
              }
            }
            }
          />
          <Route
            exact path="/profile"
            render={() => {
              if (this.state.loggedIn) {
                return (
                  <Profile />
                );
              } else {
                return (
                  <Redirect to="/login" />
                );
              }
            }
            }
          />
          <Route
            exact path="/addpet"
            render={() => {
              if (this.state.loggedIn) {
                return (
                  <AddPet />
                );
              } else {
                return (
                  <Redirect to="/login" />
                );
              }
            }
            }
          />
          <Route
            exact path="/doctors"
            render={() => {
              if (this.state.loggedIn) {
                return (
                  <Doctors />
                );
              } else {
                return (
                  <Redirect to="/login" />
                );
              }
            }
            }
          />
          <Route
            exact path="/videochat"
            render={() => {
              if (this.state.loggedIn) {
                return (
                  <VideoChat firstName={this.state.firstName} lastName={this.state.lastName} />
                );
              } else {
                return (
                  <Redirect to="/login" />
                );
              }
            }
            }
          />
        </Router>

      </div>
    );
  }
}

export default App;