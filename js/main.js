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
    window.location.href = 'https://goprompt.io/pages/myprompt.html';
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
