import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firebaseApp } from '../firebase';

class Login extends Component {
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

  signIn(e) {
    e.preventDefault();
    const { email, password } = this.state;
    firebaseApp.auth().signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.setState({ error });
      }); 
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <div>
          {this.state.error.message}
        </div>
        <div>{this.props.user ? this.props.user.email : 'no user'}</div>
        <form>
          <input 
            type="email"
            placeholder="email"
            onChange={e => this.setState({ email: e.target.value })}
          />
          <input 
            type="password"
            placeholder="password"
            onChange={e => this.setState({ password: e.target.value })}
          />
          <button
            onClick={e => this.signIn(e)}
          >
            Log In
          </button>
        </form>
        <Link to="/signup">Sign up instead</Link>
      </div>
    );
  }
}

export default Login;
