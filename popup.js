// Empty array used as buffer for blocked sites stored in local storage
let blockedSitesArr = [];

// Create array of all list items
let close = document.getElementsByClassName("close");

// Load any pre-existing blocked sites from local storage
for (let i = 0; localStorage.getItem(i) != null; i++) {
	addElement(localStorage.getItem(i));
	blockedSitesArr.push(localStorage.getItem(i));
}

// Updates back-end local storage and blockedSites array
const form = document.getElementById("formId");
form.addEventListener("submit", (e) => {
	e.preventDefault();
	let i = blockedSitesArr.length;

	// Add new blocked site to local storage as ["blockedSiteArr.length": "blockedSite.com"]
	localStorage.setItem(i, document.getElementById("myInput").value);

	// Add new blocked site to blocked sites array to be ammended and iterated later
	blockedSitesArr.push(document.getElementById("myInput").value);

	// Add new blocked site to popup list HTML
	addElement(document.getElementById("myInput").value);
});

// Handles adding and removing elements from front-end popup HTML
function addElement(userInput) {
	let li = document.createElement("li");
	let inputValue = userInput;
	let t = document.createTextNode(inputValue);
	li.appendChild(t);

	// Catch blank inputs
	if (inputValue === "") {
		alert("You must write something!");
	} else {
		document.getElementById("myUL").appendChild(li);
	}

	// Clear input field
	document.getElementById("myInput").value = "";

	// Create a close "x" button and append it to each list item
	let span = document.createElement("SPAN");
	let txt = document.createTextNode("\u00D7");
	span.className = "close";
	span.appendChild(txt);
	li.appendChild(span);

	// Remove list element
	span.addEventListener("click", () => {
		let div = span.parentElement;

		// Remove element from back-end
		blockedSitesArr.splice(blockedSitesArr.indexOf(div.childNodes[0].nodeValue), 1);
		console.log(blockedSitesArr);

		// Clear and reorder local storage
		localStorage.clear();
		for (let i = 0; i < blockedSitesArr.length; i++) {
			localStorage.setItem(i, blockedSitesArr[i]);
		}

		// Remove element from front-end
		div.parentNode.removeChild(div);
	});
}

// Forward blockedSitesArr to contentScript, refresh current tab
let blockBtn = document.getElementById("start-block");
blockBtn.addEventListener("click", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { msg: blockedSitesArr }, function () {
			chrome.tabs.reload(tabs[0].id);
		});
		console.log("Sent to contentscript: ", blockedSitesArr);
	});
});
