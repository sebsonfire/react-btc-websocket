import React, { Component } from 'react';
import './App.css';


let qrs = [{
  btcAddress: "96f343af-e888-5840-9b11-f0ab7a4de0f4",
  apiLink: "http://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=96f343af-e888-5840-9b11-f0ab7a4de0f4"
}];

let btcs = new WebSocket("wss://ws.blockchain.info/inv");

function subscribe(btcAddress){
  btcs.onopen = function() {
    btcs.send(JSON.stringify({"op":"addr_sub", "addr":btcAddress}));
  };
  console.log(btcAddress);
}

subscribe(qrs[0].btcAddress);

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      qrs
    }
  }

  render() {
    return (
      <div className="container">
        <div className="text-center">
          <h1> Send me BTC!</h1>
          {this.state.qrs.map((qr) =>
            <div>
              <img src={qr.apiLink} alt="qr-code"/>
              <div>{qr.btcAddress}</div>
            </div>
          )}
          <div id="websocket">Monitoring...</div>
        </div>
      </div>
    );
  }
}

function update(onmsg) {
  btcs.onmessage = function(onmsg) {
    var response = JSON.parse(onmsg.data);
    var getOuts = response.x.out;
    var countOuts = getOuts.length;

    for(i=0; i<countOuts; i++){
      var outAdd = response.x.out[i].addr;
      var address = qrs[0].btcAddress;
        if(outAdd == address){
          var amount = response.x.out[i].value;
          var calAmount = amount/100000000;
          document.getElementById('websocket').innerHTML = "Recieved: " + calAmount + " BTC"
        }
    }
  }
}

export default App;
