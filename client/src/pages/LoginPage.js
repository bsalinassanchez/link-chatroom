import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as LinkBR, useNavigate } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";

function Copyright(props) {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{"Copyright © "}
			<Link color="inherit" href="https://bsalinassanchez.github.io/algorithm-visualizer">
				bsalinassanchez
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const theme = createTheme();

export default function LoginPage() {
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();
		//get form data into an object format
		const data = new FormData(event.currentTarget);
		if (data.get("email") === "" || data.get("password") === "") {
			//if fields are empty setError
			setError(true);
			console.log("one of the login fields was empty");
		} else {
			// request if user exists
			Axios.post("http://localhost:3001/login", {
				//send users info to see if they exist
				email: data.get("email"),
				password: data.get("password"),
			}).then((response) => {
				//if query/database/error
				if (response.data.err) {
					console.log("database error!!!");
				}
				//if successful login
				if (response.data.loginStatus === true) {
					//throw success onto screen
					console.log("login succesfull");
					//redirect to dashboard
					navigate(`/dashboard/${data.get("email")}`, { replace: true });
				}
				//if unsuccessful login
				if (response.data.loginStatus === false) {
					//throw error onto screen, wrong email and/or password
					console.log("wrong email/password combination");
				}
				//if too many users
				if (response.data.error) {
					console.log("system error, more than one user found");
				}
			});
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>

						<Button
							type="submit"
							//component={LinkBR}
							//to="/"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 1 }}
						>
							Sign In
						</Button>
						<Button variant="contained" fullWidth sx={{ mb: 1 }} component={LinkBR} to="/">
							GO BACK HOME
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</ThemeProvider>
	);
}
