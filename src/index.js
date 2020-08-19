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
    source: 2,
    loader: true,
    data: {},
    dimensions: 1,
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

  const handleDimensions = (e) => {
    setState((state) => ({ ...state, loader: true }));
    const {
      target: { value },
    } = e;
    let h = state.height;
    let w = state.width;
    if (value == 1) {
      h = 1000;
      w = 1000;
    } else if (value == 2) {
      h = 600;
      w = 300;
    } else if (value == 3) {
      h = 200;
      w = 468;
    }
    setState((state) => ({ ...state, dimensions: value, width: w, height: h }));
    setTimeout(() => {
      setState((state) => ({ ...state, loader: false }));
    }, 100);
  };

  if (state.loader) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <form action="/action_page.php">
        <label htmlFor="dimensions">Choose dimensions:</label>
        <select name="dimensions" id="dimensions" value={state.dimensions} onChange={handleDimensions}>
          <option value="1">1000x1000</option>
          <option value="2">300x600</option>
          <option value="3">468x200</option>
        </select>
      </form>
      <DesignCanvas dimensions={{ width: state.width, height: state.height }} data={state.data} />
    </div>
  );
};

render(<App />, document.getElementById("root"));
