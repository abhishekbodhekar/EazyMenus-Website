import React, { Component } from "react";
import Collapse from 'react-bootstrap/Collapse';
import axios from 'axios';

class Orders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orders: []
		};
	}

	getOrders() {
		let url = "https://us-central1-easymenuspro.cloudfunctions.net/GetOrders";
		axios.post(url, { H_ID: 'abhi' }, {
		  headers: {
			'Content-Type': 'text/plain'
		  }
		}).then(response => {
		  this.setState({
			orders: response.data.Data[0].orders
		  });
		  console.log(this.state.orders);
		});
	}

	componentWillMount() {
		this.getOrders();
	}

	render() {
		return (
			<div className="row">
				<div className="col-md-12">

				</div>
			</div>
		);
	}
}

export default Orders;