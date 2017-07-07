import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firebaseApp } from '../../firebase';
const editIcon = require('../../icons/edit.svg');
const userIcon = require('../../icons/user.svg');

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: 'tab-1'
    }
  }
  render() {
    const { email, photoURL } = this.props.user;
    const displayName = 'Ania Bania';
    return (
      <div className="text-center">
        <div className="header">
          <div className="edit-icon">
            <Link to="/profile/edit">
              <img src={editIcon} alt="edit-icon"/>
            </Link>
          </div>
          <div className="user-info">
            <div className="user-photo">
              <img src={photoURL || userIcon} alt="user-icon"/>
            </div>
            <div className="user-name">
              <h2>{displayName || email}</h2>
              <h4>{displayName && email}</h4>
            </div>
          </div>
          <div className="tabs">
            <div className="tab active" id="tab-1">
              <p>Moje Ankiety</p>
            </div>
            <div className="tab" id="tab-2">
              <p>Tab 2</p>
            </div>
            <div className="tab" id="tab-3">
              <p>Tab 3</p>
            </div>
            <div className="tab" id="tab-4">
              <p>Tab 4</p>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Profile;
