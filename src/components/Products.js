/* eslint-disable array-callback-return */
import React, { Component } from "react";
import Collapse from 'react-bootstrap/Collapse';
import Counter from "./Counter";
import Orders from "./Orders";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

class Products extends Component {
	constructor(props) {
		super(props);
		this.counter = React.createRef();
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
	updateQuantity(item, qty) {
		item.quantity = qty;
		this.props.addToCart({
			name: item.name,
			price: item.price,
			quantity: item.quantity
		});
	}

	setKey(selectedTab) {
		this.setState({activeTab: selectedTab});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ menus: nextProps.productsList });
		this.counter.current && this.counter.current.resetQuantity();
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
								<span><Counter
									ref={this.counter}
									productQuantity={item.quantity}
									updateQuantity={this.updateQuantity.bind(this, item)}
									resetQuantity={this.resetQuantity}
								/></span>
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
				<Tabs
					id="controlled-tab-example"
					activeKey={this.state.activeTab}
					variant="tabs"
					style={{justifyContent: 'center'}}
					onSelect={(k) => this.setKey(k)}>
					<Tab eventKey="menus" title="Our Menus">
					{
							this.state.activeTab === 'menus' &&
						<div className="mt-10">{categories}</div>
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
