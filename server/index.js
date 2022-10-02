const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

const db = mysql.createConnection({
	user: "root",
	host: "localhost",
	password: "",
	database: "link-users",
});

const messages = mysql.createConnection({
	user: "root",
	host: "localhost",
	password: "",
	database: "chat-logs",
});

//post that registers a user into a database
app.post("/register", (req, res) => {
	const first = req.body.first;
	const last = req.body.last;
	const email = req.body.email;
	const password = req.body.password;

	//db.query("SELECT * FROM users WHERE")

	db.query(
		"INSERT INTO users (first, last, email, password) VALUES (?,?,?,?)",
		[first, last, email, password],
		(err, result) => {
			if (err) {
				console.log("err");
			} else {
				res.send({ message: "user succesfully added to db" });
			}
		}
	);
});

//post that checks to see if an email is already associated with a user account
app.post("/check-email", (req, res) => {
	const email = req.body.email;
	db.query("SELECT * FROM users WHERE email=?", email, (err, result) => {
		//there was an error getting the user
		if (err) {
			res.send({ err: err });
		}
		//check if exactly one user was found
		if (result.length === 1) {
			res.send({ registerStatus: false });
		}
		//check if no user was found
		if (result.length === 0) {
			res.send({ registerStatus: true });
		}
		if (result.length > 1) {
			res.send({ error: "error multiple users found!" });
		}
	});
});

//post that checks to see if a user exists in a database
app.post("/login", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	db.query("SELECT * FROM users WHERE email=? AND password=?", [email, password], (err, result) => {
		if (err) {
			//there was an error getting the user
			res.send({ err: err });
		}
		//check if exactly one user was returned
		if (result.length === 1) {
			res.send({ loginStatus: true });
		}
		//check if no user was returned
		if (result.length === 0) {
			res.send({ loginStatus: false });
		}
		//check if more than one user returned, ERROR in db,
		//cannot have more than one user
		if (result.length > 1) {
			res.send({ error: "more than one user found!!!" });
		}
	});
});

io.on("connection", (socket) => {
	socket.on("join_room", async (data) => {
		//THIS WORKS!!!!!!!!!!!!
		socket.username = data.username;
		//add user to room
		await socket.join(data.value);

		const sockets = await io.in(data.value).fetchSockets();
		const users = [];
		sockets.forEach((socket) => {
			users.push(socket.username);
		});
		users.sort();
		//console.log(users);

		//let everyone in the room know that new user joined, update users list
		io.in(data.value).emit("user-joined", { username: data.username, users: users });
		//console.log(data.username + " joined " + data.value);
	});

	socket.on("leave_room", async (data) => {
		//remove user from room
		await socket.leave(data.room);

		const sockets = await io.in(data.room).fetchSockets();
		const users = [];
		sockets.forEach((socket) => {
			users.push(socket.username);
		});
		users.sort();
		//console.log(users);

		//let everyone in the room know that a user has left, update users list
		socket.to(data.room).emit("user-left", { username: data.username, users: users });
		//console.log(data.username + " left " + data.room);
	});

	socket.on("send_message", (data) => {
		socket.to(data.room).emit("receive_message", data);
	});
});

app.listen(3001, () => {
	console.log("your server is now running on port 3001");
});

server.listen(3002, () => {
	console.log("socket.io server running on port 3002");
});
