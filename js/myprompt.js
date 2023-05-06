document.addEventListener("DOMContentLoaded", function() {

    const userEmail = JSON.parse(sessionStorage.getItem("user"));

    const addPromptBtn = document.getElementById("add-prompt");
    const savePromptsBtn = document.getElementById("save-prompts");
    const addTabBtn = document.getElementById("add-tab");
    const tabLinks = document.getElementById("tab-links");
    const tabContent = document.getElementById("tab-content");

    async function fetchPrompts() {
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
            return prompts;
        } catch (error) {
            console.error("Error fetching prompts:", error);
        }
    }

    async function savePrompts() {
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

    
    

    function createPrompt(tabName, title, text) {
        const tabLink = document.querySelector(`#tab-links li[data-tab-id="${tabName}"]`);
    let tab = null;

    if (tabLink) {
        tab = document.getElementById(tabLink.dataset.tabId);
    }

    if (!tab) {
        createTab(tabName);
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

    async function displayPrompts() {
        const prompts = await fetchPrompts();
    
        // Find the maximum tab number
        const maxTabNumber = prompts.reduce((max, prompt) => {
            const tabNumber = parseInt(prompt.tab_name.split(" ")[1]);
            return Math.max(max, tabNumber);
        }, 0);
    
        // Create empty tabs from 1 to the maximum tab number
        for (let i = 1; i <= maxTabNumber; i++) {
            createTab(`Tab ${i}`);
        }
        if (maxTabNumber > 0) {
        switchTab(`Tab 1`);
        }
        
        // Add the prompts to their respective tabs
        for (const prompt of prompts) {
            createPrompt(prompt.tab_name, prompt.title, prompt.text);
        }
    
        const firstTabLink = document.querySelector("#tab-links li");
        if (firstTabLink) {
          switchTab(firstTabLink.dataset.tabId);
        }
    }
    

    function switchTab(name) {
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


    displayPrompts();
    
  function editTabName(tabLink) {
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
    addPromptBtn.removeEventListener("click", addPromptToTab); // Remove old event listener
    addPromptBtn.addEventListener("click", addPromptToTab);
}


    
    

    function deleteTab(tabId) {
    const tabLink = document.querySelector(`#tab-links li[data-tab-id="${tabId}"]`);
    if (tabLink) {
      tabLinks.removeChild(tabLink);
    }

    const tab = document.getElementById(tabId);
    if (tab) {
      tabContent.removeChild(tab);
    }
  }

    
    tabLinks.addEventListener("click", (event) => {
    const target = event.target;

    if (target.tagName === "LI") {
        switchTab(target.dataset.tabId);
    } else if (target.tagName === "SPAN") {
        event.stopPropagation();
        const tabId = target.parentElement.dataset.tabId;
        const tabName = target.parentElement.textContent.replace("✖", "").trim();
        if (confirm(`Are you sure you want to delete '${tabName}'?`)) {
            deleteTab(tabId);
        }
    }
    });
    
    tabLinks.addEventListener("dblclick", (event) => {
    const target = event.target;

    if (target.tagName === "LI") {
        editTabName(target);
    }
});

    

    function createTab(name) {
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
                deleteTab(tabId);
            }
        });
        
        tabLink.appendChild(deleteIcon);
        tabLinks.appendChild(tabLink);
    
        const tab = document.createElement("div");
        tab.classList.add("tab");
        tab.id = name;

        // Create Add Prompt button for each tab
        const addPromptBtn = document.createElement("button");
        addPromptBtn.textContent = "Add Prompt";
        addPromptBtn.addEventListener("click", addPromptToTab);
        tab.appendChild(addPromptBtn);
        addPromptBtn.classList.add("styled-button");



        tabContent.appendChild(tab);
    }

    function addPromptToTab(event) {
    const tabName = event.target.parentElement.id;
    createPrompt(tabName, "Your New Title", "// Your new prompt here...");
    }

    function getNextTabId() {
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

    if (addTabBtn) {
        addTabBtn.addEventListener("click", () => {
            const newTabName = getNextTabId();
            createTab(newTabName);
        });
    }
});

// Modify the copyAllPrompts() function
function copyAllPrompts() {
  const activeTab = document.querySelector(".tab.active");
  const prompts = activeTab.querySelectorAll(".prompt");
  const activeTabPromptsText = Array.from(prompts).map((prompt) => prompt.textContent).join("\n\n");

  navigator.clipboard.writeText(activeTabPromptsText).then(() => {
    console.log("Active tab prompts text copied to clipboard");
  });
}

document.addEventListener("DOMContentLoaded", function() {
  // ... (all your existing code)

  // Add this event listener inside the "DOMContentLoaded" event handler, at the end of the handler function
  const copyAllBtn = document.getElementById("copy-all");
  if (copyAllBtn) {
    copyAllBtn.addEventListener("click", copyAllPrompts);
  }
});

function signOut() {
  //googleAuth.signOut().then(() => {
  sessionStorage.removeItem("user"); // Remove user data from sessionStorage
  console.log("User signed out.");
  window.location.href = "https://projectbingom8.sanjindedic.repl.co/index.html";
}

function askForTitleAndName() {
    const title = prompt("Enter the collection title:");
    const name = prompt("Enter your name:");
    return { title, name };
}

function fetchPromptsToSave() {
    const tabs = document.querySelectorAll(".tab");

    return Array.from(tabs).flatMap((tab) => {
        const promptContainers = tab.querySelectorAll(".prompt-container");

        return Array.from(promptContainers).map((container) => {
            const titleElement = container.querySelector(".prompt-title");
            const codeElement = container.querySelector(".prompt");
            return {
                tab_name: container.dataset.tabName,
                title: titleElement.textContent,
                text: codeElement.textContent,
            };
        });
    });
    }
function fetchPromptsToSave() {
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


async function savePublicPrompts() {
    const { title, name } = askForTitleAndName();
    const promptsToSave = fetchPromptsToSave().map((prompt) => ({
        collection_title: title,
        author_name: name,
        ...prompt,
        
    }));

    try {
        console.log(promptsToSave);
        const response = await fetch("https://cyber9.live/save-public-prompts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(promptsToSave),
        });
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error("Error saving public prompts:", error);
    }
    }
