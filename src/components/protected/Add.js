import React, { Component } from 'react';
import { pollRef } from '../../firebase';

const AnswerInput = ({ id, name, answerChange }) => {
  return (
    <input 
      type="text"
      name={name}
      className="form-control"
      onChange={e => answerChange(id, e)}
    />
  );
}

class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      answerInputs: ['answer-0', 'answer-1'],
      answers: [
        { name: '', count: 0 },
        { name: '', count: 0 }      
      ]
    }
  }

  addAnswerInput = e => {
    e.preventDefault();
    let newAnswerInputs = [...this.state.answerInputs, `answer-${this.state.answerInputs.length}`],
        newAnswers = [...this.state.answers, { name: '', count: 0 }];
    this.setState({ 
      answerInputs: newAnswerInputs,
      answers: newAnswers
    });
  }

  removeAnswerInput = e => {
    e.preventDefault();
    if (this.state.answerInputs.length <= 2) {
      return;
    }
    let newAnswerInputs = [...this.state.answerInputs],
        newAnswers = [...this.state.answers];
    newAnswerInputs.pop();
    newAnswers.pop();    
    this.setState({
      answerInputs: newAnswerInputs,
      answers: newAnswers
    });
  }

  answerChange = (id, e) => {
    let answers = [...this.state.answers];
    answers[id].name = e.target.value;
    this.setState({ answers });
  }

  addPoll = e => {
    e.preventDefault();
    const { title, answers } = this.state;
    const slug = title.replace(/\s/g, '-').toLowerCase();
    pollRef.push({
      title,
      slug,
      answers,
      created_At: Date.now(),
      author: this.props.user.uid
    });
    console.log('added');
  }

  render() {
    return (
      <div>
        <div className="block text-center">
          <h1>Dodaj nowe głosowanie</h1>
        </div>
        <div className="block add-pool">
          <form>
            <div className="form-group">
              <label htmlFor="title">Tytuł</label>
              <input 
                type="text" 
                className="form-control"
                name="title"
                onChange={e => this.setState({ title: e.target.value })}
              />
            </div>
              <div className="form-group">
                <label htmlFor="answers">Odpowiedzi</label>
                {
                  this.state.answerInputs.map((name,i) => {
                    return <AnswerInput key={i} id={i} name={name} answerChange={this.answerChange}/>
                  })
                }
              </div>
              <button className="btn btn-lg" onClick={e => this.addPoll(e)}>Dodaj</button>          
          </form>
        </div>
        <button onClick={e => this.addAnswerInput(e)}>Dodaj odpowiedź</button>
        <button onClick={e => this.removeAnswerInput(e)}>Usuń odpowiedź</button>
      </div>
    );
  }
}

export default Add;
