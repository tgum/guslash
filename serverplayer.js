class Player {
	constructor(conn, index) {
		this.conn = conn
		this.index = index
		this.id = index + ":" + crypto.randomUUID()
		this.name = "no name"
		this.vip = this.index == 0

		this.prompts = []
		this.answers = []
		this.safeanswers = []
		this.answeredall = false

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

	answer(answer, safe) {
		this.answers.push(answer)
		this.safeanswers.push(safe)
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
}