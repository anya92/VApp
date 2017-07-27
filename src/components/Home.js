import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import { getPollsPerPage, getAllPolls } from '../actions';
const statisticsIcon = require('../icons/graphic.png');

require('moment/locale/pl');
moment.locale('pl');

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pollsPerPage: [],
      polls: null,
      hasMoreItems: true
    }
  }

  componentDidMount() {
    this.props.getAllPolls();
    // this.props.getPollsPerPage();
  } 

  componentWillReceiveProps(nextProps) {
    this.setState({ polls: nextProps.polls });
  }

  loadItems(page) {
    const perPage = 6;

    let { pollsPerPage } = this.state;
    this.props.polls.slice(perPage * (page - 1), perPage * page).forEach(poll => {
      pollsPerPage.push(poll);
    });

    if(!this.props.polls[perPage * (page - 1)]) {
      this.setState({
        hasMoreItems: false
      });
    }
    this.setState({
      pollsPerPage
    });
  }

  // loadItems(page) {
  //   const { pollsPerPage } = this.props;
  //   let { polls } = this.state;
  //   pollsPerPage[page - 1].forEach(page => {
  //     polls.push(page);
  //   });
  //   if (!pollsPerPage[page]) { // there will be no polls
  //     this.setState({
  //       hasMoreItems: false
  //     });
  //   }
  //   this.setState({
  //     polls
  //   });
  // }

  render() {
    const loader = <div className="loader">Ładowanie...</div>;

    let items = [];

    this.state.pollsPerPage.map((poll, i) => 
        items.push( // TODO style single poll card
          <div className="col-sm-6" key={i}>
              <div className="poll-card block">
                <div className="poll-card__title">
                  <Link to={`/glosowanie/${poll.key}`}>
                    <p>{poll.title}</p>
                  </Link>
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
    );

    return !this.state.polls ? <div id="loading"></div> : (
      <div>
        {/*<div className="logo text-center">
          <h1><span>VA</span>pp</h1>  TODO change to app logo 

        </div>*/}
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadItems.bind(this)}
          hasMore={this.state.hasMoreItems}
          loader={loader}
        >
          <div className="row">
              {items}
          </div>
      </InfiniteScroll>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { polls: state.polls };
}

export default connect(mapStateToProps, { getPollsPerPage, getAllPolls })(Home);

