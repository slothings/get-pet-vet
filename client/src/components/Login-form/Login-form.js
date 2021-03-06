// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
// eslint-disable-next-line no-unused-vars
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import logoDarkGray from "../assets/logoDarkGray.png";
import "./Login.css";

class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      firstName: "",
      lastName: "",
      redirectTo: null,
      isDoctor: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('handleSubmit');

    axios
      .post('/user/login', {
        email: this.state.email,
        password: this.state.password,
        isDoctor: this.state.isDoctor
      })
      .then(response => {
        console.log('login response: ');
        console.log(response);
        if (response.status === 200) {
          // update App.js state
          this.props.updateUser({
            loggedIn: true,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            isDoctor: response.data.isDoctor
          });
          // update the state to redirect to home
          this.setState({
            redirectTo: '/'
          });
        }
      }).catch(error => {
        console.log('login error: ');
        console.log(error);

      });
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />;
    } else {
      return (
        <div id="loginCentering">
          <div className="loginIntro">
            <img src={logoDarkGray} alt="Girl in a jacket" width="20%" height="20%" className="aboutlogo"></img>
            <h1 id="welcomeHomepg">Login</h1>
          </div>
          <form className="form-horizontal">
            <div className="form-group">
              <div className="col-1 col-ml-auto">
                <label className="form-label" htmlFor="email">Email</label>
              </div>
              <div className="col-3 col-mr-auto">
                <input className="form-input"
                  type="text"
                  id="email"
                  name="email"
                  placeholder="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-1 col-ml-auto">
                <label className="form-label" htmlFor="password">Password: </label>
              </div>
              <div className="col-3 col-mr-auto">
                <input className="form-input"
                  placeholder="password"
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="form-group ">
              <div className="col-7"></div>
              <button
                className="btn btn-primary"

                onClick={this.handleSubmit}
                type="submit">Login</button>
            </div>
          </form>
        </div>
      );
    }
  }
}

export default LoginForm;