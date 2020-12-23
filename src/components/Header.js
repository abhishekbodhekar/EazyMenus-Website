/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import CartScrollBar from "./CartScrollBar";
import EmptyCart from "../empty-states/EmptyCart";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import Button from 'react-bootstrap/Button';
// import InputGroup from 'react-bootstrap/InputGroup';
// import FormControl from 'react-bootstrap/FormControl';
import axios from 'axios';
import { getItem } from '../lib/myStore';
import { startLoader, stopLoader } from '../lib/utils';
import fudozLogo from '../assets/img/fudoz.jpeg';

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showCart: false,
			cart: this.props.cartItems,
			mobileSearch: false,
			searchBox: '',
			isOrderEnabled: getItem('isOrderEnabled')
		};
	}
	handleCart(e) {
		e.preventDefault();
		this.setState({
			showCart: !this.state.showCart
		});
	}
	handleSubmit(e) {
		e.preventDefault();
	}

	placeOrder() {
		if (!this.state.cart.length) return false;
		startLoader();
		let payload = {
			"H_ID": getItem('hotelId'),
			"table_id": getItem('tableId'),
			"order": this.state.cart
		};
		axios.post('https://us-central1-easymenuspro.cloudfunctions.net/PlaceOrder', payload, {
			headers: {
				'Content-Type': 'text/plain'
			}
		}).then((response) => {
			this.setState({ cart: [] });
			alert('ORDER PLACED !');
			this.props.orderPlaced();
			stopLoader();
		}).catch((error) => {
			console.error(error);
			stopLoader();
		});
	}

	handleMobileSearch(e) {
		e.preventDefault();
		this.setState({
			mobileSearch: true
		});
	}
	handleSearchNav(e) {
		e.preventDefault();
		this.setState(
			{
				mobileSearch: false
			},
			function () {
				this.state.searchBox = "";
				this.props.handleMobileSearch();
			}
		);
	}
	handleClickOutside(event) {
		this.setState({
			showCart: false
		});
	}
	componentDidMount() {
		document.addEventListener(
			"click",
			this.handleClickOutside.bind(this),
			true
		);
	}
	componentWillReceiveProps(props) {
		this.setState({ cart: props.cartItems });
	}
	componentWillUnmount() {
		document.removeEventListener(
			"click",
			this.handleClickOutside.bind(this),
			true
		);
	}
	render() {
		let cartItems;
		cartItems = this.state.cart.map(product => {
			return (
				<li className="cart-item" key={product.name}>
					{/* <img className="product-image" src={product.image} /> */}
					<div className="product-info">
						<p className="product-name text-capitalize">{product.name}</p>
						<p className="product-price">{product.price}</p>
					</div>
					<div className="product-info text-right">
						<p className="product-name">
							x {product.quantity}
						</p>
						<p className="product-price">{product.quantity * product.price}</p>
					</div>
					<a
						className="product-remove"
						href=""
						onClick={this.props.removeProduct.bind(this, product.name)}>×</a>
				</li>
			);
		});
		let view;
		if (cartItems.length <= 0) {
			view = <EmptyCart />;
		} else {
			view = (
				<div>
					<CSSTransitionGroup
						transitionName="fadeIn"
						transitionEnterTimeout={500}
						transitionLeaveTimeout={300}
						component="ul"
						className="cart-items">
						{cartItems}
						<div className="text-right total p-10 fs-24">Total :&nbsp;<i className="fa fa-inr"></i>&nbsp;{this.props.total}</div>
					</CSSTransitionGroup>
				</div>
			);
		}
		return (
			<header>
				<div className="container">
					{/* <div className="search">
						<InputGroup size="sm">
							<FormControl placeholder="Search for Dish..." aria-label="Small" className="fs-13" aria-describedby="inputGroup-sizing-sm" />
							<InputGroup.Append>
								<InputGroup.Text id="inputGroup-sizing-sm" className="p-0 bg-danger">
									<Button className="fa fa-search text-white" variant="default" onClick={this.handleSubmit.bind(this)}></Button>
								</InputGroup.Text>
							</InputGroup.Append>
						</InputGroup>
					</div> */}
					<div className={this.state.isOrderEnabled == '0' ? 'inline-block text-left' : 'inline-block text-left'} style={{ width: '50%' }}>
						<img src={fudozLogo} alt="fudoz logo" style={{ height: '55px', marginLeft: '1rem' }}></img>
					</div>

					{
						this.state.isOrderEnabled == '1' &&
						<div className="inline-block" style={{ width: '50%' }}>
							<div className="cart">
								<div className="cart-info">
									<table>
										<tbody>
											<tr>
												<td>No. of items</td>
												<td>:</td>
												<td>
													<strong>{this.props.totalItems}</strong>
												</td>
											</tr>
											<tr>
												<td>Sub Total</td>
												<td>:</td>
												<td>
													<strong>{this.props.total}</strong>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
								<a
									className="cart-icon"
									href="#"
									onClick={this.handleCart.bind(this)}
								>
									<Button variant="warning" disabled={this.state.isOrderEnabled == '0'} className="fs-12 vertical-align-top">Place Order</Button>
									{this.props.totalItems ? (
										<span className="cart-count">{this.props.totalItems}</span>
									) : (
											""
										)}
								</a>
								<div
									className={
										this.state.showCart ? "cart-preview active" : "cart-preview"
									}
								>
									<CartScrollBar>{view}</CartScrollBar>
									<div className="action-block">
										<Button variant="warning" disabled={this.state.cart.length <= 0 ? true : false} onClick={this.placeOrder.bind(this)}>PLACE ORDER</Button>
									</div>
								</div>
							</div>
						</div>
					}
				</div>
			</header>
		);
	}
}

export default Header;
