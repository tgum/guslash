function Loading() {
	let text = h1("Loading")
	setInterval(() => text.textContent += ".", 100)
	return text
}


function LobbyPlayer(player) {
	return span({className: "player" + (player.vip ? " vip" : "")},
		`${player.name} ${player.vip ? "(VIP)" : ""}`
	)
}

let updatelobby = ()=>{}
function Lobby() {
	let playerlist = div({className: "playerlist"})
	updatelobby = () => {
		playerlist.innerHTML = ""
		for (let player of state.players) {
			playerlist.append(LobbyPlayer(player))
		}
	}

	return div(
		h1("Guslash Lobby"),
		button({onclick: () => {
			navigator.clipboard.writeText(state.id)
		}}, "click to copy id!"),
		playerlist
	)
}


function Timer(amount, callback) {
	let display = p({className: "timer"}, ""+amount)
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
	let submitted = div({className: "playerlist"})
	let didntsubmit = div({className: "playerlist"})
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

	let timer = Timer(90, start_voting)

	return div(
		h1("Answer the prompts on your device"),
		timer,
		h3("finished"),
		submitted,
		h3("not finished"),
		didntsubmit,
	)
}


function ShowPrompt() {
	let view = div(
		h1(state.prompts[state.promptindex].prompt)
	)

	Timer(3, () => {
		state.state = "vote"
	})

	return view
}


let voted = ()=>{}
function Vote() {
	let prompt = state.prompts[state.promptindex]

	let timer = Timer(25, () => {
		state.state = "showvotes"
	})

	let view = div(
		timer,
		h1(prompt.prompt),
		div({className: "answercontainer"},
			div({className: "answer"}, div({className: "answerbox"}, prompt.answers[0].answer)),
			div({className: "answer"}, div({className: "answerbox"}, prompt.answers[1].answer)),
		)
	)

	voted = () => {
		let allvoted = true
		for (let player of state.players) {
			if (!player.hasvoted) {
				allvoted = false
				break
			}
		}
		if (allvoted) {
			state.timeleft = 0
		}
	}

	for (let player of state.players) {
		player.send_vote(prompt.answers.map(x => x.answer))
	}

	return view
}

function VotedAnswer(index) {
	let prompt = state.prompts[state.promptindex]

	let votes = [0, 0]
	let voters = [[], []]
	for (let player of state.players) {
		if (player.hasvoted) {
			votes[player.votedfor]++
			voters[player.votedfor].push(player)
		}
	}

	let percentage = Math.round((votes[0] / (votes[0] + votes[1])) * 100)

	if (votes[0] == votes[1]) {
		percentage = 50
	}


	if (index == 1) {
		percentage = 100 - percentage
	}

	points = percentage * 10
	if (percentage > 50) {
		points += 100
	}
	if (prompt.answers[index].safetyquip) {
		points /= 2
	}
	points *= state.round
	prompt.answers[index].answerer.score += points

	let voterslist = div({className: "voters"})
	for (let player of voters[index]) {
		voterslist.append(span(player.name))
	}

	let view = div({className: "answer"},
		voterslist,
		div({className: "answerbox"},
			prompt.answers[index].answer,
		),
		percentage, "% ",
		points, " points",
		LobbyPlayer(prompt.answers[index].answerer),
	)

	return view
}
function ShowVotes() {
	let prompt = state.prompts[state.promptindex]

	let view = div(
		h1(state.prompts[state.promptindex].prompt),
		div({className: "answercontainer"},
			VotedAnswer(0),
			VotedAnswer(1)
		)
	)

	for (let player of state.players) {
		player.hasvoted = false
		player.votedfor = -1
	}

	Timer(5, () => {
		state.promptindex++
		if (state.promptindex >= state.prompts.length) {
			state.state = "scoreboard"
		} else {
			state.state = "showprompt"
		}
	})

	return view
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
		} else if (state.state == "showprompt") {
			view.append(ShowPrompt())
		} else if (state.state == "vote") {
			view.append(Vote())
		} else if (state.state == "showvotes") {
			view.append(ShowVotes())
		}
	})

	return div(
		view
	)
}

document.body.appendChild(MainInterface(state));
