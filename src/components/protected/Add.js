import React, { Component } from 'react';
import { pollRef } from '../../firebase';

const AnswerInput = ({ id, name, answerChange, removeAnswerInput, value }) => {
  return (id <= 1) ? (
      <input 
        type="text"
        name={name}
        className="form-control"
        onChange={e => answerChange(id, e)}
        value={value || ''}
        required
      />
    ) : (
    <div className="input-group">
      <input 
        type="text"
        name={name}
        className="form-control"
        value={value || ''}
        onChange={e => answerChange(id, e)}
      />
      <span 
        className="input-group-addon"
        onClick={e => removeAnswerInput(id, e)}
      > - </span>
    </div>
  );
}

class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      answerInputs: ['answer-0', 'answer-1'],
      answers: []
    }
  }

  addAnswerInput = e => {
    e.preventDefault();
    let newAnswerInputs = [...this.state.answerInputs, `answer-${this.state.answerInputs.length}`];
    this.setState({ 
      answerInputs: newAnswerInputs
    });
  }

  removeAnswerInput = (id, e) => {
    e.preventDefault();
    if (this.state.answerInputs.length <= 2) {
      return;
    }
    let updatedInputs = this.state.answerInputs.slice(id + 1).map((input, i) => {
      return `answer-${this.state.answerInputs.slice(0, id).length + i}`
    });
    
    let newAnswerInputs = [
      ...this.state.answerInputs.slice(0, id),
      ...updatedInputs
    ];
    
    let newAnswers = [...this.state.answers];
    newAnswers.splice(id, 1); 

    this.setState({
      answerInputs: newAnswerInputs,
      answers: newAnswers
    });
  }

  answerChange = (id, e) => {
    let answers = [...this.state.answers];
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
    const slug = title.replace(/\s/g, '-').toLowerCase(); // TODO remove slug
    pollRef.push({
      title,
      slug,
      answers: ansObj,
      created_At: Date.now(),
      author: this.props.user.uid,
      numberOfVotes: 0
    });
    this.props.history.push('/profil');
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
                  this.state.answerInputs.map((name, i) => {
                    return <AnswerInput key={i} id={i} name={name} answerChange={this.answerChange} removeAnswerInput={this.removeAnswerInput} value={this.state.answers[i]}/>
                  })
                }
              </div>
              <button className="btn btn-lg" type="submit">Dodaj</button>          
          </form>
        </div>
        <button onClick={e => this.addAnswerInput(e)}>Dodaj odpowiedź</button>
        <button onClick={e => this.removeAnswerInput(e)}>Usuń odpowiedź</button>
      </div>
    );
  }
}

export default Add;
