import React, { Component } from 'react';
import './App.css';
import {TargetAccount} from './TargetAccount';



class App extends Component {

  render() {
    return (
      <div className="container">
        <div className="text-center">
          <h1> Send me BTC!</h1>
          <TargetAccount />
        </div>
      </div>
    );
  }
}

export default App;
