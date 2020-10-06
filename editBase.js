const SERVER_HOST = "www.example.com";
chrome.webRequest.onBeforeRequest.addListener(info=>{
	if (info.url.match(/^https:\/\/(www\.|)youtube\.com\/s\/player\/[a-f0-9]+\/(?:[^\/]*\/)*base\.js$/)) {
		return {redirectUrl: `https://${SERVER_HOST}/ytBase?url=${info.url}`};
	}
	}, {urls: ["<all_urls>"]}, ["blocking"]
);