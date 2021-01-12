import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { removeAll } from "../lib/myStore";

class NotFound extends Component {
	constructor() {
		super();
		this.state = {
		};
	}

	componentWillUnmount() {
		removeAll();
	}

	render() {
		return (
			<div>
				<h1>404 - Not Found!</h1>
				<Link to="/">
				Go Home
				</Link>
			</div>
		);
	}
}

export default NotFound;