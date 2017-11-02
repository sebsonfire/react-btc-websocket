import React, { Component } from 'react';
import './App.css';
import {TargetAccount} from './TargetAccount';

var listeners = [

];

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      listeners
    };
    this.handleAddListener = this.handleAddListener.bind(this);
  }

  buildLink(apiLink, btcAddress){
    return apiLink + btcAddress
  }

  handleAddListener(listener) {
    this.setState({listeners: [...this.state.listeners, listener]});
    console.log(listener)
    listener.message = 'Monitoring...';
    let btcs = new WebSocket("wss://ws.blockchain.info/inv");
    btcs.onopen = function() {
      btcs.send(JSON.stringify({"op":"addr_sub", "addr":listener.btcAddress}));
    };

    btcs.onmessage = function(onmsg) {
      let response = JSON.parse(onmsg.data);
      let getOuts = response.x.out;
      let countOuts = getOuts.length;
      for(let i=0; i<countOuts; i++) {
        let outAdd = response.x.out[i].addr;
        if(outAdd === listener.btcAddress) {
          let amount = response.x.out[1].value;
          let calcAmount = amount/ 100000000;
          listener.message = "Received: " + calcAmount + " BTC";
          console.log(response);
        }
      }
    }
    console.log(listener);
  }


  render() {
    return (
      <div className="container">
        <div className="text-center row">
          <div className="col title">
            <h1>MONITOR BITCOIN BLOCKCHAIN CONFIRMATIONS</h1>
          </div>
          <br />
          <div>
            <TargetAccount onAddListener={this.handleAddListener}/>
          </div>
          <div>
            <div><strong>BitListener allows you to listen for blockchain confirmations on a bitcoin transaction</strong></div>
            <div className="instructions text-center">
              <ul>
                <li><p>Enter the Public Key (address) of the receiving wallet before you send it Bitcoin.</p></li>
                <li><p>Press "Monitor".</p></li>
                <li><p>Now you can initiate the transaction on whatever platform you are using and BitListener will notify you of confirmations as they happen.
                  <br />
                  BitListener is run entirely on the front-end, if you refresh the page you will lose the monitoring.
                </p></li>
              </ul>
            </div>
          </div>
          {this.state.listeners.length > 0 ? <h2>Listeners</h2> : null}
          <div>
              {this.state.listeners.map((listener, index) =>
              <div key={index}>
                <img src={this.buildLink(listener.apiLink, listener.btcAddress)} alt="target account qr"></img>
                <div>{listener.btcAddress}</div>
                <div id="websocket">{listener.message}</div>
              </div>
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
