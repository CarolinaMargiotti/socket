const net = require("net");
const chalk = require("chalk");

const HOST = "localhost";
const PORT = 8080;

let isConnected = false;

function disconnected() {
	console.log(chalk.yellow("Client desconectou"));
}

function dataReceived(data, socket) {
	const stringData = data.toString();

	if (stringData === "end()") socket.end();
	else console.log(`> ${stringData}`);
}

function onError(error) {
	console.log(chalk.bgRed(" ERROR ") + error.message);
}

function connectionHandler(socket) {
	console.clear();
	isConnected = true;
	defaulTextWhenConnecting();

	socket.on("data", (data) => dataReceived(data, socket));

	socket.on("close", disconnected);
	socket.on("error", onError);
}

function defaulTextWhenConnecting() {
	console.log(chalk.hex("#9966FF")("╭⋟───────────────────╮"));
	if (isConnected) {
		console.log(chalk.cyanBright(" Client conectou"));
	} else {
		console.log(chalk.cyanBright(" Escutando..."));
	}
	console.log(chalk.hex("#9966FF")(` Host: ${HOST}`));
	console.log(chalk.hex("#9966FF")(` Porta: ${PORT}`));
	console.log(chalk.hex("#9966FF")("╰───────────────────⋞╯"));
	console.log(chalk.cyanBright("Dados recebidos:"));
	console.log(chalk.cyanBright("▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃"));
}

const server = net.createServer(connectionHandler);
defaulTextWhenConnecting();
server.listen(PORT, HOST);

//node server.js
