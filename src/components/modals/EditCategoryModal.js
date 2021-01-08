import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table'

class EditCategoryModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: this.props.selecteditem
        };
    }

    handleChange(field, e) {
        let selectedCategory = this.state.selectedCategory;
        selectedCategory[field] = e.target.value;
        this.setState({ selectedCategory });
    }

    handleItemChange(index, field, e) {
        let selectedItem = this.state.selectedCategory.items[index];
        selectedItem[field] = e.target.value;
        this.setState({ selectedCategory: this.state.selectedCategory });
    }

    addNewItem() {
        this.state.selectedCategory.items.push({ name: '', price: 0, description: '' });
        this.setState({ selectedCategory: this.state.selectedCategory });
    }

    removeItem() {
        this.state.selectedCategory.items.splice(this.state.selectedCategory.items.length - 1, 1);
        this.setState({ selectedCategory: this.state.selectedCategory });
    }

    componentDidMount() {
        if (!this.state.selectedCategory.items) {
            this.state.selectedCategory.items = [{ name: '', price: 0, description: '' }]
            this.setState({ selectedCategory: this.state.selectedCategory });
        }
    }

    render() {
        let tbody = this.state.selectedCategory.items && this.state.selectedCategory.items.map((item, index) => {
            return (<tbody key={index}>
                <tr>
                    <td>
                        <input required type="text" value={item.name} placeholder="Item name" className="form-control" onChange={this.handleItemChange.bind(this, index, 'name')}></input>
                    </td>
                    <td>
                        <input required type="number" value={item.price} placeholder="Rs." className="form-control" onChange={this.handleItemChange.bind(this, index, 'price')}></input>
                    </td>
                    <td>
                        <textarea rows="1" type="text" value={item.description} placeholder="Description" className="form-control" onChange={this.handleItemChange.bind(this, index, 'description')}></textarea>
                    </td>
                </tr>
            </tbody>);
        });
        return (
            <Modal
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                scrollable="true"
                show={this.props.show}
            >
                <Modal.Header closeButton onHide={this.props.handleclose}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.modalTitle}
                    </Modal.Title>
                </Modal.Header>
                <form className="modalForm" onSubmit={this.props.onSubmit(this.state.selectedCategory)}>
                    <Modal.Body style={{ maxHeight: '65vh' }}>
                        <div className="row">
                            <div className="col-sm-12 col-md-12">
                                <label>Category name<span className="text-danger">*</span></label>
                                <input autoFocus required placeholder="Enter category name" className="form-control" type="text" value={this.state.selectedCategory.category || ''} onChange={this.handleChange.bind(this, 'category')}></input>
                            </div>
                        </div>
                        <div className="row mt-20">
                            <div className="col-sm-12 col-md-12">
                                <label>Items</label>
                                <Table responsive bordered size="sm">
                                    <thead style={{ backgroundColor: '#eee' }}>
                                        <tr>
                                            <th width="40%" className="text-left">Name<span className="text-danger">*</span></th>
                                            <th width="20%" className="text-left">Price<span className="text-danger">*</span></th>
                                            <th width="40%" className="text-left">Description</th>
                                        </tr>
                                    </thead>
                                    {tbody}
                                </Table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 col-sm-12 text-right">
                                <Button disabled={this.state.selectedCategory.items.length == 1} variant="warning mr-3" size="sm" type="button" onClick={this.removeItem.bind(this)}>
                                    <i className="fa fa-minus"></i>
                                </Button>
                                <Button variant="warning" size="sm" type="button" onClick={this.addNewItem.bind(this)}>
                                    <i className="fa fa-plus"></i>
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {/* <Button onClick={this.props.onHide}>Close</Button> */}
                        <Button type="submit">Save</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export default EditCategoryModal;