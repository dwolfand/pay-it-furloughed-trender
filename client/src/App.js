import React, { Component } from 'react';
import './App.css';
// import stubData from './stubData';
import dateFormat from 'dateformat';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryLegend, VictoryVoronoiContainer, VictoryTooltip} from 'victory';
import sortBy from 'lodash/sortBy';

class App extends Component {
  constructor(props) {
    super(props);
    // const resultData = this.formatData(stubData);
    // this.state = {
    //   isFetching: true,
    //   ...resultData,
    // };
    this.state = {isFetching: true};
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
    if (this.state.isFetching) {
      return <div className="App"><header className="App-header">Loading</header></div>;
    }
    return (
      <div className="App">
        <header className="App-header">
          <div className="graph">
            <VictoryChart
              padding={{ top: 10, bottom: 40, left: 50, right: 40 }}
              containerComponent={
                <VictoryVoronoiContainer voronoiDimension="sdf"
                  labels={(d) => `${dateFormat(new Date(d.createdDate), "m/d h:MMT")}-${d.beersAvailable}/${d.beersRedeemed}`}
                  labelComponent={<VictoryTooltip style={{fontSize: 8}}/>}
                />
              }
            >
              <VictoryLegend x={50} y={10}
                orientation="vertical"
                padding={20}
                style={{
                  border: { stroke: "white"},
                  title: {fontSize: 10, fill: "white" } }
                }
                data={[
                  { name: "Available", symbol: { fill: "0000ff" }, labels: { fontSize: 10, fill: "white" }},
                  { name: "Redeemed", symbol: { fill: "800000" }, labels: { fontSize: 10, fill: "white" } }
                ]}
              />
              <VictoryAxis
                label="Date"
                tickCount= {4}
                tickFormat={(t) => dateFormat(new Date(t), "m/d/yy")}
                style={{
                  axis: {stroke: "white"},
                  axisLabel: {stroke: "white", fill: "white", strokeWidth: 0, fontSize: 10},
                  ticks: {stroke: "white"},
                  tickLabels: {stroke:"white", fill: "white", strokeWidth: 0, fontSize: 10}
                }}
              />
              <VictoryAxis dependentAxis
                label="Count"
                tickCount= {8}
                style={{
                  axis: {stroke: "white"},
                  axisLabel: {stroke: "white", fill: "white", strokeWidth: 0, fontSize: 10, padding: 35},
                  ticks: {stroke: "white"},
                  tickLabels: {stroke:"white", fill: "white", strokeWidth: 0, fontSize: 10}
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
            Let's trend the beers consumed vs beers available!
          </p>
          <footer>Data from <a target="_blank" rel="noopener noreferrer" href="https://payitfurloughed.com">payitfurloughed.com</a></footer>
        </header>
      </div>
    );
  }
}

export default App;
