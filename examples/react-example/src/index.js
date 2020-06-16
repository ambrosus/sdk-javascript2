import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from './components/form';
import AssetResponse from './components/asset-response';
import EventResponse from './components/event-response';
// import AmbrosusSDK from 'ambrosus-javascript-sdk';
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assetResponse: null,
      eventResponse: null
    };

    this.ambrosus = new AmbrosusSDK({
      apiEndpoint: 'https://test-nop.ambrosus-test.com'
    });

  }

  assetSearch(assetId) {
    this.ambrosus.assets.getAsset(assetId)
      .then(response => { this.getEvents(assetId); this.setState({ assetResponse: response })})
      .catch(error => console.log(error));
  }

  getEvents(assetId) {
    this.ambrosus.events.getEvents({assetId: assetId})
      .then(response => this.setState({ eventResponse: response }))
      .catch(error => console.log(error));
  }

  render() {

    const assetSearch = term => this.assetSearch(term);

    return (
      <div className='container-pad'>
        <h1>
            Ambrosus Viewer 🔭
        </h1>
        <div className="container-pad">
          <Form onSubmitId={assetSearch} />
          <br />
          <AssetResponse response={this.state.assetResponse} />
          <br />
          <EventResponse response={this.state.eventResponse} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('.container'));
