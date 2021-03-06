import React, { Component } from "react";
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { getItem, setItem } from '../lib/myStore';
import { startLoader, stopLoader } from "../lib/utils";
import EditMenuModal from './modals/EditMenuModal';
import EditCategoryModal from './modals/EditCategoryModal';
import { withRouter } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

class MyMenus extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menus: [],
			isEditMenu: false,
			selectedItem: {},
			selectedCategory: {},
			itemModalTitle: '',
			categoryModalTitle: ''
		};
	}

	getMenus() {
		startLoader();
		let url = "https://us-central1-easymenuspro.cloudfunctions.net/GetMenu";
		axios.post(url, { H_ID: getItem('hotelId') }, {
			headers: {
				'Content-Type': 'text/plain'
			}
		}).then(response => {
			if (!response.data.Status) {
				console.warn(response.data.Data);
				this.setState({ menus: [] });
				stopLoader();
				return;
			}

			this.setState({
				menus: this.addIDs(response.data.Data.menu),
				hotelInfo: {
					hotel_name: response.data.Data.hotel_name,
					hotel_logo_link: response.data.Data.logoLink
				},
				isOrderEnabled: response.data.Data.isOrderEnabled
			}, () => {
				setItem('isOrderEnabled', response.data.Data.isOrderEnabled);
				stopLoader();
			});
		});
	}

	addIDs(menus) {
		menus.map((menu) => {
			if (!menu.id) menu.id = uuidv4();
			menu.items.map((item) => {
				if (!item.id) item.id = uuidv4();
			});
		});
		return menus;
	}

	togglePanel(e, $index) {
		this.state.menus.map((menu, index) => {
			if (index === $index) menu.open = !menu.open;
			else menu.open = false;
		});
		this.setState({ menus: this.state.menus });
	}

	deleteCategory(index, e) {
		let catToDelete = this.state.menus[index];
		e.preventDefault();
		e.stopPropagation();
		let cnf = window.confirm(`Do you want to delete ${catToDelete.category} category? This will delete all items under this category.`);
		if (!cnf) return false;
		//on success-
		this.state.menus.splice(index, 1);
		this.setState({ menus: this.state.menus });
		this.updateMenu();
	}

	openCategoryModal(categoryIndex, e) {
		e.preventDefault();
		e.stopPropagation();
		if (categoryIndex == -1) {
			this.setState({ selectedCategory: {}, isEditCategory: true, categoryModalTitle: 'Add Category' });
		}
		if (categoryIndex >= 0) {
			let selectedCategory = Object.assign({}, this.state.menus[categoryIndex]);
			selectedCategory.categoryIndex = categoryIndex;
			this.setState({ selectedCategory, isEditCategory: true, categoryModalTitle: 'Edit Category' });
		}
	}

	editMenuItem(item, categoryIndex, e) {
		let selectedItem = Object.assign({}, item);
		selectedItem.categoryIndex = categoryIndex;
		this.setState({ isEditMenu: true, selectedItem, itemModalTitle: 'Edit Item' });
	}

	deleteMenuItem(itemIndex, categoryIndex, e) {
		if (this.state.menus[categoryIndex].items.length === 1) {
			console.log('1 left');
			this.state.menus.splice(categoryIndex, 1);
		} else {
			this.state.menus[categoryIndex].items.splice(itemIndex, 1);
		}
		this.updateMenu();
	}

	addNewItem(categoryIndex, e) {
		e.preventDefault();
		e.stopPropagation();
		let selectedItem = {};
		selectedItem.categoryIndex = categoryIndex;
		this.setState({ isEditMenu: true, selectedItem, itemModalTitle: 'Add Item' });
	}

	setModalShow(bool) {
		this.setState({ isEditMenu: bool, isEditCategory: bool });
	}

	handleItemSubmit(changedItem, e) {
		e.preventDefault();
		this.state.selectedItem = Object.assign({}, changedItem);
		if (!this.state.selectedItem.description) this.state.selectedItem.description = "";
		let catIndex = this.state.selectedItem.categoryIndex;
		let itemIndex = this.state.menus[catIndex].items.findIndex(x => x.id == this.state.selectedItem.id);
		if (this.state.selectedItem.id) {
			this.state.menus[catIndex].items[itemIndex] = this.state.selectedItem;
		} else {
			this.state.menus[catIndex].items.push(this.state.selectedItem);
		}
		this.setState({ menus: this.state.menus, isEditMenu: false });
		this.updateMenu();
	}

	handleCategorySubmit(changedCategory, e) {
		e.preventDefault();
		this.state.selectedCategory = Object.assign({}, changedCategory);
		if (this.state.selectedCategory.id) {
			this.state.menus[this.state.selectedCategory.categoryIndex] = this.state.selectedCategory;
		} else {
			if (!this.state.selectedCategory.items) this.state.selectedCategory.items = [];
			this.state.menus.push(this.state.selectedCategory);
		}
		this.setState({ menus: this.state.menus, isEditCategory: false });
		this.updateMenu();
	}

	updateMenu() {
		startLoader();
		let payload = {
			H_ID: getItem('hotelId'),
			menu: this.state.menus
		};
		axios.post('https://us-central1-easymenuspro.cloudfunctions.net/UpdateMenu', payload, {
			headers: {
				'Content-Type': 'text/plain'
			}
		}).then(response => {
			// if (response.data.Data && response.data.Data.menu) {
			// 	this.setState({ menus: response.data.Data.menu });
			// }
			this.setState({ menus: this.addIDs(this.state.menus) });
			stopLoader();
		}).catch(error => {
			console.error(error);
			stopLoader();
		})
	}

	componentWillMount() {
		if (!Object.keys(getItem('hotelId')).length) {
			alert('Please Sign in first.');
			this.props.history.push("/mgmt/login");
			return;
		}
		this.getMenus();
	}

	render() {
		const categories = this.state.menus.map((cat, index) => {
			const listItems = cat.items.map((item, itemIndex) => {
				return (
					<div key={itemIndex} className="menu-item">
						<div className="">
							<div className="inline-block vertical-align-top" style={{ width: '80%' }}>
								<span className="text-capitalize mr-10">{item.name}</span>
								{/* <span className="itemDescription">{item.description}</span> */}
								(<span className="fs-18"><i className="fa fa-inr"></i> {item.price}</span>)
							</div>
							<div className="inline-block text-right" style={{ width: '20%' }}>
								<Button size="sm" variant="default">
									<i className="text-success fa fa-edit" onClick={this.editMenuItem.bind(this, item, index)}></i>
								</Button>
								<Button size="sm" variant="default">
									<i className="text-danger fa fa-trash" onClick={this.deleteMenuItem.bind(this, itemIndex, index)}></i>
								</Button>
							</div>
						</div>
					</div>
				)
			});

			return (<div className="row" key={index}>
				<div className="col-md-12">
					<div onClick={(e) => this.togglePanel(e, index)} className='category text-capitalize' aria-expanded={cat.open} aria-controls="example-collapse-text">
						<div className="inline-block" style={{ width: '50%' }}>
							<span>{cat.category}</span>
						</div>
						<div className="inline-block text-right" style={{ width: '50%' }}>
							<Button size="sm" variant="warning" className="mr-3" onClick={this.openCategoryModal.bind(this, index)}>
								<i className="fa fa-edit"></i>
							</Button>
							<Button size="sm" variant="warning" className="mr-3" onClick={this.addNewItem.bind(this, index)}>
								<i className="fa fa-plus"></i>
							</Button>
							<Button size="sm" variant="danger" className="" onClick={this.deleteCategory.bind(this, index)}>
								<i className="fa fa-trash-o"></i>
							</Button>
						</div>
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
			<div className="container">
				<div className="row">
					<div className="col-md-12 p-0 overflow-x-hidden">
						{
							this.state.menus.length <= 0 &&
							<div className="text-center mt-10">
								<h5>No menus to display.</h5>
							</div>
						}
						<div className="text-right p-10">
							<Button variant="warning" size="sm" onClick={this.openCategoryModal.bind(this, -1)}>
								<i className="fa fa-plus"></i>&nbsp;Add Category
							</Button>
						</div>
						{
							this.state.menus.length > 0 &&
							<div>{categories}</div>
						}
					</div>
				</div>

				{
					this.state.isEditMenu &&
					<EditMenuModal
						selecteditem={this.state.selectedItem}
						show={this.state.isEditMenu}
						onSubmit={(changedItem) => this.handleItemSubmit.bind(this, changedItem)}
						handleclose={() => this.setModalShow(false)}
						modalTitle={this.state.itemModalTitle}
					/>
				}

				{
					this.state.isEditCategory &&
					<EditCategoryModal
						selecteditem={this.state.selectedCategory}
						show={this.state.isEditCategory}
						onSubmit={(changedItem) => this.handleCategorySubmit.bind(this, changedItem)}
						handleclose={() => this.setModalShow(false)}
						modalTitle={this.state.categoryModalTitle}
					/>
				}

			</div>
		);
	}
}

export default withRouter(MyMenus);
