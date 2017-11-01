

import React from 'react';

let btcs = new WebSocket("wss://ws.blockchain.info/inv");

export class WebSocketComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      btcAddress: "96f343af-e888-5840-9b11-f0ab7a4de0f4"
    }
  }

  subscribe(btcAddress){
    btcs.onopen = function() {
      btcs.send(JSON.stringify({"op":"addr_sub", "addr":btcAddress}));
    };
    console.log(btcAddress);
  }

  render() {
    return (
      <div key={this.subscribe(this.state.btcAddress)} id="websocket"></div>
    )
  }

 }
