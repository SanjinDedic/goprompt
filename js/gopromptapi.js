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
        return await response.json();
        
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
        const userEmail = JSON.parse(sessionStorage.getItem("user"));
        //const userEmail = sessionStorage.getItem("user"); //used for testing
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

      async fetchStats() {
        try {
            const response = await fetch(this.baseUrl + '/stats', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const stats = await response.json();
            return stats;
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }
    async reportBug(bugReport) {
        try {
            const response = await fetch(this.baseUrl + '/submit-bug-report', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([bugReport]),
            });
            return await response.json();
            
        } catch (error) {
            console.error("Error submitting report:", error);
        }
    }
}