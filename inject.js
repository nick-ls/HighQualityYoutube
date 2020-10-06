(()=>{
	let s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', chrome.extension.getURL('monitorQuality.js'));
	document.body.appendChild(s);
})();