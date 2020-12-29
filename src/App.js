import React, { Component } from "react";
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import IncomingOrders from './components/IncomingOrders';
import ErrorBoundary from './components/ErrorBoundary';
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
					<Route exact path="/">
						<ErrorBoundary>
							<Home />
						</ErrorBoundary>
					</Route>
					<Route exact path="/mgmt/signup">
						<ErrorBoundary>
							<SignUp />
						</ErrorBoundary>
					</Route>
					<Route exact path="/mgmt/login">
						<ErrorBoundary>
							<Login />
						</ErrorBoundary>
					</Route>
					<Route exact path="/mgmt/incomingorders">
						<ErrorBoundary>
							<IncomingOrders />
						</ErrorBoundary>
					</Route>
				</Switch>
			</div>
		);
	}
}

export default App;
