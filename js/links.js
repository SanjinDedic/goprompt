    async fetchPublicPrompts() {
        console.log("fetching public prompts");
        try {
            const response = await fetch("https://cyber9.live/get-public-prompts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const prompts = await response.json();
            console.log(prompts);
            return prompts;
        } catch (error) {
            console.error("Error fetching prompts:", error);
        }
    }
    

function createCollectionPages(prompts) {
    const collections = {};
    prompts.forEach(prompt => {
        const { collection_title } = prompt;
        if (!collections[collection_title]) {
            collections[collection_title] = [];
        }
        collections[collection_title].push(prompt);
    });

    for (const collectionTitle in collections) {
        const pageContent = generateCollectionPageContent(collectionTitle);
        createHTMLFile(`pages/${collectionTitle.replace(/\s+/g, '-').toLowerCase()}.html`, pageContent);
    }
}

function generateCollectionPageContent(collectionTitle) {
    const template = document.getElementById('collection-template').textContent;
    return template.replace(/{{collectionTitle}}/g, collectionTitle);
}

function createHTMLFile(filename, content) {
    // You'll need a server-side script to handle file creation, as it's not possible to do this directly from the browser
    // For example, you could set up an Express server with an API endpoint to handle file creation.
    // Replace the URL below with the appropriate URL for your server-side script.
    fetch('https://yourserver.com/create-html-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, content }),
    });
}

function displayLinks(prompts) {
    const linksContainer = document.getElementById('links-container');
    const uniqueCollections = [...new Set(prompts.map(prompt => prompt.collection_title))];

    uniqueCollections.forEach(collectionTitle => {
        const link = document.createElement('a');
        link.href = `pages/${collectionTitle.replace(/\s+/g, '-').toLowerCase()}.html`;
        link.textContent = collectionTitle;
        linksContainer.appendChild(link);
        linksContainer.appendChild(document.createElement('br'));
    });
}

(async () => {
    const prompts = await fetchPublicPrompts();
    createCollectionPages(prompts);
    displayLinks(prompts);
})();
