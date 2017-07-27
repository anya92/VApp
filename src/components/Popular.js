import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getPopularPolls } from '../actions';

require('moment/locale/pl');
moment.locale('pl');


class Popular extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popularPolls: null
    };
  }

  componentDidMount() {
    this.props.getPopularPolls();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      popularPolls: nextProps.popularPolls
    })
  }

  render() {
    return !this.state.popularPolls ? <div id="loading"></div> : (
      <div className="row">
      {
        this.state.popularPolls.map(poll => {
          return (
            <div className="col-sm-6" key={poll.key}>
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
        })
      }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { popularPolls: state.popularPolls };
}

export default connect(mapStateToProps, { getPopularPolls })(Popular);
