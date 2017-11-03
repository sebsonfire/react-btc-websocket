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
      [name]: value
    })
  }

  buildLink(apiLink, btcAddress) {
    return apiLink + btcAddress;
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onAddListener(this.state);
    this.setState({
      btcAddress: ""
    })
  }

  render() {
    return (
      <div>
        <div className="col-6">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className="input-field">
              <label htmlFor="inputTargetAccount"> </label>
              <input  className="target-input"
                      name="btcAddress"
                      style={{textAlign: "center", color: "black"}}
                      type="text"
                      placeholder="Enter public key"
                      id="inputTargetAccount"
                      value={this.state.btcAddress}
                      onChange={this.handleInputChange}></input>
            </div>
            <div>
              <button type='submit' className="submit-btn btn btn-success">Add Listener</button>
            </div>
          </form>
        </div>
        <p>Hit "Add Listener" to listen for transfer confirmations for the target account</p>
        <img className='main-qr' src={this.buildLink(this.state.apiLink, this.state.btcAddress)} alt="qr-code"/>
      </div>
    )
  }
}
