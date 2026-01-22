function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

class Player {
	constructor(conn, index) {
		this.conn = conn
		this.index = index
		this.id = index + ":" + uuidv4()
		this.name = "no name"
		this.vip = this.index == 0

		this.score = 0

		this.prompts = []
		this.answers = []
		this.safeanswers = []
		this.answeredall = false

		this.hasvoted = false
		this.votedfor = -1

		this.connready = false

		this.conn.on("open", () => {
			this.conn.send({ type: "welcome", id: this.id, vip: this.vip })
			this.connready = true
			console.log("player", this.index, "connection opened")
		})

		this.conn.on("data", data => ondata(this.index, data))
	}

	send_prompts() {
		let packet = {type: "prompts", prompts: this.prompts}
		this.conn.send(packet)
	}
	send_wait() {
		let packet = {type: "wait"}
		this.conn.send(packet)
	}
	send_vote(options) {
		let packet = {type: "vote", options}
		this.conn.send(packet)
	}

	answer(answer, safe) {
		this.answers.push(answer)
		this.safeanswers.push(safe)
		for (let prompt of state.prompts) {
			if (prompt.prompt == this.prompts[this.answers.length-1].prompt) {
				prompt.answers.push({answer, answerer: this, safetyquip: safe})
			}
		}
		
		if (this.answers.length == this.prompts.length) {
			this.answeredall = true
		}
		submittedanswer()
	}
	safety() {
		let prompt = this.prompts[this.answers.length]
		let answerindex = Math.floor(Math.random() * prompt.safetyquips.length)
		this.answer(prompt.safetyquips[answerindex], true)
	}

	voted(index) {
		console.log("voted for", index)
		this.hasvoted = true
		this.votedfor = index
		voted()
	}
}