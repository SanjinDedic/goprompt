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
        deleteButton.addEventListener("click", () => this.deletePrompt(promptContainer));
        promptContainer.appendChild(deleteButton);

        // Create the Topic Link button
        let topicLinkButton = document.createElement("button");
        topicLinkButton.className = "prompt-link";
        topicLinkButton.textContent = "Topic Link";
        topicLinkButton.dataset.link = link;
        topicLinkButton.classList.add("prompt-btn");
        let mouseDownTime = 0;  // timestamp when mouse down event occurs

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
                if (newLink) link = newLink; // update the link if a new one is provided
            } else {
                // if button was not held down for 2 seconds, open the link as usual
                window.open(link, '_blank');
            }
        });
        promptContainer.appendChild(topicLinkButton);

        // Append the prompt container to the body
        this.container.appendChild(promptContainer);
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

    deletePrompt(promptContainer) {
        this.container.removeChild(promptContainer);
    }
}