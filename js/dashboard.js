const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  window.location.href = "login.html";
}

document.getElementById("userName").innerText = user.name;

document.getElementById("userEmail").innerText = user.email;

document.getElementById("welcomeUser").innerText = `Welcome ${user.name}`;

function logout() {
  localStorage.removeItem("loggedInUser");

  window.location.href = "index.html";
}
