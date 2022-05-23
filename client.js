const net = require("net");
const read = require("readline");
const chalk = require("chalk");

const HOST = "localhost";
const PORT = 8080;

let isConnected = false;

const reader = read.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function clientConnection() {
	console.clear();
	client = new net.Socket();
	client.connect(PORT, HOST, connected);
}

function disconnected() {
	isConnected = false;
	console.clear();
	client.end();
	generateDefaultConnectionText();
	client.destroy();
}

function exitClient() {
	client.end();
	client.destroy();
	process.exit();
}

function error(error) {
	isConnected = false;
	client.end();
	client.destroy();
	console.log(chalk.bgRed(" ERROR ") + error.message);
}

function writer(line) {
	if (isConnected === false) {
		if (line == "connect()") {
			clientConnection();
			return;
		} else {
			console.log(chalk.yellow("Desconectado do server"));
		}
	}

	if (line === "exit()") {
		exitClient();
		return;
	}

	client.write(line);

	if (line === "end()") {
		disconnected();
		return;
	}
}

function generateDefaultConnectionText() {
	console.log(chalk.hex("#9966FF")("╭⋟───────────────────╮"));
	if (isConnected) {
		console.log(chalk.cyanBright(" Conectou ao server"));
		console.log(chalk.hex("#9966FF")(" 'end()' — desconectar  "));
	} else {
		console.log(chalk.cyanBright(" Desconectado do server"));
		console.log(chalk.hex("#9966FF")(" 'connect()' - conectar "));
	}
	console.log(chalk.hex("#9966FF")(" 'exit()' - encerrar"));
	console.log(chalk.hex("#9966FF")("╰───────────────────⋞╯"));
	console.log(chalk.cyanBright("Comece a digitar:"));
	console.log(chalk.cyanBright("▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃"));
}

function connected() {
	isConnected = true;
	generateDefaultConnectionText();
	reader.removeAllListeners();
	reader.addListener("line", writer);
}

let client = new net.Socket();
clientConnection();
client.on("end", () => disconnected(client));
client.on("error", error);

//node client.js
