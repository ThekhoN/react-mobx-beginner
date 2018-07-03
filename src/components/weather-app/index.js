import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";

const APPID = "6c9bb64443d124019b41ea00de26732e";
const message = "city not found";

class Temperature {
  id = new Date().getTime();
  @observable unit = "C";
  @observable temperatureCelsius = 25;
  @observable location = "Bangalore";
  @observable loading = false;
  @observable message = "";

  constructor(location) {
    this.location = location;
    this.fetch();
  }

  @action
  fetch() {
    this.loading = true;
    window
      .fetch(
        `https://api.openweathermap.org/data/2.5/weather?appid=${APPID}&q=${
          this.location
        }`
      )
      .then(res =>
        res.json().then(
          action(json => {
            // console.log("json: ", json);
            if (json.message === message) {
              this.loading = false;
              this.message = `${this.location}: ${message} :(`;
            } else {
              this.temperatureCelsius = json.main.temp - 273.15;
              this.loading = false;
            }
          })
        )
      )
      .catch(err => {
        this.loading = false;
        this.message = "Error in fetch service";
        console.log("err in fetch: ", err);
      });
  }
}

@observer(["temperatures"])
class UserInput extends Component {
  @observable value = "";
  render() {
    return (
      <div>
        <input
          onChange={this.onChange}
          value={this.value}
          onKeyDown={e => {
            const keyCode = e.keyCode || e.which;
            if (keyCode === 13) {
              this.onSubmit();
            }
          }}
        />
        <button onClick={this.onSubmit}>submit</button>
      </div>
    );
  }

  @action
  onChange = e => {
    this.value = e.target.value;
  };

  @action
  onSubmit = () => {
    this.props.temperatures.push(new Temperature(this.value));
    this.value = "";
  };
}

const Loading = () => <div>Loading...</div>;

const Content = temperature => {
  return (
    <div>
      <div>
        <span>Location: </span>
        {temperature.temperature.location}
      </div>
      <div>
        <span>Temperature: </span>
        {temperature.temperature.temperatureCelsius}{" "}
        {temperature.temperature.unit}
      </div>
    </div>
  );
};

// const WeatherApp = observer(["temperatures"], ({ temperatures }) => (
//   <ul>
//     <UserInput />
//     {temperatures.map(t => (
//       <li key={t.id}>
//         {t.loading ? (
//           <Loading />
//         ) : t.message ? (
//           t.message
//         ) : (
//           <Content temperature={t} />
//         )}
//       </li>
//     ))}
//   </ul>
// ));

@observer(["temperatures"])
class WeatherApp extends Component {
  handleRender = temperature => {
    if (temperature.loading) {
      return <Loading />;
    } else {
      if (temperature.message) {
        return temperature.message;
      } else {
        return <Content temperature={temperature} />;
      }
    }
  };
  render() {
    const { temperatures } = this.props;
    return (
      <ul>
        <UserInput />
        {temperatures.map(t => <li key={t.id}>{this.handleRender(t)}</li>)}
      </ul>
    );
  }
}

export default WeatherApp;
