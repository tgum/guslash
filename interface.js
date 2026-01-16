function Loading() {
	let text = h2("Loading")
	setInterval(() => text.textContent += ".", 100)
	return text
}

function MainMenu() {
	return div(
		h2("Main Menu"),
		button({ onclick: () => {
			location.href = "server.html"
		}}, "Host a game!"),
		button({ onclick: () => {
			state.state = "connectmenu"
		}}, "Connect to a game!"),
	)
}

function ConnectMenu() {
	return div(
		h2("Connect to a game"),
		button({onclick: ()=>state.state="mainmenu"}, "<- Back"),
		input({placeholder: "Your name", id: "name"}),
		input({placeholder: "Server code", id: "serverid"}),
		button({onclick: () => {
			connect_to($("#serverid").value, $("#name").value)
		}}, "Connect")
	)
}

function Lobby() {
	if (state.vip) {
		return div(
			button({onclick: () => {
				send_start()
			}}, "Everybody's in!")
		)
	} else {
		return div("Wait for the VIP player to start the game")
	}
}

function AnswerPrompts() {
	let container = div(
		p(state.prompts[0].prompt),
		input({id: "promptanswer"})
	)

	let view = div(
		container,
		button({onclick: () => {
			let answer = $("#promptanswer").value
			console.log("sending answer")
			send_answer(answer)
			state.prompts = state.prompts.slice(1)
		}}, "Submit"),
		button({onclick: () => {
			console.log("safety quip :/")
			send_safety()
			state.prompts = state.prompts.slice(1)
		}}, "Safety quip")
	)

	state.addUpdate("prompts", () => {
		if (state.prompts.length > 0) {
			container.innerHTML = ""
			container.append(p(state.prompts[0].prompt))
			container.append(input({id: "promptanswer"}))
		} else {
			view.innerHTML = ""
			view.append(
				p("Wait for everyone to finish writing their prompts")
			)
		}
	})

	return view
}

function Wait() {
	return p("Wait for stuff to happen")
}

function Option(index) {
	return button({onclick: () => {
		send_voted(index)
		state.state = "wait"
	}}, state.options[index])
}
function Vote() {
	return div(
		Option(0),
		Option(1)
	)
}

function MainInterface() {
	let view = div(
		MainMenu()
	)

	state.addUpdate("state", () => {
		view.innerHTML = ""
		if (state.state == "mainmenu") {
			view.append(MainMenu())
		} else if (state.state == "connectmenu") {
			view.append(ConnectMenu())
		} else if (state.state == "loading") {
			view.append(Loading())
		} else if (state.state == "lobby") {
			view.append(Lobby())
		} else if (state.state == "answerprompts") {
			view.append(AnswerPrompts())
		} else if (state.state == "wait") {
			view.append(Wait())
		} else if (state.state == "vote") {
			view.append(Vote())
		}
	})

	return div(
		h1("GusLash!"),
		view
	)
}
