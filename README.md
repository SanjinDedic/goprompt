## Goprompt README

This project is an HTML-based prompt collection system. The main functionality of the project is implemented in the following files: `mainprompt.js`, `tabcreator.js`, and `promptcreator.js`. 
`authorise.js` does authentication with Google API and `gopromptapi.js` saves and fetches data from the back end.

### mainprompt.js

The `mainprompt.js` file contains the `MainPrompt` class, which acts as the main controller for the prompt collection system. It handles the initialization of the system, event listeners for various buttons, and interactions with the server API.

The important methods in `MainPrompt` include:

- `constructor()`: Initializes the `MainPrompt` object and sets up event listeners for buttons such as "Add Tab", "Save Prompt Collection", etc.
- `checkSession()`: Checks if a user is logged in and fetches the necessary prompts from the server if applicable.
- `addTab()`: Creates a new tab and adds it to the tab collection.
- `saveData()`: Saves the current prompt collection data to the server.
- `populateFromJson(jsonData)`: Populates the prompt collection from a JSON object containing tab and prompt data.
- `uploadJson()`: Allows the user to upload a JSON file containing prompt data and populates the prompt collection from it.
- `getTabPromptData()`:


### promptcreator.js

The `promptcreator.js` file contains the `PromptCreator` class, which is responsible for creating individual prompts within a tab. It provides methods to create and manage prompts within the tab.

The important methods in `PromptCreator` include:

- `constructor(container)`: Initializes the `PromptCreator` object with a container element where the prompts will be appended.
- `createPrompt(title, message, link)`: Creates a new prompt with the specified title, message, and link. It also adds buttons for copying the prompt text, deleting the prompt, adding a new prompt, and moving the prompt up or down within the tab.
- `preventPasteStyles(element)`: Prevents the default paste behavior of an element and inserts plain text instead.
- `emptyTitleFallback()`: Handles the fallback behavior when the prompt title is empty (replaces empty text with non-breaking space).
- `deletePrompt(promptContainer)`: Deletes the specified prompt from the container and adds a new prompt if all prompts have been deleted.
- `movePromptUp(promptContainer)`: Moves the specified prompt up one position within the container.
- `movePromptDown(promptContainer)`: Moves the specified prompt down one position within the container.

### tabcreator.js

The `tabcreator.js` file contains the `TabCreator` class, which is responsible for creating and managing tabs within the prompt collection. It provides methods to create new tabs, switch between tabs, delete tabs, and add prompts to tabs.

The important methods in `TabCreator` include:

- `constructor(tabLinksContainer, tabContentContainer)`: Initializes the `TabCreator` object with the container elements for tab links and tab content.
- `createTab(name)`: Creates a new tab with the specified name. It also adds buttons for deleting the tab, adding a new prompt, moving the prompt up or down within the tab, and opening the topic link associated with the prompt.
- `deleteTab(tabId)`: Deletes the specified tab and its associated link from the container, and switches to another tab if necessary.
- `addPromptToTab(name)`: Adds a new prompt to the specified tab.
- `handleTabLinkClick(event)`: Event handler for clicking on a tab link. It switches to the clicked tab.
- `switchTab(name)`: Switches to the tab with the specified name and updates the UI accordingly by adding an "active" class to the active tab link and tab content.

The `TabCreator` class interacts closely with the `PromptCreator` class to create prompts within the tabs. It keeps track of the created tabs using an object and provides methods to manipulate the tabs and their associated prompts.
