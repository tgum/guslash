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


function Timer(amount, callback) {
	let display = h1(""+amount)
	state.timeleft = amount

	let timer = setInterval(() => {
		display.textContent = state.timeleft
		state.timeleft--
		if (state.timeleft <= 0) {
			clearInterval(timer)
			callback()
		}
	}, 1000)
	return display
}

let submittedanswer = ()=>{}
function AnswerPrompts() {
	let submitted = ol()
	let didntsubmit = ol()
	submittedanswer = () => {
		submitted.innerHTML = ""
		didntsubmit.innerHTML = ""
		let allsubmitted = true
		for (let player of state.players) {
			if (player.answeredall) {
				submitted.append(LobbyPlayer(player))
			} else {
				didntsubmit.append(LobbyPlayer(player))
				allsubmitted = false
			}
		}
		if (allsubmitted) {
			state.timeleft = 0
		}
	}
	submittedanswer()

	let timer = Timer(90, () => {
		console.log("timer over!")
	})

	return div(
		h2("answer the prompts on ur deviced"),
		timer,
		h3("finished"),
		submitted,
		h3("not finished"),
		didntsubmit,
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
		} else if (state.state == "answerprompts") {
			view.append(AnswerPrompts())
		}
	})

	return div(
		h1("GusLash host!"),
		view
	)
}

document.body.appendChild(MainInterface(state));
