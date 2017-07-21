import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pollRef } from '../firebase';
import { getSinglePoll } from '../actions';

import PollChart from './PollChart';
import Vote from './Vote';

class SinglePoll extends Component {
  constructor() {
    super();

    this.state = {
      alreadyVoted: false, //TODO localStorage ___done___
      singlePoll: null
    }
  }

  componentDidMount() {
    const key = this.props.match.params.key;
    this.props.getSinglePoll(key);
  }

  componentWillReceiveProps(nextProps) {
    const key = this.props.match.params.key;
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls')) || [];
   
    // check if user has already voted
    if (votedPolls.includes(key)) {
      this.setState({
        alreadyVoted: true
      });
    }

    this.setState({
      singlePoll: nextProps.singlePoll
    });
  }

  vote = (e, answer) => {
    e.preventDefault();
    let count = this.state.singlePoll.answers[answer] + 1;   
    const { answers, pollKey, numberOfVotes } = this.state.singlePoll;
    let newNumbersOfVotes = numberOfVotes + 1;

    // update poll in firebase
    pollRef.child(pollKey).update({
      answers: {
        ...answers,
        [answer]: count
      },
      numberOfVotes: newNumbersOfVotes
    });

    // store pollKey in localStorage
    let votedPolls = JSON.parse(localStorage.getItem('votedPolls')) || [];
    let votedPollsCopy =  [...votedPolls, pollKey];
    localStorage.setItem('votedPolls', JSON.stringify(votedPollsCopy));
    this.setState({
      alreadyVoted: true
    });
  }

  render() {
    return !this.state.singlePoll ? <div id="loading"></div> :  (
      <div>
        <div className="block"><h1>{this.state.singlePoll.title}</h1><span>{this.state.author}</span></div>
        {
          this.state.alreadyVoted 
          ? <PollChart poll={this.state.singlePoll} />
          : <Vote poll={this.state.singlePoll} vote={this.vote} />
        }
        
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return { 
    singlePoll: state.singlePoll
  };
}

export default connect(mapStateToProps, { getSinglePoll })(SinglePoll);
