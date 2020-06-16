import React from "react";

const EventResponse = ({ response }) => {

  if (!response) {
    return <div></div>;
  }

  const eventResponse = response.data;

  const divLoaded = (
    <div className="wrap">
      <pre><p>{JSON.stringify(eventResponse, null, 2)}</p></pre>
    </div>
  );

  const loading = (
    <div className="wrap">
      <p>Loading</p>
  </div>
  )

  return divLoaded;

};

export default EventResponse;