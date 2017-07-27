import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ShareButtons } from 'react-share';
import MotionMenu from 'react-motion-menu';
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
const WhatsappIcon = require('../icons/whatsapp.png');
const GooglePlusIcon = require('../icons/google-plus.svg');
const shareIcon = require('../icons/share.svg');

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

  shareButton = () => {
    const share = document.querySelector('.share');
    const icons = document.querySelectorAll('.social');
    share.classList.toggle('turn');
      icons.forEach(icon => {
        let { classList } = icon;
        if (classList.contains('hide-icon')) {
          classList.remove('hide-icon');
          classList.add('show-icon');
        } else if (classList.contains('show-icon')) {
          classList.remove('show-icon');
          classList.add('hide-icon');
        } else {
          classList.add('show-icon');
        }
      }); 
  }
   

  render() {
    return !this.state.singlePoll ? <div id="loading"></div> :  (
      <div>
        <div className="block">
          <h1>{this.state.singlePoll.title}</h1>
          <span>{this.state.singlePoll.author.displayName}</span>
                
        {
          this.state.alreadyVoted 
          ? <PollChart poll={this.state.singlePoll} />
          : <Vote poll={this.state.singlePoll} vote={this.vote} />
        }
        {
          this.state.isAuthor
          ? <div className="share-buttons">
              <img src={shareIcon} alt="share" className="share" onClick={() => this.shareButton()}/>
              <FacebookShareButton title={`Oddaj głos w moim głosowaniu! "${this.state.singlePoll.title}"`} url={document.URL}>
                <img src={FacebookIcon} alt="Facebook" className="social facebook"  />
              </FacebookShareButton>
              <TwitterShareButton title={`Oddaj głos w moim głosowaniu! "${this.state.singlePoll.title}"`} url={document.URL} hashtags={["VApp"]}>
                <img src={TwitterIcon} alt="Twitter" className="social twitter" />
              </TwitterShareButton>  
              <WhatsappShareButton title={`Oddaj głos w moim głosowaniu! "${this.state.singlePoll.title}"`} url={document.URL}>
                <img src={WhatsappIcon} alt="Whatsapp" className="social whatsapp" />
              </WhatsappShareButton> 
              <GooglePlusShareButton url={document.URL}>
                <img src={GooglePlusIcon} alt="GooglePlus" className="social google-plus" />
              </GooglePlusShareButton>
           </div>
          : <div></div> 
        }
        </div>
        
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
