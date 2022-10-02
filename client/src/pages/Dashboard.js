import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "axios";
import DashboardActive from "../components/DashboardActive";

function Dashboard() {
	let { id } = useParams();
	const [username, setUsername] = useState(id);
	const [accountStatus, setAccountStatus] = useState(false);

	useEffect(() => {
		//onmount: check if user exists in database
		Axios.post("http://localhost:3001/check-email", {
			email: id,
		}).then((response) => {
			//if query/database/error
			if (response.data.err) {
				console.log("error looking up user");
			}
			//if user found
			if (response.data.registerStatus === false) {
				console.log("hit");
				setAccountStatus(true);
			}
			console.log(response);
		});
	}, []);

	return (
		<div>{accountStatus ? <DashboardActive username={username} /> : <h1>ERROR: no user</h1>}</div>
	);
}

export default Dashboard;
