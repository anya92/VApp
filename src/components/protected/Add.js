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
      >&#x2715;</span>
    </div>
  );
}

class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '', 
      numberOfAnswers: 2,
      answers: [],
      photoURL: ''
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
    const { title, answers, photoURL } = this.state;
    let ansObj = {};
    answers.forEach(answer => {
      // Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]" --> firebase
      answer = answer.replace(/[.$#/[\]]/g, '');
      ansObj[answer] = 0
    });
    pollRef.push({
      title,
      answers: ansObj,
      photoURL,
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
        <div>
          <div className="col-sm-6">
            <div className="poll-photo">
              {this.state.photoURL && <img src={this.state.photoURL || ''} alt="poll" className="img-responsive" />}
            </div>
          </div>
          <div className="col-sm-6 block">
            <form onSubmit={e => this.addPoll(e)} className="form">
              
              <div className="form-group">
                  <label htmlFor="photo">Zdjęcie</label>
                  <input type="text" name="photo" placeholder="Link do zdjęcia" className="form-control" onChange={e => this.setState({ photoURL: e.target.value })}/>
                </div>
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
                </div>
                <div className="add-answer" onClick={e => this.addAnswerInput(e)}>
                  <span>+</span><p>Dodaj nową odpowiedź.</p>
                </div>
                <div className="text-center">
                  <button className="btn btn-lg" type="submit">Dodaj</button>
                </div>            

            </form>

          </div>
        </div>
      </div>
    );
  }
}

export default Add;
