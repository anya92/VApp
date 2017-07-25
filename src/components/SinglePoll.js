import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ShareButtons } from 'react-share';

import { pollRef } from '../firebase';
import { getSinglePoll } from '../actions';

import PollChart from './PollChart';
import Vote from './Vote';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} = ShareButtons;

const FacebookIcon = require('../icons/facebook.svg');
const TwitterIcon = require('../icons/twitter.svg');
const WhatsappIcon = require('../icons/whatsapp.svg');
const GooglePlusIcon = require('../icons/google.svg');

class SinglePoll extends Component {
  constructor() {
    super();

    this.state = {
      alreadyVoted: false, //TODO localStorage ___done___
      singlePoll: null,
      isAuthor: false
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
    if (nextProps.user && nextProps.user.email === nextProps.singlePoll.author.email) {
      this.setState({
        isAuthor: true
      });
    } else {
      this.setState({
        isAuthor: false
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
      numberOfVotes: newNumbersOfVotes,
      lastVoted_At: Date.now()
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
        <div className="block">
          <h1>{this.state.singlePoll.title}</h1>
          <span>{this.state.singlePoll.author.displayName}</span>
        </div>
        
          {
            this.state.isAuthor
            ? <div className="share-buttons">
                <FacebookShareButton title={`Oddaj głos w moim głosowaniu! "${this.state.singlePoll.title}"`} url={document.URL}>
                  <img src={FacebookIcon} alt="Facebook"/>
                </FacebookShareButton>
                <TwitterShareButton title={`Oddaj głos w moim głosowaniu! "${this.state.singlePoll.title}"`} url={document.URL} hashtags={["VApp"]}>
                  <img src={TwitterIcon} alt="Twitter"/>
                </TwitterShareButton>  
                <WhatsappShareButton title={`Oddaj głos w moim głosowaniu! "${this.state.singlePoll.title}"`} url={document.URL}>
                  <img src={WhatsappIcon} alt="Whatsapp"/>
                </WhatsappShareButton> 
                <GooglePlusShareButton url={document.URL}>
                  <img src={GooglePlusIcon} alt="GooglePlus"/>
                </GooglePlusShareButton>
             </div>
            : <div></div> 
          }
       
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
    user: state.user,
    singlePoll: state.singlePoll
  };
}

export default connect(mapStateToProps, { getSinglePoll })(SinglePoll);
