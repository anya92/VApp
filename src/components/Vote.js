import React, { Component } from 'react';

class Vote extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      newAnswer: null,
      selected: ''
    }
  }

  newAnswer = e => {
    this.setState({
      newAnswer: e.target.value,
      selected: e.target.value
    })
  }

  render() {
    const { answers } = this.props.poll;
    return ( // style vote 
      <div>
        <form className="form" onSubmit={e => this.props.vote(e, this.state.selected)}>
          {
            Object.keys(answers).map((answer, i) => {
              return (
                <div className="radio" key={i}>
                  <input type="radio" id={answer} value={answer} onChange={e => this.setState({ selected: e.target.value })} checked={this.state.selected === answer} required />
                  <label htmlFor={answer}><span></span>{answer}</label>
                </div>
              )
            })
          }
          {
            this.props.user
            ? (
                <div className="radio new-answer">
                  <input type="radio" id="newAnswer"  checked={this.state.selected === this.state.newAnswer} required />
                  <label htmlFor="newAnswer"><span></span></label>
                  <input type="text" placeholder="Dodaj nową odpowiedź" value={this.state.newAnswer === this.state.selected ? this.state.selected : ''} onChange={e => this.newAnswer(e)} />
                </div>
              )
            : <div><p className="message">Zaloguj się, by dodać własną odpowiedź.</p></div>
          } 
          
          <button className="btn btn-lg" type="submit">Zagłosuj</button>
        </form>

      </div>
    );
  }
}

export default Vote;
