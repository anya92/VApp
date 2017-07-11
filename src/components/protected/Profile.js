import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { userRef, pollRef } from '../../firebase';
const editIcon = require('../../icons/edit.svg');
const userIcon = require('../../icons/user.png');
const errorIcon = require('../../icons/error.png');

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: 'tab-1',
      loading: true,
      userPolls: null
    }
  }

  componentDidMount() {
    let { polls, user } = this.props;
    let userPolls = polls.filter(poll => {
      return poll.author === user.uid;
    });
    this.setState({
      userPolls,
      loading: false
    });
  }

  imageError = () => {
    this.image.src = errorIcon;
  }

  render() {
    const { email, displayName, photoURL } = this.props.user;
    const { userPolls } = this.state;
    return (
      <div className="text-center">
        <div className="header">
          <div className="edit-icon">
            <Link to="/ustawienia">
              <img src={editIcon} alt="edit-icon"/>
            </Link>
          </div>
          <div className="user-info">
            <div className="user-photo">
              <img src={photoURL || userIcon} alt="user-icon" className="img-responsive" ref={ref => (this.image = ref)} onError={() => this.imageError()} />
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
        <div className="row">
          {
            this.state.loading
            ? <div id="loading"></div>
            : userPolls.map(poll => {
                return <div key={poll.pollKey}>{poll.author}</div>
              })
          }
        </div>
      </div>
    );
  }
}

export default Profile;
