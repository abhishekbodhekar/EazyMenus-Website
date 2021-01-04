import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class EditMenuModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItem: this.props.selecteditem || {}
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
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                dialogClassName="mobile-modal"
                scrollable="true"
                show={this.props.show}
            >
                <Modal.Header closeButton onHide={this.props.handleclose}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.modalTitle}
                    </Modal.Title>
                </Modal.Header>
                <form className="modalForm">
                    <Modal.Body>
                        <div className="row">
                            <div className="col-sm-12 col-md-12">
                                <label>Item name</label>
                                <input required className="form-control" type="text" value={this.state.selectedItem.name} onChange={this.handleChange.bind(this, 'name')}></input>
                                <label>Item price</label>
                                <input required className="form-control" type="number" value={this.state.selectedItem.price} onChange={this.handleChange.bind(this, 'price')}></input>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {/* <Button onClick={this.props.onHide}>Close</Button> */}
                        <Button type="submit" onClick={this.props.onSubmit(this.state.selectedItem)}>Save</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export default EditMenuModal;