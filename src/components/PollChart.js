import React, { Component } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';


class PollChart extends Component {
  constructor() {
    super();

    this.state = {
      labels: [],
      data: [],
      backgroundColor: [],
      display: 'doughnut'
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

  changeChart = (chart) => {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.${chart}`).classList.add('active');
    this.setState({
      display: chart
    });
  }

  render() {
    const { labels, data, backgroundColor } = this.state;
    let data2 = {
      labels,
      datasets: [{
        label: ' głosów',
        data,
        backgroundColor
      }]
    };
    let doughnutOptions = {
      responsive: true,
      legend: {
        display: true,
        // position: 'right',
        labels: {
          // boxWidth: 50,
          // fontSize: 16,
          padding: 15
        }
      }
    }
    let barOptions = {
      // responsive: true,
      legend: {
        display: true,
        position: 'right',
        labels: {
          fontColor: 'rgb(255, 99, 132)'
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };
    return ( // TODO style chart, choose doughnut or bar chart // icons!!!!
      <div>
        <div className="choose-chart">
          <a onClick={() => this.changeChart('doughnut')} className="tab doughnut active">Kołowy</a>
          <a onClick={() => this.changeChart('bar')} className="tab bar">Kulumnowy</a>
          <a onClick={() => this.changeChart('info')} className="tab info">Informacje</a>
        </div>
        {
          this.state.display === 'doughnut'
          ? (
              <div className="chart">
                <Doughnut data={data2} options={doughnutOptions}/>
              </div>
            )
          : this.state.display === 'bar'
          ? (
              <div className="chart">
                <Bar data={data2} options={barOptions}/>
              </div>
            )
          : <div>Info</div>
        }
        
        
      </div>
    );
  }
}

export default PollChart;
