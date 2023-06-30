import GopromptAPI from './gopromptapi.js';

export default class Authorize {
    constructor(status) {
        this.status = status;

        // Check status and handle accordingly
        if (status) {
            this.apiHelper = new GopromptAPI('https://cyber9.live');
            this.googleScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (this.googleScript) this.googleScript.addEventListener('load', this.onGAPILoad.bind(this));

        } else {
            let buttonDiv = document.getElementById("buttonDiv");
            if (buttonDiv) {
                buttonDiv.addEventListener('click', () => {
                    sessionStorage.setItem("user", "dawoodhassan12@gmail.com");
                    window.location.href = "../pages/myprompt.html"; // Define loginurl
                });
            }
        }

    }

    async handleCredentialResponse(response) {
        const user = await this.apiHelper.fetchToken(response.credential);
        if (user) {
            sessionStorage.setItem("user", JSON.stringify(user.email));

            // Show modal
            var modal = document.getElementById("myModal");
            modal.style.display = "block";

            // Handle modal submit button
            document.getElementById("submitButton").onclick = function () {
                // Here you can handle the values of checkboxes
                var privacyPolicyAgree = document.getElementById("privacyPolicyAgree").checked;
                var emailOptIn = document.getElementById("emailOptIn").checked;
                
                // If user agrees to the privacy policy, then redirect
                if (privacyPolicyAgree) {
                    window.location.href = loginurl;
                } else {
                    alert('You must agree to the privacy policy');
                }
            }
        } else {
            console.error('Error:', response2.statusText);
        }
    }

    onGAPILoad() {
        google.accounts.id.initialize({
            client_id: "501150822446-s7mo1cp2sdj8nv1pclq5t7774j1a41h2.apps.googleusercontent.com",
            callback: this.handleCredentialResponse.bind(this)
        });
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"), {
                theme: "outline",
                size: "large"
            }
        );
    }

}


