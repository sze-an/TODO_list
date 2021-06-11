const appBorderEle = document.querySelector(".app-border");
const addBtn = document.querySelector(".add-item-btn");
const settingsBtn = document.querySelector(".settings-btn");
const settingsBackground = document.querySelector(".settings-background");
const saveNCloseSettingsBtn = document.querySelector(".save-n-close-settings-btn");
const backgroundColor = document.querySelector(".background-color");
const panelColor = document.querySelector(".panel-color");
const settingsModal = document.querySelector(".settings-modal");
const addModal = document.querySelector(".modal");
const saveBtn = document.querySelector(".save");
const cancelBtn = document.querySelector(".cancel");
const itemList = document.querySelector(".item-list");
const itemTextBox = document.querySelector(".todo-text");
const highlightColor = document.querySelector(".highlight-color");
const fontColor = document.querySelector(".font-color");
const fontStyle = document.querySelector(".font-style");
const completeBtn = document.querySelector(".mark-complete-btn");
const deleteBtn = document.querySelector(".delete-btn");
let addBtnClicked = false;
let editingSelectedItem;

settingsBtn.addEventListener("click", () => {
	settingsBackground.style.display = "flex";
});

const saveSettingsToLocalStorage = () => {
	const settingsObj = {
		backgroundColor: backgroundColor.value,
		panelColor: panelColor.value
	};
	localStorage.settings = JSON.stringify(settingsObj);
};

const loadSettingsFromLocalStorage = () => {
	const settings = JSON.parse(localStorage.settings ?? "{}");
	// console.log(settings);
	document.body.style.background = settings.backgroundColor;
	appBorderEle.style.background = settings.backgroundColor;
	addModal.style.background = settings.panelColor;
	settingsModal.style.background = settings.panelColor;
	backgroundColor.value = settings.backgroundColor;
	panelColor.value = settings.panelColor;
};
loadSettingsFromLocalStorage();

saveNCloseSettingsBtn.addEventListener("click", () => {
	settingsBackground.style.display = "none";
	document.body.style.background = backgroundColor.value;
	appBorderEle.style.background = backgroundColor.value;
	addModal.style.background = panelColor.value;
	settingsModal.style.background = panelColor.value;

	saveSettingsToLocalStorage();
});

const slideInModal = () => {
	addModal.style.left = 0;
};

addBtn.addEventListener("click", () => {
	addBtnClicked = true;
	completeBtn.style.display = "none";
	deleteBtn.style.display = "none";
	itemTextBox.value = "";
	slideInModal();
});

const slideOutModal = () => {
	addModal.style.left = "100%";
};

const saveToLocalStorage = () => {
	const arr = [];
	// get all html item elements
	const itemElements = document.querySelectorAll(".item");
	// loop over the item elements
	itemElements.forEach((item) => {
		// item is a html element
		arr.push({
			text: item.textContent,
			fontColor: item.dataset.fontColor,
			highlightColor: item.dataset.backgroundColor,
			font: item.style.fontFamily,
			textDecoration: item.style.textDecoration
		});
	});
	// convering array of objects to string and storing it in local storage
	localStorage.allItems = JSON.stringify(arr);
};

const loadFromLocalStorage = () => {
	// convert local storage string back into array of objects
	const items = JSON.parse(localStorage.allItems ?? "[]");
	// loop over array of objects
	items.forEach((itemObj) => {
		// itemObj is an object
		const newDiv = document.createElement("div");
		newDiv.textContent = itemObj.text;
		newDiv.style.color = itemObj.fontColor;
		newDiv.dataset.fontColor = itemObj.fontColor;
		newDiv.style.backgroundColor = itemObj.highlightColor;
		newDiv.dataset.backgroundColor = itemObj.highlightColor;
		newDiv.style.fontFamily = itemObj.font;
		newDiv.style.textDecoration = itemObj.textDecoration;
		newDiv.classList.add("item");
		itemList.appendChild(newDiv);
	});
};
loadFromLocalStorage();

const addItem = () => {
	// add the item to the list
	const newDiv = document.createElement("div");
	newDiv.textContent = itemTextBox.value;
	newDiv.classList.add("item");
	itemList.appendChild(newDiv);
	newDiv.style.backgroundColor = highlightColor.value;
	newDiv.dataset.backgroundColor = highlightColor.value;
	newDiv.style.color = fontColor.value;
	newDiv.dataset.fontColor = fontColor.value;
	newDiv.style.fontFamily = fontStyle.value;
	slideOutModal();
};

const saveEditedItem = () => {
	// user just clicked the save button
	editingSelectedItem.textContent = itemTextBox.value;
	editingSelectedItem.style.backgroundColor = highlightColor.value;
	// the browser is converting my color to rgb() format which breaks setting the
	// color inputs. so now we are setting the correct color format in dataset on the
	// element.
	editingSelectedItem.dataset.backgroundColor = highlightColor.value;
	editingSelectedItem.style.color = fontColor.value;
	editingSelectedItem.dataset.fontColor = fontColor.value;
	editingSelectedItem.style.fontFamily = fontStyle.value;
	slideOutModal();
};

const createOrEditItem = () => {
	// user clicked save btn
	if (itemTextBox.value !== "") {
		// item text is not blank, its valid
		if (addBtnClicked) {
			addItem();
		} else {
			saveEditedItem();
		}
		saveToLocalStorage();
	}
};

saveBtn.addEventListener("click", createOrEditItem);
cancelBtn.addEventListener("click", slideOutModal);

const startEditingItem = (e) => {
	// getting the html element you clicked on
	const selectedItem = e.target;
	// checking if we are clicking on the ele with 'item' class
	if (selectedItem.classList.contains("item")) {
		addBtnClicked = false;
		slideInModal();
		// setting the text-input to the text from the element
		itemTextBox.value = selectedItem.textContent;
		fontColor.value = selectedItem.dataset.fontColor;
		highlightColor.value = selectedItem.dataset.backgroundColor;
		fontStyle.value = selectedItem.style.fontFamily;
		completeBtn.style.display = "inline-block";
		deleteBtn.style.display = "inline-block";
		editingSelectedItem = selectedItem;
		if (editingSelectedItem.style.textDecoration !== "line-through") {
			completeBtn.textContent = "Mark As Complete";
		} else {
			completeBtn.textContent = "Undo Mark Complete";
		}
	}
};

itemList.addEventListener("click", startEditingItem);

const clickCompleteBtn = () => {
	if (editingSelectedItem.style.textDecoration !== "line-through") {
		editingSelectedItem.style.textDecoration = "line-through";
	} else {
		editingSelectedItem.style.textDecoration = "none";
	}
	saveToLocalStorage();
	slideOutModal();
};

completeBtn.addEventListener("click", clickCompleteBtn);

const clickDeleteBtn = () => {
	editingSelectedItem.remove();
	saveToLocalStorage();
	slideOutModal();
};

deleteBtn.addEventListener("click", clickDeleteBtn);
