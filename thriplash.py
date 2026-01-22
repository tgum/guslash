import csv
import json
import pprint

prompts = []

with open("prompts_thriplash.csv", newline="") as csvfile:
    spamreader = csv.reader(csvfile, delimiter=",", quotechar='"')
    for row in spamreader:
        prompt = {}
        prompt["prompt"] = row[0]
        prompt["answers"] = list(map(lambda x: x.split("|"), row[1].split(" \n")))
        prompt["us"] = row[2] == "yes"
        prompt["familyfriendly"] = row[3] == "no"
        prompts.append(prompt)

pprint.pprint(prompts)
with open("prompts_thriplash.json", "w") as f:
	json.dump(prompts, f)