function connect_to(server_id, name) {
	console.log(server_id, server_id.toUpperCase(), name)

	state.name = name
	localStorage.setItem("name", name)
	state.server_id = "tgum-guslash-" + server_id.toUpperCase()
	console.log(state.server_id)

	state.state = "loading"

	state.peer = new Peer()
    state.peer.on("open", id => peer_loaded(id))
}

function peer_loaded(id) {
	console.log("my peerid is: ", id)

	console.log("connecting to server, ", state.server_id)
	state.connection = state.peer.connect(state.server_id, {reliable: true})
	state.connection.on("open", () => conn_loaded())

	state.connection.on("data", data => ondata(data))
}

function conn_loaded() {
	state.connected = true
}

function ondata(data) {
	if (data.type == "welcome") {
		console.log("welcomed, my id is", data.id)
		state.id = data.id
		state.player_index = state.id.split(":")[0]
		state.vip = data.vip
		send_name()
		state.state = "lobby"
	} else if (data.type == "prompts") {
		state.prompts = data.prompts
		console.log(state.prompts)
		state.state = "answerprompts"
	} else if (data.type == "wait") {
		state.state = "wait"
	} else if (data.type == "vote") {
		state.options = data.options
		state.state = "vote"
	} else if (data.type == "rejected") {
		state.connected = false
		console.log("rejected from server. reason:", data.reason)
		state.connection.close()
		state.connection = undefined
	}
}

function basic_packet(type) {
	const packet = {}
	packet.type = type
	packet.id = state.id
	return packet
}
function send_name() {
	console.log("sendin name")
	const packet = basic_packet("name")
	packet.name = state.name
	state.connection.send(packet)
}
function send_start() {
	console.log("sending start")
	const packet = basic_packet("start game")
	state.connection.send(packet)
}
function send_answer(answer) {
	console.log("sending answer")
	const packet = basic_packet("answer")
	packet.answer = answer
	state.connection.send(packet)
}
function send_safety() {
	console.log("sending safety")
	const packet = basic_packet("safetyquip")
	state.connection.send(packet)
}
function send_voted(index) {
	console.log("sending voted")
	const packet = basic_packet("voted")
	packet.index = index
	state.connection.send(packet)
}