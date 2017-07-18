import React, { Component } from 'react';

class Vote extends Component {
  constructor() {
    super();
    this.state = {
      answers: [],
      selected: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    const { answers } = nextProps.poll;
    this.setState({
      answers
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={e => this.props.vote(e, this.state.selected)}>
          {
            Object.keys(this.state.answers).map((answer, i) => {
              return (
                <div className="radio" key={i}>
                  <label><input type="radio" value={answer} onChange={e => this.setState({ selected: e.target.value })} checked={this.state.selected === answer} required />{answer}</label>
                </div>
              )
            })
          }
          <button className="btn btn-lg" type="submit">Zagłosuj</button>
        </form>

      </div>
    );
  }
}

export default Vote;
