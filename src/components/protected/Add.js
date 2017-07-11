import React, { Component } from 'react';

class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      answers: [
        {
          id: 1,
          name: ''
        },
        {
          id: 2,
          name: ''
        }
      ]
    }
  }

  answersChange = (id, e) => {
    let answers = [...this.state.answers];
    answers[id].name = e.target.value;
    this.setState({ answers });
  }

  render() {
    return (
      <div>
        <div className="block text-center">
          <h1>Dodaj nową ankietę</h1>
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
                <input 
                  type="text" 
                  name="answers"
                  className="form-control"
                  onChange={e => this.answersChange(0, e)}
                />
                <input 
                  type="text" 
                  name="answers"
                  className="form-control"
                  onChange={e => this.answersChange(1, e)}
                />
              </div>          
          </form>
        </div>
        
      </div>
    );
  }
}

export default Add;
