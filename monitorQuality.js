const qualList = ["4320", "2160", "1440", "1080", "720", "large", "medium", "480", "360", "240", "144", "auto"];
let maxQuality = qualList[2];
function init() {
	let mo = new MutationObserver(setQuality);
	mo.observe(document.querySelector("div.ytp-spinner"), {attributes: true});
	setQuality();
}
function setQuality() {
	let availableQualities;
	if (typeof quals.options[0] === "string") {
		availableQualities = Object.keys(quals.options);
	} else {
		availableQualities = quals.G.getAvailableQualityLevels();
	}
	let quality = getHighestQuality(availableQualities, maxQuality);
	quals.G.setPlaybackQuality(quality);
}
function getHighestQuality(qualityList, max) {
	let qualityIndex = qualList.indexOf(max);
	while (qualityIndex < qualList.length) {
		for (let quality in qualityList) {
			if (qualityList[quality].includes(qualList[qualityIndex])) {
				return qualityList[quality];
			}
		}
		qualityIndex++;
	}
	return "auto";
}
_waitForSelector("button.ytp-button.ytp-settings-button").then(elem => {
	elem.click();
	elem.click();
	console.log("waiting?")
	_waitForVar("quals").then(init);
});
async function _waitForVar(windowVar) {
	return new Promise((resolve, reject) => {
		let interval = setInterval(function (v) {
			if (window.hasOwnProperty(v)) {
				clearInterval(interval);
				resolve(window[v]);
			}
		}, 50, windowVar);
	});
}
async function _waitForSelector(selector, content) {
	console.log("waiting for", selector);
	return new Promise((resolve, reject) => {
		let interval = setInterval((s, c) => {
			let elem = document.querySelectorAll(s);
			[...elem].forEach(e => {
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
		}, 50, selector, content);
	});
}