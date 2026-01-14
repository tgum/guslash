function Loading() {
	let text = h2("Loading")
	setInterval(() => text.textContent += ".", 100)
	return text
}

function LobbyPlayer(player) {
	return li(
		`${player.name} ${player.vip ? "(VIP)" : ""}`
	)
}

let updatelobby = ()=>{}
function Lobby() {
	let playerlist = ol()
	updatelobby = () => {
		playerlist.innerHTML = ""
		for (let player of state.players) {
			playerlist.append(LobbyPlayer(player))
		}
	}

	return div(
		h2("GusLash lobby"),
		playerlist
	)
}

function MainInterface() {
	let view = div(
		Loading()
	)

	state.addUpdate("state", () => {
		view.innerHTML = ""
		if (state.state == "loading") {
			view.append(Loading())
		} else if (state.state == "lobby") {
			view.append(Lobby())
		}
	})

	return div(
		h1("GusLash host!"),
		view
	)
}

document.body.appendChild(MainInterface(state));
