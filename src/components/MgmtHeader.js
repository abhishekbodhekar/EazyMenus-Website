import React from "react";
import fudozLogo from '../assets/img/fudoz.jpeg';
import Button from 'react-bootstrap/Button';
import { removeAll } from '../lib/myStore';
import { withRouter } from 'react-router-dom';

const MgmtHeader = props => {
	function logout(e) {
		e.preventDefault();
		removeAll();
		props.history.push('/mgmt/login');
	}

	return (
		<header>
			<div className="container">
				<div className="inline-block text-left" style={{ width: '100%' }}>
					<img src={fudozLogo} alt="fudoz logo" style={{ height: '55px' }}></img>
				</div>
				{
					(window.location.pathname !== '/mgmt/login' && window.location.pathname !== '/mgmt/signup') &&
					<a
						className="cart-icon mr-20"
						href="#"
					>
						<Button variant="warning" className="fs-12 vertical-align-top" onClick={logout.bind(this)}>Logout</Button>
					</a>
				}
			</div>
		</header>
	);
};

export default withRouter(MgmtHeader);
