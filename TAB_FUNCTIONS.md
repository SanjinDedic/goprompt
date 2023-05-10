# README.md

This `README.md` file provides detailed explanations of the following functions in the `PromptManager` class:
- createTab(name)
- addPromptToTab(event)
- switchTab(name)
- editTabName(tabLink)
- deleteTab(tabId)
- handleTabLinkClick(event)

## Functions

### createTab(name)

The `createTab(name)` function is responsible for creating a new tab with the given name. If no name is provided, it will call `getNextTabId()` to generate a new unique name. It creates a new tab link with a delete icon, appends it to the `tabLinks` list, creates a new tab content container, and adds an "Add Prompt" button to the new tab. Finally, it appends the new tab container to the `tabContent` element.

### addPromptToTab(event)

`addPromptToTab(event)` is an event handler for the "Add Prompt" button in each tab. It retrieves the parent tab's ID from the event target and calls the `createPrompt(tabName, "Your New Title", "// Your new prompt here...")` function to create a new prompt inside the tab with the given ID.

### switchTab(name)

The `switchTab(name)` function takes a tab name as its argument and is responsible for activating the tab with that name and deactivating all other tabs. It iterates through all tab links and tabs, and if a link or tab's ID matches the provided name, it adds the "active" class to that element; otherwise, it removes the "active" class. This results in the selected tab and its content being displayed, while hiding the other tabs and their content.

### editTabName(tabLink)

`editTabName(tabLink)` function is called when a tab link is double-clicked. It takes the tab link element as an argument, retrieves the old tab ID and name, and displays a prompt to the user to enter a new tab name. If the new name is not empty and different from the old name, the function updates the tab link text, ID, and related dataset properties. It also updates the tab content container ID and the tab_name properties for all prompts within the renamed tab. Lastly, it updates the "Add Prompt" button to use the new tab name.

### deleteTab(tabId)

The `deleteTab(tabId)` function is responsible for deleting a tab with the given tab ID. It removes the tab link from the `tabLinks` list and the tab content container from the `tabContent` element.

### handleTabLinkClick(event)

`handleTabLinkClick(event)` is an event handler for clicks on the tab links. If the event target is an `LI` element, it calls the `switchTab(event.target.dataset.tabId)` function to switch to the tab with the corresponding ID.