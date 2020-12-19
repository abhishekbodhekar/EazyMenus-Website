/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable array-callback-return */
import React, { Component } from "react";
import Collapse from 'react-bootstrap/Collapse';
import Orders from "./Orders";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import logo from '../assets/img/hotel_logo.jpg';
import axios from 'axios';

class Products extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menus: [],
			activeTab: 'menus',
			hotelInfo: {}
		};
	}
	togglePanel(e, $index) {
		this.state.menus.map((menu, index) => {
			if (index === $index) menu.open = !menu.open;
			else menu.open = false;
		});
		this.setState({ menus: this.state.menus });
	}

	setKey(selectedTab) {
		this.setState({activeTab: selectedTab});
	}

	increment(item, e) {
		e.preventDefault();
		item.quantity++;
		this.setState({menus: this.state.menus});
		this.props.addToCart({
			name: item.name,
			price: item.price,
			quantity: item.quantity
		});
	  }

	  decrement(item, e) {
		e.preventDefault();
		if (item.quantity === 0) return false;
		item.quantity--;
		this.setState({menus: this.state.menus});
		this.props.addToCart({
			name: item.name,
			price: item.price,
			quantity: item.quantity
		});
	  }

	feed(item) {
		this.props.addToCart({
			name: item.name,
			price: item.price,
			quantity: item.quantity
		});
	}

	addFavoritesCategory() {
		let url = "https://us-central1-easymenuspro.cloudfunctions.net/GetOrders";
		axios.post(url, { H_ID: localStorage.getItem('hotelId') }, {
			headers: {
				'Content-Type': 'text/plain'
			}
		}).then(response => {
			if (response.data && response.data.Status) {
				let myOrders = [];
				response.data.Data.map((resp) => {
					if (resp.table_id == localStorage.getItem('tableId')) {
						myOrders = resp.orders;
					}
				});
				// myOrders.map((order) => order.timestamp = new Date(order.timestamp).getTime());
				let itemNames = new Set();
				myOrders.map((order) => {
					order.items.map((item) => {
						itemNames.add(item.name);
					});
				});
				let orderedItems = Array.from(itemNames);

				let items = [];
				this.state.menus.map((menu) => {
					menu.items.map((item) => {
						if (orderedItems.includes(item.name)) items.push(item);
					});
				});
				this.state.menus.unshift({
					category: 'Favorites',
					items
				});
				this.setState({
					menus: this.state.menus
				});
			}
		});
	}

	componentWillReceiveProps(props) {
		// if (JSON.stringify(this.state.menus) == JSON.stringify(this.state.menus)) return false;
		this.setState({
			menus: props.productsList,
			hotelInfo: props.hotelInfo
		}, function() {
			let favs = this.state.menus.some((menu) => {
				return menu.category == 'Favorites';
			});
			if (!favs) this.addFavoritesCategory();
		});
	}

	render() {
		this.state.menus = this.props.productsList || [];
		// this.state.hotelInfo = this.props.hotelInfo || {};
		// let term = this.props.searchTerm;
		const categories = this.state.menus.map((cat, index) => {
			const listItems = cat.items.map((item, itemIndex) => {
				if (!item.quantity) item.quantity = 0;
				return (
					<div key={itemIndex} className="menu-item shadow">
						<div className="">
							<div className="inline-block" style={{ width: '75%' }}>
								<span className="fs-20 text-capitalize">{item.name}</span>
								<div className="itemDescription">{item.description}</div>
							</div>
							<div className="inline-block text-right" style={{ width: '25%' }}>
								<span className="fs-20"><i className="fa fa-inr"></i> {item.price}</span>
								<span>
									<div className="stepper-input">
										<a href="#" className="decrement" onClick={this.decrement.bind(this, item)}> – </a>
										<input
										type="number"
										className="quantity"
										value={item.quantity}
										onChange={this.feed.bind(this, item)}/>
										<a href="#" className="increment" onClick={this.increment.bind(this, item)}> + </a>
									</div>
								</span>
							</div>
						</div>
					</div>
				)
			});

			return (<div className="row" key={index}>
				<div className="col-md-12">
					<div onClick={(e) => this.togglePanel(e, index)} className='category text-capitalize' aria-expanded={cat.open} aria-controls="example-collapse-text">
						{cat.category}
					</div>
					<Collapse in={cat.open}>
						<div id="example-collapse-text">
							<div className="p-10">{listItems}</div>
						</div>
					</Collapse>
				</div>
			</div>)
		});
		return (
			<div className="menus-wrapper">
				<div className="brand">
					<img
						className="logo"
						src={logo}		//will be replaced by {this.state.hotelInfo.hotel_logo_link}
						alt={this.state.hotelInfo.hotel_name}
						/>
				</div>
				<div className="text-center fs-18 mb-10">
					{this.state.hotelInfo.hotel_name}
				</div>
				<Tabs
					id="controlled-tab-example"
					activeKey={this.state.activeTab}
					variant="tabs"
					style={{justifyContent: 'center'}}
					onSelect={(k) => this.setKey(k)}>
					<Tab eventKey="menus" title="Our Menus">
					{
						this.state.activeTab === 'menus' && this.state.menus.length > 0 ?
							(<div className="mt-10">{categories}</div>)
							:
							(<div className="p-10 text-center"><h4>No menus to display</h4></div>)
					}
					</Tab>
					<Tab eventKey="orders" title="Your Orders">
						{
							this.state.activeTab === 'orders' &&
							<Orders />
						}
					</Tab>
				</Tabs>
			</div>
		);
	}
}

export default Products;
