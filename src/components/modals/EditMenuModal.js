import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

class EditMenuModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItem: this.props.selecteditem || { name: '', price: '', description: '' }
        };
    }

    handleChange(field, e) {
        let selectedItem = this.state.selectedItem;
        selectedItem[field] = e.target.value;
        this.setState({ selectedItem });
    }

    render() {
        return (
            <Modal
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                scrollable={true}
                show={this.props.show}
            >
                <Modal.Header closeButton onHide={this.props.handleclose}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.modalTitle}
                    </Modal.Title>
                </Modal.Header>
                <form className="modalForm" onSubmit={this.props.onSubmit(this.state.selectedItem)}>
                    <Modal.Body style={{ maxHeight: '65vh' }}>
                        <div className="row">
                            <div className="col-sm-12 col-md-12">
                                <label>Item name&nbsp;<span className="text-danger">*</span></label>
                                <input placeholder="E.g. Paneer Chili, Veg Makhanwala" required={true} className="form-control" type="text" value={this.state.selectedItem.name || ''} onChange={this.handleChange.bind(this, 'name')}></input>
                                <label>Item price&nbsp;<span className="text-danger">*</span></label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text><i className="fa fa-inr"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl required={true} placeholder="Price per plate" type="number" value={this.state.selectedItem.price || ''} onChange={this.handleChange.bind(this, 'price')} />
                                </InputGroup>
                                <label>Description</label>
                                <textarea className="form-control" placeholder="Describe the item" value={this.state.selectedItem.description || ''} onChange={this.handleChange.bind(this, 'description')}></textarea>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {/* <Button onClick={this.props.onHide}>Close</Button> */}
                        <Button variant="success" type="submit">Save</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export default EditMenuModal;