import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllPolls } from '../actions';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }
  }

  componentDidMount() {

  } 

  render() {
    const { polls } = this.props;
    
    return this.state.loading ? <div id="loading"></div> : (
      <div>
        <h1>Home</h1>
        {
          polls.map(poll => {
            return (
              <div key={poll.pollKey} className="block">
                <Link to={`/glosowanie/${poll.pollKey}`}>
                  {poll.title} ➡ 
                  <h5>{poll.numberOfVotes} votes</h5>
                </Link>
                
              </div>
            )
          }) 
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { polls: state.polls };
}

export default connect(mapStateToProps, { getAllPolls })(Home);
