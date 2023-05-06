const editPromptButtons = document.getElementsByClassName("edit-prompt");

for (let btn of editPromptButtons) {
  btn.addEventListener("click", () => {
    const codeElement = btn.parentElement.nextElementSibling.children[0];
    const promptIndex = Array.prototype.indexOf.call(editPromptButtons, btn);
    codeElement.contentEditable = codeElement.contentEditable === "true" ? "false" : "true";
    btn.textContent = codeElement.contentEditable === "true" ? "Save" : "Edit";

    if (codeElement.contentEditable === "false") {
      localStorage.setItem(`prompt${promptIndex}`, codeElement.textContent);
    }
  });
}

function loadPromptContent(index, element) {
  fetch(`/txt/p${index + 1}.txt`)
    .then((response) => response.text())
    .then((data) => {
      const savedContent = localStorage.getItem(`prompt${index}`);
      element.textContent = savedContent !== null ? savedContent : data;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const prompts = document.getElementsByClassName("prompt");
  for (let i = 0; i < prompts.length; i++) {
    loadPromptContent(i, prompts[i]);
  }
});

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
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" }
    );
}
