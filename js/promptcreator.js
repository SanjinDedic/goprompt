export default class PromptCreator {
    constructor(container) {
        this.container = container;
    }

    createPrompt(title,message,link) {
        // Create the prompt container
        let promptContainer = document.createElement("div");
        promptContainer.className = "prompt-container";

        // Create the prompt title
        let promptTitle = document.createElement("h2");
        promptTitle.className = "prompt-title";
        promptTitle.contentEditable = "true";
        promptTitle.textContent = title;
        this.preventPasteStyles(promptTitle);
        promptTitle.addEventListener('blur', this.emptyTitleFallback);
        promptContainer.appendChild(promptTitle);

        // Create the prompt text
        let promptText = document.createElement("pre");
        let codeElement = document.createElement("code");
        codeElement.className = "prompt-text";
        codeElement.classList.add("prompt");
        codeElement.contentEditable = "true";
        codeElement.textContent = message;
        this.preventPasteStyles(codeElement);
        promptText.appendChild(codeElement);
        promptContainer.appendChild(promptText);

        // Create the copy button
        const copyBtn = document.createElement("button");
        copyBtn.textContent = "Copy";
        copyBtn.classList.add("prompt-btn");
        // Add copy function
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(codeElement.textContent).then(() => {
                console.log("Text copied to clipboard");
            });
        });
        promptContainer.appendChild(copyBtn);

        // Create the delete button
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Prompt";
        deleteButton.classList.add("prompt-btn");
        deleteButton.addEventListener("click", () => this.deletePrompt(promptContainer,title));
        promptContainer.appendChild(deleteButton);

        // Create the Topic Link button
        let topicLinkButton = document.createElement("button");
        topicLinkButton.className = "prompt-link";
        topicLinkButton.textContent = "Topic Link";
        topicLinkButton.dataset.link = link;
        topicLinkButton.classList.add("prompt-btn");
        let mouseDownTime = 0;  // timestamp when mouse down event occurs

        // Add the 'transparent' class if the link is empty or contains "Your link here"
        if (!link || link === '// Your new link here...') {
            topicLinkButton.classList.add("transparent");
        }

        topicLinkButton.addEventListener("mousedown", () => {
            // get current timestamp in milliseconds
            mouseDownTime = new Date().getTime();
        });

        topicLinkButton.addEventListener("mouseup", () => {
            const mouseUpTime = new Date().getTime();  // timestamp when mouse up event occurs
            const elapsedTime = mouseUpTime - mouseDownTime;  // elapsed time in milliseconds

            // if button was held down for 2 seconds or more
            if (elapsedTime >= 2000) {
                // ask for new link
                const newLink = prompt("Please enter the new link:");
                if (newLink) {
                    link = newLink; // update the local variable link
                    topicLinkButton.dataset.link = newLink; // update the actual link on the button
                    topicLinkButton.classList.remove("transparent"); // remove the 'transparent' class
                } // update the link if a new one is provided // update the link if a new one is provided
            } else {
                // if button was not held down for 2 seconds, open the link as usual
                window.open(link, '_blank');
            }
        });
        promptContainer.appendChild(topicLinkButton);

        let addPromptButton = document.createElement("button");
        addPromptButton.textContent = "+";
        addPromptButton.classList.add("prompt-btn");
        addPromptButton.addEventListener("click", () => {
            // Call the createPrompt method here with your desired title, message and link.
            // This will create a new prompt below the current one.
            let newPrompt = this.createPrompt("Your Title here...", "// Your new prompt here...", "// Your new link here...");

            // If there's a next sibling, insert the new prompt before the next sibling.
            // Otherwise, just append it to the end of the container.
            if(promptContainer.nextSibling) {
                this.container.insertBefore(newPrompt, promptContainer.nextSibling);
            } else {
                this.container.appendChild(newPrompt);
            }

        
        });
        promptContainer.appendChild(addPromptButton);

        // Create the move up button
        let moveUpButton = document.createElement("button");
        moveUpButton.innerHTML = "&#129045;";
        moveUpButton.classList.add("prompt-btn");
        moveUpButton.addEventListener("click", () => this.movePromptUp(promptContainer));
        promptContainer.appendChild(moveUpButton);

        // Create the move down button
        let moveDownButton = document.createElement("button");
        moveDownButton.innerHTML = "&#129047;";
        moveDownButton.classList.add("prompt-btn");
        moveDownButton.addEventListener("click", () => this.movePromptDown(promptContainer));
        promptContainer.appendChild(moveDownButton);


        // Append the prompt container to the body
        this.container.appendChild(promptContainer);

        return promptContainer;
    }

    preventPasteStyles(element) {
        element.addEventListener("paste", (event) => {
            event.preventDefault();
            const text = (event.clipboardData || window.clipboardData).getData('text/plain');
            document.execCommand("insertText", false, text);
        });
    }

    emptyTitleFallback() {
        if (!this.textContent.trim().length) {
            this.textContent = "\u00a0";
        }
    }

    deletePrompt(promptContainer,title) {
        this.container.removeChild(promptContainer);
    
        // After removing the prompt, check if there are any prompts left in the container.
        // If there are none, create a new one.
        if (!this.container.querySelector('.prompt-container')) {
            this.createPrompt(title, "// Your new prompt here...", "// Your new link here...");
        }
    }

    movePromptUp(promptContainer) {
        // Check if there is a previous sibling element (i.e., the prompt is not already at the top)
        if(promptContainer.previousElementSibling) {
            // Insert the prompt before its previous sibling
            this.container.insertBefore(promptContainer, promptContainer.previousElementSibling);
        }
    }
    
    movePromptDown(promptContainer) {
        // Check if there is a next sibling element (i.e., the prompt is not already at the bottom)
        if(promptContainer.nextElementSibling) {
            // Insert the next sibling before the prompt (this effectively moves the prompt down)
            this.container.insertBefore(promptContainer.nextElementSibling, promptContainer);
        }
    }
}