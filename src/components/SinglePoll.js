import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ShareButtons } from 'react-share';
import MotionMenu from 'react-motion-menu';
import moment from 'moment';
import { pollRef } from '../firebase';
import { getSinglePoll } from '../actions';

import PollChart from './PollChart';
import Vote from './Vote';

require('moment/locale/pl');
moment.locale('pl');


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
    let count = this.state.singlePoll.answers[answer] + 1 || 1;   
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
    const { singlePoll, isAuthor } = this.state;
    return !singlePoll ? <div id="loading"></div> :  (
      <div>
        <div className="col-sm-6">
          <div className="block">
          <div className="single-poll">
            <div className="single-poll__title">
              <p>{singlePoll.title}</p>
            </div>
            <div className="single-poll__photo">
              {singlePoll.photoURL && <img src={singlePoll.photoURL} alt="poll" /> }
            </div>
            <div className="single-poll__author">
              { singlePoll.author.photoURL && <img src={singlePoll.author.photoURL} alt="author"/> }
              <p>{singlePoll.author.displayName || singlePoll.author.email}</p>
              <p>{moment(singlePoll.created_At).fromNow()}</p>
              <p>{singlePoll.numberOfVotes} oddanych głosów</p>
            </div>
          </div> 
          <div className="col-sm-6">  
            {
              this.state.alreadyVoted 
              ? <PollChart poll={singlePoll} />
              : <Vote poll={singlePoll} vote={this.vote} user={this.props.user }/>
            }
            </div>
          </div>
        </div>
        {
          isAuthor
          ? <div className="share-buttons">
              <img src={shareIcon} alt="share" className="share" onClick={() => this.shareButton()}/>
              <FacebookShareButton title={`Oddaj głos w moim głosowaniu! "${singlePoll.title}"`} url={document.URL}>
                <img src={FacebookIcon} alt="Facebook" className="social facebook"  />
              </FacebookShareButton>
              <TwitterShareButton title={`Oddaj głos w moim głosowaniu! "${singlePoll.title}"`} url={document.URL} hashtags={["VApp"]}>
                <img src={TwitterIcon} alt="Twitter" className="social twitter" />
              </TwitterShareButton>  
              <WhatsappShareButton title={`Oddaj głos w moim głosowaniu! "${singlePoll.title}"`} url={document.URL}>
                <img src={WhatsappIcon} alt="Whatsapp" className="social whatsapp" />
              </WhatsappShareButton> 
              <GooglePlusShareButton url={document.URL}>
                <img src={GooglePlusIcon} alt="GooglePlus" className="social google-plus" />
              </GooglePlusShareButton>
           </div>
          : <div></div> 
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
