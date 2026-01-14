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
	return div(
		p(state.prompts[0].prompt),
		input({id: "fred"}),
		button({onclick: () => {

		}}, "submit"),
		button({onclick: () => {

		}}, "safety quip")
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
		}
	})

	return div(
		h1("GusLash!"),
		view
	)
}
