import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firebaseApp } from '../firebase';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: {
        message: ''
      }
    };
  }

  signUp(e) {
    e.preventDefault();
    const { email, password } = this.state;
    firebaseApp.auth().createUserWithEmailAndPassword(email, password)
    .catch(error => {
      this.setState({ error });
    });
  }

  render() {
    return (
      <div>
        <h1>Sign Up</h1>
        <div>
          {this.state.error.message}
        </div>
        <form>
          <input
            type="email"
            placeholder="email"
            onChange={e => this.setState({ email: e.target.value})}
          />
          <input
            type="password"
            placeholder="password"
            onChange={e => this.setState({ password: e.target.value})}
          />
          <button
            onClick={e => this.signUp(e)}
          >
            Sign Up
          </button>
        </form>
        <Link to="/login">Already a user? Sign in instead</Link>
      </div>
    );
  }
}

export default SignUp;
