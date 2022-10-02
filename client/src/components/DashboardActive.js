import "../styles/DashboardActive.css";
import io from "socket.io-client";
import React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { TextField } from "@mui/material";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const socket = io.connect("http://localhost:3002");

function DashboardActive(props) {
	//setting up current date/time
	const [time, setTime] = useState("");

	//setting up socket username
	socket.username = props.username;
	//state that keeps track of what room a user is in
	const [room, setRoom] = useState("");
	//state that keeps tracks of rooms that user is active in
	const [rooms, setRooms] = useState(["Programming", "Music", "Games"]);
	//state that keeps tracks of the users/friends that root user has
	const [friends, setFriends] = useState(["Arman", "Diego", "Juan", "Isaac", "Sean"]);

	//state that keeps track of the number/usernames of users in a particular room
	const [users, setUsers] = useState([]);

	//message logs
	const [messageLogs, setMessageLogs] = useState([]);

	//tabs value/what tab is currently active
	const [value, setValue] = React.useState("1");

	//tabs handlechange
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	setInterval(async () => {
		let date = new Date();
		await setTime(date.toLocaleString("en-US"));
	}, 1000);

	const joinRoom = (value) => {
		if (value !== "") {
			//check to leave current room, else join room
			if (room === "") {
				//value = room-name, username = username
				socket.emit("join_room", { value, username: socket.username });
				//join room of particular namec
				setRoom(value);
				//update user list of the current room
				//setUsers((list) => [...list, props.username]);
			} else {
				if (room !== value) {
					//leave current room
					socket.emit("leave_room", { room, username: socket.username });
					//join new room
					socket.emit("join_room", { value, username: socket.username });
					setRoom(value);
				}
			}
		}
	};

	const sendMessage = (message) => {
		setMessageLogs((list) => [
			...list,
			<TextField
				key={(0 + list.length).toString()}
				label={
					props.username + " at " + time.split(" ")[1].substring(0, 4) + " " + time.split(" ")[2]
				}
				defaultValue={message}
				margin="normal"
				InputProps={{
					readOnly: true,
				}}
				focused
				multiline
			/>,
		]);
		//console.log("sending to: " + room);
		socket.emit("send_message", { message, room, user: props.username });
	};

	//automatically scroll down when new message is received
	useEffect(() => {
		let element = document.getElementById("log");
		element.scrollTop = element.scrollHeight;
	}, [messageLogs]);

	//called when user leaves room
	//user leaves room
	useEffect(() => {
		const userListener = (data) => {
			/*
			console.log("user left: " + data);
			const currentUsers = users;
			const index = currentUsers.indexOf(data);
			if (index > -1) {
				currentUsers.splice(index, 1);
			}
			setUsers(currentUsers);
			*/
			//console.log("user left: " + data.username);
			setUsers(data.users);
		};

		socket.on("user-left", userListener);

		return () => socket.off("user-left", userListener);
	}, [users]);

	//user joins room
	//updates users array to add new user
	//only gets called when ANOTHER user joins room?
	//non self
	useEffect(() => {
		const userListener = (data) => {
			//console.log("user joined: " + data.username);
			setUsers(data.users);
		};

		socket.on("user-joined", userListener);

		return () => socket.off("user-joined", userListener);
	}, []);

	//called when new message is received, added to messagelogs
	useEffect(() => {
		const eventListener = (data) => {
			//console.log("message received from: " + data.room);
			//console.log("message: " + data.message);
			setMessageLogs((list) => [
				...list,
				<TextField
					key={(0 + list.length).toString()}
					label={data.user + " at " + time.split(" ")[1].substring(0, 4) + " " + time.split(" ")[2]}
					defaultValue={data.message}
					margin="normal"
					InputProps={{
						readOnly: true,
					}}
					color="success"
					focused
					multiline
				/>,
			]);
		};

		socket.on("receive_message", eventListener);

		return () => socket.off("receive_message", eventListener);
	}, [time]);

	return (
		<div className="chat-main">
			<div className="header">
				<h1>Hello, {props.username}</h1>
				<h2>It is currently: {time}</h2>
				<h3>{room !== "" ? "Current Room: " + room : "Please Select a Room or DM"}</h3>
			</div>
			<div className="chat-main-content">
				<div className="rooms">
					<Box sx={{ width: "100%", typography: "body1" }}>
						<TabContext defaultValue={value} value={value}>
							<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
								<TabList onChange={handleChange} aria-label="lab API tabs example" centered>
									<Tab label="Servers" value="1" />
									<Tab label="Friends" value="2" />
								</TabList>
							</Box>
							<TabPanel value="1">
								<Stack className="room-stack" spacing={1} sx={{ width: "80%" }}>
									{rooms.map((value, key) => {
										return (
											<Button
												key={key}
												variant="contained"
												onClick={(event) => {
													joinRoom(event.target.textContent);
												}}
											>
												{value}
											</Button>
										);
									})}
								</Stack>
							</TabPanel>
							<TabPanel value="2">
								<Stack className="friends-stack" spacing={1} sx={{ width: "80%" }}>
									{
										//make sure to change the onClick event to show dm with person
										friends.map((value, key) => {
											return (
												<Button
													key={key}
													variant="contained"
													onClick={(event) => {
														joinRoom(event.target.textContent);
													}}
												>
													{value}
												</Button>
											);
										})
									}
								</Stack>
							</TabPanel>
						</TabContext>
					</Box>
				</div>
				<div className="chat-text">
					<h2>messages:</h2>
					<div id="log" className="log">
						{
							//map through message history logs
							messageLogs.map((value, key) => {
								return value;
							})
						}
					</div>
					<div className="input">
						{room !== "" ? (
							<TextField
								fullWidth
								id="fullWidth"
								placeholder={"message: " + room}
								variant="outlined"
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										sendMessage(event.target.value);
										event.target.value = "";
									}
								}}
							/>
						) : (
							<TextField
								disabled
								fullWidth
								id="fullWidth"
								placeholder={"Select a Room!"}
								variant="outlined"
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										sendMessage(event.target.value);
										event.target.value = "";
									}
								}}
							/>
						)}
					</div>
				</div>
				<div className="user-list">
					<h2>users:</h2>
					<div className="users">
						{users.map((value, key) => {
							return <h3 key={key}>{value}</h3>;
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default DashboardActive;
