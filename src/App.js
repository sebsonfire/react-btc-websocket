import React, { Component } from 'react';
import './App.css';
import {TargetAccount} from './TargetAccount';

var listeners = [];


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

  handleResponse(calcAmount, address) {
    console.log('inside handleResponse')
    let newListeners = this.state.listeners;
    for(var i in newListeners) {
      if(newListeners[i].btcAddress === address){
        console.log("inside for loop")
        newListeners[i].message = "Received: " + calcAmount + " BTC";
      }
    }
    this.setState({listeners: newListeners });
    console.log("finished handleResponse");
    console.log(this.state.listeners)
  }

  handleAddListener(listener) {
    console.log(listener)
    listener.message = 'Monitoring...';
    let app = this;
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
          let address = listener.btcAddress;
          app.handleResponse(calcAmount, address);
          console.log(response);
        }
      }
    }
    this.setState({listeners: [...this.state.listeners, listener]});
    console.log(listener);
  }


  render() {
    return (
      <div className="wrapper">
        <div className="container">
          <div className="text-center row">
            <div className="col title">
              <h1>MONITOR BITCOIN BLOCKCHAIN CONFIRMATIONS</h1>
            </div>
            <br />
            <div>
              <TargetAccount onAddListener={this.handleAddListener}/>
            </div>
            <div className="instructions">
              <h4><strong>BitListener allows you to listen for blockchain confirmations on a bitcoin transaction</strong></h4>
              <div className="instructions-list text-center">
                <ul>
                  <li><p>Enter the Public Key (address) of the receiving wallet before you send it Bitcoin.</p></li>
                  <li><p>Press "Add Listener".</p></li>
                  <li><p>Now you can initiate the transaction on whatever platform you are using and BitListener will notify you of confirmations as they happen.</p></li>
                  <li><p>You can add as many listeners as you like and BitListener will monitor all of them.</p></li>
                    <br />
                    BitListener is run entirely on the front-end, if you refresh the page you will lose the monitoring.
                </ul>
              </div>
            </div>
            {this.state.listeners.length > 0 ? <h2>LISTENERS</h2> : null}
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
      </div>
    );
  }
}

export default App;
