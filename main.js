// let prompts = []
// Papa.parse("prompts_round2.csv", {
// 	download: true,
// 	complete: function(results) {
// 		if (results.errors.length === 0) {
// 			for (let result of results.data) {
// 				let prompt = {}
// 				prompt.prompt = result[0]
// 				prompt.safetyquips = result[1].split("\n").map(x=>x.trim())
// 				prompt.us = result[2] == "yes"
// 				prompt.familyfriendly = result[3] != "yes"
// 				prompts.push(prompt)
// 			}
// 			state.state = "mainmenu"
// 		} else {
// 			state.state = "error"
// 		}
// 	}
// })

const state = createState({
    state: "mainmenu",
    name: "",
    server_id: "",
    peer: null,
    id: "",
    connected: false,
    connection: null,
    player_index: null,
    vip: false,
    prompts: [],
});
document.body.appendChild(MainInterface(state));
