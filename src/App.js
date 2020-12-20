import React, { Component } from "react";
import axios from "axios";
import Header from "./components/Header";
import Products from "./components/Products";
import Footer from "./components/Footer";
import QuickView from "./components/QuickView";
import "./css/header.css";
import "./css/footer.css";
import "./css/modal.css";
import "./css/style.css";
import "./css/menu.css";
import "./css/orders.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      cart: [],
      totalItems: 0,
      totalAmount: 0,
      term: "",
      category: "",
      cartBounce: false,
      quantity: 0,
      quickViewProduct: {},
      modalActive: false,
      hotelInfo: {}
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleMobileSearch = this.handleMobileSearch.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.sumTotalItems = this.sumTotalItems.bind(this);
    this.sumTotalAmount = this.sumTotalAmount.bind(this);
    this.checkProduct = this.checkProduct.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.handleRemoveProduct = this.handleRemoveProduct.bind(this);
    this.handleClearCart = this.handleClearCart.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  // Fetch Initial Set of Products from external API
  getProducts() {
    
    let url = "https://us-central1-easymenuspro.cloudfunctions.net/GetMenu";
    axios.post(url, { H_ID: 'hotelujwal' }, {
			headers: {
				'Content-Type': 'text/plain'
			}
		}).then(response => {
      this.setState({
        products: response.data.Data.menu,
        hotelInfo: {
          hotel_name: response.data.Data.hotel_name,
          hotel_logo_link: response.data.Data.logoLink
        }
      });
    });

  }
  componentWillMount() {
    localStorage.setItem('tableId', "1");
    localStorage.setItem('hotelId', "sahilk");
      this.getProducts();
  }

  // Search by Keyword
  handleSearch(event) {
    this.setState({ term: event.target.value });
  }
  // Mobile Search Reset
  handleMobileSearch() {
    this.setState({ term: "" });
  }
  // Filter by Category
  handleCategory(event) {
    this.setState({ category: event.target.value });
    console.log(this.state.category);
  }
  // Add to Cart
  handleAddToCart(selectedProduct) {
    let cart = this.state.cart;

    let productName = selectedProduct.name;
    let productQty = selectedProduct.quantity;
    if (this.checkProduct(productName)) {
	  let index = cart.findIndex(x => x.name === productName);
	  if (productQty === 0) cart.splice(index, 1);
      else cart[index].quantity = Number(productQty);
      this.setState({
        cart
      });
    } else {
      cart.push(selectedProduct);
    }
    this.setState({
      cart: cart,
      cartBounce: true
      });
      setTimeout(function () {
        this.setState({
        cartBounce: false
        });
      }.bind(this), 1000);
    this.sumTotalItems(this.state.cart);
    this.sumTotalAmount(this.state.cart);
  }

  checkProduct(productName) {
    let cart = this.state.cart;
    return cart.some(function (item) {
      return item.name === productName;
    });
  }

  handleRemoveProduct(name, e) {
    let cart = this.state.cart;
    let index = cart.findIndex(x => x.name === name);
    cart.splice(index, 1);
    this.setState({
      cart: cart
    });

    let products = this.state.products;
    products.map((product) => {
      product.items.map((item) => {
        if (item.name === name) item.quantity = 0;
      });
    });
    this.setState({products});
    this.sumTotalItems(this.state.cart);
    this.sumTotalAmount(this.state.cart);
    e.preventDefault();
  }

  handleClearCart() {
    this.setState({cart: []});
    this.sumTotalItems(this.state.cart);
    this.sumTotalAmount(this.state.cart);
  }

  sumTotalItems() {
    let total = 0;
    let cart = this.state.cart;
    total = cart.length;
    this.setState({
      totalItems: total
    });
  }
  sumTotalAmount() {
    let total = 0;
    let cart = this.state.cart;
    for (var i = 0; i < cart.length; i++) {
      total += cart[i].price * parseInt(cart[i].quantity);
    }
    this.setState({
      totalAmount: total
    });
  }

  //Reset Quantity
  updateQuantity(qty) {
    this.setState({
      quantity: qty
    });
  }
  // Open Modal
  openModal(product) {
    this.setState({
      quickViewProduct: product,
      modalActive: true
    });
  }
  // Close Modal
  closeModal() {
    this.setState({
      modalActive: false
    });
  }

  render() {
    return (
      <div className="container-fluid p-0 overflow-hidden">
        <Header
          cartBounce={this.state.cartBounce}
          total={this.state.totalAmount}
          totalItems={this.state.totalItems}
          cartItems={this.state.cart}
          removeProduct={this.handleRemoveProduct}
          clearCart={this.handleClearCart}
          handleSearch={this.handleSearch}
          handleMobileSearch={this.handleMobileSearch}
          handleCategory={this.handleCategory}
          categoryTerm={this.state.category}
          updateQuantity={this.updateQuantity}
          productQuantity={this.state.moq}
        />
        <Products
          productsList={this.state.products}
          searchTerm={this.state.term}
          addToCart={this.handleAddToCart}
          productQuantity={this.state.quantity}
          updateQuantity={this.updateQuantity}
          openModal={this.openModal}
          hotelInfo={this.state.hotelInfo}
        />
        {/* <Footer /> */}
      </div>
    );
  }
}

export default App;
