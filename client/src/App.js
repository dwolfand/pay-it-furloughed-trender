import React, { Component } from 'react';
import './App.css';
import stubData from './stubData';
import { VictoryChart, VictoryLine, VictoryAxis} from 'victory';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      data: stubData.map(({beersDonated, amount, beersRedeemed, redeemed, beersAvailable, createdDate}) => {
        return {
          beersDonated: Number(beersDonated),
          amount: Number(amount),
          beersRedeemed: Number(beersRedeemed),
          redeemed: Number(redeemed),
          beersAvailable: Number(beersAvailable),
          createdDate: new Date(createdDate),
        }
      }),
    };
  }
  componentDidMount() {
    // fetch('https://9udgrybxqa.execute-api.us-east-1.amazonaws.com/dev/data')
    // .then((result) => result.json())
    // .then((data) => {
    //   this.setState({
    //     isFetching: false,
    //     data: data.sort((a, b) => {
    //       return b.createdDate.localeCompare(a.createdDate);
    //     }),
    //   })
    // })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* {this.state.data.map((item) => <div>{item.createdDate}-{item.beersAvailable}</div>)} */}
          <div className="graph">
            <VictoryChart>
              <VictoryAxis
                label="Date"
                tickCount= {2}
                tickFormat={(t) => new Date(t).toISOString()}
                style={{
                  axis: {stroke: "white"},
                  axisLabel: {stroke: "white"},
                  ticks: {stroke: "white"},
                  tickLabels: {stroke:"white"}
                }}
              />
              <VictoryAxis dependentAxis
                label="Count"
                tickCount= {5}
                style={{
                  axis: {stroke: "white"},
                  axisLabel: {stroke: "white"},
                  ticks: {stroke: "white"},
                  tickLabels: {stroke:"white"}
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
