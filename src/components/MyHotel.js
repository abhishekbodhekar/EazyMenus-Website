import React, { Component } from "react";
import Card from 'react-bootstrap/Card';
import MgmtHeader from "./MgmtHeader";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import moment from "moment";
import { getItem } from '../lib/myStore';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { startLoader, stopLoader } from '../lib/utils';
import MyMenus from './MyMenus';
import IncomingOrders from './IncomingOrders';

class MyHotel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orders: [],
			table_id: getItem('tableId'),
			activeTab: 'myMenus'
		};
	}

	getOrders() {
		startLoader();
		let url = "https://us-central1-easymenuspro.cloudfunctions.net/GetOrders";
		axios.post(url, { H_ID: getItem('hotelId') }, {
			headers: {
				'Content-Type': 'text/plain'
			}
		}).then(response => {
			if (response.data && response.data.Status) {
				let myOrders = [];
				response.data.Data.map((resp) => {
					if (resp.table_id == this.state.table_id) {
						myOrders = resp.orders;
					}
				});
				myOrders.map((order) => order.timestamp = new Date(order.timestamp).getTime());
				myOrders = myOrders.sort(function (x, y) {
					return y.timestamp - x.timestamp;
				})
				this.setState({
					orders: myOrders || []
				});
			}
			stopLoader();
		}).catch(error => {
			console.error(error);
			stopLoader();
		});
	}

	componentWillMount() {
		this.getOrders();
	}

	setKey(selectedTab) {
		this.setState({ activeTab: selectedTab });
	}

	cancelWholeOrder(orderIndex) {
		let cnf = window.confirm('Are you sure that you want to cancel all items in this order?');
		if (cnf) {
			startLoader();
			let payload = {
				H_ID: getItem('hotelId'),
				table_id: this.state.table_id,
				order_id: this.state.orders[orderIndex].id,
				is_admin: 0
			};
			axios.post("https://us-central1-easymenuspro.cloudfunctions.net/DeleteOrder", payload, {
				headers: {
					'Content-Type': 'text/plain'
				}
			}).then(response => {
				this.state.orders.splice(orderIndex, 1);
				this.setState({ orders: this.state.orders });
				alert(response.data.Data);
				stopLoader();
			}).catch((error) => {
				console.error(error);
				stopLoader();
			});
		}
	}

	cancelItemInOrder(itemIndex, orderIndex) {
		let itemToDelete = this.state.orders[orderIndex].items[itemIndex];
		let cnf = window.confirm(`Are you sure that you want to remove ${itemToDelete.name.toUpperCase()} from this order?`);
		if (cnf) {
			startLoader();
			let payload = {
				H_ID: getItem('hotelId'),
				table_id: this.state.table_id,
				order_id: this.state.orders[orderIndex].id,
				item_id: itemToDelete.id,
				is_admin: 0
			};
			axios.post("https://us-central1-easymenuspro.cloudfunctions.net/DeleteItemInOrder", payload, {
				headers: {
					'Content-Type': 'text/plain'
				}
			}).then(response => {
				this.state.orders[orderIndex].items.splice(itemIndex, 1);
				if (this.state.orders[orderIndex].items.length === 0) {
					// this.cancelWholeOrder(orderIndex);
					this.state.orders.splice(orderIndex, 1);
				}
				this.setState({ orders: this.state.orders });
				alert(response.data.Data);
				stopLoader();
			}).catch((error) => {
				console.error(error);
				stopLoader();
			});
		}
	}

	render() {
		let orders = this.state.orders.map((order, orderIndex) => {
			let items = order.items.map((item, itemIndex) => {
				return (
					<div key={itemIndex} className="orderlist-item">
						<div className="inline-block text-capitalize" style={{ width: '90%' }}>
							<span className="fs-16">{item.name}</span>
							<span className="fs-14 ml-10">-&nbsp;{item.quantity}</span>
						</div>
						<div className="inline-block" style={{ width: '10%' }}>
							{
								order.status.toUpperCase() === 'ORDERED' &&
								<i className="fa fa-times text-danger" onClick={this.cancelItemInOrder.bind(this, itemIndex, orderIndex)}></i>
							}
						</div>
					</div>
				)
			});
			return (
				<div className="mt-5" key={order.id}>
					<Card className="shadow">
						<Card.Header as="h6">
							<div className="inline-block" style={{ width: '65%' }}>
								Ordered on {moment(order.timestamp).format('DD/MM/YYYY')}
							</div>
							<div className="inline-block text-right fs-14" style={{ width: '35%', height: '25px' }}>
								{
									order.status.toUpperCase() === 'CONFIRMED' &&
									<span className="text-danger">
										Confirmed! &nbsp;
											<i className="fa fa-check-circle-o text-success"></i>
									</span>
								}
								{
									order.status.toUpperCase() === 'ORDERED' &&
									<Button variant="danger" size="sm" onClick={this.cancelWholeOrder.bind(this, orderIndex)}>
										<i className="fa fa-times text-light"></i>
									</Button>
								}
							</div>
							<div>
								<span className="fs-14 text-success">{moment(order.timestamp).format('hh:mm A')}</span>
							</div>
						</Card.Header>
						<Card.Body style={{ padding: '.5rem' }}>
							<div>{items}</div>
						</Card.Body>
					</Card>
				</div>
			)
		});
		return (
			<div>
				<MgmtHeader />
				<div className="myhotel-content">
					<Tabs
						id="controlled-tab-example"
						activeKey={this.state.activeTab}
						variant="tabs"
						style={{ justifyContent: 'center' }}
						onSelect={(k) => this.setKey(k)}>
						<Tab eventKey="myMenus" title="My Menu">
							<MyMenus />
						</Tab>
						<Tab eventKey="incOrders" title="Incoming Orders">
							<IncomingOrders />
						</Tab>
					</Tabs>
				</div>
			</div>
		);
	}
}

export default MyHotel;