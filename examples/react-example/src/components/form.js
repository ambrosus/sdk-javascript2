import React, { Component } from 'react';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = { term: '0x878bc5dfb6bd0e384924737c0f71f131db1f68921b5f8b7c3153dd76a8c98c70' };
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
