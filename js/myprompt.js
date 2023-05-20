class PromptManager {
    constructor(userEmail) {
        this.userEmail = userEmail;
        this.apiUrl = "https://cyber9.live";
        this.tabLinks = document.getElementById("tab-links");
        this.tabContent = document.getElementById("tab-content");
        this.init();
    }

    async init() {
        this.addEventListeners();
        console.log("event listeners added")
    }

    addEventListeners() {
        const addPromptBtn = document.getElementById("add-prompt");
        const savePromptsBtn = document.getElementById("save-prompts");
        const addTabBtn = document.getElementById("add-tab");
        const tabLinks = document.getElementById("tab-links");
        const copyAllBtn = document.getElementById("copy-all");
        const savePublicPromptsBtn = document.getElementById("public");

        if (addPromptBtn) addPromptBtn.addEventListener("click", () => this.addPromptToActiveTab());
        if (savePromptsBtn) savePromptsBtn.addEventListener("click", () => this.savePrompts());
        if (addTabBtn) addTabBtn.addEventListener("click", () => this.createTab());
        if (tabLinks) {
            tabLinks.addEventListener("click", (event) => this.handleTabLinkClick(event));
            tabLinks.addEventListener("dblclick", (event) => this.handleTabLinkDblClick(event.target));
        }
        if (copyAllBtn) copyAllBtn.addEventListener("click", () => this.copyAllPrompts());
        if (savePublicPromptsBtn) savePublicPromptsBtn.addEventListener("click", () => this.savePublicPrompts());
    }
    

    async fetchPrompts() {
        console.log("fetching prompts")
        const userEmail = JSON.parse(sessionStorage.getItem("user"));
        try {
            const response = await fetch(`https://cyber9.live/get-prompts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userEmail
                }),
            });
            const prompts = await response.json();
            console.log(prompts);
            return prompts;
        } catch (error) {
            console.error("Error fetching prompts:", error);
        }
    }
    
    async savePrompts() {
        const userEmail = JSON.parse(sessionStorage.getItem("user"));
        const tabs = document.querySelectorAll(".tab");
        const promptsToSave = Array.from(tabs).flatMap((tab) => {
            const promptContainers = tab.querySelectorAll(".prompt-container");
            return Array.from(promptContainers).map((container) => {
                const titleElement = container.querySelector(".prompt-title");
                const codeElement = container.querySelector(".prompt");
                return {
                    email: userEmail,
                    tab_name: container.dataset.tabName, // Use the dataset.tabName property
                    title: titleElement.textContent,
                    text: codeElement.textContent,
                };
            });
        });
        try {
            const response = await fetch(`https://cyber9.live/save-prompts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(promptsToSave),
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error("Error saving prompts:", error);
        }
    }


    createPrompt(tabName, title, text) {
        const tabLink = document.querySelector(`#tab-links li[data-tab-id="${tabName}"]`);
        let tab = null;
        if (tabLink) {
            tab = document.getElementById(tabLink.dataset.tabId);
        }
        if (!tab) {
            this.createTab(tabName);
            tab = document.getElementById(tabName);
        }
        const promptContainer = document.createElement("div");
        promptContainer.classList.add("prompt-container");
        promptContainer.dataset.tabName = tabName;
        // Create editable title
        const promptTitle = document.createElement("h2");
        const titleElement = document.createElement("span");
        titleElement.classList.add("prompt-title");
        titleElement.contentEditable = "true";
        titleElement.textContent = title;
        promptTitle.appendChild(titleElement);
        // Create editable prompt
        const promptCode = document.createElement("pre");
        const codeElement = document.createElement("code");
        codeElement.classList.add("prompt");
        codeElement.contentEditable = "true";
        codeElement.textContent = text;
        promptCode.appendChild(codeElement);
        // Create copy button
        const copyBtn = document.createElement("button");
        copyBtn.textContent = "Copy";
        copyBtn.classList.add("prompt-btn");
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(codeElement.textContent).then(() => {
                console.log("Text copied to clipboard");
            });
        });
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete Prompt";
        deleteBtn.classList.add("prompt-btn")
        deleteBtn.addEventListener("click", () => {
            tab.removeChild(promptContainer);
        });
        // Append title, prompt, and buttons to the container
        promptContainer.appendChild(promptTitle);
        promptContainer.appendChild(promptCode);
        promptContainer.appendChild(copyBtn);
        promptContainer.appendChild(deleteBtn);
        // Append the prompt container to the specified tab
        tab.appendChild(promptContainer);
    }
    async displayPrompts() {
        console.log("displayPrompts called");
        const prompts = await this.fetchPrompts();
        const maxTabNumber = prompts.reduce((max, prompt) => {
            const tabNumber = parseInt(prompt.tab_name.split(" ")[1]);
            return Math.max(max, tabNumber);
        }, 0);
        for (let i = 1; i <= maxTabNumber; i++) {
            this.createTab(`Tab ${i}`);
        }
        if (maxTabNumber > 0) {
            this.switchTab(`Tab 1`);
        }
        for (const prompt of prompts) {
            this.createPrompt(prompt.tab_name, prompt.title, prompt.text);
        }
        const firstTabLink = document.querySelector("#tab-links li");
        if (firstTabLink) {
            this.switchTab(firstTabLink.dataset.tabId);
        }
    }
    handleTabLinkClick(event) {
        if (event.target.tagName === 'LI') {
            this.switchTab(event.target.dataset.tabId);
        }
    }
    handleTabLinkDblClick(tabLink) {
        if (tabLink.tagName === 'LI') {
            this.editTabName(tabLink);
        }
    }

    
    switchTab(name) {
        const tabLinksList = document.querySelectorAll("#tab-links li");
        for (const link of tabLinksList) {
            link.classList.remove("active");
            if (link.dataset.tabId === name) {
                link.classList.add("active");
            }
        }
        const tabs = document.querySelectorAll(".tab");
        for (const tab of tabs) {
            tab.classList.remove("active");
            if (tab.id === name) {
                tab.classList.add("active");
            }
        }
    }
    if (savePromptsBtn) {
        savePromptsBtn.addEventListener("click", () => {
            savePrompts();
        });
    }

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
        // Update the Add Prompt button to use the new tab name
        const addPromptBtn = oldTab.querySelector("button");
        addPromptBtn.removeEventListener("click", this.addPromptToTab); // Remove old event listener
        addPromptBtn.addEventListener("click", this.addPromptToTab);
    }

    deleteTab(tabId) {
        const tabLink = document.querySelector(`#tab-links li[data-tab-id="${tabId}"]`);
        if (tabLink) {
            this.tabLinks.removeChild(tabLink);
        }
        const tab = document.getElementById(tabId);
        if (tab) {
            this.tabContent.removeChild(tab);
        }
    }

    createTab(name) {
        console.log('tab being created')
        if (!name) {
            name = this.getNextTabId();
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
        this.tabLinks.appendChild(tabLink);
        const tab = document.createElement("div");
        tab.classList.add("tab");
        tab.id = name;
        // Create Add Prompt button for each tab
        const addPromptBtn = document.createElement("button");
        addPromptBtn.textContent = "Add Prompt";
        addPromptBtn.addEventListener("click", this.addPromptToTab.bind(this));
        tab.appendChild(addPromptBtn);
        addPromptBtn.classList.add("styled-button");
        this.tabContent.appendChild(tab);
    }

    addPromptToTab(event) {
        const tabName = event.target.parentElement.id;
        this.createPrompt(tabName, "Your New Title", "// Your new prompt here...");
    }



    getNextTabId() {
        const tabs = document.querySelectorAll("#tab-links li");
        let maxTabId = 0;
        tabs.forEach(tab => {
            const tabName = tab.textContent.replace("✖", "").trim();
            const tabIdMatch = tabName.match(/Tab (\d+)/);
            if (tabIdMatch) {
                const tabId = parseInt(tabIdMatch[1]);
                maxTabId = Math.max(maxTabId, tabId);
            }
        });
        return `Tab ${maxTabId + 1}`;
    }

// Modify the copyAllPrompts() function
    copyAllPrompts() {
    const activeTab = document.querySelector(".tab.active");
    const prompts = activeTab.querySelectorAll(".prompt");
    const activeTabPromptsText = Array.from(prompts).map((prompt) => prompt.textContent).join("\n\n");
    navigator.clipboard.writeText(activeTabPromptsText).then(() => {
        console.log("Active tab prompts text copied to clipboard");
        });
    }

    fetchPromptsToSave() {
        const tabs = document.querySelectorAll(".tab");
        return Array.from(tabs).flatMap((tab) => {
            const promptContainers = tab.querySelectorAll(".prompt-container");
            return Array.from(promptContainers).map((container) => {
                const titleElement = container.querySelector(".prompt-title");
                const codeElement = container.querySelector(".prompt");
                return {
                    prompt_title: titleElement.textContent,
                    prompt_text: codeElement.textContent,
                    tab_name: container.dataset.tabName,
                };
            });
        });
    }
    async savePublicPrompts() {
        const title = prompt("Enter the collection title:");
        const userEmail = JSON.parse(sessionStorage.getItem("user"))
        alert("Your prompts are set to public, pending review they will be added to public collection")
        console.log("attempting to publish");
        console.log(title);
        console.log(userEmail);
        try {
            const response = await fetch("https://cyber9.live/public-collection", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: userEmail,
                    public_title: title
                })
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log(result);
            } else {
                console.error("Error publishing prompts:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error in savePublicPrompts:", error);
        }
    }

}
document.addEventListener("DOMContentLoaded", async function() {
    const userEmail = JSON.parse(sessionStorage.getItem("user"));
    if (userEmail) {
        const promptManager = new PromptManager(userEmail);
        await promptManager.displayPrompts();
    } else {
        console.error("User email not available in sessionStorage");
    }
});

function signOut() {
        //this.googleAuth.signOut().then(() => {
        window.location.href = 'https://goprompt.io/index.html';
        sessionStorage.removeItem("user"); 
        console.log("User signed out.");
    }