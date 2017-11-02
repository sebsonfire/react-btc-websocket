import React from 'react';

export class TargetAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btcAddress: "",
      apiLink: "http://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=",
      message: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      message: ""
    })
  }

  buildLink() {
    return this.state.apiLink + this.state.btcAddress;
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      message: 'Monitoring...'
    })
    let targetAccount = this;
    let btcs = new WebSocket("wss://ws.blockchain.info/inv");
    btcs.onopen = function() {
      btcs.send(JSON.stringify({"op":"addr_sub", "addr":targetAccount.state.btcAddress}));
    };

    btcs.onmessage = function(onmsg) {
      let response = JSON.parse(onmsg.data);
      let getOuts = response.x.out;
      let countOuts = getOuts.length;
      for(let i=0; i<countOuts; i++) {
        let outAdd = response.x.out[i].addr;
        if(outAdd === targetAccount.state.btcAddress) {
          let amount = response.x.out[1].value;
          let calcAmount = amount/ 100000000;
          targetAccount.setState({
            message: "Received: " + calcAmount + " BTC"
          })
        }
      }
    }

  }

  render() {
    return (
      <div>
        <div className="col-6">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <label htmlFor="inputTargetAccount"> </label>
              <input  className="target-input"
                      name="btcAddress"
                      style={{textAlign: "center"}}
                      type="text"
                      placeholder="Enter public key"
                      id="inputTargetAccount"
                      value={this.state.btcAddress}
                      onChange={this.handleInputChange}></input>
            </div>
            <div className="form-group">
              <button type='submit' className="btn btn-success">Monitor</button>
            </div>
          </form>
        </div>
        <p>Hit "Monitor" to listen for transfer confirmations for the target account</p>
        <img src={this.buildLink()} alt="qr-code"/>
        <div>{this.state.btcAddress}</div>
        <div id="websocket">{this.state.message}</div>
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
    )
  }
}
