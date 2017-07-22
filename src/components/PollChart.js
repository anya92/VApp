import React, { Component } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';


class PollChart extends Component {
  constructor() {
    super();

    this.state = {
      labels: [],
      data: [],
      backgroundColor: []
    }
  }

  componentDidMount() {
    const { poll } = this.props;
    let { answers } = poll;
    let labels = [], data = [], backgroundColor = [];
    for (let answer in answers) {
      labels.push(answer);
      data.push(answers[answer]);
      backgroundColor.push(this.generateColor());
    }
    this.setState({
      labels,
      data,
      backgroundColor
    });
  }

  componentWillReceiveProps(nextProps) {
    const { poll } = nextProps;
    let { answers } = poll;
    let labels = [], data = [];
    // let backgroundColor = [];
    for (let answer in answers) {
      labels.push(answer);
      data.push(answers[answer]);
      // backgroundColor.push(this.generateColor());
      // console.log('backgroundColor', backgroundColor);
    }
    this.setState({
      labels,
      data
      // backgroundColor
    });
  }

   generateColor = () => {
    const reds = Math.floor(Math.random() * 256);
    const greens = Math.floor(Math.random() * 256);
    const blues = Math.floor(Math.random() * 256);
    return `rgba(${reds},${greens},${blues}, 0.3)`;
  }

  render() {
    const { labels, data, backgroundColor } = this.state;
    let data2 = {
      labels,
      datasets: [{
        label: '# of votes',
        data,
        backgroundColor
      }]
    };
    let options = {
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
      }
    };
    return ( // TODO style chart, choose doughnut or bar chart
      <div>
        <div className="chart">
          Doughnut
          <Doughnut data={data2} />
        </div>
        <div className="chart">
          Bar
          <Bar data={data2} options={options}/>
        </div>
      </div>
    );
  }
}

export default PollChart;
