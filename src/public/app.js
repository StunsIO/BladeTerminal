const platform = document.body.getAttribute("platform");

let commandHistory = [];
let currentIndex = -1;
if (platform == "win32") {
  window.currentDirectory = ".\\";
} else {
  window.currentDirectory = "/home";
}

async function sendCommand() {
  const commandInput = document.getElementById("command");
  const command = commandInput.value;
  const responseContainer = document.getElementById("output");

  if (command.trim() === "") {
    alert("Please enter a valid command.");
    return;
  }
  try {
    if (command.trim() !== "") {
      commandHistory.unshift(command);
      currentIndex = -1;
    }
    if (command == "cd") {
      if (platform == "win32") {
        window.currentDirectory = "/";
      } else {
        window.currentDirectory = "~";
      }
    } else if (["clear", "cls"].includes(command)) {
      commandInput.value = "";
      document.getElementById("output").innerHTML =
        '<p id="clearMessage">Terminal cleared!</p>';
      setTimeout(function () {
        document.getElementById("clearMessage").remove();
      }, 2000);

      return;
    } else if (command === "logout") {
      fetch("/logout", {
        method: "POST",
      })
        .then((response) => {
          if (response.ok) {
            window.location.href = "/login";
          } else {
            window.location.href = "/";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (containsCdCommand(command)) {
      window.currentDirectory = extractCdPath(command);
    }

    const fullCommand = `cd ${window.currentDirectory} && ${command}`;
    try {
      const response = await fetch("/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: fullCommand }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error);
      }

      const data = await response.json();

      commandInput.value = "";

      const commandElement = document.createElement("div");
      commandElement.classList.add("command");
      commandElement.textContent = `> ${command}`;
      responseContainer.appendChild(commandElement);

      const outputElement = document.createElement("div");
      outputElement.classList.add("output");
      outputElement.innerHTML = `<pre class="results"><code class="language-bash">${data.output}</code></pre>`;
      responseContainer.appendChild(outputElement);

      Prism.highlightElement(outputElement.querySelector("code"));

      responseContainer.scrollTop = responseContainer.scrollHeight;
      const resultsElements = document.querySelectorAll(".results");
      const lastResultsElement = resultsElements[resultsElements.length - 1];

      if (lastResultsElement) {
        lastResultsElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } catch (error) {
      commandInput.value = "";
      const errorMessage = error.message;
      const errorMessageCont = errorMessage.replace(
        `cd ${window.currentDirectory} && `,
        ""
      );

      const commandElement = document.createElement("div");
      commandElement.classList.add("command");
      commandElement.textContent = `> ${command}`;
      responseContainer.appendChild(commandElement);

      const outputElement = document.createElement("div");
      outputElement.classList.add("output");
      outputElement.innerHTML = `<pre><code class="language-bash">${errorMessageCont}</code></pre>`;
      responseContainer.appendChild(outputElement);

      Prism.highlightElement(outputElement.querySelector("code"));

      responseContainer.scrollTop = responseContainer.scrollHeight;
      const resultsElements = document.querySelectorAll(".results");
      const lastResultsElement = resultsElements[resultsElements.length - 1];

      if (lastResultsElement) {
        lastResultsElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  } catch (error) {}
}

document
  .getElementById("command")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendCommand();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (currentIndex < commandHistory.length - 1) {
        currentIndex++;
        document.getElementById("command").value = commandHistory[currentIndex];
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (currentIndex >= 0) {
        currentIndex--;
        if (currentIndex >= 0) {
          document.getElementById("command").value =
            commandHistory[currentIndex];
        } else {
          document.getElementById("command").value = "";
        }
      }
    }
  });

function containsCdCommand(command) {
  const cdRegex = /^cd\s+/i;
  return cdRegex.test(command);
}

function extractCdPath(command) {
  const cdRegex = /^cd\s+(.+)/i;
  const match = command.match(cdRegex);
  return match ? match[1] : null;
}
document.addEventListener("DOMContentLoaded", function () {
  const documentationLink = document.getElementById("cdoc");
  if (platform === "win32") {
    documentationLink.href =
      "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands";
    documentationLink.textContent = "Windows Documentation";
  } else {
    documentationLink.href =
      "https://mally.stanford.edu/~sr/computing/basic-unix.html";
    documentationLink.textContent = "Unix Documentation";
  }
  const lastLoginElement = document.getElementById("lastLogin");
  const now = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = dayNames[now.getDay()];
  const month = monthNames[now.getMonth()];
  const date = now.getDate();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const year = now.getFullYear();

  const lastLoginMessage = `Last login: ${day} ${month} ${date} ${hours}:${minutes}:${seconds} ${year}`;
  lastLoginElement.textContent = lastLoginMessage;

  document.getElementById("userAgent").textContent = navigator.userAgent;

  fetch("https://api.ipify.org/")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("userIp").textContent = data;
    })
    .catch((error) => console.error("Error:", error));
});

async function getServerInfo() {
  toggleOverlay(true);
  await fetch("/serverinfo")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("serverInfo").innerHTML = data;
      document.getElementById("serverInfoPopup").style.display = "block";
      toggleOverlay(false);
    })
    .catch((error) => console.error("Error:", error));
}

function closeServerInfoPopup() {
  document.getElementById("serverInfoPopup").style.display = "none";
}
function toggleOverlay(show) {
  var overlay = document.getElementById("overlay");
  overlay.style.display = show ? "flex" : "none";
}
