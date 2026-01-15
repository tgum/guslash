function Loading() {
	let text = h2("Loading")
	setInterval(() => text.textContent += ".", 100)
	return text
}

function MainMenu() {
	return div(
		h2("main menu"),
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
		h2("connect to a game"),
		button({onclick: ()=>state.state="mainmenu"}, "<- back"), br(),
		input({placeholder: "your name", id: "name"}), br(),
		input({placeholder: "server code", id: "serverid"}), br(),
		button({onclick: () => {
			connect_to($("#serverid").value, $("#name").value)
		}}, "CONNECT")
	)
}

function Lobby() {
	if (state.vip) {
		return div(
			button({onclick: () => {
				send_start()
			}}, "everybody's in!")
		)
	} else {
		return div("wait for the vip player to start the game")
	}
}

function AnswerPrompts() {
	let container = div(
		p(state.prompts[0].prompt),
		input({id: "promptanswer"})
	)

	let view = div(
		container,
		br(),
		button({onclick: () => {
			let answer = $("#promptanswer").value
			console.log("sending answer")
			send_answer(answer)
			state.prompts = state.prompts.slice(1)
		}}, "submit"),
		button({onclick: () => {
			console.log("safety quip :/")
			send_safety()
			state.prompts = state.prompts.slice(1)
		}}, "safety quip")
	)

	state.addUpdate("prompts", () => {
		if (state.prompts.length > 0) {
			container.innerHTML = ""
			container.append(p(state.prompts[0].prompt))
			container.append(input({id: "promptanswer"}))
		} else {
			view.innerHTML = ""
			view.append(
				p("wait for everyone to finish their prompts")
			)
		}
	})

	return view
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
		}
	})

	return div(
		h1("GusLash!"),
		view
	)
}
