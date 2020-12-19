import React, { Component } from "react";
import CartScrollBar from "./CartScrollBar";
import EmptyCart from "../empty-states/EmptyCart";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import axios from 'axios';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCart: false,
      cart: this.props.cartItems,
      mobileSearch: false,
      searchBox: ''
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
		let payload = {
			"H_ID": localStorage.getItem('hotelId'),
			"table_id": localStorage.getItem('tableId'),
			"order": this.state.cart
    };
		axios.post('https://us-central1-easymenuspro.cloudfunctions.net/PlaceOrder', payload, {
			headers: {
				'Content-Type': 'text/plain'
			}
		}).then((response) => {
			this.setState({cart: []});
      alert('ORDER PLACED !');
      this.props.clearCart();
		}).catch((error) => {
			console.error(error);
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
            onClick={this.props.removeProduct.bind(this, product.name)}
          >
            ×
          </a>
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
          <div className="search">
            {/* <a
              className="mobile-search"
              href="#"
              onClick={this.handleMobileSearch.bind(this)}>
              <i className="fa fa-search"></i>
            </a>
            <form
              action="#"
              method="get"
              className={
                this.state.mobileSearch ? "search-form active" : "search-form"
              }>
              <a
                className="back-button"
                href="#"
                onClick={this.handleSearchNav.bind(this)}>
                <i className="fa fa-arrow-left"></i>
              </a>
              <input
                type="search"
                value={this.state.searchBox}
                placeholder="Search for Dish"
                className="search-keyword"
                onChange={this.props.handleSearch}
              />
              <Button className="search-button" variant="warning" onClick={this.handleSubmit.bind(this)}></Button>
            </form> */}
            <InputGroup>
              <FormControl placeholder="Search for Dish..." aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
              <InputGroup.Append>
                <InputGroup.Text id="inputGroup-sizing-sm" className="p-3 bg-warning">
                <Button className="fa fa-search" variant="default" onClick={this.handleSubmit.bind(this)}></Button>
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </div>

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
              <Button variant="warning fs-14">Place Order</Button>
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
                <Button variant="warning" className={this.state.cart.length > 0 ? " " : "disabled"} onClick={this.placeOrder.bind(this)}>PLACE ORDER</Button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
