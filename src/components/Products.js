import React, { Component } from "react";
import Product from "./Product";
import LoadingProducts from "../loaders/Products";
import NoResults from "../empty-states/NoResults";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import Collapse from 'react-bootstrap/Collapse';

class Products extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menus: []
		};
	}
	togglePanel(e, $index) {
		this.state.menus.map((menu, index) => {
			if (index === $index) menu.open = true;
			else menu.open = false;
		});
		this.setState({ menus: this.state.menus });
	}
	render() {
		this.state.menus = this.props.productsList;
		let term = this.props.searchTerm;
		console.log(this.state.menus);
		const categories = this.state.menus.map((cat, index) => {
			const listItems = cat.items.map((item) => <div key={item.name} className="itemName shadow">
				<div><span>{item.name}</span>
					<span className="pull-right">Rs. {item.price}</span></div>
				<div className="itemDescription">{item.description}</div>
			</div>);
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
			<div className="menus-wrapper">{categories}</div>
		);
	}
}

export default Products;
