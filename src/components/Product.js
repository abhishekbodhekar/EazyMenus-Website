import React, { Component } from "react";
import Collapse from 'react-bootstrap/Collapse';

class Product extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedProduct: {},
			quickViewProduct: {},
			isAdded: false,
			open: false
		};
	}
	addToCart(image, name, price, id, quantity) {
		this.setState(
			{
				selectedProduct: {
					image: image,
					name: name,
					price: price,
					id: id,
					quantity: quantity
				}
			},
			function () {
				this.props.addToCart(this.state.selectedProduct);
			}
		);
		this.setState(
			{
				isAdded: true
			},
			function () {
				setTimeout(() => {
					this.setState({
						isAdded: false,
						selectedProduct: {}
					});
				}, 3500);
			}
		);
	}

	togglePanel() {
		this.setState({
			open: !this.state.open
		});
	}

	render() {
		let category = this.props.category;
		let items = this.props.items;
		let id = this.props.id;
		const listItems = items.map((item) => <li key={item.name}>{item.name}</li>);
		return (
			<div className="row">
				<div className="col-md-12">
					<div onClick={(e) => this.togglePanel(e)} className='category' aria-expanded={this.state.open} aria-controls="example-collapse-text">
						{this.props.category}
					</div>
					<Collapse in={this.state.open}>
						<div id="example-collapse-text">
							{listItems}
						</div>
					</Collapse>
				</div>
			</div>
		);
	}
}

export default Product;
