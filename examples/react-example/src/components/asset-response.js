import React from "react";

const AssetResponse = ({ response }) => {

  if (!response) {
    return <div></div>;
  }

  const assetResponse = response.data;

  const divLoaded = (
    <div>
      <div className="wrap">
        <pre><p>{JSON.stringify(assetResponse, null, 2)}</p></pre>
      </div>
      <br />
      <div>
        <h4>Events for AssetID: {assetResponse.assetId} </h4>
      </div>
    </div>
  );

  const loading = (
    <div className="wrap">
      <p>Loading</p>
  </div>
  )

  return divLoaded;
  
};

export default AssetResponse;