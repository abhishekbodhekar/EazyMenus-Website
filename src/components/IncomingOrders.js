import React, { Component } from "react";
import Collapse from 'react-bootstrap/Collapse';
import { startLoader, stopLoader } from "../lib/utils";
import axios from 'axios';
import { getItem } from "../lib/myStore";
import { groupBy } from "../lib/predicate";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge'
import moment from "moment";

class IncomingOrders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orders: []
		};
		this.tablesCopy = [];
	}

	togglePanel(e, $index) {
		this.state.orders.map((menu, index) => {
			if (index === $index) menu.open = !menu.open;
			else menu.open = false;
		});
		this.setState({ orders: this.state.orders });
		this.tablesCopy =  JSON.parse(JSON.stringify(this.state.orders));
	}

	getOrders(isSilent) {
		if (!isSilent) startLoader();
		let url = "https://us-central1-easymenuspro.cloudfunctions.net/GetOrders";
		axios.post(url, { H_ID: getItem('hotelId') }, {
			headers: {
				'Content-Type': 'text/plain'
			}
		}).then(response => {
			if (response.data && response.data.Status) {
				let orders = this.groupOrdersTablewise(response.data.Data);
				this.setState({
					orders
				});
			} else {
				this.setState({orders: []});
			}
			if (isSilent) this.setExpandedTablesOpen();
			this.tablesCopy =  JSON.parse(JSON.stringify(this.state.orders));
			stopLoader();
		}).catch(error => {
			console.error(error);
			stopLoader();
		});
	}

	setExpandedTablesOpen() {
		this.tablesCopy.map((table) => {
			console.log(table);
			this.state.orders.map((order) => {
				if (table.table_id == order.table_id) {
					order.open = table.open;
				}
			});
		});
		this.setState({orders: this.state.orders});
	}

	groupOrdersTablewise(orders) {
		//also sort by timestamp
		let grpd = groupBy(orders, 'table_id');
		let tables = [];
		for (var key in grpd) {
			tables = tables.concat(grpd[key]);
		}

		tables.map((table) => {
			table.orders.map((order) => {
				order.timestamp = new Date(order.timestamp).getTime();
			});
			let sorted = table.orders.sort((x, y) => {
				return y.timestamp - x.timestamp;
			});
			table.latestTimestamp = sorted[0].timestamp;
		});

		tables = tables.sort((x, y) => {
			return y.latestTimestamp - x.latestTimestamp;
		});
		return tables;
	}

	cancelWholeOrder(tableIndex, orderIndex) {
		let cnf = window.confirm('Are you sure that you want to cancel all items in this order?');
		if (cnf) {
			startLoader();
			let payload = {
				H_ID: getItem('hotelId'),
				table_id: this.state.orders[tableIndex].table_id,
				order_id: this.state.orders[tableIndex].orders[orderIndex].id,
				is_admin: 1
			};
			axios.post("https://us-central1-easymenuspro.cloudfunctions.net/DeleteOrder", payload, {
				headers: {
					'Content-Type': 'text/plain'
				}
			}).then(response => {
				this.state.orders[tableIndex].orders.splice(orderIndex, 1);
				if (this.state.orders[tableIndex].orders.length === 0) this.state.orders.splice(tableIndex, 1);
				this.setState({ orders: this.state.orders });
				alert(response.data.Data);
				stopLoader();
			}).catch((error) => {
				console.error(error);
				stopLoader();
			});
		}
	}

	cancelItemInOrder(tableIndex, orderIndex, itemIndex) {
		let itemToDelete = this.state.orders[tableIndex].orders[orderIndex].items[itemIndex];
		let cnf = window.confirm(`Are you sure that you want to remove ${itemToDelete.name.toUpperCase()} from this order?`);
		if (cnf) {
			startLoader();
			let payload = {
				H_ID: getItem('hotelId'),
				table_id: this.state.orders[tableIndex].table_id,
				order_id: this.state.orders[tableIndex].orders[orderIndex].id,
				item_id: itemToDelete.id,
				is_admin: 1
			};
			axios.post("https://us-central1-easymenuspro.cloudfunctions.net/DeleteItemInOrder", payload, {
				headers: {
					'Content-Type': 'text/plain'
				}
			}).then(response => {
				this.state.orders[tableIndex].orders[orderIndex].items.splice(itemIndex, 1);
				if (this.state.orders[tableIndex].orders[orderIndex].items.length === 0) {
					this.state.orders[tableIndex].orders.splice(orderIndex, 1);
				}
				if (this.state.orders[tableIndex].orders.length === 0) {
					this.state.orders.splice(tableIndex, 1);
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

	checkoutTable(index, e) {
		e.preventDefault()
		e.stopPropagation();
		let table = this.state.orders[index];
		let cnf = window.confirm(`Are you sure to check out table no. ${table.table_id}?`);
		if (!cnf) return false;
		startLoader();
		let payload = {
			H_ID: getItem('hotelId'),
			table_id: table.table_id
		};
		axios.post("https://us-central1-easymenuspro.cloudfunctions.net/Checkout", payload, {
			headers: {
				'Content-Type': 'text/plain'
			}
		}).then(response => {
			this.getOrders();
		}).catch((error) => {
			console.error(error);
			stopLoader();
		});
	}

	confirmOrder(tableIndex, orderIndex, e) {
		e.preventDefault();
		let table = this.state.orders[tableIndex];
		let cnf = window.confirm(`Confirm order?`);
		if (!cnf) return false;
		startLoader();
		let payload = {
			H_ID: getItem('hotelId'),
			table_id: table.table_id,
			order_id: table.orders[orderIndex].id
		};
		axios.post("https://us-central1-easymenuspro.cloudfunctions.net/ConfirmOrder", payload, {
			headers: {
				'Content-Type': 'text/plain'
			}
		}).then(response => {
			if (response.data.Status) {
				this.state.orders[tableIndex].orders[orderIndex].status = 'Confirmed';
				this.setState({ orders: this.state.orders });
				stopLoader();
				// this.getOrders();
			}
		}).catch((error) => {
			console.error(error);
			stopLoader();
		});
	}

	componentWillMount() {
		this.getOrders();
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			this.getOrders(true);
		}, 15 * 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		let tables = this.state.orders.map((table, tableIndex) => {
			let orders = table.orders.map((order, orderIndex) => {
				let items = order.items.map((item, itemIndex) => {
					return (
						<div key={itemIndex} className="orderlist-item">
							<div className="inline-block text-capitalize" style={{ width: '90%' }}>
								<span className="fs-16">{item.name}</span>
								<span className="fs-14 ml-10">-&nbsp;{item.quantity}</span>
							</div>
							<div className="inline-block" style={{ width: '10%' }}>
								<i className="fa fa-times text-danger pointer" onClick={this.cancelItemInOrder.bind(this, tableIndex, orderIndex, itemIndex)}></i>
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
										<div>
											<Button variant="danger" size="sm" className="ml-10" onClick={this.cancelWholeOrder.bind(this, tableIndex, orderIndex)}>
												<i className="fa fa-times text-light"></i>
											</Button>
										</div>
									}
									{
										order.status.toUpperCase() === 'ORDERED' &&
										<div>
											<Button variant="success" className="mr-3" size="sm" onClick={this.confirmOrder.bind(this, tableIndex, orderIndex)}>
												<i className="fa fa-check-circle"></i>
											</Button>
											<Button variant="danger" size="sm" onClick={this.cancelWholeOrder.bind(this, tableIndex, orderIndex)}>
												<i className="fa fa-times text-light"></i>
											</Button>
										</div>
									}
								</div>
								<div className="inline-block" style={{ width: '65%' }}>
									<span className="fs-14 text-success">{moment(order.timestamp).format('hh:mm A')}</span>
								</div>
								{
									order.status.toUpperCase() === 'CONFIRMED' &&
										<div className="inline-block text-right fs-14 pt-10" style={{ width: '35%'}}>
											<span className="text-danger">
												Confirmed&nbsp;
												<i className="fa fa-check-circle-o text-success"></i>
											</span>
										</div>
								}
							</Card.Header>
							<Card.Body style={{ padding: '.5rem' }}>
								<div>{items}</div>
							</Card.Body>
						</Card>
					</div>
				);
			});
			return (
				<div key={tableIndex}>
					<div onClick={(e) => this.togglePanel(e, tableIndex)} className='category text-capitalize' aria-expanded={table.open} aria-controls="example-collapse-text">
						<div className="inline-block" style={{ width: '70%' }}>
							<span>Table - {table.table_id}</span>
							<Badge pill variant="danger" className="ml-3">
								<span>
									{table.orders.filter((order) => order.status.toUpperCase() !== 'CONFIRMED').length}
								</span>
							</Badge>
						</div>
						<div className="inline-block text-right" style={{ width: '30%' }}>
							{
								table.orders.filter((order) => order.status.toUpperCase() === 'ORDERED').length == 0 &&
								<Button variant="warning" size="sm" onClick={this.checkoutTable.bind(this, tableIndex)}>
									<i className="text-success fa fa-share"></i>&nbsp;Checkout
								</Button>
							}
						</div>
					</div>
					<Collapse in={table.open}>
						<div id="example-collapse-text">
							<div className="p-10">{orders}</div>
						</div>
					</Collapse>
				</div>
			);
		});

		return (
			<div className="container">
				<div className="row mt-5">
					<div className="col-md-12 text-right">
						<Button variant="warning" size="sm" onClick={this.getOrders.bind(this)} style={{ marginRight: '13px' }}>
							<i className="fa fa-refresh"></i>
						</Button>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12 p-0 overflow-x-hidden">
						{
							this.state.orders.length <= 0 &&
							<div className="text-center mt-10">
								<h5>No orders to display.</h5>
							</div>
						}
						{
							this.state.orders.length > 0 &&
							<div className="mt-10">{tables}</div>
						}
					</div>
				</div>
			</div>
		);
	}
}

export default IncomingOrders;
