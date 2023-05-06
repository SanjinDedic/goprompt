async function fetchData() {
    const response = await fetch('https://cyber9.live/get-public-users', {
        method: 'POST'
    });
    const data = await response.json();
    createLinks(data);
}
async function fetchPromptDetails(title, name) {
    const response = await fetch(`https://cyber9.live/get-prompt-details?title=${encodeURIComponent(title)}&name=${encodeURIComponent(name)}`, {
        method: 'POST'
    });
    const data = await response.json();
    displayPromptDetails(data);
}

function createLinks(linksData) {
    const linkContainer = document.getElementById('link-container');
    linksData.forEach(link => {
        const anchorElement = document.createElement('a');
        anchorElement.textContent = `${link.collection_title} - ${link.author_name}`;
        anchorElement.href = '#';
        anchorElement.classList.add('link-item');
        anchorElement.addEventListener('click', (event) => {
            event.preventDefault();
            fetchPromptDetails(link.collection_title, link.author_name);
        });
        linkContainer.appendChild(anchorElement);
    });
}

function displayPromptDetails(promptDetails) {
    const promptContainer = document.getElementById('prompt-container');
    promptContainer.innerHTML = '';
    promptDetails.forEach(prompt => {
        const promptElement = document.createElement('div');
        promptElement.innerHTML = `
        <h3>${prompt.prompt_title}</h3>
        <p>${prompt.prompt_text}</p>
        <p>Tab: ${prompt.tab_name}</p>
      `;
        promptContainer.appendChild(promptElement);
    });
}
async function handleCredentialResponse(response) {
    const response2 = await fetch('https://cyber9.live/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + response.credential
        }
    });
    if (response2.ok) {
        const user = await response2.json();
        sessionStorage.setItem("user", JSON.stringify(user.email));
        window.location.href = 'https://projectbingom8.sanjindedic.repl.co/pages/myprompt.html';
    } else {
        console.error('Error:', response2.statusText);
    }
}

function onGAPILoad() {
    google.accounts.id.initialize({
        client_id: "501150822446-s7mo1cp2sdj8nv1pclq5t7774j1a41h2.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"), {
            theme: "outline",
            size: "large"
        }
    );
}
fetchData();