const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = 1235

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
			} else if (text.includes("a=new VZ(this.G,this),")) {
				text = text.replace("a=new VZ(this.G,this)","a=new VZ(this.G,this),window.quals=a");
			}
			res.type("text/javascript");
			res.send(text);
			throw new Error();
		} catch(e) {
			res.status(404);
			res.send();
		}
	}
});

app.listen(PORT);