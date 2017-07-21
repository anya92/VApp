import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import moment from 'moment';
import { connect } from 'react-redux';
// import { pollRef } from '../../firebase';

const editIcon = require('../../icons/edit.svg');
const userIcon = require('../../icons/user.png');
const errorIcon = require('../../icons/error.png');
require('moment/locale/pl');
// moment.locale('pl');

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: 'tab-1',
      loading: false
    }
  }

  componentDidMount() {
    // const { user } = this.props;
    // pollRef.on('value', snap => {
    //   let userPolls = [];
    //   snap.forEach(poll => {
    //     const { title, answers, slug, author, created_At } = poll.val();
    //     const pollKey = poll.key;
    //     if (author === user.uid) {
    //       userPolls.push({ title, answers, slug, author, created_At, pollKey });
    //     }
    //   });
    //   this.props.getUserPolls(userPolls);
    //   this.setState({
    //     loading: false
    //   });
    // });
  }

  imageError = () => {
    this.image.src = errorIcon;
  }

  changeTab = (tab) => {
    this.setState({
      display: tab
    });
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
  }

  render() {
    const { email, displayName, photoURL } = this.props.user;

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
            <div className="tab active" id="tab-1" onClick={() => this.changeTab('tab-1')}>
              <p>Moje Ankiety</p>
            </div>
            <div className="tab" id="tab-2" onClick={() => this.changeTab('tab-2')}>
              <p>Tab 2</p>
            </div>
            <div className="tab" id="tab-3" onClick={() => this.changeTab('tab-3')}>
              <p>Tab 3</p>
            </div>
            <div className="tab" id="tab-4" onClick={() => this.changeTab('tab-4')}>
              <p>Tab 4</p>
            </div>
          </div>
        </div>
        <div>
          {/*
            this.props.polls.map((poll,i) => {
              return <div key={i}>{poll.title}</div> 
            })
          */}
          {
            this.state.display === 'tab-1'
            ? (
                <div className="block">
                  <h1>Moje głosowania</h1>
                </div>
              ) 
            : <div></div>
          }
          {
             this.state.display === 'tab-2'
            ? (
                <div className="block">
                  <h1>Tab 2</h1>
                </div>
              ) 
            : <div></div>
          }
          
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) { // TODO get userPolls !!!
  // let { polls, user } = state;
  // const userPolls = polls.filter(poll => poll.author === user.uid);
  // return {
    // polls: userPolls
  // };
}

export default Profile;
