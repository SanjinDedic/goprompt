export default class GopromptAPI {
    constructor(baseUrl) {
        
        this.baseUrl = baseUrl;
    }

    async fetchToken(responseCredential) {
        const response = await fetch(this.baseUrl + '/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + responseCredential
            }
        });
        if (!response.ok) {
            console.error('Error:', response.statusText);
            return null;
        }
        const data = await response.json();
        return data;
    }

    async fetchPrompts(user) {
        console.log("fetching prompts")
        const userEmail = user//JSON.parse(user);
        try {
            const response = await fetch(this.baseUrl + '/get-prompts', {
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

    async savePrompts(data) {
        //const userEmail = JSON.parse(sessionStorage.getItem("user"));
        const userEmail = sessionStorage.getItem("user");
        // Include the email in the data
        data.email = userEmail;
        
        console.log("saving prompts", data);
        try {
          const response = await fetch(this.baseUrl + '/save-prompts', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          console.log(result);
          return result;
        } catch (error) {
          console.error("Error saving prompts:", error);
        }
      }
}