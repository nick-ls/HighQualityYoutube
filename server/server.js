const express = require("express");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const app = express();
const Script = mongoose.model("Script", {url: String, script: String});
const PORT = 1235

const db = mongoose.connect("mongodb://localhost:27017/ytcache", {
		useNewUrlParser: true,
		useUnifiedTopology: true
});

app.get("/ytBase", async (req, res) => {
	if (!req.query.url) return res.status(404).send();
	let url = req.query.url;
	if (url.match(/^https:\/\/(www\.|)youtube\.com\/s\/player\/[a-f0-9]+\/(?:[^\/]*\/)*base\.js$/)) {
			let query = await Script.find({url: url});
			if (query[0]) {
					res.type("text/javascript");
					res.send(query[0].script);
					return;
			}
			try {
					let text = (await (await fetch(url)).text());
					if (text.includes("var a=new VZ(this.G,this);")) {
							text = text.replace("var a=new VZ(this.G,this);", "var a=new VZ(this.G,this);window.quals = a;");
							(new Script({
									url: url,
									script: text
							})).save();
							res.type("text/javascript");
							res.send(text);
							return;
					}
					throw new Error();
			} catch(e) {
					res.status(404);
					res.send();
			}
	}
});

app.listen(PORT);