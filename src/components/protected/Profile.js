import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import { getUserPolls } from '../../actions';
import { pollRef } from '../../firebase';

const editIcon = require('../../icons/edit.svg');
const userIcon = require('../../icons/user.png');
const errorIcon = require('../../icons/error.png');
const trashIcon = require('../../icons/trash.svg');

require('moment/locale/pl');
moment.locale('pl');

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: 'tab-1',
      userPolls: null
    }
  }

  componentDidMount() {
    const { uid } = this.props.user;
    this.props.getUserPolls(uid); // jeśli nie ma żadnych ??
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      userPolls: nextProps.userPolls
    });
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

  deletePoll = (key, title) => {
    const confirmDelete = () => {
      return window.confirm(`Na pewno chcesz usunąć głosowanie "${title}"?`);
    }
    if (confirmDelete()) {
      pollRef.child(key).remove();
    }
  }

  render() {
    const { email, displayName, photoURL } = this.props.user;

    return (
      <div className="">
        <div className="header text-center">
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
                <div>
                  {/*<div className="block">
                    <h1>Moje głosowania</h1>
                  </div>*/}
                  {
                    !this.state.userPolls ? <div className="text-center">Ładowanie...</div> : (
                      this.state.userPolls.map(poll => {
                        return (
                          <div className="col-sm-6" key={poll.key}>
                            <div className="poll-card block">
                              <div className="poll-card__title">
                                <Link to={`/glosowanie/${poll.key}`}>
                                  <p>{poll.title}</p>
                                </Link>
                                <a className="delete-poll" onClick={() => this.deletePoll(poll.key, poll.title)}>&#x2715;</a>
                              </div>
                              <Link to={`/glosowanie/${poll.key}`}>
                                <div className="poll-card__photo">
                                  { poll.photoURL && <img src={poll.photoURL} alt="poll" /> }
                                </div>
                              </Link>
                              <div className="poll-card__info">
                                <p>{poll.numberOfVotes} oddanych głosów</p>
                                <p>{moment(poll.created_At).fromNow()}</p>
                                <Link to={`/glosowanie/${poll.key}`}>
                                  <button className="btn btn-lg">Głosuj ➡</button>
                                </Link>
                              </div>  
                            </div>
                        </div>
                        )
                      })
                    )
                  }
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
  return { userPolls: state.userPolls }
}
                                  // <div className="trash-icon">
                                    // <img src={trashIcon} alt="trash-icon" onClick={() => this.deletePoll(poll.key)} />
                                  // </div>

export default connect(mapStateToProps, { getUserPolls })(Profile);
