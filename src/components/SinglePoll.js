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
      alreadyVoted: false //TODO localStorage ___done___
    }
  }

  componentDidMount() {
    // check if user has already 
    const key = this.props.match.params.key;
    this.props.getSinglePoll(key);
  }

  componentWillReceiveProps(nextProps) {
    const key = this.props.match.params.key;
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls')) || [];
    if (votedPolls.includes(key)) {
      this.setState({
        alreadyVoted: true,
        author: nextProps.single.author.displayName
      });
    }
  }

  vote = (e, answer) => {
    e.preventDefault();
    let count = this.props.single.answers[answer] + 1;   
    const { answers, pollKey, numberOfVotes } = this.props.single;
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
    let poll = {'nie': 2};
    return !this.props.single ? <div id="loading"></div> :  (
      <div>
        <div className="block"><h1>{this.props.single.title}</h1><span>{this.state.author}</span></div>
        {/*<pre>{JSON.stringify(this.props.single, null, ' ')}</pre>*/}
        {
          this.state.alreadyVoted 
          ? <PollChart poll={this.props.single} />
          
          : <Vote poll={this.props.single} vote={this.vote}/>
        }
        
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return { 
    single: state.singlePoll
  };
}

export default connect(mapStateToProps, { getSinglePoll })(SinglePoll);
