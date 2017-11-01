import React from 'react';

export class TargetAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btcAddress: "",
      apiLink: "http://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=",
      monitoring: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  buildLink() {
    return this.state.apiLink + this.state.btcAddress;
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      monitoring: true
    })
  }


  render() {
    return (
      <div>
        <div className="col-6">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <label htmlFor="inputTargetAccount"> </label>
              <input  name="btcAddress"
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
        <img src={this.buildLink()} alt="qr-code"/>
        <div>{this.state.btcAddress}</div>
        <div id="websocket">{this.state.monitoring? "Monitoring..." : ""}</div>
      </div>
    )
  }
}
