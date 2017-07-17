import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pollRef } from '../firebase';
 
class SinglePoll extends Component {
  constructor() {
    super();

    this.state = {
      alreadyVoted: false //TODO localStorage 
    }
  }

  componentDidMount() {
    // check if user has already voted
    const key = this.props.match.params.key;
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls')) || [];
    console.log('check if user has already voted CDM', key, votedPolls);
    if (votedPolls.includes(key)) {
      this.setState({
        alreadyVoted: true
      });
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   // check if user has already voted
  //   const { pollKey } = nextProps.single;
  //   const votedPolls = JSON.parse(localStorage.getItem('votedPolls')) || [];
  //   console.log('check if user has already voted CWRP', pollKey, votedPolls);
  //   if (votedPolls.includes(pollKey)) {
  //     this.setState({
  //       alreadyVoted: true
  //     });
  //   }
  // }

  vote = (answer) => {
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
    return !this.props.single ? <div id="loading"></div> :  (
      <div>
        Single <br/>
        {this.state.alreadyVoted ? <div>Już głosowałeś</div> : <div>Możesz głosowac</div>}
        {this.props.match.params.key} <br/>
        {this.props.single.title} <br/>
        {this.props.single.created_At}
        {
          Object.keys(this.props.single.answers).map((answer, i) => {
            return <p key={i} onClick={() => this.vote(answer)}>{answer} <span>{this.props.single.answers[answer]}</span></p>
          })
        }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const key = ownProps.match.params.key;
  const single = state.polls.filter(poll => poll.pollKey === key)[0];
  // const { uid } = state.user;
  return { 
    single
    // uid 
  };
}

export default connect(mapStateToProps, null)(SinglePoll);
