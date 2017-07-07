import React, { Component } from 'react';

class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      answers: []
    }
  }
  render() {
    return (
      <div>
        Dodaj nowy ...???
        <form>
          <input type="text" className="form-control" />
        </form>

      </div>
    );
  }
}

export default Add;
