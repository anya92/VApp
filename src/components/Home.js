import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { getPollsPerPage } from '../actions';
const statisticsIcon = require('../icons/graphic.png');

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pollsPerPage: null,
      polls: [],
      hasMoreItems: true
    }
  }

  componentDidMount() {
    this.props.getPollsPerPage();
  } 

  componentWillReceiveProps(nextProps) {
    this.setState({ pollsPerPage: nextProps.pollsPerPage });
  }

  loadItems(page) {
    const { pollsPerPage } = this.props;
    let { polls } = this.state;
    pollsPerPage[page - 1].forEach(page => {
      polls.push(page);
    });
    if (!pollsPerPage[page]) { // there will be no polls
      this.setState({
        hasMoreItems: false
      });
    }
    this.setState({
      polls
    });
  }

  render() {
    const loader = <div className="loader">Ładowanie...</div>;

    let items = [];

    this.state.polls.map((poll, i) => 
        items.push( // TODO style single poll card
          <div className="col-sm-6" key={i}>
            <Link to={`/glosowanie/${poll.key}`}>
              <div className="poll-card">
                <div className="poll-card__title">
                  <p>{poll.title}</p>
                </div>
                { poll.photoURL && <img src={poll.photoURL} alt="poll" className="poll-card__photo" /> }
              </div>
            </Link>
          </div>
        )
    );

    return !this.state.pollsPerPage ? <div id="loading"></div> : (
      <div>
        <div className="logo text-center">
          <h1>VApp</h1> {/* TODO change to app logo */}

        </div>
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
  return { pollsPerPage: state.pollsPerPage };
}

export default connect(mapStateToProps, { getPollsPerPage })(Home);

