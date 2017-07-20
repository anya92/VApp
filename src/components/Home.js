import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { getAllPolls, getPollsPagination } from '../actions';
import { pollRef } from '../firebase';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      pages: null,
      polls: [],
      hasMoreItems: true
    }
  }

  componentDidMount() {
    this.props.getPollsPagination();
    // this.props.getAllPolls();
  } 
  componentWillReceiveProps(nextProps) {
    this.setState({ pages: nextProps.pages });
  }
  loadItems(page) {
    const { pages } = this.props;
    let { polls } = this.state;
    pages[page - 1].forEach(page => {
      polls.push(page);
    });
    if (!pages[page]) { // there will be no polls
      this.setState({
        hasMoreItems: false
      });
    }
    this.setState({
      polls
    });
  }

  render() {
    // const { polls } = this.props;
    const { pages } = this.props;
    const loader = <div className="loader">Loading ...</div>;

    let items = [];

    this.state.polls.map((poll, i) => {
        items.push(
          <div className="col-md-6 block" key={i} style={{minHeight: '200px', marginTop: '10px'}}>
            <Link to={`/glosowanie/${poll.key}`}>
              <h1>{poll.title}</h1>
              {poll.photoURL && <img src={poll.photoURL} width="150" height="150" />}
              <p>{poll.numberOfVotes}</p>
            </Link>
          </div>
        );
    });

    return !this.state.pages ? <div id="loading"></div> : (
      <div>
        <h1>Home</h1>
        {/*
        <pre>{JSON.stringify(pages[2], null, ' ')}</pre> 
          polls.map(poll => {
            return (
              <div key={poll.pollKey} className="block col-sm-6" >
                <Link to={`/glosowanie/${poll.pollKey}`}>
                  {poll.title} ➡ 
                  <h5>{poll.numberOfVotes} votes</h5>
                  {poll.photoURL && <img src={poll.photoURL} alt="poll" />}
                </Link>
                
              </div>
            )
          }) 
       */ }
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
  return { pages: state.pages };
}

export default connect(mapStateToProps, { getAllPolls, getPollsPagination })(Home);

// style={{background: poll.photoURL && `url(${poll.photoURL})` || 'white'}}
