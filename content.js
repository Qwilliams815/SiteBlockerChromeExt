console.log("~ Weblocker Ext Loaded ~");

// Replaces webpage with an iframe displaying blocked_page.html
function generateBlockedPage() {
	// Eliminate any existing doc styles that may interfere with iframes.
	document.querySelector("html").setAttribute("style", "none");
	document.querySelector("html").style.cssText = "overflow: hidden;";

	const newBody = document.createElement("body");
	const iframe = document.createElement("iframe");

	newBody.style.cssText =
		"height: 100vh; width: 100vw; margin: 0px; overflow: hidden; box-sizing: border-box;";
	iframe.style.cssText =
		"height: 100vh; width: 100vw; margin: 0px; overflow: hidden; border: none;";
	iframe.src = chrome.runtime.getURL("blocked_page.html");

	newBody.append(iframe);
	document.body = newBody;
}

// Receive list of blocked sites sent from popup
let blockedSitesObj;
chrome.runtime.onMessage.addListener(function (request) {
	//console.log("Msg from popup received: ", request.msg);

	// Clear any current locally stored blocked sites
	chrome.storage.local.clear();

	// Create object from blockedSites to appease the chrome.storage API
	blockedSitesObj = { blockedSitesList: request.msg };
	chrome.storage.local.set(blockedSitesObj).then(() => {
		console.log("New blocked list set: " + blockedSitesObj.blockedSitesList);
	});

	// Check if current document.url is blocked
	for (let site of blockedSitesObj.blockedSitesList) {
		if (document.URL.includes(site)) {
			generateBlockedPage();
		}
	}
});

// Block any pre-existing sites in local storage
chrome.storage.local.get(blockedSitesObj).then((result) => {
	for (let item of result.blockedSitesList) {
		// console.log(item);
		if (document.URL.includes(item.toLowerCase())) {
			generateBlockedPage();
		}
	}
});
