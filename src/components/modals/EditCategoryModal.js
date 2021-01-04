import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class EditCategoryModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: this.props.selecteditem || { category: '' }
        };
    }

    handleChange(field, e) {
        let selectedCategory = this.state.selectedCategory;
        selectedCategory[field] = e.target.value;
        this.setState({ selectedCategory });
    }

    componentDidMount() {
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
                <form className="modalForm" onSubmit={this.props.onSubmit(this.state.selectedCategory)}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-sm-12 col-md-12">
                                <label>Category name</label>
                                <input required placeholder="Enter category name" className="form-control" type="text" value={this.state.selectedCategory.category} onChange={this.handleChange.bind(this, 'category')}></input>
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