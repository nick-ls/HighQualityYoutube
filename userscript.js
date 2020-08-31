// ==UserScript==
// @name         HighQualityYoutube
// @version      1.0
// @description  Stop youtube from giving low quality feeds
// @author       Nicholas264
// @match        https://*.youtube.com/*
// ==/UserScript==

(function(quality) {
let qualities = ["2160p", "1440p", "1080p", "720p", "480p", "360p", "240p", "144p"];
document.styleSheets[0].insertRule(".ytp-settings-menu{display:none;}");
async function setQuality(maxQuality) {
	if (!qualities.includes(maxQuality)) return;
	(await _waitForSelector(".ytp-settings-button")).click();
	let x = await _waitForSelector(".ytp-menuitem-label", "Quality");
	x.click();
	_waitForSelector(".ytp-quality-menu").then(()=>{
		_getHighestQuality(maxQuality);
	});
}
async function _getHighestQuality(maxQuality) {
	let qualityList = document.querySelectorAll(".ytp-quality-menu>.ytp-panel-menu>.ytp-menuitem>.ytp-menuitem-label");
	let availableQualities = [...qualityList].map(node=>node.innerText);
	let qual = qualities.indexOf(maxQuality);
	while (qual < qualities.length) {
		for (let i = 0; i < availableQualities.length; i++) {
			if (availableQualities[i].includes(qualities[qual])) {
				document.styleSheets[0].deleteRule(0);
				return qualityList[i].click();
			}
		}
		qual++;
	}
	throw new Error("Video has no available qualities to select from");
}
async function _waitForSelector(selector, content) {
	return new Promise((resolve, reject) => {
		let interval = setInterval((s, c) => {
			let elem = document.querySelectorAll(s);
			[...elem].forEach(e=>{
				if (c) {
					if (e.innerText === c) {
						clearInterval(interval);
						resolve(e)
						return;
					}
				} else {
					clearInterval(interval);
					resolve(e);
					return;
				}
			});
		}, 10, selector, content);
	});
}
setQuality(quality);
})("2160p");
