import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { getPollsPerPage } from '../actions';

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
          <div className="col-sm-6 block" key={i} style={{minHeight: '200px', marginTop: '10px'}}>
             <Link to={`/glosowanie/${poll.key}`}>
              <h1>{poll.title}</h1>
              { poll.photoURL && <img src={poll.photoURL} width="150" height="150" alt="poll" /> }
              <p>{poll.numberOfVotes} oddanych głosów</p>
            </Link>
          </div>
        )
    );

    return !this.state.pollsPerPage ? <div id="loading"></div> : (
      <div>
        <h1>Home</h1> {/* TODO change to app logo */}
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

