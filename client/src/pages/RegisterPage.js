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
			<Link color="inherit" href="https://mui.com/">
				bsalinassanchez
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const theme = createTheme();

export default function RegisterPage() {
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		if (
			//check if any of the data is null or empty
			data.get("firstName") === "" ||
			data.get("lastName") === "" ||
			data.get("email") === "" ||
			data.get("password") === ""
		) {
			//if empty, log error
			setError(true);
			console.log("one of the inputs was empty");
		} else {
			//check if email is already part of a user-acc
			Axios.post("http://localhost:3001/check-email", {
				email: data.get("email"),
			}).then((response) => {
				//if query/database/error
				if (response.data.err) {
					console.log("error looking up user");
				}
				//if user found
				if (response.data.registerStatus === false) {
					//throw error that email is already in use
					console.log("email is already in use");
				}
				//if multiple users found
				if (response.data.error) {
					console.log("system error, multiple users found!!!");
				}
				//if no users found, register the user
				if (response.data.registerStatus === true) {
					console.log("user succesfully registered!");
					//add user to database
					Axios.post("http://localhost:3001/register", {
						first: data.get("firstName"),
						last: data.get("lastName"),
						email: data.get("email"),
						password: data.get("password"),
					}).then((response) => {
						//if successfull, set success to true
						setSuccess(true);
						//redirect to login page after successful registration
						navigate("/login");
					});
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
						Sign up
					</Typography>
					<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="given-name"
									name="firstName"
									required
									fullWidth
									id="firstName"
									label="First Name"
									autoFocus
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="family-name"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="new-password"
								/>
							</Grid>
						</Grid>
						<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
							Sign Up
						</Button>
						<Button variant="contained" fullWidth sx={{ mt: 0, mb: 1 }} component={LinkBR} to="/">
							GO BACK HOME
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link href="#" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Copyright sx={{ mt: 5 }} />
			</Container>
		</ThemeProvider>
	);
}
