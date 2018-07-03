import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import WeatherApp from "./components/weather-app";
import { Provider } from "mobx-react";
import { observable } from "mobx";
// import registerServiceWorker from './registerServiceWorker';

const appStore = observable([]);

const App = () => (
  <div className="app">
    <Provider temperatures={appStore}>
      <WeatherApp />
    </Provider>
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
// registerServiceWorker();
