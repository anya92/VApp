import React, { Component } from 'react';
import { firebaseApp } from '../../firebase';

class Profile extends Component {

  render() {
    return (
      <div>
        <h1>User Profile</h1>
        <p>{this.props.user.email}</p>
      </div>
    );
  }
}

export default Profile;
