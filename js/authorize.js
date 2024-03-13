import GopromptAPI from './gopromptapi.js';

export default class Authorize {
    constructor(status) {
        this.status = status;
        // Check status and handle accordingly

        if (status) {

            let buttonDiv = document.getElementById("buttonDiv");
            if (buttonDiv) {
                buttonDiv.addEventListener('click', () => {
                    sessionStorage.setItem("user", "dawoodhassan12@gmail.com");
                    window.location.href = "../pages/myprompt.html"; // Define loginurl
                });
            }
        
        } else {
            
            this.apiHelper = new GopromptAPI('https://cyber9.live');

            // Create a new script element
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
        
            // Once the script is loaded, call onGAPILoad
            script.addEventListener('load', this.onGAPILoad.bind(this));
        
            // Append the script to the body
            document.body.appendChild(script);
        }

    }

    async handleCredentialResponse(response) {
        const user = await this.apiHelper.fetchToken(response.credential);
        if (user) {
            sessionStorage.setItem("user", JSON.stringify(user.email));
            
            // Check if user has signed in before
            if (!localStorage.getItem(user.email)) {
                // User is signing in for the first time
    
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
                        window.location.href = "../pages/myprompt.html";
                    } else {
                        alert('You must agree to the privacy policy');
                    }
                }
    
                // Save user to local storage
                localStorage.setItem(user.email, JSON.stringify(user));
    
            } else {
                // User has signed in before
                // Redirect to another page or do something else
                window.location.href = "../pages/myprompt.html";
            }
        } else {
            console.error('Error:', response.statusText);
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


