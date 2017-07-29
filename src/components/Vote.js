import React, { Component } from 'react';

class Vote extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      selected: ''
    }
  }

  addNewAnswer = () => {
    document.querySelector('.add-answer').classList.add('hide');
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
          <div className="add-answer" onClick={() => this.addNewAnswer()}>
            <span>+</span><p>Dodaj nową odpowiedź.</p>
          </div>
          <button className="btn btn-lg" type="submit">Zagłosuj</button>
        </form>

      </div>
    );
  }
}

export default Vote;
