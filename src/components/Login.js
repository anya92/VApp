import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase';
import { firebaseApp } from '../firebase';


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: {
        message: ''
      },
      renderForgot: false,
      forgotEmail: ''
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

  forgotPassword = () => {
    this.setState(prevState => {
      return {
        renderForgot: !prevState.renderForgot
      };
    })
  }

  sendReset = () => {
    const { forgotEmail } = this.state;
    firebaseApp.auth().sendPasswordResetEmail(forgotEmail).then(() => {
      // Email sent.
      this.setState({ resetMessage: 'Email został wysłany.' })
    }).catch(error => console.log(error));
  }

  render() {
    return (
      <div className="login">
        <div className="header__login text-center">
          <h4 className="active login-title">Zaloguj się</h4>
          <Link to="/signup">
            <h4 className="signup-title">Zarejestruj się</h4>
          </Link>
        </div>
        <div>
          <p className="error">{this.state.error.message}</p>
        </div>
        <form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              name="email"
              placeholder="email"
              className="form-control"
              onChange={e => this.setState({ email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Hasło</label>
            <input 
              type="password"
              name="password"
              className="form-control"
              placeholder="password"
              onChange={e => this.setState({ password: e.target.value })}
             />
          </div>   
          <button
            className="btn btn-lg"
            onClick={e => this.signIn(e)}
          >
            Zaloguj się
          </button>
        </form>
        <hr/>
        {
          !this.state.renderForgot 
          ? <button 
              className="btn btn-lg forgot-password"
              onClick={this.forgotPassword}
            >
              Zapomniałeś hasła?
            </button>
          : <div></div>  
        }
        
        { 
          this.state.renderForgot 
          ? (
              <div className="forgot-password">
                <p onClick={this.forgotPassword}>&#x2715;</p>
                <div className="form-group">
                  <label htmlFor="forgot-email">Wpisz email, </label>
                  <input 
                    type="email" 
                    name="forgot-email" 
                    className="form-control" 
                    onChange={e => this.setState({ forgotEmail: e.target.value })}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-lg"
                  onClick={this.sendReset}
                >
                  Wyślij
                </button>
              </div>
            )
          : <div></div>
        }
      </div>
    );
  }
}

export default Login;
