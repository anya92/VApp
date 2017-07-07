import React, { Component } from 'react';
import { firebaseApp } from '../../firebase';

class Profile extends Component {
  signOut() {
    firebaseApp.auth().signOut();
  }

  render() {
    return (
      <div>
        <h1>User Profile</h1>
        <p>{this.props.user.email}</p>
        <button onClick={this.signOut}>Sign Out</button>
      </div>
    );
  }
}

export default Profile;
