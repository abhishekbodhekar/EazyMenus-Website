import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class Default extends Component {
	constructor() {
		super();
		this.state = {
		};
	}

	componentDidMount() {
		this.props.history.push("/mgmt/login");
	}

	render() {
		return (
			<div className="container-fluid p-0 overflow-hidden"></div>
		);
	}
}

export default withRouter(Default);