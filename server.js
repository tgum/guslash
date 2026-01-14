const state = createState({
	id: "",
	players: [],
	namedplayers: "", // Hack to refresh the playerlist when a player gets named
	state: "loading",
	round: 1,
	loaded_prompts: 2,
});

let peer = new Peer()
peer.on("open", id => peer_loaded(id))
peer.on("connection", conn => on_connection(conn))

function peer_loaded(id) {
	state.id = id
	state.state = "lobby"
	console.log("my peerid is: ", id)
	prompt("This is the id other people can use to connect to your server, please copy it and send it to your friends\n\n", id)
}

function on_connection(conn) {
	console.log("connected to ", conn)
	if (state.state == "lobby") {
		const player_index = state.players.length

		const player = new Player(conn, player_index)

		state.players = [...state.players, player]

	} else {
		console.log("connection canceled since game is in progress")
		conn.on("open", () => {
			conn.send({ type: "rejected", reason: "Game in progress" })
		})
	}
}

function ondata(id, data) {
	console.log("got data from", id, data)
	if (data.id == state.players[id].id) {
		if (data.type == "name" && state.state == "lobby") {
			state.players[id].name = data.name
			updatelobby()
		} else if (data.type == "start game" && state.state == "lobby") {
			if (state.players[id].vip) {
				console.log("let the games begin")
				if (state.loaded_prompts > 0) {
					state.addUpdate("loaded_prompts", () => {
						if (state.loaded_prompts == 0) {
							begin_game()
						}
					})
				} else {
					begin_game()
				}
			} else {
				console.log("non vip tried to start the game")
			}
		} else {
			console.log("unrecognized packet or wrong state, type:", data.type, ", state:", state.state)
		}
	} else {
		console.log("unauthorized packet from player #", id, "trying to login with id", data.id)
	}
}

function begin_game() {
	console.log("let the games actually begin fr this time")
	state.state = ""
}

let prompts_round1 = []
let prompts_round2 = []
fetch("prompts_round1.json")
	.then(r=>r.json())
	.then(r=>{
		prompts_round1=r
		state.loaded_prompts--
		console.log("loaded prompts for round 1")
	})
fetch("prompts_round2.json")
	.then(r=>r.json())
	.then(r=>{
		prompts_round2=r
		state.loaded_prompts--
		console.log("loaded prompts for round 2")
	})