import React, { Component } from "react";
import Counter from "./Counter";

class Product extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedProduct: {},
			quickViewProduct: {},
			isAdded: false
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

	render() {
		let image = this.props.image;
		let name = this.props.name;
		let price = this.props.price;
		let id = this.props.id;
		let quantity = this.props.productQuantity;
		// return (
		//   <div className="row">
		//     <div className="col-md-12">
		//     <h4 className="product-name">{this.props.name}</h4>
		//     <p className="product-price">{this.props.price}</p>
		//     <Counter
		//       productQuantity={quantity}
		//       updateQuantity={this.props.updateQuantity}
		//       resetQuantity={this.resetQuantity}
		//     />
		//     <div className="product-action">
		//       <button
		//         className={!this.state.isAdded ? "" : "added"}
		//         type="button"
		//         onClick={this.addToCart.bind(
		//           this,
		//           image,
		//           name,
		//           price,
		//           id,
		//           quantity
		//         )}
		//       >
		//         {!this.state.isAdded ? "ADD TO CART" : "✔ ADDED"}
		//       </button>
		//     </div>
		//     </div>
		//   </div>
		// );
		return (
			<div className="row">
				<div className="col-md-12">
					<div onClick={(e) => this.togglePanel(e)} className='header'>
						{this.props.title}</div>
					{this.state.open ? (
						<div className='content'>
							{this.props.children}
						</div>
					) : null}
				</div>
			</div>
		);
	}
}

export default Product;
