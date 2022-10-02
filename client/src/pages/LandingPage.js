import { Button } from "@mui/material";
import { Stack } from "@mui/system";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";

function LandingPage() {
	return (
		<div className="landing-main">
			<div className="landing-intro">
				<h1>Hello, Welcome to Link!</h1>
				<h2>Link is a server channel application that connects friends and family.</h2>
			</div>
			<div className="landing-actions">
				<Stack spacing={2} direction="row" justifyContent={"center"}>
					<Button variant="contained" component={Link} to="/login">
						Login
					</Button>
					<Button variant="contained" component={Link} to="/register">
						Register
					</Button>
				</Stack>
			</div>
			<div className="landing-content">
				<p>This app was built using React, Node, Express, Axios, MySQL, Socket.IO</p>
			</div>
		</div>
	);
}

export default LandingPage;
