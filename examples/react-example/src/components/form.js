import React, { Component } from 'react';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = { term: '0x46debb0de0e1ce401da205aa1522df7911488651089e9c5e360802decf1d987d' };
  }

  onSubmitId() {
    this.props.onSubmitId(this.state.term);
  }

  render() {
    return (
      <div className="form-group">
        <form ref="form">
          <label htmlFor="usr">Asset ID:</label>
          <input 
            value={this.state.term}
            onChange={event => this.setState({term: event.target.value})} 
            className="form-control" 
          />
          <br />
          <button type="button" onClick={() => this.onSubmitId()}>Submit</button>
        </form>
      </div>
    );
  }
}

export default Form;
