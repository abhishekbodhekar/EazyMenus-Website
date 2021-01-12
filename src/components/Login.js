import React, { Component } from "react";
import axios from "axios";
import MgmtHeader from "./MgmtHeader";
import { setItem } from '../lib/myStore';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, withRouter } from 'react-router-dom';
import { startLoader, stopLoader } from "../lib/utils";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            fields: {
                "username": "",
                "password": ""
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
        startLoader();
        e.preventDefault();
        let payload = Object.assign({}, this.state.fields);
        axios.post("https://us-central1-easymenuspro.cloudfunctions.net/Signin", payload, {
            headers: {
                'Content-Type': 'text/plain'
            }
        }).then(response => {
            if (!response.data.Status) {
                alert(response.data.Data);
            } else {
                setItem('hotelId', this.state.fields.username);
                this.props.history.push("/mgmt/myhotel");
            }
            stopLoader();
        }).catch(error => {
            console.error(error);
            stopLoader();
        })
    }

    render() {
        return (<div>
            <MgmtHeader />
            <div className='signup-form container-fluid'>
                {/* <div className="row mt-20">
                    <div className="col-md-12">
                        <h5>Sign In</h5>
                    </div>
                </div> */}
                <div className="row mt-20">
                    <div className="col-md-12">
                        <Form onSubmit={this.handleSubmit.bind(this)}>
                            <Form.Group controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" className="text-lowercase" type="text" maxLength="20" placeholder="Enter Username" required value={this.state.fields.username} onChange={this.handleChange.bind(this, 'username')} />
                                <Form.Text className="text-muted">
                                    Username is your hotel ID.
								</Form.Text>
                            </Form.Group>

                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" minLength="6" required value={this.state.fields.password} onChange={this.handleChange.bind(this, 'password')} />
                            </Form.Group>

                            <div className="text-center mt-10">
                                <Button variant="warning" type="submit">
                                    Log In
								</Button>
                            </div>
                            <div className="text-center mt-10 fs-14">
                                New User? <Link to="/mgmt/signup">Click here for Signup</Link>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default withRouter(Login);