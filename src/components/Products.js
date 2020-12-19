/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable array-callback-return */
import React, { Component } from "react";
import Collapse from 'react-bootstrap/Collapse';
import Orders from "./Orders";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import logo from '../assets/img/hotel_logo.jpg';

class Products extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menus: [],
			activeTab: 'menus'
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

	componentWillReceiveProps(nextProps) {
		this.setState({ menus: nextProps.productsList });
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

	render() {
		this.state.menus = this.props.productsList || [];
		// let term = this.props.searchTerm;
		const categories = this.state.menus.map((cat, index) => {
			const listItems = cat.items.map((item) => {
				if (!item.quantity) item.quantity = 0;
				return (
					<div key={item.name} className="menu-item shadow">
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
						src={logo}
						alt="Hotel Ujwal Pure Veg"
						/>
				</div>
				<div className="text-center fs-18 mb-10">
					Hotel Ujwal Pure Veg
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
