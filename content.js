console.log("~ Weblocker Ext Loaded ~");

// Generates HTML to replace a blocked sites content
function generateBlockedPage() {
	const newBody = document.createElement("body");
	const centerDiv = document.createElement("div");
	const header = document.createElement("h1");
	const footer = document.createElement("h2");

	const headerTag = document.createElement("h1");
	const headerText = "Site Blocked";
	const footerTag = document.createElement("h2");
	const footerText = "Stay focused, King, you got this.";

	headerTag.append(headerText);
	header.append(headerTag);
	footerTag.append(footerText);
	footer.append(footerTag);

	centerDiv.append(headerTag);
	centerDiv.append(footerTag);
	newBody.append(centerDiv);

	newBody.style.cssText =
		"font-family: Verdana, Geneva, Tahoma, sans-serif; margin: 0; color: #F2E9E4; background: radial-gradient(50% 50% at 50% 50%, rgba(74, 78, 105, 0.98) 0%, #43475F 100%); display: flex; justify-content: center; align-items: center; height: 100vh";
	centerDiv.style.cssText =
		"font-size: 5vh; width: 75vw; display: flex; flex-direction: column; justify-content: center; align-items: center;";

	document.getElementsByTagName("body")[0] = newBody;
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
		console.log(item);
		if (document.URL.includes(item.toLowerCase())) {
			generateBlockedPage();
		}
	}
});
