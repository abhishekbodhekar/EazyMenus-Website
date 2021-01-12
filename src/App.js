import React, { Component } from "react";
import Default from './components/Default';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import MyHotel from './components/MyHotel';
import ErrorBoundary from './components/ErrorBoundary';
import "./css/header.css";
import "./css/footer.css";
import "./css/modal.css";
import "./css/style.css";
import "./css/menu.css";
import "./css/orders.css";
import "./css/management.css";
import { Route, Switch } from "react-router-dom";

import NotFound from './errorpages/NotFound';

class App extends Component {
	render() {
		return (
			<div>
				{ /* Route components are rendered if the path prop matches the current URL */}
				<Switch>
					<Route exact path="/">
						<ErrorBoundary>
							<Default />
						</ErrorBoundary>
					</Route>
					<Route exact path="/hotels">
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
					<Route exact path="/mgmt/myhotel">
						<ErrorBoundary>
							<MyHotel />
						</ErrorBoundary>
					</Route>
					<Route component={NotFound} />
				</Switch>
			</div>
		);
	}
}

export default App;
