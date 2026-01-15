const familyfriendly = true

const state = createState({
	id: "",
	players: [],
	namedplayers: "", // Hack to refresh the playerlist when a player gets named
	state: "loading",
	round: 1,
	loaded_prompts: 2,
	timeleft: 0,
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
	let player = state.players[id]

	if (data.id == player.id) {
		if (data.type == "name" && state.state == "lobby") {
			player.name = data.name
			updatelobby()
		} else if (data.type == "start game" && state.state == "lobby") {
			if (player.vip) {
				console.log("let the games begin")
				if (state.loaded_prompts == 0) {
					begin_game()
				} else {
					state.addUpdate("loaded_prompts", () => {
						if (state.loaded_prompts == 0) {
							begin_game()
						}
					})
				}
			} else {
				console.log("non vip tried to start the game")
			}
		} else if (data.type == "answer" && state.state == "answerprompts") {
			player.answer(data.answer, false)
		} else if (data.type == "safetyquip" && state.state == "answerprompts") {
			player.safety()
		} else {
			console.log("unrecognized packet or wrong state, type:", data.type, ", state:", state.state)
		}
	} else {
		console.log("unauthorized packet from player #", id, "trying to login with id", data.id)
	}
}

function begin_game() {
	console.log("let the games actually begin fr this time")
	generate_prompts()

	for (let player of state.players) {
		player.send_prompts()
	}

	state.state = "answerprompts"
}

function generate_prompts() {
	let pool = state.round == 1 ? prompts_round1 : prompts_round2
	pool = pool.filter(x => !familyfriendly || x.familyfriendly)

	let loop = true
	while (loop) {
		let prompts = []
		for (let i = 0; i < state.players.length; i++) {
			let p = pool[Math.floor(Math.random()*pool.length)]
			prompts.push(p)
		}
		prompts = [...prompts, ...prompts]
		console.log(prompts)

		for (let i = 0; i < 2; i++) {
			for (let player of state.players) {
				if (i == 0) player.prompts = []
				let prompt_index = Math.floor(Math.random() * prompts.length)
				player.prompts.push(prompts[prompt_index])
				prompts.splice(prompt_index, 1)
			}
		}

		loop = false
		for (let player of state.players) {
			console.log(player.index, player.prompts)
			if (player.prompts[0] == player.prompts[1]) {
				console.log("whoops we have a double. relooping")
				loop = true
				break
			}
		}
	}
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