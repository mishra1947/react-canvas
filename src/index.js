import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import "fabric-webpack";

import DesignCanvas from "./Canvas";
import data_1 from "./Data/data_1.json";
import data_2 from "./Data/data_2.json";
import data_3 from "./Data/data_3.json";

const App = () => {
  const [state, setState] = useState({
    width: 1000,
    height: 1000,
    source: 1,
    loader: true,
    data: {},
  });

  useEffect(() => {
    setState((state) => ({ ...state, loader: true }));
    let data = {};
    if (state.source === 1) {
      data = data_1;
    } else if (state.source === 2) {
      data = data_2;
    } else if (state.source === 3) {
      data = data_3;
    }
    setState((state) => ({ ...state, loader: false, data }));
  }, [state.source]);

  if (state.loader) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <DesignCanvas dimensions={{ width: state.width, height: state.height }} data={state.data} />
    </div>
  );
};

render(<App />, document.getElementById("root"));
