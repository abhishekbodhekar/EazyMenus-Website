import React, { Component } from "react";
import logo from '../assets/img/fudoz.jpeg';

export default class SplashScreen extends Component {
    render() {
      return (
        <div className="splash">
          <img src={logo} alt="Splash"/>
        </div>
      );
    }
}