import React, { Component } from "react";
import axios from "axios";
import MgmtHeader from "./MgmtHeader";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';

class SignUp extends Component {
	constructor() {
		super();
		this.state = {
			fields: {
				"hotel_name": "",
				"owner_name": "",
				"password": "",
				"username": "",
				"contactNo": "",
				"logo": "",
				"email": "",
				"city": "",
				"isOrderEnabled": false
			},
			errors: {}
		};
	}

	handleChange(field, e) {
		let fields = this.state.fields;
		fields[field] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
		this.setState({ fields });
	}

	handleSubmit(e) {
		e.preventDefault();
		let payload = Object.assign({}, this.state.fields);
		payload.isOrderEnabled = this.state.fields.isOrderEnabled ? '1' : '0';
		axios.post("https://us-central1-easymenuspro.cloudfunctions.net/Signup", payload, {
			headers: {
				'Content-Type': 'text/plain'
			}
		}).then(response => {
			if (response.data.Status) {
				alert(response.data.Data);
				this.props.history.push("/mgmt/login");
			}
		}).catch(error => {
			console.error(error);
		});
	}

	render() {
		return (<div>
			<MgmtHeader />
			<div className='signup-form container-fluid'>
				<div className="row mt-20">
					<div className="col-md-12">
						<h5>Create account for your hotel</h5>
					</div>
				</div>
				<div className="row mt-20">
					<div className="col-md-12">
						<Form onSubmit={this.handleSubmit.bind(this)}>
							<Form.Group controlId="hotel_name">
								{/* <Form.Label>Hotel Name</Form.Label> */}
								<Form.Control type="text" placeholder="Enter Hotel Name" required value={this.state.fields.hotel_name} onChange={this.handleChange.bind(this, 'hotel_name')} />
							</Form.Group>

							<Form.Group controlId="owner_name">
								{/* <Form.Label>Owner Name</Form.Label> */}
								<Form.Control type="text" placeholder="Enter Owner Name" required value={this.state.fields.owner_name} onChange={this.handleChange.bind(this, 'owner_name')} />
							</Form.Group>

							<Form.Group controlId="email">
								{/* <Form.Label>Email address</Form.Label> */}
								<Form.Control type="email" placeholder="Enter Email" required value={this.state.fields.email} onChange={this.handleChange.bind(this, 'email')} />
							</Form.Group>

							<Form.Group controlId="username">
								{/* <Form.Label>Username</Form.Label> */}
								<Form.Control type="text" maxLength="20" placeholder="Enter Username" required value={this.state.fields.username} onChange={this.handleChange.bind(this, 'username')} />
								<Form.Text className="text-muted">
									Username will be used as hotel ID.
								</Form.Text>
							</Form.Group>

							<Form.Group controlId="password">
								{/* <Form.Label>Password</Form.Label> */}
								<Form.Control type="password" placeholder="Password" minLength="6" required value={this.state.fields.password} onChange={this.handleChange.bind(this, 'password')} />
								<Form.Text className="text-muted">
									Min. length of password should be 6 characters.
								</Form.Text>
							</Form.Group>

							<Form.Group controlId="contactNo">
								{/* <Form.Label>Contact Number</Form.Label> */}
								<Form.Control type="number" placeholder="Enter Phone" required value={this.state.fields.contactNo} onChange={this.handleChange.bind(this, 'contactNo')} />
							</Form.Group>

							<Form.Group controlId="logo">
								{/* <Form.Label>Logo link</Form.Label> */}
								<Form.Control type="url" placeholder="Enter link to hotel logo" required value={this.state.fields.logo} onChange={this.handleChange.bind(this, 'logo')} />
							</Form.Group>

							<Form.Group controlId="city">
								{/* <Form.Label>City</Form.Label> */}
								<Form.Control type="text" placeholder="Enter City" required value={this.state.fields.city} onChange={this.handleChange.bind(this, 'city')} />
							</Form.Group>

							<Form.Group controlId="isOrderEnabled">
								<Form.Check type="checkbox" label="Accepting orders" checked={this.state.fields.isOrderEnabled} onChange={this.handleChange.bind(this, 'isOrderEnabled')} />
							</Form.Group>

							<div className="text-center mt-10">
								<Button variant="warning" type="submit">
									Sign me Up
								</Button>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</div>);
	}
}

export default withRouter(SignUp);