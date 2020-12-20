import React, { Component } from "react";
import Home from './components/Home';
import "./css/header.css";
import "./css/footer.css";
import "./css/modal.css";
import "./css/style.css";
import "./css/menu.css";
import "./css/orders.css";
import { Route, Switch } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div>
        { /* Route components are rendered if the path prop matches the current URL */}
        <Switch>
          <Route exact path="/" component={Home}/>
        </Switch>
      </div>
    );
  }
}

export default App;
