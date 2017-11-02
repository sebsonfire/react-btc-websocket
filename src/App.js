import React, { Component } from 'react';
import './App.css';
import {TargetAccount} from './TargetAccount';



class App extends Component {

  render() {
    return (
      <div className="container">
        <div className="text-center row">
          <div className="col title">
            <h1>MONITOR BITCOIN BLOCKCHAIN CONFIRMATIONS</h1>
          </div>
          <br />
          <div>
            <TargetAccount />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
