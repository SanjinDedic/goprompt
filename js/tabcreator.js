import PromptCreator from './promptcreator.js';

export default class TabCreator {
    constructor(tabLinksContainer, tabContentContainer) {
        this.tabLinksContainer = tabLinksContainer;
        this.tabContentContainer = tabContentContainer;
        this.tabs = {};
        this.tabLinksContainer.addEventListener("click", this.handleTabLinkClick.bind(this));
        this.tabLinksContainer.addEventListener("dblclick", this.handleTabLinkDblClick.bind(this));
        this.tabCounter = 1;
    }
    
    createTab(name,firstprompt = true) {
        console.log('tab being created')
        if (!name) {
            name = `Tab ${this.tabCounter++}`;
        }
        if (this.tabs[name]) {
            name = `${name} (${this.tabCounter++})`;
            }
        const tabLink = document.createElement("li");
        tabLink.textContent = name;
        tabLink.dataset.tabId = name;

        const deleteIcon = document.createElement("span");
        deleteIcon.innerHTML = "&#x2716;"; // The 'X' symbol
        deleteIcon.style.cursor = "pointer";
        deleteIcon.style.marginLeft = "5px";
        deleteIcon.addEventListener("click", (event) => {
            event.stopPropagation();
            const tabId = tabLink.dataset.tabId;
            const tabName = tabLink.textContent.replace("✖", "").trim();
            if (confirm(`Are you sure you want to delete '${tabName}'?`)) {
                this.deleteTab(tabId);
            }
        });

        tabLink.appendChild(deleteIcon);
        this.tabLinksContainer.appendChild(tabLink);
        const tab = document.createElement("div");
        tab.classList.add("tab");
        tab.id = name;
        this.tabs[name] = tab;

        this.tabContentContainer.appendChild(tab);
        if (firstprompt) this.addPromptToTab(name)
        return name;
    }

    deleteTab(tabId) {
        const tabLinkToDelete = this.tabLinksContainer.querySelector(`li[data-tab-id="${tabId}"]`);

        const nextTab = tabLinkToDelete.nextSibling || tabLinkToDelete.previousSibling;

        if (tabLinkToDelete) this.tabLinksContainer.removeChild(tabLinkToDelete);
        
        // Delete the tab content
        const tabToDelete = this.tabContentContainer.querySelector(`.tab[id="${tabId.replace(/ /g, '_')}"]`); // Fixed id selector issue
        if (tabToDelete) this.tabContentContainer.removeChild(tabToDelete);

        // Remove the tab from the tabs object
        delete this.tabs[tabId];

        // Switch to another tab, e.g., the first remaining tab, if any
        if (nextTab) {
            this.switchTab(nextTab.dataset.tabId);
        }
    }

    addPromptToTab(name) {
        const promptCreator = new PromptCreator(this.tabs[name]);
        promptCreator.createPrompt(name, "// Your new prompt here...", "// Your new link here...");
    }


    handleTabLinkClick(event) {
        if (event.target.tagName === 'LI') {
            this.switchTab(event.target.dataset.tabId);
        }
     
    }

    handleTabLinkDblClick(event) {
        const tabLink = event.target;
        // if tab link is clicked and not the delete button
        if (!event.target.matches("span")) {
            this.editTabName(tabLink);
        }
    }

    // Add the function here
    editTabName(tabLink) {
        const oldTabId = tabLink.dataset.tabId;
        const oldTabName = tabLink.textContent.replace("✖", "").trim();
        const newTabName = prompt("Enter new tab name:", oldTabName);
        if (!newTabName || newTabName.trim() === "" || newTabName === oldTabName) {
            return;
        }
        const deleteIcon = tabLink.querySelector("span");
        tabLink.textContent = newTabName;
        tabLink.dataset.tabId = newTabName;
        tabLink.appendChild(deleteIcon);
        const oldTab = document.getElementById(oldTabId);
        oldTab.id = newTabName;
        // Update tab_name property for all prompts within the renamed tab
        const promptContainers = oldTab.querySelectorAll(".prompt-container");
        promptContainers.forEach((container) => {
            container.dataset.tabName = newTabName;
        });
        
    }
    
    switchTab(name) {
        const tabLinksList = this.tabLinksContainer.querySelectorAll("li");
        for (const link of tabLinksList) {
            link.classList.remove("active");
            if (link.dataset.tabId === name) {
                link.classList.add("active");
            }
        }
        const tabs = this.tabContentContainer.querySelectorAll(".tab");
        for (const tab of tabs) {
            tab.classList.remove("active");
            if (tab.id === name) {
                tab.classList.add("active");
            }
        }
    }

}