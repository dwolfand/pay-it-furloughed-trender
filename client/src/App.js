import React, { Component } from 'react';
import './App.css';
import stubData from './stubData';
import { VictoryChart, VictoryLine, VictoryAxis} from 'victory';
import sortBy from 'lodash/sortBy';

class App extends Component {
  constructor(props) {
    super(props);
    const resultData = this.formatData(stubData);
    this.state = {
      isFetching: true,
      ...resultData,
    };
  }

  formatData(data) {
    let resultData = data.map(({beersDonated, amount, beersRedeemed, redeemed, beersAvailable, createdDate}) => {
      return {
        beersDonated: Number(beersDonated),
        amount: Number(amount),
        beersRedeemed: Number(beersRedeemed),
        redeemed: Number(redeemed),
        beersAvailable: Number(beersAvailable),
        createdDate: new Date(createdDate),
      }
    });
    resultData = sortBy(resultData, ['createdDate']);
    return {
      data: resultData,
      max: resultData[resultData.length - 1],
      min: resultData[0],
    }
  }

  componentDidMount() {
    fetch('https://9udgrybxqa.execute-api.us-east-1.amazonaws.com/dev/data')
    .then((result) => result.json())
    .then((data) => {
      const resultData = this.formatData(data);
      this.setState({
        isFetching: false,
        ...resultData,
      });
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>Earliest data: {this.state.min.createdDate.toISOString()} - {this.state.min.beersRedeemed}/{this.state.min.beersDonated}</div>
          <div>Most recent data: {this.state.max.createdDate.toISOString()} - {this.state.max.beersRedeemed}/{this.state.max.beersDonated}</div>
          <div className="graph">
            <VictoryChart>
              <VictoryAxis
                label="Date"
                tickCount= {2}
                tickFormat={(t) => new Date(t).toISOString()}
                style={{
                  axis: {stroke: "white"},
                  axisLabel: {stroke: "white", fill: "white"},
                  ticks: {stroke: "white"},
                  tickLabels: {stroke:"white", fill: "white"}
                }}
              />
              <VictoryAxis dependentAxis
                label=""
                tickCount= {5}
                style={{
                  axis: {stroke: "white"},
                  axisLabel: {stroke: "white", fill: "white"},
                  ticks: {stroke: "white"},
                  tickLabels: {stroke:"white", fill: "white"}
                }}
              />
              <VictoryLine
                style={{
                  data: { stroke: "#800000" },
                  parent: { border: "1px solid #ccc"}
                }}
                data={this.state.data} x="createdDate" y="beersRedeemed"/>
              <VictoryLine
                style={{
                  data: { stroke: "#0000ff" },
                  parent: { border: "1px solid #ccc"}
                }}
                data={this.state.data} x="createdDate" y="beersAvailable"/>
            </VictoryChart>
          </div>
          <p>
            Let's trend the beers consumed vs beers donated!
          </p>
          <footer>Data from <a target="_blank" rel="noopener noreferrer" href="https://payitfurloughed.com">payitfurloughed.com</a></footer>
        </header>
      </div>
    );
  }
}

export default App;
