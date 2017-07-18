import React, { Component } from 'react';
import { pollRef } from '../../firebase';

const AnswerInput = ({ id, answerChange, removeAnswerInput, value }) => {
  return (id <= 1) ? (
      <input 
        type="text"
        className="form-control"
        onChange={e => answerChange(id, e)}
        value={value || ''}
        required
      />
    ) : (
    <div className="input-group">
      <input 
        type="text"
        className="form-control"
        value={value || ''}
        onChange={e => answerChange(id, e)}
      />
      <span 
        className="input-group-addon"
        onClick={e => removeAnswerInput(id, e)}
      ><p>-</p></span>
    </div>
  );
}

class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '', 
      numberOfAnswers: 2,
      answers: []
    }
  }

  addAnswerInput = e => {
    e.preventDefault();
    let { numberOfAnswers } = this.state;
    numberOfAnswers += 1;
    this.setState({ 
      numberOfAnswers
    });
  }

  removeAnswerInput = (id, e) => {
    e.preventDefault();

    if (this.state.numberOfAnswers <= 2) {
      return;
    }

    let { numberOfAnswers, answers } = this.state;
    numberOfAnswers -= 1;
    answers.splice(id, 1);

    this.setState({
      numberOfAnswers,
      answers
    });
  }

  answerChange = (id, e) => {
    let { answers } = this.state;
    answers[id] = e.target.value;
    this.setState({ answers });
  }

  addPoll = e => {
    e.preventDefault();
    const { title, answers } = this.state;
    let ansObj = {};
    answers.forEach(answer => {
      ansObj[answer] = 0
    });
    pollRef.push({
      title,
      answers: ansObj,
      created_At: Date.now(),
      author: this.props.user.uid,
      numberOfVotes: 0
    }).then(poll => this.props.history.push(`/glosowanie/${poll.key}`))
      .catch(error => console.log(error));
    
  }

  render() {
    return (
      <div>
        <div className="block text-center">
          <h1>Dodaj nowe głosowanie</h1>
        </div>
        <div className="block">
          <form onSubmit={e => this.addPoll(e)} className="add-poll-form">
            <div className="form-group">
              <label htmlFor="title">Pytanie</label>
              <input 
                type="text" 
                className="form-control"
                name="title"
                onChange={e => this.setState({ title: e.target.value })}
                required
              />
            </div>
              <div className="form-group">
                <label htmlFor="answers">Odpowiedzi</label>
                 {
                  [...Array(this.state.numberOfAnswers).keys()].map((i) => {
                    return <AnswerInput key={i} id={i} answerChange={this.answerChange} removeAnswerInput={this.removeAnswerInput} value={this.state.answers[i]}/>
                  })
                }
                {/*
                  this.state.answerInputs.map((name, i) => {
                    return <AnswerInput key={i} id={i} name={name} answerChange={this.answerChange} removeAnswerInput={this.removeAnswerInput} value={this.state.answers[i]}/>
                  })
                */}
              </div>
              <div className="add-answer" onClick={e => this.addAnswerInput(e)}><p>+</p></div>
              <button className="btn btn-lg" type="submit">Dodaj</button>          

          </form>
        </div>
      </div>
    );
  }
}

export default Add;
