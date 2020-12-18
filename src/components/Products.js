/* eslint-disable array-callback-return */
import React, { Component } from "react";
import Collapse from 'react-bootstrap/Collapse';
import Counter from "./Counter";
import Button from 'react-bootstrap/Button';
import axios from "axios";

class Products extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menus: []
		};
	}
	togglePanel(e, $index) {
		this.state.menus.map((menu, index) => {
			if (index === $index) menu.open = !menu.open;
			else menu.open = false;
		});
		this.setState({ menus: this.state.menus });
	}
	placeOrder() {
		let orders = [];
		this.state.menus.map((menu) => {
			menu.items.map((item) => {
				if (item.quantity) {
					orders.push({
						name: item.name,
						quantity: item.quantity
					});
				}
			});
		});
		let payload = {
			"H_ID": "sahil",
			"table_id": "2",
			"order": orders
		};
		axios.post('https://us-central1-easymenuspro.cloudfunctions.net/PlaceOrder', payload, {
			headers: {
				'Content-Type': 'text/plain'
			}
		}).then((response) => {
			console.log(response, 'success resp');
		}).catch((error) => {
			console.error(error);
		});
	}
	updateQuantity(item, qty) {
		item.quantity = qty;
		this.props.addToCart({
			name: item.name,
			price: item.price,
			quantity: item.quantity
		});
	}
	render() {
		this.state.menus = this.props.productsList;
		let term = this.props.searchTerm;
		const categories = this.state.menus.map((cat, index) => {

			const listItems = cat.items.map((item) => {
				if (!item.quantity) item.quantity = 0;
				return (
					<div key={item.name} className="menu-item shadow">
						<div className="">
							<div className="inline-block" style={{ width: '75%' }}>
								<span className="fs-20">{item.name}</span>
								<div className="itemDescription">{item.description}</div>
							</div>
							<div className="inline-block text-right" style={{ width: '25%' }}>
								<span className="fs-20"><i className="fa fa-inr"></i> {item.price}</span>
								<span><Counter
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
					<div onClick={(e) => this.togglePanel(e, index)} className='category' aria-expanded={cat.open} aria-controls="example-collapse-text">
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
			<div>
				<div className="menus-wrapper">{categories}</div>
				<div className="text-center mt-10">
					<Button variant="warning" onClick={this.placeOrder.bind(this)}>Place Order</Button>
				</div>
			</div>
		);
	}
}

export default Products;
